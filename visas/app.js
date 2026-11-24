// Visa Wallet: keeps eVisa PDFs on this device, encrypted with a key derived from a passcode, and shows
// them offline. Nothing is uploaded: the server only hosts this code.

pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';

const CARD_COLORS = [
  'linear-gradient(135deg, #1d4ed8, #0f172a)',
  'linear-gradient(135deg, #be185d, #3b0764)',
  'linear-gradient(135deg, #047857, #022c22)',
  'linear-gradient(135deg, #b45309, #431407)',
];
const ZOOMS = [1, 1.5, 2, 3];
const MAX_CANVAS_PIXELS = 12e6; // iOS refuses canvases much above ~16.7 MP
// Argon2id (memory-hard, so GPU guessing is slow even if someone copies the encrypted data off the phone).
const KDF = { name: 'argon2id', memoryKiB: 64 * 1024, passes: 3 };
const MIN_PASSCODE = 8;
const ERASE_AFTER = 10; // wrong passcodes in a row before everything on the phone is erased
const IDLE_LOCK_MS = 3 * 60 * 1000;
const AWAY_LOCK_MS = 30 * 1000; // away longer than this (app switcher, other app) locks it
const FREE_TRIES = 3; // wrong passcodes before a growing wait kicks in

/** Promise wrapper around the app's IndexedDB: 'meta' (vault settings) and 'people' (encrypted records). */
class Store {
  constructor() {
    this.ready = new Promise((resolve, reject) => {
      const req = indexedDB.open('visa-wallet', 2);
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const name of db.objectStoreNames) db.deleteObjectStore(name); // v1 kept plain PDFs
        db.createObjectStore('meta');
        db.createObjectStore('people', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Runs one request in its own transaction.
   * @param {string} store Object store name.
   * @param {string} mode 'readonly' or 'readwrite'.
   * @param {function(IDBObjectStore): IDBRequest} fn Builds the request.
   * @return {Promise<*>} The request's result.
   */
  async run(store, mode, fn) {
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const req = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Replaces every person record and the vault record in ONE transaction, so a passcode change can't
   * leave records encrypted under a key the vault doesn't match.
   */
  async rekey(records, vault) {
    const db = await this.ready;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['people', 'meta'], 'readwrite');
      records.forEach(r => tx.objectStore('people').put(r));
      tx.objectStore('meta').put(vault, 'vault');
      tx.oncomplete = resolve;
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  }

  getMeta(key) { return this.run('meta', 'readonly', s => s.get(key)); }
  setMeta(key, value) { return this.run('meta', 'readwrite', s => s.put(value, key)); }
  all() { return this.run('people', 'readonly', s => s.getAll()); }
  put(record) { return this.run('people', 'readwrite', s => s.put(record)); }
  remove(id) { return this.run('people', 'readwrite', s => s.delete(id)); }

  /** Deletes the whole database (the "forgot passcode" reset). */
  async erase() {
    (await this.ready).close();
    await new Promise(resolve => {
      const req = indexedDB.deleteDatabase('visa-wallet');
      req.onsuccess = req.onerror = req.onblocked = resolve;
    });
  }
}

/** AES-256-GCM encryption with a key derived from the passcode by Argon2id. */
class Vault {
  /**
   * Derives the encryption key.
   * @param {string} passcode The user's passcode.
   * @param {Uint8Array} salt Random per-install salt.
   * @param {Object} kdf Argon2id settings stored with the vault (see KDF).
   * @return {Promise<CryptoKey>} A non-extractable AES-GCM key.
   */
  static async derive(passcode, salt, kdf) {
    const raw = await hashwasm.argon2id({
      password: passcode.normalize('NFC'), salt, parallelism: 1, iterations: kdf.passes,
      memorySize: kdf.memoryKiB, hashLength: 32, outputType: 'binary',
    });
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
    raw.fill(0);
    return key;
  }

  /**
   * @param {CryptoKey} key AES-GCM key.
   * @param {BufferSource} bytes Plaintext.
   * @param {string} label Bound to the ciphertext (record id), so records can't be swapped.
   * @return {Promise<{iv: Uint8Array, data: ArrayBuffer}>}
   */
  static async encrypt(key, bytes, label) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const additionalData = new TextEncoder().encode(label);
    return { iv, data: await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData }, key, bytes) };
  }

