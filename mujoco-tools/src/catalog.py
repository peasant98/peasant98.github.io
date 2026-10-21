"""The hand tools on the page. Each class holds its dimensions, masses, joint and contact parameters
next to the source (or estimate reasoning) that the page shows.

Frame convention: the joint axis is z, tools lie in the xy-plane with their working tips toward +x.
"""
import re
from pathlib import Path

import mujoco
import numpy as np

from toolkit import Geom, Joint, Source, ToolModel, TwoPartTool, bar, distribute_mass, ring

STEEL = "0.74 0.76 0.79 1"
DARK_STEEL = "0.42 0.44 0.47 1"
BLACK_RUBBER = "0.13 0.14 0.15 1"
ORANGE_PLASTIC = "0.95 0.45 0.1 1"
RED_GRIP = "0.78 0.12 0.1 1"
WOOD = "0.86 0.71 0.5 1"
PP_CLEAR = "0.86 0.91 0.96 0.35"
PP_WHITE = "0.93 0.94 0.95 1"

# Skin-contact friction (shared by several tools).
SKIN_METAL = Source("Fingertip friction on metal and rubber vs. normal force (PMC6756432)",
                    "https://pmc.ncbi.nlm.nih.gov/articles/PMC6756432")
SKIN_PP = Source("Fingertip friction on polypropylene (PMC3565724)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC3565724")
SKIN_REVIEW = Source("Tribology of skin: review of experimental results (TU/e)",
                     "https://research.tue.nl/en/publications/tribology-of-skin-review-and-analysis-of-experimental-results-for/")


def deg(rad):
    return f"{np.degrees(rad):.0f}° ({rad:.2f} rad)"


