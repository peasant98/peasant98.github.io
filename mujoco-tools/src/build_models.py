"""Build the MJCF models and tools.json for the MuJoCo hand-tools page, then validate each model.

usage: python build_models.py [--dexjoco DIR] [--debug-dir DIR]
  --dexjoco   folder holding DexJoCo's tongs.xml + tongs/ meshes (github.com/brave-eai/dexjoco, MIT)
  --debug-dir where validation renders are written

Every physical number lives in the tool classes below next to its source, so the page's parameter
tables and the MJCF are generated from one place.
"""
import argparse
import json
import re
import shutil
from dataclasses import dataclass, field
from pathlib import Path

import mujoco
import numpy as np

HERE = Path(__file__).resolve().parent
SITE_DIR = HERE.parent
MODEL_DIR = SITE_DIR / "models"


@dataclass
class Source:
    title: str
    url: str


@dataclass
class ToolModel:
    """One tool: its MJCF text, page metadata, and the parameter table shown next to it."""
    id: str
    name: str
    blurb: str
    joint: str = "hinge"
    grip: tuple = ("grip_a", "grip_b")
    tips: tuple = ("tip_a", "tip_b")
    tip_label: str = "Tip gap"
    max_force: float = 20.0
    grip_lever: float | None = None  # m from pivot to grip sites, for the "grip force to hold" readout
    sources: list = field(default_factory=list)
    params: list = field(default_factory=list)  # (label, value, note) — note is "[n]" or "estimate: ..."

    def xml(self) -> str:
        raise NotImplementedError

    def extra_files(self) -> list[Path]:
        """Files besides the XML that the model needs, relative to MODEL_DIR."""
        return []

    def manifest(self) -> dict:
        return {
            "id": self.id, "name": self.name, "blurb": self.blurb,
            "xml": f"models/{self.id}.xml",
            "files": [f"models/{p.as_posix()}" for p in self.extra_files()],
            "joint": self.joint, "grip": list(self.grip), "tips": list(self.tips), "tipLabel": self.tip_label,
            "maxForce": self.max_force, "gripLever": self.grip_lever,
            "params": [[k, v, render_note(n)] for k, v, n in self.params],
            "sources": [{"title": s.title, "url": s.url} for s in self.sources],
        }


def render_note(note: str) -> str:
    """'[2]' -> link to source 2; 'estimate: why' -> highlighted estimate."""
    if note.startswith("estimate"):
        return f'<span class="est">estimate</span>{note[len("estimate"):]}'
    return re.sub(r"\[(\d+)\]", r'<a href="#src-\1">[\1]</a>', note)