  /** Decrypts; throws if the key or label is wrong or the data was tampered with. */
  static decrypt(key, { iv, data }, label) {
    const additionalData = new TextEncoder().encode(label);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData }, key, data);
  }

  /** @return {Promise<Object>} A new vault record (salt, KDF settings, check value) for this key. */
  static async seal(key, salt) {
    return { salt, kdf: KDF, check: await Vault.encrypt(key, new TextEncoder().encode('visa-wallet'), 'check') };
  }

  /** @return {Promise<CryptoKey|null>} The key if the passcode is right, else null. */
  static async open(vault, passcode) {
    const key = await Vault.derive(passcode, vault.salt, vault.kdf);
    try {
      await Vault.decrypt(key, vault.check, 'check');
      return key;
    } catch (e) {
      return null;
    }
  }

  /** @return {string|null} Why a new passcode is too weak, or null if it's fine. */
  static weakness(code) {
    if (code.length < MIN_PASSCODE) return `Use at least ${MIN_PASSCODE} characters.`;
    if (/^\d+$/.test(code)) return 'Use letters too, not only digits (a short phrase is best).';
    if (/^(.)\1+$/.test(code) || /^(password|passcode|12345678|qwerty)/i.test(code)) return 'Too easy to guess.';
    return null;
  }

  /**
   * Packs a person into one buffer: [header length][header JSON][eVisa PDF][arrival card].
   * @param {Object} person Person with optional `pdf` (eVisa) and `arrival` (PDF or image) Blobs.
   * @return {Promise<Uint8Array>}
   */
  static async pack(person) {
    const { pdf, arrival, ...fields } = person;
    const visaBytes = pdf ? new Uint8Array(await pdf.arrayBuffer()) : new Uint8Array(0);
    const arrivalBytes = arrival ? new Uint8Array(await arrival.arrayBuffer()) : new Uint8Array(0);
    fields.pdfSize = visaBytes.length;
    fields.arrivalType = arrival ? arrival.type : '';
    const header = new TextEncoder().encode(JSON.stringify(fields));
    const out = new Uint8Array(4 + header.length + visaBytes.length + arrivalBytes.length);
    new DataView(out.buffer).setUint32(0, header.length);
    out.set(header, 4);
    out.set(visaBytes, 4 + header.length);
    out.set(arrivalBytes, 4 + header.length + visaBytes.length);
    return out;
  }

  /** Inverse of pack(). Records saved before arrival cards existed hold only the PDF after the header. */
  static unpack(buffer) {
    const bytes = new Uint8Array(buffer);
    const n = new DataView(buffer).getUint32(0);
    const person = JSON.parse(new TextDecoder().decode(bytes.subarray(4, 4 + n)));
    const visaEnd = 4 + n + (person.pdfSize ?? bytes.length - 4 - n);
    if (visaEnd > 4 + n) person.pdf = new Blob([bytes.subarray(4 + n, visaEnd)], { type: 'application/pdf' });
    if (bytes.length > visaEnd) {
      person.arrival = new Blob([bytes.subarray(visaEnd)], { type: person.arrivalType || 'application/pdf' });
    }
    delete person.pdfSize;
    delete person.arrivalType;
    return person;
  }
}

/** Renders PDF blobs with pdf.js. */
class PdfRenderer {
  /** @return {Promise<PDFDocumentProxy>} The opened PDF. */
  static async open(blob) {
    return pdfjsLib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()), isEvalSupported: false }).promise;
  }

  /**
   * Draws one page into a new canvas.
   * @param {PDFDocumentProxy} doc The open document.
   * @param {number} pageNo 1-based page number.
   * @param {number} cssWidth Width to show the page at, in CSS pixels.
   * @param {number} dpr Device pixel ratio to render at.
   * @return {Promise<HTMLCanvasElement>}
   */
  static async page(doc, pageNo, cssWidth, dpr) {
    const page = await doc.getPage(pageNo);
    const base = page.getViewport({ scale: 1 });
    let scale = (cssWidth / base.width) * dpr;
    const pixels = base.width * base.height * scale * scale;
    if (pixels > MAX_CANVAS_PIXELS) scale *= Math.sqrt(MAX_CANVAS_PIXELS / pixels);
    const vp = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    canvas.style.width = `${cssWidth}px`;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    return canvas;
  }

  /** @return {Promise<string>} A small JPEG data URL of page 1, for the card background. */
  static async thumbnail(blob) {
    const doc = await PdfRenderer.open(blob);
    const canvas = await PdfRenderer.page(doc, 1, 240, 1);
    doc.destroy();
    return canvas.toDataURL('image/jpeg', 0.7);
  }
}