class KitchenTongs(TwoPartTool):
    L = 0.305            # overall length [1]
    MASS = 0.145         # 137-150 g [2][3]
    MOVING_MASS = 0.065  # one stamped arm
    ARM_W, ARM_T = 0.020, 0.004   # channel width (z) and profile depth (y)
    HEAD_L, HEAD_W, HEAD_T = 0.05, 0.038, 0.006
    PAD_X = (0.02, 0.13)          # Santoprene handle sleeve
    REAR_Y = 0.012                # arm centreline offset at the hinge
    OPEN = 0.33                   # rad, ~100 mm tip opening
    GRIP_X = 0.10                 # where a hand squeezes
    F_CLOSE = 2.45                # N to close, ATK/MIT tensile test [4]
    PRELOAD = 0.5                 # spring torque when fully open, as a fraction of the closing torque
    friction = 0.5                # stainless on fingertip at 10-20 N [5]
    damping_ratio = 0.1

    def __init__(self):
        tau_close = self.F_CLOSE * self.GRIP_X
        self.k = tau_close * (1 - self.PRELOAD) / self.OPEN
        self.springref = self.OPEN + self.PRELOAD * tau_close / self.k
        super().__init__(
            id="kitchen_tongs", name="Kitchen tongs, 12 in (OXO Good Grips type)",
            blurb="Spring-loaded stainless tongs. The spring holds them open against a stop; squeezing the "
                  "handles at the grip closes the scalloped heads. 2.45 N closes them, as measured at MIT for "
                  "America's Test Kitchen.",
            max_force=6.0, grip_lever=self.GRIP_X, initial=self.OPEN,
            sources=[Source("OXO 12\" tongs product page", "https://www.oxo.com/products/cooking-baking/tongs/12-tongs"),
                     Source("OXO 12\" tongs listing (5.3 oz)", "https://www.desertcart.co/products/1042360"),
                     Source("Retail listing, 137 g", "https://advantage-catering-equipment.co.uk/products/oxo-good-grips-locking-tongs-with-silicone-12"),
                     Source("America's Test Kitchen tongs review: tension 0.55 lb (MIT uniaxial tester)", "https://www.americastestkitchen.com/equipment_reviews/1859-kitchen-tongs"),
                     SKIN_METAL,
                     Source("Tong spring pre-compression (patent US20230037008)", "https://patents.justia.com/patent/20230037008")],
        )
        self.params = [
            ("Length", "305 mm", "[1]"),
            ("Mass", "145 g (one arm 65 g)", "[2][3]; split: estimate, symmetric stamped arms"),
            ("Arm section", "20 mm wide × 4 mm channel; heads 38 mm wide", "estimate: from photos and the 1.5 in listing width"),
            ("Opening", f"0 to {deg(self.OPEN)}: ~100 mm at the tips", "estimate: typical 12 in tongs"),
            ("Force to close", f"{self.F_CLOSE} N at the grip (100 mm from the hinge)", "[4]; lever: estimate"),
            ("Spring", f"k = {self.k:.3f} N·m/rad, rest angle {deg(self.springref)}", f"derived from [4] with {self.PRELOAD:.0%} preload at full open (estimate; springs are pre-compressed [6])"),
            ("Damping", f"ζ = {self.damping_ratio}", "estimate: lightly damped steel spring"),
            ("Friction", "steel 0.5, Santoprene sleeves 0.7", "[5] at 10–20 N normal force"),
        ]

    def _arm(self, s):
        """Arm centreline from the hinge to the tip for side s = ±1 (closed pose: heads touch)."""
        p0 = np.array([0.012, s * self.REAR_Y])
        p1 = np.array([self.L - self.HEAD_L, s * self.HEAD_T / 2])
        return p0, p1

    def _side(self, s, mass):
        p0, p1 = self._arm(s)
        d = (p1 - p0) / np.linalg.norm(p1 - p0)
        at = lambda x: p0 + d * (x - p0[0]) / d[0]
        g = [bar(p0, p1, self.ARM_W / 2, self.ARM_T / 2, rgba=STEEL),
             bar(at(self.PAD_X[0]), at(self.PAD_X[1]), self.ARM_W / 2 + 0.001, self.ARM_T / 2 + 0.0025,
                 rgba=BLACK_RUBBER, friction=0.7),
             Geom("box", (self.HEAD_L / 2, self.HEAD_T / 2, self.HEAD_W / 2),
                  pos=(self.L - self.HEAD_L / 2, s * self.HEAD_T / 2, 0), rgba=STEEL)]
        return distribute_mass(g, mass)

    def base_geoms(self):
        hinge = Geom("cylinder", (0.012, self.ARM_W / 2 + 0.002), pos=(0, 0, 0), rgba=DARK_STEEL, mass=0.015)
        return [hinge] + self._side(-1, self.MASS - self.MOVING_MASS - 0.015)

    def moving_geoms(self):
        return self._side(+1, self.MOVING_MASS)

    def _outer(self, s, x):
        p0, p1 = self._arm(s)
        d = (p1 - p0) / np.linalg.norm(p1 - p0)
        p = p0 + d * (x - p0[0]) / d[0]
        n = np.array([-d[1], d[0]]) * s  # outward normal
        return (*(p + n * (self.ARM_T / 2 + 0.005)), 0.0)

    def base_sites(self):
        return {"grip_b": self._outer(-1, self.GRIP_X), "tip_b": (self.L - 0.02, 0.0, 0.0)}

    def moving_sites(self):
        return {"grip_a": self._outer(+1, self.GRIP_X), "tip_a": (self.L - 0.02, 0.0, 0.0)}

    def joint_spec(self):
        return Joint("hinge", (0, 0, 0), (0, 0, 1), (0.0, self.OPEN), stiffness=self.k,
                     springref=self.springref, frictionloss=0.002)