# ---------------------------------------------------------------------------------------------
# DexJoCo tongs: the benchmark's model, unchanged except for file paths, root pose and added sites.
# ---------------------------------------------------------------------------------------------
class DexJoCoTongs(ToolModel):
    MESH_SUBDIR = Path("dexjoco_tongs")

    def __init__(self, src_dir: Path):
        super().__init__(
            id="dexjoco_tongs",
            name="DexJoCo “tongs” (benchmark mesh model)",
            blurb="The tongs model from the DexJoCo MuJoCo benchmark (Pinch Tongs task), shown as published. "
                  "Its mesh is a pair of cutting pliers; each part collides as one convex hull "
                  "(tick <i>Collision geometry</i>) and the hinge has no damping or friction.",
            joint="joint_0", tip_label="Handle-end gap", max_force=15.0,
            sources=[Source("DexJoCo benchmark (GitHub, MIT)", "https://github.com/brave-eai/dexjoco"),
                     Source("DexJoCo project page", "https://dexjoco.github.io")],
        )
        self.src_dir = src_dir
        self.src_xml = (src_dir / "tongs.xml").read_text()
        self.mesh_files = sorted(set(re.findall(r'file="([^"]+\.obj)"', self.src_xml)))
        self._compute_sites()

    def _compute_sites(self):
        """Grip sites 75 % of the way from the hinge to each handle end; tip sites at the handle ends."""
        m = mujoco.MjModel.from_xml_path(str(self.src_dir / "tongs.xml"))
        d = mujoco.MjData(m)
        mujoco.mj_forward(m, d)
        anchor = d.xanchor[m.joint("joint_0").id]
        self.sites = {}
        for body, tag in (("link_0", "a"), ("link_1", "b")):
            b = m.body(body).id
            pts = np.concatenate([
                verts_world(m, d, g) for g in range(m.ngeom) if m.geom_bodyid[g] == b and m.geom_group[g] == 4])
            end = pts[np.argmax(np.linalg.norm(pts - anchor, axis=1))]
            R, p = d.xmat[b].reshape(3, 3), d.xpos[b]
            self.sites[body] = {f"grip_{tag}": R.T @ (anchor + 0.75 * (end - anchor) - p),
                                f"tip_{tag}": R.T @ (end - p)}
            self.grip_lever = float(0.75 * np.linalg.norm(end - anchor))
        jid = m.joint("joint_0").id
        lo, hi = m.jnt_range[jid]
        self.params = [
            ("Joint", f"hinge, {np.degrees(lo):+.1f}° to {np.degrees(hi):+.1f}°", "[1]"),
            ("Spring", f"k = {m.jnt_stiffness[jid]:g} N·m/rad toward {np.degrees(m.qpos_spring[m.jnt_qposadr[jid]]):.1f}°", "[1]"),
            ("Damping / friction", f"{m.dof_damping[m.jnt_dofadr[jid]]:g} / {m.dof_frictionloss[m.jnt_dofadr[jid]]:g}", "[1]"),
            ("Mass", f"{m.body_subtreemass[m.body('link_1').id] * 1000:.0f} g", "[1]"),
            ("Length", f"{np.ptp(np.concatenate([verts_world(m, d, g) for g in range(m.ngeom) if m.geom_group[g] == 4])[:, :2], axis=0).max() * 100:.1f} cm", "[1]"),
            ("Collision", "convex hull of each mesh part", "[1]"),
        ]

    def extra_files(self):
        return [self.MESH_SUBDIR / Path(f).name for f in self.mesh_files]

    def xml(self):
        s = self.src_xml
        for f in self.mesh_files:
            s = s.replace(f'file="{f}"', f'file="{(self.MESH_SUBDIR / Path(f).name).as_posix()}"')
        s = re.sub(r"\s*<light [^>]*/>", "", s)
        s = re.sub(r"\s*<actuator>\s*</actuator>", "", s)
        s = s.replace('pos="0.5 0.1 0.05"', 'pos="0 0 0.03"', 1)
        for body, sites in self.sites.items():
            tag = f'<body name="{body}"'
            i = s.index(tag)
            j = s.index(">", i) + 1
            site_xml = "".join(
                f'\n      <site name="{n}" pos="{v[0]:.5f} {v[1]:.5f} {v[2]:.5f}" size="0.004" rgba="0.2 0.5 1 0.8" group="5"/>'
                for n, v in sites.items())
            s = s[:j] + site_xml + s[j:]
        header = ("<!-- DexJoCo tongs (https://github.com/brave-eai/dexjoco, MIT License, Copyright (c) 2026 Dexjoco\n"
                  "     contributors). Modified for the hand-tools page: mesh paths, root position, grip/tip sites. -->\n")
        return header + s

    def copy_meshes(self):
        out = MODEL_DIR / self.MESH_SUBDIR
        out.mkdir(parents=True, exist_ok=True)
        for f in self.mesh_files:
            text = (self.src_dir / f).read_text()
            text = "\n".join(l for l in text.splitlines() if not l.startswith(("mtllib", "usemtl")))
            (out / Path(f).name).write_text(text + "\n")