/** Full-screen, zoomable view of one document (PDF or image). */
class Viewer {
  constructor() {
    this.el = document.getElementById('viewer');
    this.pages = document.getElementById('pages');
    this.zoom = 0;
    document.getElementById('viewer-close').onclick = () => this.close();
    document.getElementById('viewer-share').onclick = () => this.share();
    this.el.querySelectorAll('[data-zoom]').forEach(b => {
      b.onclick = () => {
        const step = Number(b.dataset.zoom);
        this.zoom = step === 0 ? 0 : Math.max(0, Math.min(ZOOMS.length - 1, this.zoom + step));
        this.render();
      };
    });
  }

  /**
   * @param {{blob: Blob, title: string, fileName: string}} item The document to show.
   */
  async open(item) {
    this.item = item;
    this.zoom = 0;
    document.getElementById('viewer-title').textContent = item.title;
    this.el.hidden = false;
    if (item.blob.type.startsWith('image/')) {
      this.url = URL.createObjectURL(item.blob);
      this.doc = null;
    } else {
      this.doc = await PdfRenderer.open(item.blob);
    }
    await this.render();
  }

  async render() {
    const token = (this.token = {});
    const width = this.pages.clientWidth * ZOOMS[this.zoom] - (this.zoom ? 0 : 16);
    if (this.url) {
      const img = Object.assign(document.createElement('img'), { src: this.url, alt: this.item.title });
      img.style.width = `${width}px`;
      this.pages.replaceChildren(img);
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const canvases = [];
    for (let i = 1; this.doc && i <= this.doc.numPages; i++) {
      canvases.push(await PdfRenderer.page(this.doc, i, width, dpr));
      if (token !== this.token) return; // a newer zoom (or close) started
    }
    if (this.doc) this.pages.replaceChildren(...canvases);
  }

  close() {
    this.token = {};
    this.el.hidden = true;
    this.pages.replaceChildren();
    this.doc?.destroy();
    this.doc = null;
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = null;
    this.item = null;
  }

  /** Shares the original file (AirDrop, Files, print) or downloads it. */
  async share() {
    const { blob, fileName, title } = this.item;
    const file = new File([blob], fileName, { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title }); } catch (e) { /* cancelled */ }
      return;
    }
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(file), download: file.name });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
}

/** The add/edit sheet. */
class Editor {
  constructor(onSave, onDelete) {
    this.dialog = document.getElementById('editor');
    this.form = document.getElementById('edit-form');
    document.getElementById('edit-cancel').onclick = () => this.dialog.close();
    document.getElementById('edit-delete').onclick = () => {
      this.dialog.close();
      onDelete(this.person);
    };
    this.form.onsubmit = e => {
      e.preventDefault();
      const f = this.form.elements;
      const file = f.pdf.files[0];
      const person = {
        ...this.person,
        name: f.name.value.trim(),
        country: f.country.value.trim(),
        number: f.number.value.trim(),
        from: f.from.value,
        until: f.until.value,
      };
      if (file) Object.assign(person, { pdf: file, fileName: file.name, thumb: null });
      const arrival = f.arrival.files[0];
      if (arrival) Object.assign(person, { arrival, arrivalName: arrival.name });
      else if (f.dropArrival.checked) Object.assign(person, { arrival: null, arrivalName: '' });
      this.dialog.close();
      onSave(person);
    };
  }