class Scissors(TwoPartTool):
    BLADE = 0.100        # pivot to tip; cut length 90-100 mm [1][2]
    MASS = 0.083         # [1][2]
    LOOP_X = -0.085
    OPEN = 0.70          # rad (40°)
    FRICTION_TORQUE = 0.10  # N·m, measured on scissors near closing [3]
    friction = 0.5

    def __init__(self):
        super().__init__(
            id="scissors", name="Office scissors, 8 in (Fiskars Classic type)",
            blurb="Two blade-and-handle halves on a pivot screw, no spring. The screw's rubbing friction holds any "
                  "opening; squeezing the finger loops closes the blades.",
            max_force=8.0, grip_lever=abs(self.LOOP_X), initial=0.55,
            sources=[Source("Fiskars Classic 21 cm: 211 × 80 mm, 83 g", "https://royaldesign.co.uk/classic-universal-scissors-21-cm"),
                     Source("Fiskars 8 in general purpose: 100 mm blade, 83 g", "https://www.diy.com/departments/fiskars-1000814-left-handed-general-purpose-scissors-210mm-8in-fsk1000814/6411501985019_BQ.prd"),
                     Source("Mahvash et al. 2008, scissors cutting forces (Fig. 5)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC2709828/"),
                     SKIN_METAL, SKIN_PP],
        )
        self.params = [
            ("Length × width", "211 × 80 mm", "[1]"),
            ("Mass", "83 g (≈ 41 g per half)", "[1][2]; split: estimate"),
            ("Blade", "100 mm pivot to tip, 18 → 6 mm wide, 2 mm thick", "[2]; widths: estimate"),
            ("Opening", f"0 to {deg(self.OPEN)}", "estimate: 35–45° typical"),
            ("Pivot friction", f"{self.FRICTION_TORQUE} N·m (Coulomb)", "[3]: 0.10–0.12 N·m measured near closing; real friction varies with angle"),
            ("Friction", "steel blades 0.5, plastic loops 0.4", "[4][5]"),
        ]

    def _half(self, side, z, mass):
        """Blade along +x stacked at height z; handle loop on the given y side."""
        t = 0.001
        cy = side * 0.022
        g = [Geom("box", (0.025, 0.009, t), pos=(0.025, 0, z), rgba=STEEL),
             Geom("box", (0.025, 0.0055, t), pos=(0.075, 0, z), rgba=STEEL),
             bar((0, 0), (self.LOOP_X + 0.015, cy), 0.004, 0.0045, rgba=ORANGE_PLASTIC, friction=0.4)]
        g[-1].pos = (*g[-1].pos[:2], z)
        r = 0.014 if side > 0 else 0.017
        loop = ring((self.LOOP_X - (r - 0.014), cy), r, 0.0045, rgba=ORANGE_PLASTIC, friction=0.4)
        for c in loop:
            f = list(c.fromto)
            f[2] = f[5] = z
            c.fromto = tuple(f)
        return distribute_mass(g + loop, mass)

    def base_geoms(self):
        screw = Geom("cylinder", (0.004, 0.003), pos=(0, 0, 0), rgba=DARK_STEEL, mass=0.002)
        return [screw] + self._half(+1, -0.0011, self.MASS / 2 - 0.002)

    def moving_geoms(self):
        return self._half(-1, +0.0011, self.MASS / 2)

    def base_sites(self):
        return {"grip_b": (self.LOOP_X, 0.022, -0.0011), "tip_b": (self.BLADE - 0.002, 0, 0)}

    def moving_sites(self):
        return {"grip_a": (self.LOOP_X - 0.003, -0.022, 0.0011), "tip_a": (self.BLADE - 0.002, 0, 0)}

    def joint_spec(self):
        return Joint("hinge", (0, 0, 0), (0, 0, 1), (0.0, self.OPEN), frictionloss=self.FRICTION_TORQUE,
                     damping=0.0005)