def verts_world(m, d, g):
    mid = m.geom_dataid[g]
    v = m.mesh_vert[m.mesh_vertadr[mid]:m.mesh_vertadr[mid] + m.mesh_vertnum[mid]]
    return v @ d.geom_xmat[g].reshape(3, 3).T + d.geom_xpos[g]


# ---------------------------------------------------------------------------------------------
# Procedural tools: two rigid parts joined by one hinge or slide, built from primitive geoms.
# ---------------------------------------------------------------------------------------------
def v3(x):
    return " ".join(f"{float(c):.5g}" for c in x)


@dataclass
class Geom:
    """A primitive geom. Use size+pos(+euler) for box/cylinder/sphere, or fromto for capsules/cylinders."""
    type: str
    size: tuple
    mass: float                      # kg
    pos: tuple | None = None
    euler: tuple | None = None       # radians, xyz
    fromto: tuple | None = None
    rgba: str = "0.7 0.7 0.72 1"
    friction: float | None = None    # sliding; None = the tool default

    def xml(self):
        a = [f'type="{self.type}"', f'size="{v3(self.size)}"', f'mass="{self.mass:.6g}"', f'rgba="{self.rgba}"']
        if self.fromto is not None:
            a.append(f'fromto="{v3(self.fromto)}"')
        if self.pos is not None:
            a.append(f'pos="{v3(self.pos)}"')
        if self.euler is not None:
            a.append(f'euler="{v3(self.euler)}"')
        if self.friction is not None:
            a.append(f'friction="{self.friction:g} 0.005 0.0001"')
        return f"<geom {' '.join(a)}/>"


@dataclass
class Joint:
    type: str                 # hinge | slide
    pos: tuple
    axis: tuple
    range: tuple              # rad or m
    stiffness: float = 0.0    # N·m/rad or N/m
    springref: float = 0.0
    damping: float = 0.0      # N·m·s/rad or N·s/m
    frictionloss: float = 0.0  # N·m or N

    def xml(self, name):
        return (f'<joint name="{name}" type="{self.type}" pos="{v3(self.pos)}" axis="{v3(self.axis)}" '
                f'range="{self.range[0]:.6g} {self.range[1]:.6g}" stiffness="{self.stiffness:.6g}" '
                f'springref="{self.springref:.6g}" damping="{self.damping:.6g}" '
                f'frictionloss="{self.frictionloss:.6g}"/>')


class TwoPartTool(ToolModel):
    """Base part (free in the downloadable file) + one moving part on a hinge or slide joint.

    Subclasses fill base_geoms, moving_geoms, sites and the joint; the default sliding friction
    applies to every geom unless a geom sets its own.
    """
    friction: float = 0.8
    lift: float = 0.02        # height of the joint frame above the table plane in the file
    damping_ratio: float | None = None  # if set, joint damping = 2·ζ·sqrt(k·I) at build time

    def base_geoms(self) -> list[Geom]: raise NotImplementedError
    def moving_geoms(self) -> list[Geom]: raise NotImplementedError
    def joint_spec(self) -> Joint: raise NotImplementedError
    def base_sites(self) -> dict: return {}
    def moving_sites(self) -> dict: return {}

    def xml(self, damping=None):
        j = self.joint_spec()
        if damping is not None:
            j.damping = damping
        site = lambda n, p: f'<site name="{n}" pos="{v3(p)}" size="0.003" rgba="0.2 0.5 1 0.8" group="5"/>'
        ind = "\n        "
        return f"""<!-- {self.name}: generated by src/build_models.py; parameters and sources in tools.json. -->
<mujoco model="{self.id}">
  <compiler angle="radian" autolimits="true"/>
  <option timestep="0.001"/>
  <default>
    <geom condim="4" friction="{self.friction:g} 0.005 0.0001"/>
  </default>
  <worldbody>
    <body name="{self.id}_base" pos="0 0 {self.lift:g}">
      <freejoint name="{self.id}_root"/>
      {ind[3:].join([g.xml() for g in self.base_geoms()] + [site(n, p) for n, p in self.base_sites().items()])}
      <body name="{self.id}_moving">
        {j.xml(self.joint)}
        {ind.join([g.xml() for g in self.moving_geoms()] + [site(n, p) for n, p in self.moving_sites().items()])}
      </body>
    </body>
  </worldbody>
</mujoco>
"""

    def tuned_xml(self):
        """XML with damping set from the damping ratio using the moving part's inertia about the joint."""
        if self.damping_ratio is None:
            return self.xml()
        m = mujoco.MjModel.from_xml_string(self.xml())
        d = mujoco.MjData(m)
        mujoco.mj_forward(m, d)
        j = m.joint(self.joint)
        dof = j.dofadr[0]
        M = np.zeros((m.nv, m.nv))
        mujoco.mj_fullM(m, M, d.M)
        inertia = M[dof, dof]  # moving part's inertia about the joint axis
        k = self.joint_spec().stiffness
        self.inertia = float(inertia)
        return self.xml(damping=2 * self.damping_ratio * np.sqrt(k * inertia))