  /** @param {Object} person Existing person, or a new one without a pdf. */
  open(person, isNew) {
    this.person = person;
    const f = this.form.elements;
    this.form.reset();
    for (const k of ['name', 'country', 'number', 'from', 'until']) f[k].value = person[k] || '';
    document.getElementById('edit-title').textContent = isNew ? 'Add person' : `Edit ${person.name}`;
    document.getElementById('edit-file').textContent = person.fileName ? `Current: ${person.fileName}` : '';
    document.getElementById('edit-arrival').textContent = person.arrival ? `Current: ${person.arrivalName}` : '';
    document.getElementById('drop-arrival').hidden = !person.arrival;
    document.getElementById('edit-delete').hidden = isNew;
    this.dialog.showModal();
  }

  close() { if (this.dialog.open) this.dialog.close(); }
}

/** Passcode screen: set a passcode on first run, unlock afterwards, throttle wrong guesses. */
class LockScreen {
  constructor(store) {
    this.store = store;
    this.el = document.getElementById('lock');
    this.form = document.getElementById('lock-form');
    this.input = document.getElementById('lock-input');
    this.confirm = document.getElementById('lock-confirm');
    this.msg = document.getElementById('lock-msg');
    document.getElementById('lock-forgot').onclick = () => this.forgot();
  }

  /**
   * Shows the lock screen until the passcode is right.
   * @return {Promise<CryptoKey>} The vault key.
   */
  async unlock() {
    const vault = await this.store.getMeta('vault');
    const setup = !vault;
    this.el.hidden = false;
    document.body.classList.add('locked');
    document.getElementById('lock-title').textContent = setup ? 'Set a passcode' : 'Enter passcode';
    document.getElementById('lock-sub').textContent = setup
      ? `At least ${MIN_PASSCODE} characters with letters; a short phrase is best. It encrypts the visas on ` +
        `this phone and can't be recovered. ${ERASE_AFTER} wrong tries in a row erase everything.`
      : 'The visas are encrypted on this phone.';
    this.confirm.hidden = !setup;
    document.getElementById('lock-submit').textContent = setup ? 'Set passcode' : 'Unlock';
    document.getElementById('lock-forgot').hidden = setup;
    this.form.reset();
    this.say('');
    setTimeout(() => this.input.focus(), 50);

    return new Promise(resolve => {
      this.form.onsubmit = async e => {
        e.preventDefault();
        const code = this.input.value;
        const key = setup ? await this.create(code) : await this.check(vault, code);
        if (!key) return;
        this.form.reset();
        this.el.hidden = true;
        document.body.classList.remove('locked');
        resolve(key);
      };
    });
  }

  async create(code) {
    const weak = Vault.weakness(code);
    if (weak) return this.say(weak);
    if (code !== this.confirm.value) return this.say("The two passcodes don't match.");
    this.say('Setting up…');
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await Vault.derive(code, salt, KDF);
    await this.store.setMeta('vault', await Vault.seal(key, salt));
    return key;
  }

  async check(vault, code) {
    const fails = (await this.store.getMeta('fails')) || { count: 0, until: 0 };
    const wait = Math.ceil((fails.until - Date.now()) / 1000);
    if (wait > 0) return this.say(`Too many tries. Wait ${wait} s.`);
    this.say('Checking…');
    const key = await Vault.open(vault, code);
    if (!key) {
      fails.count += 1;
      if (fails.count >= ERASE_AFTER) {
        await this.store.erase();
        alert(`${ERASE_AFTER} wrong passcodes: everything was erased from this phone.`);
        location.reload();
        return null;
      }
      // Counted before the wait, so closing the app doesn't skip it.
      const wait = fails.count >= FREE_TRIES ? 30 * 2 ** (fails.count - FREE_TRIES) : 0;
      fails.until = Date.now() + wait * 1000;
      await this.store.setMeta('fails', fails);
      this.input.select();
      const left = ERASE_AFTER - fails.count;
      return this.say(`Wrong passcode. ${left} ${left === 1 ? 'try' : 'tries'} left before everything is erased` +
                      (wait ? `; wait ${wait} s.` : '.'));
    }
    await this.store.setMeta('fails', { count: 0, until: 0 });
    return key;
  }

  async forgot() {
    if (!confirm('Forgot the passcode? The visas cannot be decrypted without it. Erase everything on this ' +
                 'phone and start over?')) return;
    await this.store.erase();
    location.reload();
  }