class NeedleNosePliers(TwoPartTool):
    NOSE = 0.055         # pivot to tip (jaw 47.6 mm + joint) [1]
    HANDLE = 0.113       # behind the pivot; 168 mm overall [1][2]
    MASS = 0.122         # 4.3 oz [2]
    JAW_W, JAW_T, TIP_W = 0.0175, 0.0095, 0.0024  # [1]
    OPEN = 0.45
    FRICTION_TORQUE = 0.05
    friction = 0.5

    def __init__(self):
        super().__init__(
            id="needle_nose_pliers", name="Needle-nose pliers, 6 in (Klein D203-6 type)",
            blurb="Long-nose pliers with plastic-dipped handles and no return spring. The riveted joint has "
                  "enough friction to hold a handle against its own weight.",
            max_force=20.0, grip_lever=0.075, initial=0.25,
            sources=[Source("Klein D203-6 jaw dimensions (Lumen)", "https://www.lumen.ca/en/products/25-tools-instruments/08-hand-tools/55-pliers/11-long-nose-pliers/p-S0xFRDIwMzY=-kled2036-klein-tools-d203-6-long-nose-plier-with-side-cutter-straight-1-78-in-l-x-0688-in-w-x-38-in-t-jaw"),
                     Source("Klein D203-6: 6-5/8 in, 4.3 oz", "https://altex.com/products/klein-6-standard-long-nose-pliers-side-cutting"),
                     Source("Klein D203 materials", "https://www.toolnut.com/klein-d203-6h2-6-standard-long-nose-pliers-side-cutting-switchboard-work.html"),
                     SKIN_METAL],
        )
        self.params = [
            ("Length", "168 mm (pivot 55 mm from the tip)", "[1][2]; pivot position: estimate"),
            ("Jaw", "47.6 mm long, 17.5 mm wide, 9.5 mm thick, 2.4 mm tip", "[1]"),
            ("Mass", "122 g (≈ 61 g per half)", "[2]; split: estimate"),
            ("Opening", f"0 to {deg(self.OPEN)}: ~25 mm at the tips", "estimate"),
            ("Spring", "none", "[2]"),
            ("Pivot friction", f"{self.FRICTION_TORQUE} N·m (Coulomb)", "estimate: holds a handle (~0.035 N·m gravity torque)"),
            ("Friction", "steel jaws 0.5, dipped handles 0.7", "[4] at 10–20 N"),
        ]

    def _half(self, side, mass):
        """Jaw on the `side` of the x-axis, handle crossing to the other side."""
        # Two straight segments per jaw, inner faces on y = 0 so the jaws meet along their length.
        t0, t1 = self.JAW_W / 4, (self.JAW_W / 4 + self.TIP_W / 2) / 2
        jaw = [bar((0.006, side * t0), (0.03, side * t0), self.JAW_T / 2, t0, rgba=DARK_STEEL),
               bar((0.03, side * t1), (self.NOSE, side * t1), 0.7 * self.JAW_T / 2, t1, rgba=DARK_STEEL)]
        h0, h1 = np.array([-0.008, -side * 0.004]), np.array([-self.HANDLE, -side * 0.024])
        handle = [bar(h0, h0 + 0.3 * (h1 - h0), 0.0045, 0.004, rgba=DARK_STEEL),
                  bar(h0 + 0.3 * (h1 - h0), h1, 0.0045, 0.0065, rgba=RED_GRIP, friction=0.7)]
        return distribute_mass(jaw + handle, mass)

    def base_geoms(self):
        boss = Geom("cylinder", (0.010, self.JAW_T / 2), pos=(0, 0, 0), rgba=DARK_STEEL, mass=0.012)
        return [boss] + self._half(+1, self.MASS / 2 - 0.012)

    def moving_geoms(self):
        return self._half(-1, self.MASS / 2)

    def _grip(self, side):
        h0, h1 = np.array([-0.008, -side * 0.004]), np.array([-self.HANDLE, -side * 0.024])
        p = h0 + (0.075 - 0.008) / (self.HANDLE - 0.008) * (h1 - h0)
        return (p[0], p[1] - side * 0.0065, 0.0)

    def base_sites(self):
        return {"grip_b": self._grip(+1), "tip_b": (self.NOSE - 0.002, 0.0, 0.0)}

    def moving_sites(self):
        return {"grip_a": self._grip(-1), "tip_a": (self.NOSE - 0.002, 0.0, 0.0)}

    def joint_spec(self):
        # Opening turns the moving jaw (on -y) clockwise, hence the -z axis.
        return Joint("hinge", (0, 0, 0), (0, 0, -1), (0.0, self.OPEN), frictionloss=self.FRICTION_TORQUE,
                     damping=0.0005)


