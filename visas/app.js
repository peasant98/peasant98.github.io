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
/** Documents a person can carry besides the eVisa; each is a PDF or an image. */
const EXTRA_DOCS = [
  { key: 'arrival', label: 'Arrival card' },
  { key: 'suvidha', label: 'Air Suvidha' },
];
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
      tx.objectStore('meta').delete('faceid'); // wraps the old key; turned on again after a change
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
    const raw = await Vault.deriveRaw(passcode, salt, kdf);
    const key = await Vault.importKey(raw);
    raw.fill(0);
    return key;
  }

  /** @return {Promise<Uint8Array>} The 32 raw key bytes for a passcode (wipe them after use). */
  static deriveRaw(passcode, salt, kdf) {
    return hashwasm.argon2id({
      password: passcode.normalize('NFC'), salt, parallelism: 1, iterations: kdf.passes,
      memorySize: kdf.memoryKiB, hashLength: 32, outputType: 'binary',
    });
  }

  /** @return {Promise<CryptoKey>} A non-extractable AES-GCM key from raw bytes. */
  static importKey(raw) {
    return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
  }

  /** @return {Promise<boolean>} Whether this key opens the vault's check value. */
  static async fits(key, vault) {
    try {
      await Vault.decrypt(key, vault.check, 'check');
      return true;
    } catch (e) {
      return false;
    }
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
    return (await Vault.fits(key, vault)) ? key : null;
  }

  /** @return {string|null} Why a new passcode is too weak, or null if it's fine. */
  static weakness(code) {
    if (code.length < MIN_PASSCODE) return `Use at least ${MIN_PASSCODE} characters.`;
    if (/^\d+$/.test(code)) return 'Use letters too, not only digits (a short phrase is best).';
    if (/^(.)\1+$/.test(code) || /^(password|passcode|12345678|qwerty)/i.test(code)) return 'Too easy to guess.';
    return null;
  }

  /**
   * Packs a person into one buffer: [header length][header JSON][eVisa PDF][extra documents].
   * @param {Object} person Person with optional `pdf` (eVisa) and EXTRA_DOCS Blobs (PDF or image).
   * @return {Promise<Uint8Array>}
   */
  static async pack(person) {
    const { pdf, ...fields } = person;
    const blobs = [pdf, ...EXTRA_DOCS.map(d => person[d.key])];
    const bytes = await Promise.all(blobs.map(async b => (b ? new Uint8Array(await b.arrayBuffer()) : new Uint8Array(0))));
    EXTRA_DOCS.forEach(d => delete fields[d.key]);
    fields.pdfSize = bytes[0].length;
    fields.parts = EXTRA_DOCS.map((d, k) => ({ key: d.key, type: blobs[k + 1]?.type || '', size: bytes[k + 1].length }));
    const header = new TextEncoder().encode(JSON.stringify(fields));
    const out = new Uint8Array(4 + header.length + bytes.reduce((n, b) => n + b.length, 0));
    new DataView(out.buffer).setUint32(0, header.length);
    out.set(header, 4);
    let at = 4 + header.length;
    for (const b of bytes) { out.set(b, at); at += b.length; }
    return out;
  }

  /**
   * Inverse of pack(). Older records: no pdfSize = eVisa only (v4); pdfSize but no parts = eVisa
   * plus an arrival card filling the rest (v5-v7).
   */
  static unpack(buffer) {
    const bytes = new Uint8Array(buffer);
    const n = new DataView(buffer).getUint32(0);
    const person = JSON.parse(new TextDecoder().decode(bytes.subarray(4, 4 + n)));
    let at = 4 + n;
    const take = (size, type) => {
      const blob = size ? new Blob([bytes.subarray(at, at + size)], { type: type || 'application/pdf' }) : null;
      at += size;
      return blob;
    };
    const pdf = take(person.pdfSize ?? bytes.length - at, 'application/pdf');
    if (pdf) person.pdf = pdf;
    const parts = person.parts ?? [{ key: 'arrival', type: person.arrivalType, size: bytes.length - at }];
    for (const { key, type, size } of parts) {
      const blob = take(size, type);
      if (blob) person[key] = blob;
    }
    delete person.pdfSize;
    delete person.arrivalType;
    delete person.parts;
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
      for (const { key } of EXTRA_DOCS) {
        const doc = f[key].files[0];
        if (doc) Object.assign(person, { [key]: doc, [`${key}Name`]: doc.name });
        else if (f[`drop_${key}`].checked) Object.assign(person, { [key]: null, [`${key}Name`]: '' });
      }
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
    for (const { key } of EXTRA_DOCS) {
      document.getElementById(`edit-${key}`).textContent = person[key] ? `Current: ${person[`${key}Name`]}` : '';
      document.getElementById(`drop-${key}`).hidden = !person[key];
    }
    document.getElementById('edit-delete').hidden = isNew;
    this.dialog.showModal();
  }

  close() { if (this.dialog.open) this.dialog.close(); }
}