  say(text) {
    this.msg.textContent = text;
    return null;
  }
}

class App {
  constructor() {
    this.store = new Store();
    this.lockScreen = new LockScreen(this.store);
    this.viewer = new Viewer();
    this.editor = new Editor(p => this.save(p), p => this.remove(p));
    this.cards = document.getElementById('cards');
    document.getElementById('add-btn').onclick = () =>
      this.editor.open({ id: crypto.randomUUID(), created: Date.now() }, true);
    document.getElementById('lock-btn').onclick = () => this.lock();
    this.change = document.getElementById('change');
    document.getElementById('change-code').onclick = () => {
      document.getElementById('change-form').reset();
      document.getElementById('change-msg').textContent = '';
      this.change.showModal();
    };
    document.getElementById('change-cancel').onclick = () => this.change.close();
    document.getElementById('change-form').onsubmit = e => {
      e.preventDefault();
      this.changePasscode(e.target.elements);
    };
    // Cover the visas whenever the app leaves the screen (app-switcher snapshot), lock if away for long
    // (a short trip, like the iOS file picker, doesn't lose the open form), and lock after idling.
    document.addEventListener('visibilitychange', () => this.onVisibility());
    ['pointerdown', 'keydown', 'scroll'].forEach(t => addEventListener(t, () => this.poke(), { passive: true }));
    this.showInstallHint();
    navigator.storage?.persist?.(); // ask the browser not to evict the data
  }

  async start() {
    this.key = await this.lockScreen.unlock();
    let records = await this.store.all();
    if (!records.length) { // first run: one card each, ready for a PDF
      for (const [i, name] of ['Me', 'Fiancée'].entries()) {
        await this.write({ id: crypto.randomUUID(), created: Date.now() + i, name });
      }
      records = await this.store.all();
    }
    this.people = await Promise.all(records.map(async r => ({
      ...Vault.unpack(await Vault.decrypt(this.key, r, r.id)), id: r.id, created: r.created,
    })));
    this.draw();
    this.poke();
  }

  /** Forgets the key and every decrypted byte, then asks for the passcode again. */
  lock() {
    if (!this.key) return;
    this.key = null;
    this.people = null;
    clearTimeout(this.idle);
    this.viewer.close();
    this.editor.close();
    if (this.change.open) this.change.close();
    document.getElementById('change-form').reset();
    this.cards.replaceChildren();
    this.start();
  }

  onVisibility() {
    document.body.classList.toggle('covered', document.hidden);
    if (document.hidden) this.hiddenAt = Date.now();
    else if (Date.now() - this.hiddenAt > AWAY_LOCK_MS) this.lock();
  }

  poke() {
    if (!this.key) return;
    clearTimeout(this.idle);
    this.idle = setTimeout(() => this.lock(), IDLE_LOCK_MS);
  }

  /** @return {Promise<Object>} The stored form of a person: only id and creation time stay readable. */
  static async seal(person, key) {
    return { id: person.id, created: person.created, ...await Vault.encrypt(key, await Vault.pack(person), person.id) };
  }

  /** Encrypts one person and stores it. */
  async write(person) {
    await this.store.put(await App.seal(person, this.key));
  }

  async save(person) {
    if (person.pdf && !person.thumb) {
      try { person.thumb = await PdfRenderer.thumbnail(person.pdf); } catch (e) {
        alert(`That file doesn't open as a PDF (${e.message}). Nothing was changed.`);
        return;
      }
    }
    await this.write(person);
    this.people = this.people.filter(p => p.id !== person.id).concat(person);
    this.draw();
  }

  async remove(person) {
    if (!confirm(`Delete ${person.name} and their PDF from this phone?`)) return;
    await this.store.remove(person.id);
    this.people = this.people.filter(p => p.id !== person.id);
    this.draw();
  }

