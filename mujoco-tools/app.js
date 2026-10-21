// MuJoCo (WebAssembly) + three.js viewer for articulated hand tools.
// Each tool is a standalone MJCF file listed in tools.json. The viewer drops the tool's free joint so
// its base is fixed and only the mechanism moves; springs, friction and limits all come from the MJCF.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";
import loadMujoco from "https://cdn.jsdelivr.net/npm/@mujoco/mujoco@3.15.0/mujoco.js";

const FRAME_DT = 1 / 60;
const ANIMATE_PERIOD_S = 2.4;
const PULL_STIFFNESS = 300;  // N/m, spring from the cursor to the grabbed point
const PULL_DAMPING = 3;      // N·s/m
const COLLISION_COLOR = 0xff8a2a;

const $ = (id) => document.getElementById(id);
const status = (msg) => { $("status").textContent = msg; $("status").hidden = !msg; };

// ---------- three.js scene ----------
const canvas = $("c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.005, 20);
camera.up.set(0, 0, 1);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(0.4, -0.6, 1.2);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun, sun.target);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.18 }));
ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(1, 50, 0x9aa8b8, 0xc9d3de);
grid.rotation.x = Math.PI / 2;
scene.add(grid);
const pullLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
                                new THREE.LineBasicMaterial({ color: 0xd0342c }));
pullLine.visible = false;
scene.add(pullLine);

function themeColors() {
  const dark = matchMedia("(prefers-color-scheme: dark)").matches;
  scene.background = new THREE.Color(dark ? 0x141a22 : 0xf4f7fb);
}
themeColors();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", themeColors);

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas.parentElement;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas.parentElement);

// ---------- MuJoCo ----------
status("Loading MuJoCo (WebAssembly)…");
const mujoco = await loadMujoco();
mujoco.FS.mkdir("/work");
const manifest = await (await fetch("tools.json")).json();

let sim = null;          // current tool state
let pull = null;         // active cursor pull {body, local: Vector3, target: Vector3, prev: Vector3}
const geomGroup = new THREE.Group();
scene.add(geomGroup);

function mkdirs(path) {
  let cur = "";
  for (const part of path.split("/").slice(0, -1)) {
    cur += "/" + part;
    try { mujoco.FS.mkdir("/work" + cur); } catch { /* exists */ }
  }
}

async function writeToolFiles(tool) {
  for (const rel of [tool.xml, ...(tool.files || [])]) {
    const res = await fetch(rel);
    mkdirs(rel);
    if (rel === tool.xml) {
      // Weld the tool to the world: remove its free joint (the downloadable file keeps it).
      const xml = (await res.text()).replace(/<freejoint\b[^>]*\/>|<joint\b[^>]*type="free"[^>]*\/>/g, "");
      mujoco.FS.writeFile("/work/" + rel, xml);
    } else {
      mujoco.FS.writeFile("/work/" + rel, new Uint8Array(await res.arrayBuffer()));
    }
  }
}

function idOf(model, kind, name) {
  if (!name) return -1;
  const acc = model[kind](name);
  const id = acc.id;
  acc.delete();
  return id;
}

function geomGeometry(model, g) {
  const s = model.geom_size.subarray(3 * g, 3 * g + 3);
  const G = mujoco.mjtGeom;
  switch (model.geom_type[g]) {
    case G.mjGEOM_BOX.value: return new THREE.BoxGeometry(2 * s[0], 2 * s[1], 2 * s[2]);
    case G.mjGEOM_SPHERE.value: return new THREE.SphereGeometry(s[0], 24, 16);
    case G.mjGEOM_ELLIPSOID.value: return new THREE.SphereGeometry(1, 24, 16).scale(s[0], s[1], s[2]);
    case G.mjGEOM_CAPSULE.value: return new THREE.CapsuleGeometry(s[0], 2 * s[1], 8, 20).rotateX(Math.PI / 2);
    case G.mjGEOM_CYLINDER.value: return new THREE.CylinderGeometry(s[0], s[0], 2 * s[1], 32).rotateX(Math.PI / 2);
    case G.mjGEOM_MESH.value: return meshGeometry(model, model.geom_dataid[g], false);
    default: return null;
  }
}

function meshVertices(model, m) {
  const a = model.mesh_vertadr[m], n = model.mesh_vertnum[m];
  return model.mesh_vert.slice(3 * a, 3 * (a + n));
}