class Tweezers(TwoPartTool):
    L = 0.120            # [1]
    MASS = 0.020         # [1]
    JOINED = 0.020       # rear joined length
    T = 0.0007           # arm thickness
    REST = 0.12          # rad, ~12 mm tip opening at rest
    GRIP = 0.060         # grip point from the flexure
    F_CLOSE = 1.8        # N at the grip to bring the tips together
    friction = 0.5
    damping_ratio = 0.1
    timestep = 0.0005

    def __init__(self):
        self.k = self.F_CLOSE * self.GRIP / self.REST
        super().__init__(
            id="tweezers", name="Precision tweezers, 120 mm (Knipex 92 01 06 type)",
            blurb="Two stainless leaves joined at the rear. The leaves are a flexure, modelled as a hinge with a "
                  "torsional spring that rests open; squeezing at the grip brings the tips together.",
            max_force=4.0, grip_lever=self.GRIP, initial=self.REST,
            sources=[Source("Knipex 92 01 06: 120 mm, 20 g", "https://www.ebay.de/p/3054921966"), SKIN_METAL],
        )
        self.params = [
            ("Length", "120 mm", "[1]"),
            ("Mass", "20 g", "[1]"),
            ("Leaf section", "8 mm → 3 mm wide, 0.7 mm thick; joined over the rear 20 mm", "estimate"),
            ("Rest opening", f"{deg(self.REST)}: ~12 mm at the tips", "estimate"),
            ("Force to close", f"{self.F_CLOSE} N at 60 mm from the joint", "estimate: cantilever bending, 0.7 mm stainless (E = 193 GPa) gives 1.2–3.9 N for 0.6–0.9 mm"),
            ("Spring", f"k = {self.k:.2f} N·m/rad, rest {deg(self.REST)}, no preload", "derived from the line above"),
            ("Damping", f"ζ = {self.damping_ratio}", "estimate"),
            ("Friction", "stainless 0.5", "[2] at 10–20 N"),
        ]

    def _leaf(self, s, mass):
        p0, p1, p2 = (np.array([self.JOINED, s * self.T / 2]), np.array([0.08, s * self.T / 2]),
                      np.array([self.L, s * self.T / 2]))
        return distribute_mass([bar(p0, p1, 0.004, self.T / 2, rgba=STEEL),
                                bar(p1, p2, 0.0015, self.T / 2, rgba=STEEL)], mass)

    def base_geoms(self):
        rear = Geom("box", (self.JOINED / 2, self.T, 0.004), pos=(self.JOINED / 2, 0, 0), rgba=STEEL, mass=0.004)
        return [rear] + self._leaf(-1, self.MASS / 2 - 0.004)

    def moving_geoms(self):
        return self._leaf(+1, self.MASS / 2)

    def base_sites(self):
        return {"grip_b": (self.JOINED + self.GRIP, -self.T - 0.004, 0), "tip_b": (self.L - 0.001, 0, 0)}

    def moving_sites(self):
        return {"grip_a": (self.JOINED + self.GRIP, self.T + 0.004, 0), "tip_a": (self.L - 0.001, 0, 0)}

    def joint_spec(self):
        return Joint("hinge", (self.JOINED, 0, 0), (0, 0, 1), (0.0, 1.5 * self.REST), stiffness=self.k,
                     springref=self.REST)