  /**
   * Re-encrypts everything under a new passcode.
   * @param {HTMLFormControlsCollection} f The change-passcode form fields (old, code, again).
   */
  async changePasscode(f) {
    const msg = document.getElementById('change-msg');
    msg.textContent = 'Checking…';
    if (!(await Vault.open(await this.store.getMeta('vault'), f.old.value))) {
      msg.textContent = 'Current passcode is wrong.';
      return;
    }
    const problem = Vault.weakness(f.code.value) || (f.code.value !== f.again.value && "New passcodes don't match.");
    if (problem) {
      msg.textContent = problem;
      return;
    }
    msg.textContent = 'Re-encrypting…';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await Vault.derive(f.code.value, salt, KDF);
    const records = await Promise.all(this.people.map(p => App.seal(p, key)));
    await this.store.rekey(records, await Vault.seal(key, salt));
    this.key = key;
    f.old.form.reset();
    this.change.close();
    alert('Passcode changed.');
  }

  draw() {
    const people = [...this.people].sort((a, b) => a.created - b.created);
    this.cards.replaceChildren(...people.map((p, i) => this.card(p, i)));
  }

  card(p, i) {
    const el = document.createElement('article');
    el.className = `card${p.pdf ? '' : ' empty'}`;
    el.style.setProperty('--card', CARD_COLORS[i % CARD_COLORS.length]);
    const fields = [['Country', p.country], ['Visa no.', p.number], ['Valid from', fmt(p.from)],
                    ['Valid until', fmt(p.until)]].filter(([, v]) => v);
    el.innerHTML = `
      ${p.thumb ? '<img class="thumb" alt="">' : ''}
      <div class="kicker">eVisa${p.arrival ? ' + arrival card' : ''}</div>
      <div class="name"></div>
      ${fields.length ? `<dl>${fields.map(() => '<div><dt></dt><dd></dd></div>').join('')}</dl>` : ''}
      <p>${status(p)}</p>
      <div class="actions">
        <button class="open">${p.pdf ? 'eVisa' : 'Add eVisa'}</button>
        <button class="open-arrival">${p.arrival ? 'Arrival card' : '+ Arrival card'}</button>
        <button class="edit">Edit</button>
      </div>`;
    if (p.thumb) el.querySelector('.thumb').src = p.thumb;
    el.querySelector('.name').textContent = p.name;
    el.querySelectorAll('dl > div').forEach((d, k) => {
      d.querySelector('dt').textContent = fields[k][0];
      d.querySelector('dd').textContent = fields[k][1];
    });
    el.querySelector('.open').onclick = () => (p.pdf
      ? this.viewer.open({ blob: p.pdf, title: `${p.name}: eVisa`, fileName: p.fileName || `${p.name}-evisa.pdf` })
      : this.editor.open(p, false));
    el.querySelector('.open-arrival').onclick = () => (p.arrival
      ? this.viewer.open({ blob: p.arrival, title: `${p.name}: arrival card`,
                           fileName: p.arrivalName || `${p.name}-arrival-card` })
      : this.editor.open(p, false));
    el.querySelector('.edit').onclick = () => this.editor.open(p, false);
    return el;
  }

  showInstallHint() {
    const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    document.getElementById('install-hint').hidden = standalone || !ios;
  }
}

/** @return {string} An ISO date as e.g. "12 Dec 2026", or "". */
function fmt(iso) {
  if (!iso) return '';
  return new Date(`${iso}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/** @return {string} A status pill for the card (fixed markup, no user text). */
function status(p) {
  if (!p.pdf) return '<span class="status">No PDF yet</span>';
  if (!p.until) return '<span class="status">Saved offline</span>';
  const days = Math.ceil((new Date(`${p.until}T23:59`) - Date.now()) / 864e5);
  if (days < 0) return '<span class="status bad">Expired</span>';
  return `<span class="status${days <= 30 ? ' warn' : ''}">${days} day${days === 1 ? '' : 's'} left</span>`;
}

const APP_VERSION = 6; // keep in step with VERSION in sw.js
document.getElementById('app-version').textContent = `Version ${APP_VERSION}`;

// Updates: check for a new version whenever the app comes to the front, and reload into it as soon as it
// has been downloaded (a reload only re-shows the passcode screen; nothing stored is lost).
if ('serviceWorker' in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.register('sw.js').then(reg => {
    document.addEventListener('visibilitychange', () => document.hidden || reg.update().catch(() => {}));
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => hadController && location.reload());
}
new App().start();