function meshGeometry(model, m, hull) {
  const v = meshVertices(model, m);
  if (hull) {
    const pts = [];
    for (let i = 0; i < v.length; i += 3) pts.push(new THREE.Vector3(v[i], v[i + 1], v[i + 2]));
    return new ConvexGeometry(pts);
  }
  const fa = model.mesh_faceadr[m], fn = model.mesh_facenum[m];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(v, 3));
  geo.setIndex(Array.from(model.mesh_face.subarray(3 * fa, 3 * (fa + fn))));
  geo.computeVertexNormals();
  return geo;
}

function geomColor(model, g) {
  const mat = model.geom_matid[g];
  const c = mat >= 0 ? model.mat_rgba.subarray(4 * mat, 4 * mat + 4) : model.geom_rgba.subarray(4 * g, 4 * g + 4);
  return [new THREE.Color(c[0], c[1], c[2]), c[3]];
}

function buildMeshes(model) {
  geomGroup.clear();
  const visual = [], collision = [];
  for (let g = 0; g < model.ngeom; g++) {
    const isCollider = (model.geom_contype[g] | model.geom_conaffinity[g]) !== 0;
    const isVisual = model.geom_group[g] <= 2;
    const geo = (isVisual || isCollider) ? geomGeometry(model, g) : null;
    if (!geo) continue;
    const body = model.geom_bodyid[g];
    if (isVisual) {
      const [color, alpha] = geomColor(model, g);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color, roughness: 0.45, metalness: 0.25, transparent: alpha < 1, opacity: alpha }));
      mesh.castShadow = true;
      mesh.userData = { geom: g, body };
      visual.push(mesh);
      geomGroup.add(mesh);
    }
    if (isCollider) {
      // Mesh geoms collide as their convex hull, so show the hull, not the mesh.
      const cgeo = model.geom_type[g] === mujoco.mjtGeom.mjGEOM_MESH.value
        ? meshGeometry(model, model.geom_dataid[g], true) : geo;
      const mesh = new THREE.Mesh(cgeo, new THREE.MeshStandardMaterial({
        color: COLLISION_COLOR, transparent: true, opacity: 0.45, depthWrite: false, flatShading: true }));
      mesh.userData = { geom: g, body, collision: true };
      mesh.visible = false;
      collision.push(mesh);
      geomGroup.add(mesh);
    }
  }
  return { visual, collision };
}

async function loadTool(tool) {
  status(`Loading ${tool.name}…`);
  pull = null;
  const old = sim;
  sim = null;  // the render loop skips simulation while the next tool loads
  if (old) { old.data.delete(); old.model.delete(); }
  await writeToolFiles(tool);
  const model = mujoco.MjModel.from_xml_path("/work/" + tool.xml);
  const data = new mujoco.MjData(model);
  const jid = idOf(model, "jnt", tool.joint);
  const opt = model.opt;
  const s = {
    tool, model, data, jid,
    qadr: model.jnt_qposadr[jid], dof: model.jnt_dofadr[jid],
    isSlide: model.jnt_type[jid] === mujoco.mjtJoint.mjJNT_SLIDE.value,
    range: [model.jnt_range[2 * jid], model.jnt_range[2 * jid + 1]],
    timestep: opt.timestep,
    grip: (tool.grip || []).map((n) => idOf(model, "site", n)),
    tips: (tool.tips || []).map((n) => idOf(model, "site", n)),
    t0: performance.now() / 1000,
  };
  mujoco.mj_forward(model, data);
  Object.assign(s, buildMeshes(model));
  sim = s;
  syncMeshes();
  frameCamera();
  setupControls();
  status("");
}

const _m = new THREE.Matrix4();
function syncMeshes() {
  const xpos = sim.data.geom_xpos, xmat = sim.data.geom_xmat;
  for (const mesh of [...sim.visual, ...sim.collision]) {
    const g = mesh.userData.geom, r = xmat.subarray(9 * g, 9 * g + 9);
    _m.set(r[0], r[1], r[2], xpos[3 * g],
           r[3], r[4], r[5], xpos[3 * g + 1],
           r[6], r[7], r[8], xpos[3 * g + 2],
           0, 0, 0, 1);
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(_m);
  }
}

function frameCamera() {
  geomGroup.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(geomGroup);
  const center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
  const span = Math.max(size.x, size.y, size.z);
  ground.position.set(center.x, center.y, box.min.z - 0.001);
  grid.position.copy(ground.position);
  grid.scale.setScalar(Math.max(0.3, span * 2));
  sun.target.position.copy(center);
  sun.position.copy(center).add(new THREE.Vector3(0.4, -0.6, 1.2).multiplyScalar(span));
  const cam = sun.shadow.camera;
  cam.left = cam.bottom = -span; cam.right = cam.top = span; cam.near = 0.01; cam.far = 4 * span + 1;
  cam.updateProjectionMatrix();
  controls.target.copy(center);
  camera.position.copy(center).add(new THREE.Vector3(0.15, -0.95, 0.85).multiplyScalar(span * 1.15));
  camera.near = span / 200; camera.far = span * 50;
  camera.updateProjectionMatrix();
}

