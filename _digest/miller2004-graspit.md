---
title: GraspIt! A Versatile Simulator for Robotic Grasping
arxiv: ''
date: '2004-12-01'
added: '2026-11-05'
authors: Andrew T. Miller, Peter K. Allen
venue: IEEE Robotics & Automation Magazine
doi: 10.1109/MRA.2004.1371616
pdf: https://www.cs.columbia.edu/~allen/PAPERS/graspit.final.pdf
website: http://www.cs.columbia.edu/~amiller/graspit
code: ''
topics:
- foundations
- grasping
seminal: true
tldr: GraspIt! is a public simulator that imports hand, arm and object models, finds the contacts as a hand closes on an object, and scores the grasp on the fly with wrench-space quality measures. It ships with five hand models, a Puma arm and a mobile base, and a rigid-body dynamics engine for simulating how grasps form.
abstract: 'Research in robotic grasping has flourished in the last 25 years. A recent survey by Bicchi [1] covered over 140 papers, and many more than that have been published. Stemming from our desire to implement some of the work in grasp analysis for particular hand designs, we created an interactive grasping simulator that can import a wide variety of hand and object models and can evaluate the grasps formed by these hands. This system, dubbed "GraspIt!," has since expanded in scope to the point where we feel it could serve as a useful tool for other researchers in the field. To that end, we are making the system publicly available (GraspIt! is available for download for a variety of platforms from http://www.cs.columbia.edu/~amiller/graspit).'
thumb:
  image: miller2004-graspit/thumb.webp
  width: 960
  height: 642
videos: []
youtube: []
figures:
- image: miller2004-graspit/figure1.webp
  width: 994
  height: 679
  caption: 'From Figure 2: the robot library, with a parallel jaw gripper (a), the Barrett hand (b), the DLR hand (c), the Robonaut hand (d), the Rutgers hand (e), the Puma 560 arm (f) and the Nomadics XR4000 mobile robot (g).'
- image: miller2004-graspit/figure2.webp
  width: 1472
  height: 429
  caption: 'From Figure 5: a Barrett hand link collides with a phone (a), a search finds the joint angle that puts the link within 0.1 mm of the surface (b), and friction cones are placed at the ends of the line contact (c).'
- image: miller2004-graspit/figure3.webp
  width: 1307
  height: 1147
  caption: 'From Figure 9: a force-closure Barrett hand grasp of a mug, seen from the top. The insets project the grasp wrench space into force space (upper) and torque space (lower), and the panel below shows the two quality values.'
- image: miller2004-graspit/figure4.webp
  width: 1469
  height: 1787
  caption: 'From Figure 14: in dynamic simulation the Barrett hand closes on a wine glass lying on a table (a); low friction and the taper of the glass squeeze it out of the grasp (b-f, 0.51 to 0.70 s of simulated time).'
---
## What they do
GraspIt! is a public, interactive grasping simulator. A user imports hands, arms, objects and obstacles, closes a hand on an object, and sees the grasp's contacts, quality and weakest direction update as contacts form. A dynamics engine shows how a grasp forms over time. The authors also plan grasps in it for a real service robot with a Barrett hand.

## How it works
- **Robots.** Kinematic chains of revolute or prismatic joints in Denavit-Hartenberg form. Degrees of freedom are kept separate from joints, so coupled joints follow a DOF linearly. Robots attach into trees, e.g. a Barrett hand on a Puma 560 on a mobile base.
- **Contacts.** Collision detection uses bounding-volume trees (based on PQP). After a collision, a binary search brings the bodies within a 0.1 mm contact threshold. Contact regions are reduced to line endpoints or convex-hull vertices, each with a Coulomb friction cone set by the two materials.
- **Grasp quality.** Each cone becomes 8 boundary forces by default, and qhull builds the 6-D grasp wrench space over them; force closure means the origin is inside. Quality is ε1, the radius of the largest origin-centred ball inside the space, and v1, its volume. Force and torque projections and the worst-case disturbance wrench are drawn.
- **Dynamics.** Joint and contact constraints form a linear complementarity problem, solved with Lemke's algorithm at a default 2.5 ms step. PD joint controllers follow trajectories, and a MATLAB interface over TCP accepts user controllers.

## Results
No benchmarks; the paper demonstrates:
- Barrett, DLR (12 DOF), Robonaut (14 DOF) and Rutgers (19 DOF) hand models; adding a robot usually takes under an hour or two.
- Side grasps of a 104 mm mug. The Barrett grasp is weakest against vertical forces because all contacts sit around the mug's side; rubber instead of plastic fingers raises quality dramatically. The parallel jaw gripper reaches only three contacts and gets a lower-quality grasp.
- A Barrett hand squeezing a tapered, low-friction wine glass out of its grasp in dynamic simulation.

## Limitations
Rigid bodies only, with approximate link masses. Quality measures cover force closure only, assume nothing about task wrenches, and ε1 depends on the torque origin. The L-infinity wrench space is feasible only for few contacts. The trajectory generator ignores singularities and joint force limits, there is no path planner, and PD control never exactly reaches its set point.