/**
 * Face ID unlock with a passkey (WebAuthn) and its PRF extension: Face ID releases a secret that only this
 * passkey can produce, and that secret decrypts a copy of the vault key. Without Face ID (or the passcode)
 * the copy is useless. Needs iOS 18+ (PRF in iCloud Keychain passkeys).
 */
class FaceId {
  static SALT = new TextEncoder().encode('visa-wallet face-id unlock v1');

  /** @return {Promise<boolean>} Whether the device has a biometric/passcode platform authenticator. */
  static async available() {
    try {
      return Boolean(window.PublicKeyCredential &&
                     await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
    } catch (e) {
      return false;
    }
  }

  /**
   * Creates the passkey (first Face ID prompt). Must run straight from a tap.
   * @return {Promise<{id: Uint8Array, secret: ArrayBuffer|undefined}>} Credential id, and the PRF secret if
   *     the platform already returns it at creation.
   */
  static async create() {
    const cred = await navigator.credentials.create({ publicKey: {
      rp: { name: 'Visa Wallet' },
      user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'Visa Wallet', displayName: 'Visa Wallet' },
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: 'platform', residentKey: 'required',
                                userVerification: 'required' },
      extensions: { prf: { eval: { first: FaceId.SALT } } },
    } });
    const prf = cred.getClientExtensionResults().prf || {};
    if (!prf.enabled && !prf.results) throw new Error('no-prf');
    return { id: new Uint8Array(cred.rawId), secret: prf.results?.first };
  }

  /**
   * Asks for Face ID and returns the passkey's secret. Must run straight from a tap.
   * @param {Uint8Array} id Credential id.
   * @return {Promise<ArrayBuffer>}
   */
  static async secret(id) {
    const cred = await navigator.credentials.get({ publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{ type: 'public-key', id }],
      userVerification: 'required',
      extensions: { prf: { eval: { first: FaceId.SALT } } },
    } });
    const flags = new Uint8Array(cred.response.authenticatorData)[32];
    if (!(flags & 0x04)) throw new Error('not-verified'); // UV bit: Face ID (or device passcode) was used
    const out = cred.getClientExtensionResults().prf?.results?.first;
    if (!out) throw new Error('no-prf');
    return out;
  }

  /** @return {Promise<CryptoKey>} The key that wraps the vault key, from a passkey secret. */
  static async wrapKey(secret) {
    const base = await crypto.subtle.importKey('raw', secret, 'HKDF', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: FaceId.SALT,
                                     info: new TextEncoder().encode('wrap') },
                                   base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }

  /** @return {string} A short, human message for a failed Face ID step. */
  static explain(e) {
    if (e.message === 'no-prf') return "Face ID can't protect a key on this iPhone (needs iOS 18 or newer).";
    if (e.name === 'NotAllowedError') return 'Face ID was cancelled.';
    return `Face ID didn't work (${e.name || e.message}).`;
  }
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
    const faceid = setup ? null : await this.store.getMeta('faceid');
    const faceBtn = document.getElementById('lock-faceid');
    faceBtn.hidden = !faceid;
    // With Face ID on, the passcode is a fallback: hidden behind "Use passcode" and no keyboard popping up.
    const usePass = document.getElementById('lock-use-pass');
    this.form.classList.toggle('face-first', Boolean(faceid));
    usePass.hidden = !faceid;
    usePass.onclick = () => {
      this.form.classList.remove('face-first');
      usePass.hidden = true;
      this.input.focus();
    };
    if (faceid) document.getElementById('lock-title').textContent = 'Locked';
    document.getElementById('lock-submit').textContent = setup ? 'Set passcode' : 'Unlock';
    document.getElementById('lock-forgot').hidden = setup;
    this.form.reset();
    this.say('');
    if (!faceid) setTimeout(() => this.input.focus(), 50);

    return new Promise(resolve => {
      const done = key => {
        if (!key) return;
        this.form.reset();
        this.el.hidden = true;
        document.body.classList.remove('locked');
        resolve(key);
      };
      this.form.onsubmit = async e => {
        e.preventDefault();
        const code = this.input.value;
        done(setup ? await this.create(code) : await this.check(vault, code));
      };
      faceBtn.onclick = async () => done(await this.faceUnlock(vault, faceid));
    });
  }

  /** @return {Promise<CryptoKey|null>} The vault key via Face ID, or null (message shown). */
  async faceUnlock(vault, faceid) {
    let raw;
    try {
      const secret = await FaceId.secret(faceid.id);
      raw = new Uint8Array(await Vault.decrypt(await FaceId.wrapKey(secret), faceid.wrapped, 'faceid'));
    } catch (e) {
      return this.say(e.name === 'OperationError' ? 'Face ID key no longer matches. Use the passcode.'
                                                  : `${FaceId.explain(e)} Use the passcode.`);
    }
    const key = await Vault.importKey(raw);
    raw.fill(0);
    if (!(await Vault.fits(key, vault))) return this.say('Face ID key no longer matches. Use the passcode.');
    await this.store.setMeta('fails', { count: 0, until: 0 });
    return key;
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
    this.faceDialog = document.getElementById('faceid');
    document.getElementById('faceid-toggle').onclick = () => this.toggleFaceId();
    document.getElementById('faceid-cancel').onclick = () => this.faceDialog.close();
    this.faceDialog.addEventListener('close', () => {
      this.raw?.fill(0);
      this.raw = null;
      this.cred = null;
    });
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
    this.showFaceIdState();
  }

  async showFaceIdState() {
    const on = Boolean(await this.store.getMeta('faceid'));
    const btn = document.getElementById('faceid-toggle');
    btn.textContent = on ? 'Turn off Face ID' : 'Turn on Face ID';
    btn.hidden = !on && !(await FaceId.available());
  }

  /**
   * Turns Face ID off, or walks through turning it on: passcode (checked), then a tap for each Face ID
   * prompt (iOS only shows them straight from a tap).
   */
  async toggleFaceId() {
    if (await this.store.getMeta('faceid')) {
      if (!confirm('Turn off Face ID? You will unlock with the passcode only.')) return;
      await this.store.run('meta', 'readwrite', s => s.delete('faceid'));
      return this.showFaceIdState();
    }
    const f = document.getElementById('faceid-form');
    const msg = document.getElementById('faceid-msg');
    const step = document.getElementById('faceid-step');
    f.reset();
    msg.textContent = '';
    step.hidden = true;
    f.querySelector('[type=submit]').hidden = false;
    this.faceDialog.showModal();
    f.onsubmit = async e => {
      e.preventDefault();
      msg.textContent = 'Checking…';
      const vault = await this.store.getMeta('vault');
      const raw = await Vault.deriveRaw(f.code.value, vault.salt, vault.kdf);
      if (!(await Vault.fits(await Vault.importKey(raw), vault))) {
        raw.fill(0);
        msg.textContent = 'Wrong passcode.';
        return;
      }
      this.raw = raw;
      msg.textContent = '';
      f.querySelector('[type=submit]').hidden = true;
      step.hidden = false;
      step.textContent = 'Set up Face ID';
      step.onclick = () => this.enrollFaceId(step, msg);
    };
  }

  async enrollFaceId(step, msg) {
    try {
      if (!this.cred) this.cred = await FaceId.create();
      let secret = this.cred.secret;
      if (!secret) { // iOS creates the passkey first; a second Face ID tap returns its secret
        if (step.textContent !== 'Confirm with Face ID') {
          step.textContent = 'Confirm with Face ID';
          msg.textContent = 'Passkey saved. Tap once more to confirm.';
          return;
        }
        secret = await FaceId.secret(this.cred.id);
      }
      const wrapped = await Vault.encrypt(await FaceId.wrapKey(secret), this.raw, 'faceid');
      await this.store.setMeta('faceid', { id: this.cred.id, wrapped });
      this.cred = null;
      this.faceDialog.close();
      this.showFaceIdState();
      alert('Face ID is on. The passcode still works as a backup.');
    } catch (e) {
      console.warn('Face ID setup failed:', e.name, e.message);
      msg.textContent = FaceId.explain(e);
    }
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
    if (this.faceDialog.open) this.faceDialog.close();
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
    const hadFace = Boolean(await this.store.getMeta('faceid'));
    await this.store.rekey(records, await Vault.seal(key, salt));
    this.key = key;
    f.old.form.reset();
    this.change.close();
    this.showFaceIdState();
    alert(hadFace ? 'Passcode changed. Turn Face ID on again (it used the old passcode).' : 'Passcode changed.');
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
      <div class="kicker">${['eVisa', ...EXTRA_DOCS.filter(d => p[d.key]).map(d => d.label)].join(' + ')}</div>
      <div class="name"></div>
      ${fields.length ? `<dl>${fields.map(() => '<div><dt></dt><dd></dd></div>').join('')}</dl>` : ''}
      <p>${status(p)}</p>
      <div class="actions">
        <button class="open">${p.pdf ? 'eVisa' : 'Add eVisa'}</button>
        <button class="edit">Edit</button>
      </div>
      <div class="actions docs">
        ${EXTRA_DOCS.map(d => `<button class="doc" data-doc="${d.key}">${p[d.key] ? '' : '+ '}${d.label}</button>`).join('')}
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
    for (const d of EXTRA_DOCS) {
      el.querySelector(`.doc[data-doc="${d.key}"]`).onclick = () => (p[d.key]
        ? this.viewer.open({ blob: p[d.key], title: `${p.name}: ${d.label}`,
                             fileName: p[`${d.key}Name`] || `${p.name}-${d.key}` })
        : this.editor.open(p, false));
    }
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

const APP_VERSION = 8; // keep in step with VERSION in sw.js
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