// ---------- forces ----------
function applyForceAt(body, point, f) {
  const x = sim.data.xipos, xf = sim.data.xfrc_applied, o = 6 * body;
  const r = [point[0] - x[3 * body], point[1] - x[3 * body + 1], point[2] - x[3 * body + 2]];
  xf[o] += f[0]; xf[o + 1] += f[1]; xf[o + 2] += f[2];
  xf[o + 3] += r[1] * f[2] - r[2] * f[1];
  xf[o + 4] += r[2] * f[0] - r[0] * f[2];
  xf[o + 5] += r[0] * f[1] - r[1] * f[0];
}

function sitePos(site) {
  const p = sim.data.site_xpos;
  return [p[3 * site], p[3 * site + 1], p[3 * site + 2]];
}

function bodyPoint(body, local) {
  const p = sim.data.xpos, R = sim.data.xmat, o = 9 * body;
  return new THREE.Vector3(
    p[3 * body] + R[o] * local.x + R[o + 1] * local.y + R[o + 2] * local.z,
    p[3 * body + 1] + R[o + 3] * local.x + R[o + 4] * local.y + R[o + 5] * local.z,
    p[3 * body + 2] + R[o + 6] * local.x + R[o + 7] * local.y + R[o + 8] * local.z);
}

function applyForces(squeezeN) {
  sim.data.xfrc_applied.fill(0);
  if (squeezeN > 0 && sim.grip.length === 2) {
    const [a, b] = sim.grip.map(sitePos);
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const n = Math.hypot(...d) || 1;
    const f = d.map((v) => (squeezeN * v) / n);
    applyForceAt(sim.model.site_bodyid[sim.grip[0]], a, f);
    applyForceAt(sim.model.site_bodyid[sim.grip[1]], b, f.map((v) => -v));
  }
  if (pull) {
    const p = bodyPoint(pull.body, pull.local);
    const v = p.clone().sub(pull.prev).divideScalar(sim.timestep);
    pull.prev.copy(p);
    const f = pull.target.clone().sub(p).multiplyScalar(PULL_STIFFNESS).addScaledVector(v, -PULL_DAMPING);
    applyForceAt(pull.body, [p.x, p.y, p.z], [f.x, f.y, f.z]);
  }
}

// ---------- UI ----------
const ui = {
  tool: $("tool"), angle: $("angle"), force: $("force"), coll: $("show-collision"), vis: $("show-visual"),
  angleOut: $("angle-out"), forceOut: $("force-out"),
};
const mode = () => document.querySelector('input[name="mode"]:checked').value;

for (const [i, t] of manifest.tools.entries()) ui.tool.add(new Option(t.name, i));

function fmtJoint(q) { return sim.isSlide ? `${(q * 1000).toFixed(1)} mm` : `${(q * 180 / Math.PI).toFixed(1)}°`; }