class Clothespin(TwoPartTool):
    JAW = 0.032          # fulcrum to jaw tip
    HANDLE = 0.041       # fulcrum to rear end (73 mm overall) [1]
    LEG_T, LEG_W = 0.008, 0.0095   # each leg: 8 mm (opening direction) × 9.5 mm [1]
    MASS_WOOD, MASS_SPRING = 0.0022, 0.0008
    OPEN = 0.30          # rad: rear ends meet
    FORCE_5MM = 10.0     # N clamp at 5 mm jaw spread [3]
    K = 0.46             # N·m/rad, coil-spring estimate
    friction = 0.5
    damping_ratio = 0.2
    timestep = 0.0002    # 2 g leg against a preloaded spring

    def __init__(self):
        dq = 0.005 / self.JAW
        tau = self.FORCE_5MM * self.JAW
        self.tau0 = tau - self.K * dq
        self.springref = -self.tau0 / self.K
        super().__init__(
            id="clothespin", name="Spring clothespin (wooden)",
            blurb="Two wooden legs on a steel coil spring that clamps the jaws shut with a preload. Squeezing the "
                  "rear handles opens the jaws.",
            max_force=20.0, grip_lever=0.035, initial=0.0,
            tips=("tip_a", "tip_b"), tip_label="Jaw gap",
            sources=[Source("Wood clothespin 2-7/8 × 5/8 × 3/8 in (WebstaurantStore)", "https://www.webstaurantstore.com/wood-clothespins-pack/93304701.html"),
                     Source("Wood spring clothespins, 50-pack weight", "https://www.ontimesupplies.com/ckc365801-wood-spring-clothespins-338-length-natural-50-pack.html"),
                     Source("Egloff et al. 2011: clothes-peg clamp, 10 N at 5 mm spread", "https://pmc.ncbi.nlm.nih.gov/articles/PMC3158560/"),
                     Source("Clothespin spring strength varies by brand", "https://nzeldes.com/?p=4124"),
                     SKIN_REVIEW],
        )
        self.params = [
            ("Size", "73 × 15.9 × 9.5 mm (legs 8 × 9.5 mm)", "[1]"),
            ("Mass", "5.2 g (2 × 2.2 g wood + 0.8 g spring)", "[2]; split: estimate"),
            ("Fulcrum", "32 mm from the jaw tips", "estimate"),
            ("Jaw opening", f"0 to {deg(self.OPEN)}, until the rear ends touch: ~{self.JAW * self.OPEN * 1000:.0f} mm", "estimate"),
            ("Clamp force", f"{self.FORCE_5MM:.0f} N at 5 mm jaw spread; {self.tau0 / self.JAW:.1f} N with jaws shut", "[3] (plastic peg); closed-jaw value derived with the spring rate below"),
            ("Spring", f"k = {self.K} N·m/rad, preload {self.tau0:.2f} N·m (rest angle {deg(self.springref)})", "estimate: 1.1 mm wire, 5 mm coil, 2 turns; strength varies a lot by brand [4]"),
            ("Damping", f"ζ = {self.damping_ratio}", "estimate: wood-on-wire rubbing"),
            ("Friction", "wood 0.5", "estimate: raw wood on skin is low among woods [5]"),
        ]

    def _leg(self, s, mass):
        rear = (-self.HANDLE, s * (self.LEG_T / 2 + self.HANDLE * self.OPEN / 2))
        g = [bar((0.0, s * self.LEG_T / 2), (self.JAW, s * self.LEG_T / 2), self.LEG_W / 2, self.LEG_T / 2, rgba=WOOD),
             bar((0.0, s * self.LEG_T / 2), rear, self.LEG_W / 2, self.LEG_T / 2, rgba=WOOD)]
        return distribute_mass(g, mass)

    def base_geoms(self):
        coil = Geom("cylinder", (0.0035, self.LEG_W / 2 + 0.0008), pos=(0, 0, 0), rgba=DARK_STEEL,
                    mass=self.MASS_SPRING)
        return [coil] + self._leg(-1, self.MASS_WOOD)

    def moving_geoms(self):
        return self._leg(+1, self.MASS_WOOD)

    def base_sites(self):
        return {"grip_b": (-0.035, -(self.LEG_T + 0.035 * self.OPEN / 2), 0), "tip_b": (self.JAW - 0.001, 0, 0)}

    def moving_sites(self):
        return {"grip_a": (-0.035, self.LEG_T + 0.035 * self.OPEN / 2, 0), "tip_a": (self.JAW - 0.001, 0, 0)}

    def joint_spec(self):
        return Joint("hinge", (0, 0, 0), (0, 0, 1), (0.0, self.OPEN), stiffness=self.K,
                     springref=self.springref, frictionloss=0.002)