# ---------------------------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------------------------
def validate(tool: ToolModel, debug_dir: Path):
    path = MODEL_DIR / f"{tool.id}.xml"
    m = mujoco.MjModel.from_xml_path(str(path))
    d = mujoco.MjData(m)
    mujoco.mj_forward(m, d)
    j = m.joint(tool.joint).id
    for n in (*tool.grip, *tool.tips):
        m.site(n)  # raises if missing
    root = m.body_rootid[m.jnt_bodyid[j]]
    print(f"[{tool.id}] mass {m.body_subtreemass[root] * 1000:.1f} g, joint range {m.jnt_range[j].round(4)}, "
          f"k={m.jnt_stiffness[j]:g}, damping={m.dof_damping[m.jnt_dofadr[j]]:g}, frictionloss={m.dof_frictionloss[m.jnt_dofadr[j]]:g}")
    render_debug(m, d, tool, debug_dir)


def render_debug(m, d, tool, debug_dir):
    from PIL import Image
    j = m.joint(tool.joint).id
    qadr = m.jnt_qposadr[j]
    r = mujoco.Renderer(m, 360, 480)
    opt = mujoco.MjvOption()
    opt.geomgroup[:] = 1
    opt.sitegroup[:] = 1
    tiles = []
    for q in m.jnt_range[j]:
        d.qpos[qadr] = q
        mujoco.mj_forward(m, d)
        cam = mujoco.MjvCamera()
        mujoco.mjv_defaultFreeCamera(m, cam)
        cam.lookat[:] = d.geom_xpos.mean(0)
        cam.distance = 2.2 * np.ptp(d.geom_xpos, axis=0).max() + 0.05
        cam.elevation, cam.azimuth = -70, 90
        r.update_scene(d, cam, opt)
        tiles.append(r.render())
    debug_dir.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.concatenate(tiles, axis=1)).save(debug_dir / f"{tool.id}.png")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dexjoco", type=Path, default=Path.home() / "Downloads/outputs/dexjoco_tongs")
    ap.add_argument("--debug-dir", type=Path, default=Path.home() / "Downloads/outputs/mujoco_tools_debug")
    args = ap.parse_args()

    MODEL_DIR.mkdir(exist_ok=True)
    dex = DexJoCoTongs(args.dexjoco)
    dex.copy_meshes()
    tools = [dex]
    for t in tools:
        (MODEL_DIR / f"{t.id}.xml").write_text(t.xml())
        validate(t, args.debug_dir)
    (SITE_DIR / "tools.json").write_text(json.dumps({"tools": [t.manifest() for t in tools]}, indent=1))
    print("wrote", SITE_DIR / "tools.json")


if __name__ == "__main__":
    main()
