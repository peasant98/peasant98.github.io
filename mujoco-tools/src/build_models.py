"""Build the MJCF models and tools.json for the MuJoCo hand-tools page, then validate each model.

usage: python build_models.py [--dexjoco DIR] [--debug-dir DIR]
  --dexjoco   folder holding DexJoCo's tongs.xml + tongs/ meshes (github.com/brave-eai/dexjoco, MIT)
  --debug-dir where validation renders are written

The tools and every physical number (with its source) live in catalog.py.
"""
import argparse
import json
from pathlib import Path

import mujoco
import numpy as np

from catalog import DexJoCoTongs, all_tools

SITE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = SITE_DIR / "models"


def validate(tool, debug_dir: Path):
    """Compile the written file, report mass/joint, check the spring against the grip lever, render."""
    m = mujoco.MjModel.from_xml_path(str(MODEL_DIR / f"{tool.id}.xml"))
    d = mujoco.MjData(m)
    j = m.joint(tool.joint).id
    for n in (*tool.grip, *tool.tips):
        m.site(n)  # raises if a site is missing
    qadr, dof = m.jnt_qposadr[j], m.jnt_dofadr[j]
    lo, hi = m.jnt_range[j]
    k, ref = m.jnt_stiffness[j], m.qpos_spring[qadr]
    line = (f"[{tool.id}] mass {m.body_subtreemass[1] * 1000:.1f} g | range [{lo:.3f}, {hi:.3f}] | "
            f"k {k:.3g} ref {ref:.3f} | damping {m.dof_damping[dof]:.3g} | frictionloss {m.dof_frictionloss[dof]:.3g}")
    if k and tool.grip_lever:
        line += f" | grip force at {lo:.2f}: {k * (ref - lo) / tool.grip_lever:.2f} N, at {hi:.2f}: {k * (ref - hi) / tool.grip_lever:.2f} N"
    print(line)
    render_debug(m, d, tool, debug_dir)


def render_debug(m, d, tool, debug_dir):
    from PIL import Image
    j = m.joint(tool.joint).id
    qadr = m.jnt_qposadr[j]
    r = mujoco.Renderer(m, 360, 480)
    opt = mujoco.MjvOption()
    opt.sitegroup[:] = 1
    tiles = []
    for q in m.jnt_range[j]:
        d.qpos[qadr] = q
        mujoco.mj_forward(m, d)
        cam = mujoco.MjvCamera()
        cam.lookat[:] = d.geom_xpos.mean(0)
        cam.distance = 1.6 * np.ptp(d.geom_xpos, axis=0).max() + 0.06
        cam.elevation, cam.azimuth = -60, 90
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
    tools = all_tools(args.dexjoco)
    for t in tools:
        if isinstance(t, DexJoCoTongs):
            t.copy_meshes(MODEL_DIR)
        (MODEL_DIR / f"{t.id}.xml").write_text(t.xml())
        validate(t, args.debug_dir)
    (SITE_DIR / "tools.json").write_text(json.dumps({"tools": [t.manifest() for t in tools]}, indent=1))
    print("wrote", SITE_DIR / "tools.json")


if __name__ == "__main__":
    main()