class Syringe(TwoPartTool):
    R_IN, R_OUT, BARREL = 0.014432 / 2, 0.01621 / 2, 0.08548   # [1][2]
    TRAVEL_10ML = 1e-5 / (np.pi * (0.014432 / 2) ** 2)       # m
    MASS_BARREL, MASS_PLUNGER = 0.0059, 0.0031
    GLIDE = 1.88          # N [3]
    friction = 0.4
    timestep = 0.0005     # 3 g plunger

    def __init__(self):
        super().__init__(
            id="syringe_10ml", name="Syringe, 10 mL (BD Plastipak type)",
            blurb="Polypropylene barrel and plunger with a rubber stopper on a slide joint. Push with the thumb "
                  "against the finger flange; the stopper's sliding friction resists. Air or liquid pressure is "
                  "not modelled.",
            joint="slide", joint_label="Plunger drawn back", tips=(), max_force=8.0,
            initial=self.TRAVEL_10ML, volume_per_meter=np.pi * self.R_IN ** 2 * 1e6,
            sources=[Source("BD syringe inner diameters (NE-1000 pump spec sheet)", "https://www.usplastic.com/catalog/files/specsheets/NE-1000%20Rates%20and%20Specifications.pdf"),
                     Source("BD Plastipak 10 mL: 16.21 mm OD, 85.48 mm barrel", "https://www.fishersci.pt/shop/products/plastipak-concentric-luer-lock-three-piece-syringe/10430864"),
                     Source("Plunger forces of 10 mL syringes (PMC6687218)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6687218/"),
                     Source("ISO 7886-1 (as IS 10258), plunger force limits", "https://law.resource.org/pub/in/bis/S09/is.10258.2002.pdf"),
                     SKIN_PP],
        )
        self.params = [
            ("Barrel", "14.43 mm bore, 16.21 mm outside, 85.5 mm long", "[1][2]"),
            ("Stroke", f"{self.TRAVEL_10ML * 1000:.1f} mm to 10 mL; {1.1 * self.TRAVEL_10ML * 1000:.0f} mm max (110 %)", "derived from the bore; 110 % capacity per [4]"),
            ("Mass", "9 g (barrel 5.9 g, plunger 3.1 g)", "estimate: catalogue pack weights"),
            ("Plunger friction", f"{self.GLIDE} N while sliding (Coulomb)", "[3]: 1.88 ± 0.48 N gliding, 3.27 N to break loose (21G needle, 100 mm/min); MuJoCo has one friction level, so break-loose is not modelled"),
            ("Friction", "polypropylene 0.4", "[5]: 0.37 on a dry fingertip"),
        ]

    def base_geoms(self):
        g = [Geom("cylinder", (self.R_OUT,), fromto=(0.0015, 0, 0, self.BARREL, 0, 0), rgba=PP_CLEAR),
             Geom("box", (0.00075, 0.0165, 0.0065), pos=(0.00075, 0, 0), rgba=PP_CLEAR),
             Geom("cylinder", (0.0021,), fromto=(self.BARREL, 0, 0, self.BARREL + 0.01, 0, 0), rgba=PP_CLEAR)]
        return distribute_mass(g, self.MASS_BARREL)

    def moving_geoms(self):
        front = self.BARREL - 0.0025
        stopper_back = front - 0.009
        rod_end = -0.009
        mid, half = (stopper_back + rod_end) / 2, (stopper_back - rod_end) / 2
        g = [Geom("cylinder", (self.R_IN,), fromto=(stopper_back, 0, 0, front, 0, 0), rgba=BLACK_RUBBER),
             Geom("box", (half, 0.0055, 0.0008), pos=(mid, 0, 0), rgba=PP_WHITE),
             Geom("box", (half, 0.0008, 0.0055), pos=(mid, 0, 0), rgba=PP_WHITE),
             Geom("cylinder", (0.0105,), fromto=(rod_end - 0.0018, 0, 0, rod_end, 0, 0), rgba=PP_WHITE)]
        return distribute_mass(g, self.MASS_PLUNGER)

    def base_sites(self):
        return {"grip_b": (0.0015, 0.0, 0.0)}

    def moving_sites(self):
        return {"grip_a": (-0.009 - 0.0018, 0.0, 0.0)}

    def joint_spec(self):
        # Positive travel draws the plunger back (toward -x).
        return Joint("slide", (0, 0, 0), (-1, 0, 0), (0.0, 1.1 * self.TRAVEL_10ML), frictionloss=self.GLIDE,
                     damping=0.05)


