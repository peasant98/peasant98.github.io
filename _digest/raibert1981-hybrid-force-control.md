---
title: Hybrid Position/Force Control of Manipulators
arxiv: ''
date: '1981-06-01'
added: '2026-11-05'
authors: Marc H. Raibert, John J. Craig
venue: Journal of Dynamic Systems, Measurement, and Control
doi: 10.1115/1.3139652
pdf: https://fab.cba.mit.edu/classes/865.15/classes/measurement/hybrid-position-force.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: A controller architecture that splits a task frame's directions into force-controlled and position-controlled ones with a binary selection matrix, while every joint contributes to both. On two axes of a Scheinman arm it tracks 1-10 Nt force steps with about 0.15 s rise time and under 1 Nt steady-state error.
abstract: 'A new conceptually simple approach to controlling compliant motions of a robot manipulator is presented. The "hybrid" technique described combines force and torque information with positional data to satisfy simultaneous position and force trajectory constraints specified in a convenient task related coordinate system. Analysis, simulation, and experiments are used to evaluate the controller''s ability to execute trajectories using feedback from a force sensing wrist and from position sensors found in the manipulator joints. The results show that the method achieves stable, accurate control of force and position trajectories for a variety of test conditions.'
thumb:
  image: raibert1981-hybrid-force-control/thumb.webp
  width: 656
  height: 769
videos: []
youtube: []
figures:
- image: raibert1981-hybrid-force-control/figure1.webp
  width: 564
  height: 671
  caption: 'From Figure 1: Two compliant tasks, turning a crank and turning a frictionless screw at constant rates, each with its constraint frame C, the natural constraints set by the task geometry and the artificial constraints that specify the desired motion and forces.'
- image: raibert1981-hybrid-force-control/figure2.webp
  width: 656
  height: 769
  caption: 'From Figure 2: Conceptual organization of the hybrid controller. Position and force errors are computed in the constraint frame, filtered by I - S and S, passed through separate control laws and transformed into joint commands that are summed to drive the arm.'
- image: raibert1981-hybrid-force-control/figure3.webp
  width: 641
  height: 598
  caption: 'From Figure 8: X force is held at 5 Nt and Y position is held fixed (top two curves) while the X-Y table recedes in X at 0.65 cm/s (bottom curve, the position disturbance).'
- image: raibert1981-hybrid-force-control/figure4.webp
  width: 435
  height: 280
  caption: 'From Figure 11: The hybrid controller, extended to three planar degrees of freedom, used for a peg-in-hole insertion.'
---
## What they do
Joint sensors on an imperfectly rigid, geared arm are not precise enough for assembly, but contact forces reveal small relative position errors. Building on Mason's framework of natural and artificial constraints, the paper proposes a hybrid controller: in a task-related Cartesian frame, some directions are servoed in force and the rest in position, using a wrist force sensor and the joint position sensors. It is a control architecture, not a particular control law.

## How it works
- **Constraints.** Task geometry sets natural constraints (no motion along a contact normal, no force along a frictionless tangent); desired trajectories are artificial constraints on the complementary directions.
- **Selection matrix.** A binary vector S marks each frame direction as force-controlled (1) or position-controlled (0); force errors are filtered by S, position errors by I - S.
- **Joint commands.** Position errors map to joints through the inverse Jacobian, force errors through the Jacobian transpose, and the torques are summed, so every joint serves every constraint. Paul and Shimano's earlier free-joint method assigned single joints to force constraints and corrected the resulting position errors on later cycles.
- **Implementation.** PID position law; PI force law with a saturation limiter and a quasi-static force feed-forward. Gains were set empirically, with no dynamics compensation.

## Results
Two axes of a Scheinman arm with a force-sensing wrist pushed against a numerically controlled X-Y table, servoed at 60 Hz.
- Force steps of 1, 5 and 10 Nt rose in about 0.15 s with little or no overshoot and under 1.0 Nt steady-state error; a simulated 5 Nt step agreed well.
- Holding 5 Nt while the table receded at 0.65 cm/s, contact was never lost and force error stayed under 1.75 Nt except at the ramp ends.
- A 10 Nt force step during a sinusoidal position trajectory caused no noticeable position disturbance.
- Extended to 3 planar DOF, it inserted a 15.9 mm peg with 0.025 mm clearance and no chamfer.

## Limitations
The constraints must be specified by hand; choosing them automatically is left to future research. The method needs more computation than free-joint control, which already ran 6 DOF, while these experiments cover 2-3 DOF. A 286 Hz wrist-hand-surface oscillation of about 0.5 Nt lies beyond the controller's bandwidth.
