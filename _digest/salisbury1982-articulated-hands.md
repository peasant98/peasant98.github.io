---
title: 'Articulated Hands: Force Control and Kinematic Issues'
arxiv: ''
date: '1982-03-01'
added: '2026-11-05'
authors: J. Kenneth Salisbury, John J. Craig
venue: The International Journal of Robotics Research
doi: 10.1177/027836498200100102
pdf: https://fab.cba.mit.edu/classes/865.15/classes/measurement/articulated-hands.pdf
website: ''
code: ''
topics:
- foundations
- dexterous-manipulation
seminal: true
tldr: Kinematic and control design of the three-finger, 9-DOF Stanford-JPL hand. A mobility analysis picks the finger layout (39 of 600 candidate designs pass), isotropic points mark where fingertip forces are most accurate, and a Cartesian hand controller sets object stiffness and internal grasp forces without inverse kinematics.
abstract: Kinematic and control issues are discussed in the context of an articulated, multifinger mechanical hand. Hand designs with particular mobility properties are illustrated, and a definition of accuracy points within manipulator workspace is given. Optimization of the physical dimensions of the Stanford-JPL hand is described. Several architectures for position and force control of this multiloop mechanism are described, including a way of dealing with the internal forces inherent in such systems. Preliminary results are shown for the joint torque subsystem used in the hand controller.
thumb:
  image: salisbury1982-articulated-hands/thumb.webp
  width: 960
  height: 1092
videos: []
youtube: []
figures:
- image: salisbury1982-articulated-hands/figure1.webp
  width: 1049
  height: 1193
  caption: 'From Figure 8: Top and side views of the Stanford-JPL hand, with the thumb placement found by OPHAND.'
- image: salisbury1982-articulated-hands/figure2.webp
  width: 1574
  height: 774
  caption: 'From Figure 3: The eight ways a three-link finger can touch an object, combined across fingers to enumerate candidate hand designs.'
- image: salisbury1982-articulated-hands/figure3.webp
  width: 779
  height: 678
  caption: 'From Figure 5: Condition number of the force transform across the workspace of two-link fingers with parallel revolute joints. Only the a = 0.707 design reaches the isotropic value of 1.'
- image: salisbury1982-articulated-hands/figure4.webp
  width: 715
  height: 464
  caption: 'From Figure 13: Cartesian hand controller. Fingertip position and velocity errors pass through grasp-matrix stiffness and damping blocks, are added to the desired force and are sent to the three finger controllers.'
---
## What they do
Salisbury and Craig work through the kinematic and control design of the Stanford-JPL hand: three fingers with three joints each. Motors sit on the forearm and drive each finger through four Teflon-coated cables in flexible conduit. A cantilever beam and idler pulley sense each cable's tension where it enters the finger, so the tension loop encloses motor, gear and conduit friction.

## How it works
- **Mobility analysis.** A modified Grübler formula gives the connectivity between palm and object. A design must reach C = 6 with joints free and C' ≤ 0 with joints locked (object fully constrained). They enumerate 600 three-finger, three-link designs.
- **Isotropic points.** The condition number of the transposed Jacobian bounds how torque errors become fingertip-force errors. Where it equals 1, force accuracy is best and joint noise spreads equally in all directions. Fingers are placed so their circular loci of such points touch a nominal 1-inch sphere.
- **OPHAND.** Gradient-free conjugate-direction search (Powell 1964) over subsets of a 36-parameter hand model, scoring the volume reachable by a fingertip-grasped object.
- **Control.** Each tendon has feedforward plus a constant-gain regulator with an integral term; a bearing force is chosen to keep all tensions positive. A 9×9 grasp matrix, inverted once per grasp, maps object stiffness and three internal grasp forces to fingertip commands, with no inverse kinematics or inverse Jacobian.

## Results
- 39 of 600 designs pass. The 33 with frictionless five-DOF contacts are rejected because they cannot apply moments to cylinders or spheres. The chosen 4-4-4 design (point contact with friction) is the only one where extra joints tighten the grasp (C' = −3).
- A two-link parallel-axis finger with a = 0.707 has a true isotropic point.
- OPHAND's thumb placement more than doubled the performance index of the original heuristic design.
- A prototype tendon-driven joint is shown following torque steps against a stiff aluminum-on-steel environment; no error numbers are given.

## Limitations
Only that one joint was tested; the hand controller was not yet implemented. OPHAND scores only fingertip grasps, the design enumeration assumes one contact type for all contacts, and the grasp matrix assumes fixed grasp points.
