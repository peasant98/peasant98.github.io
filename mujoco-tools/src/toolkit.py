"""Shared pieces for the hand-tool models: page metadata, primitive geoms, joints, and a generator for
tools made of two rigid parts joined by one hinge or slide joint."""
import re
from dataclasses import dataclass, field
from pathlib import Path

import mujoco
import numpy as np


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
    joint_label: str = "Hinge angle"
    max_force: float = 20.0
    grip_lever: float | None = None       # m from pivot to grip sites, for the "grip force to hold" readout
    initial: float | None = None          # joint position when the page loads the tool
    volume_per_meter: float | None = None  # mL per m of slide travel (syringe readout)
    sources: list = field(default_factory=list)
    params: list = field(default_factory=list)  # (label, value, note); note is "[n]" or "estimate: ..."

    def xml(self) -> str:
        raise NotImplementedError

    def extra_files(self) -> list[Path]:
        """Files besides the XML that the model needs, relative to the models folder."""
        return []

    def manifest(self) -> dict:
        return {
            "id": self.id, "name": self.name, "blurb": self.blurb,
            "xml": f"models/{self.id}.xml",
            "files": [f"models/{p.as_posix()}" for p in self.extra_files()],
            "joint": self.joint, "jointLabel": self.joint_label,
            "grip": list(self.grip), "tips": list(self.tips), "tipLabel": self.tip_label,
            "maxForce": self.max_force, "gripLever": self.grip_lever,
            "initial": self.initial, "volumePerMeter": self.volume_per_meter,
            "params": [[k, v, render_note(n)] for k, v, n in self.params],
            "sources": [{"title": s.title, "url": s.url} for s in self.sources],
        }


def render_note(note: str) -> str:
    """'[2]' -> link to source 2; 'estimate: why' -> highlighted estimate."""
    if note.startswith("estimate"):
        return f'<span class="est">estimate</span>{note[len("estimate"):]}'
    return re.sub(r"\[(\d+)\]", r'<a href="#src-\1">[\1]</a>', note)


def v3(x):
    return " ".join(f"{float(c):.5g}" for c in x)


@dataclass
class Geom:
    """A primitive geom. Use size+pos(+euler) for box/cylinder/sphere, or fromto for capsules/cylinders.
    mass is filled in by distribute_mass() when left as None."""
    type: str
    size: tuple
    pos: tuple | None = None
    euler: tuple | None = None       # radians, xyz
    fromto: tuple | None = None
    rgba: str = "0.72 0.73 0.75 1"
    friction: float | None = None    # sliding; None = the tool default
    mass: float | None = None        # kg

    def volume(self):
        s = self.size
        half = np.linalg.norm(np.subtract(self.fromto[3:], self.fromto[:3])) / 2 if self.fromto else None
        if self.type == "box":
            return 8 * s[0] * s[1] * s[2]
        if self.type == "sphere":
            return 4 / 3 * np.pi * s[0] ** 3
        if self.type == "cylinder":
            return np.pi * s[0] ** 2 * 2 * (half if half is not None else s[1])
        if self.type == "capsule":
            h = half if half is not None else s[1]
            return np.pi * s[0] ** 2 * 2 * h + 4 / 3 * np.pi * s[0] ** 3
        raise ValueError(self.type)

    def xml(self):
        size = self.size[:1] if self.fromto is not None else self.size
        a = [f'type="{self.type}"', f'size="{v3(size)}"', f'mass="{self.mass:.6g}"', f'rgba="{self.rgba}"']
        if self.fromto is not None:
            a.append(f'fromto="{v3(self.fromto)}"')
        if self.pos is not None:
            a.append(f'pos="{v3(self.pos)}"')
        if self.euler is not None:
            a.append(f'euler="{v3(self.euler)}"')
        if self.friction is not None:
            a.append(f'friction="{self.friction:g} 0.005 0.0001"')
        return f"<geom {' '.join(a)}/>"


def distribute_mass(geoms: list[Geom], total: float) -> list[Geom]:
    """Give every geom without an explicit mass a share of what is left of `total`, by volume."""
    fixed = sum(g.mass for g in geoms if g.mass is not None)
    free = [g for g in geoms if g.mass is None]
    vol = sum(g.volume() for g in free)
    for g in free:
        g.mass = (total - fixed) * g.volume() / vol
    return geoms


def bar(p0, p1, half_width, half_thick, **kw) -> Geom:
    """Box from p0 to p1 in the xy-plane: thickness along the in-plane normal, width along z."""
    p0, p1 = np.asarray(p0, float), np.asarray(p1, float)
    d = p1 - p0
    return Geom("box", (np.linalg.norm(d) / 2, half_thick, half_width),
                pos=(*((p0 + p1) / 2), 0.0), euler=(0, 0, np.arctan2(d[1], d[0])), **kw)