function setupControls() {
  const t = sim.tool, [lo, hi] = sim.range;
  ui.angle.min = lo; ui.angle.max = hi; ui.angle.step = (hi - lo) / 400;
  ui.angle.value = sim.data.qpos[sim.qadr];
  $("angle-label").textContent = sim.isSlide ? "Plunger position" : "Hinge angle";
  ui.force.max = t.maxForce ?? 20; ui.force.step = (t.maxForce ?? 20) / 200; ui.force.value = 0;
  $("blurb").innerHTML = t.blurb || "";
  $("download").href = t.xml;
  $("download").setAttribute("download", t.xml.split("/").pop());
  $("params").innerHTML = (t.params || []).map(([k, v, src]) =>
    `<tr><th>${k}</th><td>${v}</td><td class="src">${src ?? ""}</td></tr>`).join("");
  $("sources").innerHTML = (t.sources || []).map((s, i) =>
    `<li id="src-${i + 1}"><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join("");
  $("sources-wrap").hidden = !(t.sources || []).length;
  ui.coll.dispatchEvent(new Event("change"));
  updateReadouts();
}

ui.tool.addEventListener("change", () => loadTool(manifest.tools[+ui.tool.value]));
ui.coll.addEventListener("change", () => sim?.collision.forEach((m) => (m.visible = ui.coll.checked)));
ui.vis.addEventListener("change", () => sim?.visual.forEach((m) => (m.visible = ui.vis.checked)));
document.querySelectorAll('input[name="mode"]').forEach((r) => r.addEventListener("change", () => {
  document.body.dataset.mode = mode();
  if (!sim) return;
  sim.data.qvel.fill(0);
  ui.angle.value = sim.data.qpos[sim.qadr];
}));
document.body.dataset.mode = mode();

function updateReadouts() {
  const m = sim.model, q = sim.data.qpos[sim.qadr], j = sim.jid;
  ui.angleOut.textContent = fmtJoint(q);
  ui.forceOut.textContent = `${(+ui.force.value).toFixed(1)} N`;
  const rows = [["Opening", fmtJoint(q)]];
  if (sim.tips.length === 2) {
    const [a, b] = sim.tips.map(sitePos);
    rows.push([sim.tool.tipLabel || "Tip gap", `${(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 1000).toFixed(1)} mm`]);
  }
  const k = m.jnt_stiffness[j];
  if (k > 0) {
    const tau = k * (m.qpos_spring[sim.qadr] - q);
    rows.push([sim.isSlide ? "Spring force" : "Spring torque", sim.isSlide ? `${tau.toFixed(2)} N` : `${(tau * 1000).toFixed(0)} N·mm`]);
    if (!sim.isSlide && sim.grip.length === 2 && sim.tool.gripLever) {
      rows.push(["Grip force to hold", `${(Math.abs(tau) / sim.tool.gripLever).toFixed(2)} N`]);
    }
  }
  $("readouts").innerHTML = rows.map(([k2, v]) => `<div><span>${k2}</span><b>${v}</b></div>`).join("");
}

// Cursor pull: pressing on a moving part pulls it; pressing elsewhere orbits.
const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2(), dragPlane = new THREE.Plane();
function rayFrom(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
}
canvas.addEventListener("pointerdown", (ev) => {
  if (!sim) return;
  rayFrom(ev);
  const hit = raycaster.intersectObjects(sim.visual.filter((m) => m.visible), false)[0];
  const body = hit?.object.userData.body;
  if (!hit || sim.model.body_rootid[body] === body) return;  // the fixed base orbits instead
  if (mode() !== "physics") $("mode-physics").click();
  const p = sim.data.xpos, R = sim.data.xmat, o = 9 * body;
  const d = hit.point.clone().sub(new THREE.Vector3(p[3 * body], p[3 * body + 1], p[3 * body + 2]));
  const local = new THREE.Vector3(  // R^T d
    R[o] * d.x + R[o + 3] * d.y + R[o + 6] * d.z,
    R[o + 1] * d.x + R[o + 4] * d.y + R[o + 7] * d.z,
    R[o + 2] * d.x + R[o + 5] * d.y + R[o + 8] * d.z);
  dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()), hit.point);
  pull = { body, local, target: hit.point.clone(), prev: hit.point.clone() };
  controls.enabled = false;
  canvas.setPointerCapture(ev.pointerId);
});
canvas.addEventListener("pointermove", (ev) => {
  if (!pull) return;
  rayFrom(ev);
  raycaster.ray.intersectPlane(dragPlane, pull.target);
});
const endPull = () => { pull = null; controls.enabled = true; pullLine.visible = false; };
canvas.addEventListener("pointerup", endPull);
canvas.addEventListener("pointercancel", endPull);

// ---------- main loop ----------
function tick() {
  requestAnimationFrame(tick);
  if (sim) {
    const { model, data, qadr } = sim, [lo, hi] = sim.range;
    const m = mode();
    if (m === "animate") {
      const t = performance.now() / 1000 - sim.t0;
      data.qpos[qadr] = (hi + lo) / 2 + ((hi - lo) / 2) * Math.cos((2 * Math.PI * t) / ANIMATE_PERIOD_S);
      data.qvel.fill(0);
      mujoco.mj_forward(model, data);
    } else if (m === "angle") {
      data.qpos[qadr] = +ui.angle.value;
      data.qvel.fill(0);
      mujoco.mj_forward(model, data);
    } else {
      const n = Math.max(1, Math.round(FRAME_DT / sim.timestep));
      for (let i = 0; i < n; i++) {
        applyForces(+ui.force.value);
        mujoco.mj_step(model, data);
      }
      mujoco.mj_forward(model, data);
    }
    syncMeshes();
    updateReadouts();
    if (pull) {
      const p = bodyPoint(pull.body, pull.local);
      pullLine.geometry.setFromPoints([p, pull.target]);
      pullLine.visible = true;
    }
  }
  controls.update();
  renderer.render(scene, camera);
}

const initial = Math.max(0, manifest.tools.findIndex((t) => t.id === new URLSearchParams(location.search).get("tool")));
ui.tool.value = initial;
await loadTool(manifest.tools[initial]);
tick();