# ---------------------------------------------------------------------------------------------
# DexJoCo tongs: the benchmark's model, unchanged except for file paths, root pose and added sites.
# ---------------------------------------------------------------------------------------------
def verts_world(m, d, g):
    mid = m.geom_dataid[g]
    v = m.mesh_vert[m.mesh_vertadr[mid]:m.mesh_vertadr[mid] + m.mesh_vertnum[mid]]
    return v @ d.geom_xmat[g].reshape(3, 3).T + d.geom_xpos[g]


class DexJoCoTongs(ToolModel):
    MESH_SUBDIR = Path("dexjoco_tongs")

    def __init__(self, src_dir: Path):
        super().__init__(
            id="dexjoco_tongs",
            name="DexJoCo “tongs” (benchmark mesh model)",
            blurb="The tongs model from the DexJoCo MuJoCo benchmark (Pinch Tongs task), shown as published. "
                  "Its mesh is a pair of cutting pliers; each part collides as one convex hull "
                  "(tick <i>Collision geometry</i>) and the hinge has no damping or friction, so it rings.",
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
        coll = np.concatenate([verts_world(m, d, g) for g in range(m.ngeom) if m.geom_group[g] == 4])
        self.params = [
            ("Joint", f"hinge, {np.degrees(lo):+.1f}° to {np.degrees(hi):+.1f}°", "[1]"),
            ("Spring", f"k = {m.jnt_stiffness[jid]:g} N·m/rad toward {np.degrees(m.qpos_spring[m.jnt_qposadr[jid]]):.1f}°", "[1]"),
            ("Damping / friction", f"{m.dof_damping[m.jnt_dofadr[jid]]:g} / {m.dof_frictionloss[m.jnt_dofadr[jid]]:g}", "[1]"),
            ("Mass", f"{m.body_subtreemass[m.body('link_1').id] * 1000:.0f} g", "[1]"),
            ("Length", f"{np.ptp(coll[:, :2], axis=0).max() * 100:.1f} cm", "[1]"),
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
            i = s.index(f'<body name="{body}"')
            j = s.index(">", i) + 1
            site_xml = "".join(
                f'\n      <site name="{n}" pos="{v[0]:.5f} {v[1]:.5f} {v[2]:.5f}" size="0.004" rgba="0.2 0.5 1 0.8" group="5"/>'
                for n, v in sites.items())
            s = s[:j] + site_xml + s[j:]
        header = ("<!-- DexJoCo tongs (https://github.com/brave-eai/dexjoco, MIT License, Copyright (c) 2026 Dexjoco\n"
                  "     contributors). Modified for the hand-tools page: mesh paths, root position, grip/tip sites. -->\n")
        return header + s

    def copy_meshes(self, model_dir: Path):
        out = model_dir / self.MESH_SUBDIR
        out.mkdir(parents=True, exist_ok=True)
        for f in self.mesh_files:
            text = (self.src_dir / f).read_text()
            text = "\n".join(l for l in text.splitlines() if not l.startswith(("mtllib", "usemtl")))
            (out / Path(f).name).write_text(text + "\n")


def all_tools(dexjoco_dir: Path) -> list[ToolModel]:
    return [KitchenTongs(), Scissors(), NeedleNosePliers(), Tweezers(), Clothespin(), Syringe(),
            DexJoCoTongs(dexjoco_dir)]