def ring(center, radius, tube, n=10, **kw) -> list[Geom]:
    """Finger loop in the xy-plane as a ring of capsules; kw (e.g. mass, rgba) apply to each."""
    ang = np.linspace(0, 2 * np.pi, n + 1)
    pts = [(center[0] + radius * np.cos(a), center[1] + radius * np.sin(a), 0.0) for a in ang]
    return [Geom("capsule", (tube,), fromto=(*pts[i], *pts[i + 1]), **kw) for i in range(n)]


@dataclass
class Joint:
    type: str                  # hinge | slide
    pos: tuple
    axis: tuple
    range: tuple               # rad or m
    stiffness: float = 0.0     # N·m/rad or N/m
    springref: float = 0.0
    damping: float = 0.0       # N·m·s/rad or N·s/m
    frictionloss: float = 0.0  # N·m or N
    solreflimit: tuple = (0.02, 1.0)   # MuJoCo default; TwoPartTool tightens it to the timestep

    def xml(self, name):
        return (f'<joint name="{name}" type="{self.type}" pos="{v3(self.pos)}" axis="{v3(self.axis)}" '
                f'range="{self.range[0]:.6g} {self.range[1]:.6g}" stiffness="{self.stiffness:.6g}" '
                f'springref="{self.springref:.6g}" damping="{self.damping:.6g}" '
                f'frictionloss="{self.frictionloss:.6g}" solreflimit="{v3(self.solreflimit)}"/>')


class TwoPartTool(ToolModel):
    """Base part (free-floating in the downloadable file) + one moving part on a hinge or slide joint.

    Subclasses implement base_geoms, moving_geoms, joint_spec and the sites; the tool-wide sliding
    friction applies to every geom that does not set its own. If damping_ratio is set, the joint
    damping is chosen as 2·ζ·sqrt(k·I), with I the moving part's inertia about the joint.

    MuJoCo's joint limits are soft, with a stiffness that scales with the moving part's inertia, so a
    gram-scale part needs a short limit time constant (and so a short timestep) to stop where the real
    tool stops. The limit time constant is set to 2.5 timesteps, the stiffest MuJoCo allows comfortably.
    """
    friction: float = 0.8
    damping_ratio: float | None = None
    timestep: float = 0.001

    def base_geoms(self) -> list[Geom]: raise NotImplementedError
    def moving_geoms(self) -> list[Geom]: raise NotImplementedError
    def joint_spec(self) -> Joint: raise NotImplementedError
    def base_sites(self) -> dict: return {}
    def moving_sites(self) -> dict: return {}

    def _xml(self, joint: Joint):
        site = lambda n, p: f'<site name="{n}" pos="{v3(p)}" size="0.0025" rgba="0.2 0.5 1 0.8" group="5"/>'
        base = [g.xml() for g in self.base_geoms()] + [site(n, p) for n, p in self.base_sites().items()]
        moving = [g.xml() for g in self.moving_geoms()] + [site(n, p) for n, p in self.moving_sites().items()]
        lift = max(abs(g.size[-1]) for g in self.base_geoms())  # rest the part on z = 0 when free
        return f"""<!-- {self.name}: generated by src/build_models.py; parameters and their sources are in tools.json. -->
<mujoco model="{self.id}">
  <compiler angle="radian" autolimits="true"/>
  <option timestep="{self.timestep:g}"/>
  <default>
    <geom condim="4" friction="{self.friction:g} 0.005 0.0001"/>
  </default>
  <worldbody>
    <body name="{self.id}_base" pos="0 0 {lift:.4g}">
      <freejoint name="{self.id}_root"/>
      {(chr(10) + '      ').join(base)}
      <body name="{self.id}_moving">
        {joint.xml(self.joint)}
        {(chr(10) + '        ').join(moving)}
      </body>
    </body>
  </worldbody>
  <contact>
    <!-- The two parts meet only through the joint (and its limits), also when the base is welded down. -->
    <exclude body1="{self.id}_base" body2="{self.id}_moving"/>
  </contact>
</mujoco>
"""

    def xml(self):
        joint = self.joint_spec()
        joint.solreflimit = (2.5 * self.timestep, 1.0)
        if self.damping_ratio is not None and joint.stiffness > 0:
            m = mujoco.MjModel.from_xml_string(self._xml(joint))
            d = mujoco.MjData(m)
            mujoco.mj_forward(m, d)
            M = np.zeros((m.nv, m.nv))
            mujoco.mj_fullM(m, d, M)
            dof = m.joint(self.joint).dofadr[0]
            self.inertia = float(M[dof, dof])  # moving part's inertia about the joint axis
            joint.damping = 2 * self.damping_ratio * np.sqrt(joint.stiffness * self.inertia)
        self.joint_used = joint
        return self._xml(joint)
