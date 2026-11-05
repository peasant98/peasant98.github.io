---
title: Numerical Filtering for the Operation of Robotic Manipulators through Kinematically Singular Configurations
arxiv: ''
date: '1988-12-01'
added: '2026-11-05'
authors: Anthony A. Maciejewski, Charles A. Klein
venue: Journal of Robotic Systems
doi: 10.1002/rob.4620050603
pdf: https://mountainscholar.org/bitstream/10217/67337/1/ECEaam00004.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: Damped least-squares inverse kinematics with a cheap running estimate of the smallest singular value, plus extra damping applied only along the near-singular direction, lets a simulated arm pass through singularities with bounded joint velocity. At a planar arm's internal singularity, peak tracking error falls from 22% to under 4% of the commanded velocity compared with uniformly damped least squares.
abstract: The loss of independent degrees of freedom at singular configurations is an inherent characteristic of robotic manipulators. Due to the unavoidable singularity of mechanical wrists, singular configurations cannot be avoided by simply restricting the bounds of the workspace. Techniques for operating at singular configurations without inducing unacceptably high joint velocities or end effector tracking errors are presented. Extensions to the damped least-squares formulation which incorporate estimates of the proximity to singularities and selective filtering of singular components are illustrated. The generality of the technique presented is illustrated in a computer simulation of a commercially available manipulator operating through singular configurations.
thumb:
  image: maciejewski1988-singularity-filtering/thumb.webp
  width: 960
  height: 649
videos: []
youtube: []
figures:
- image: maciejewski1988-singularity-filtering/figure1.webp
  width: 1039
  height: 702
  caption: 'From Figure 1: Joint velocity norm of one solution component versus its singular value σ. The pseudoinverse (1/σ) blows up as σ goes to zero; damped least squares (σ/(σ² + λ²)) peaks at 1/(2λ) when σ = λ and falls back to zero.'
- image: maciejewski1988-singularity-filtering/figure2.webp
  width: 817
  height: 639
  caption: 'From Figure 2: The two-link planar arm (links of 110 and 100 cm) and its commanded 200 cm square path ABCD. The dotted arc is the maximum reach.'
- image: maciejewski1988-singularity-filtering/figure3.webp
  width: 1056
  height: 1376
  caption: 'From Figure 3: Planar arm results. Top: end-effector paths with a constant damping factor and with numerical filtering. Bottom: normalized end-effector velocity error and joint velocity norm along A-B-C-D-A for constant λ, variable λ and numerical filtering.'
- image: maciejewski1988-singularity-filtering/figure4.webp
  width: 1039
  height: 1352
  caption: 'From Figure 6: PUMA simulation, trajectory A through a wrist singularity. Arm configurations with constant damping and with numerical filtering, then the end-effector velocity error and joint velocity norm.'
---
## What they do
Near a kinematic singularity, the pseudoinverse solution of resolved-rate control jumps discontinuously and demands very high joint velocities. Damped least squares (DLS) bounds the solution at the cost of tracking error, but a constant damping factor adds error everywhere and damps all directions equally, though only one direction of motion is lost. The paper sets the damping from an estimate of the minimum singular value and adds damping aimed only at the singular direction, which it calls numerical filtering.

## How it works
- **Choosing λ.** DLS scales each component by σ/(σ² + λ²) instead of 1/σ. Bounds on joint velocity, tracking error or conditioning can each be met with a λ computed from the minimum singular value; manipulability is rejected because it can stay constant while the minimum singular value varies widely.
- **Cheap estimate.** JJᵀ + λ²I is already Cholesky-factored for the solve. One extra right-hand side, carried over from the previous cycle, performs a step of inverse iteration that tracks the minimum singular value and its singular vector.
- **Numerical filtering.** A term α²uuᵀ along the estimated singular direction u adds damping there only. The overall λ comes from an "effective singular value" of the current command, so λ is zero when the command has no singular component. The added cost is a few linear-time vector operations.

## Results
All results are simulations.
- Planar two-link arm on a square path that leaves the workspace and crosses the internal singularity (λ ≤ 25, joint velocity ≤ 0.05 rad per interval). Constant λ leaves error along the whole path; variable λ cuts it to near zero away from singularities. At the internal singularity, filtering cuts peak error from 22% to under 4% of the commanded velocity, and integral error from 9.94 cm to 0.25, versus variable λ.
- PUMA through wrist, shoulder and triple singularities: constant λ has a nominal 15% velocity error on trajectory A; with filtering, error outside the singular region is near zero.
- When the two smallest singular values cross, the estimate errs only mid-crossing, averaging the two, then tracks the new minimum.

## Limitations
Simulation only. Filtering targets one estimated singular direction; at the triple singularity the region with tracking error widens.
