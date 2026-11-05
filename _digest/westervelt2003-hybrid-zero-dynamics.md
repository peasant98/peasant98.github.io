---
title: Hybrid Zero Dynamics of Planar Biped Walkers
arxiv: ''
date: '2003-01-01'
added: '2026-11-05'
authors: Eric R. Westervelt, Jessy W. Grizzle, Daniel E. Koditschek
venue: IEEE Transactions on Automatic Control
doi: 10.1109/TAC.2002.806653
pdf: https://grizzle.robotics.umich.edu/files/hybrid_zdyn_TAC.pdf
website: ''
code: ''
topics:
- foundations
- legged-locomotion
seminal: true
tldr: A feedback design for underactuated planar bipeds that keeps a two-dimensional zero-dynamics surface invariant through foot impacts, so walking stability reduces to a scalar linear return map. On a 5-link biped model, optimized controller parameters give exponentially stable walking at 1.05 m/s with a peak torque of about 47 Nm.
abstract: 'Planar, underactuated, biped walkers form an important domain of applications for hybrid dynamical systems. This paper presents the design of exponentially stable walking controllers for general planar bipedal systems that have one degree of freedom greater than the number of available actuators. The within-step control action creates an attracting invariant set—a two dimensional zero dynamics submanifold of the full hybrid model—whose restriction dynamics admits a scalar LTI return map. Exponentially stable periodic orbits of the zero dynamics correspond to exponentially stabilizable orbits of the full model. A convenient parameterization of the hybrid zero dynamics is imposed through the choice of a class of output functions. Parameter optimization is used to tune the hybrid zero dynamics in order to achieve closed-loop, exponentially stable walking with low energy consumption, while meeting natural kinematic and dynamic constraints. The general theory developed in the paper is illustrated on a five link walker, consisting of a torso and two legs with knees.'
thumb:
  image: westervelt2003-hybrid-zero-dynamics/thumb.webp
  width: 340
  height: 328
videos: []
youtube: []
figures:
- image: westervelt2003-hybrid-zero-dynamics/figure1.webp
  width: 348
  height: 547
  caption: 'From Figure 2: The 5-link planar biped (a torso and two legs with knees) and its joint-angle conventions.'
- image: westervelt2003-hybrid-zero-dynamics/figure2.webp
  width: 323
  height: 502
  caption: 'From Figure 3: An example of θ(q), the angle between the vertical and the line from the stance leg end to the hips; the leg postures are controlled as functions of this angle.'
- image: westervelt2003-hybrid-zero-dynamics/figure3.webp
  width: 340
  height: 328
  caption: 'From Figure 6: Stick animation of the optimized gait, one step from left to right; the stance leg is dotted.'
- image: westervelt2003-hybrid-zero-dynamics/figure4.webp
  width: 765
  height: 610
  caption: 'From Figure 7: The four joint torques over three steps of the optimized gait.'
---
## What they do
A planar biped with no ankle actuation has one more degree of freedom than actuators, and its model is hybrid: swing dynamics plus an impact map when the swing leg lands. The paper defines the *hybrid zero dynamics*, a 2-D surface on which the controlled outputs stay at zero and which the impact maps into itself. Stable walking of the full robot then reduces to a stable orbit of this 2-D system, tuned by parameter optimization.

## How it works
- **Outputs as constraints on posture.** N−1 joint quantities track desired functions of θ(q), a configuration variable that increases monotonically over a step, instead of functions of time. Computed-torque feedback drives the outputs to zero.
- **Scalar return map.** If the zero-dynamics surface is invariant under impact, its Poincaré map is the scalar LTI map ζ ↦ δ²·ζ − V(θ⁻). A fixed point is exponentially stable if and only if 0 < δ² < 1, and a finite-time output controller carries that stability to the full model.
- **Bézier parameterization.** The desired functions are Bézier polynomials. Impact invariance fixes the first two coefficients of each output from the last ones, so the degree must be at least 3.
- **Optimization.** DIRCOL tunes the free coefficients to minimize integrated squared torque per step length. Constraints cover walking speed, ground reaction forces within the friction cone, swing-foot height, and the existence and stability of the fixed point.

## Results
Results are in simulation only, on a model of RABBIT, a 5-link prototype that was still under construction.
- Degree-6 polynomials leave 20 free parameters. Optimizing for 1.05 m/s took 1240 s on a 1 GHz Pentium III.
- δ² = 0.638, and the fixed point (979.0) lies above its lower bound (408.2), so the gait is exponentially stable.
- Peak torque is about 47 Nm and peak power about 267 W, both at the stance hip. The authors call the torques comparable to those reported elsewhere for walking at 0.75 m/s.

## Limitations
The theory covers planar walkers with exactly one degree of underactuation, rigid instantaneous impacts and symmetric gaits. Because the outputs depend only on configuration, θ must be monotonic over each step, which restricts the gaits that can be achieved. Invertibility of the decoupling matrix has to be checked after optimization. There are no hardware experiments.
