---
title: Measure of Manipulability for Robot Manipulators
arxiv: ''
date: '1984-02-01'
added: '2026-11-05'
authors: Tsuneo Yoshikawa
venue: Journal of the Robotics Society of Japan
doi: 10.7210/jrsj.2.63
pdf: https://www.jstage.jst.go.jp/article/jrsj1983/2/1/2_1_63/_pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: Study the manipulability measure w = √det(J Jᵀ), proportional to the volume of the end-effector velocity ellipsoid, and use it to find the best working posture of common arm types and a robot finger. A two-link arm is best with its elbow at 90° for any link lengths, and equal links are best for a fixed total length.
abstract: 'It will be beneficial for design, control, and task planning of robots to have a quantitative measure of manipulating ability of robot arms in positioning and orienting the end effectors. We have proposed one such measure in a previous paper, which we call the measure of manipulatability. In this paper, we investigate some properties of this measure. Also we study various types of robot manipulators and robot fingers from the viewpoint of this measure.'
thumb:
  image: yoshikawa1984-manipulability/thumb.webp
  width: 960
  height: 495
videos: []
youtube: []
figures:
- image: yoshikawa1984-manipulability/figure1.webp
  width: 1360
  height: 902
  caption: 'From Figure 4: Postures that maximize manipulability of a PUMA-type arm (main three joints, hand position only) with forearm length l3 = γ l2 for γ = 0.5, 1 and 2.'
- image: yoshikawa1984-manipulability/figure2.webp
  width: 1169
  height: 1724
  caption: 'From Figure 6: Finger postures that maximize manipulability of the fingertip position in the XZ plane, computed numerically for each fingertip distance la (link lengths 0.4, 0.4 and 0.3).'
- image: yoshikawa1984-manipulability/figure3.webp
  width: 1600
  height: 952
  caption: 'From Figure 7: Maximum manipulability w of the finger for each fingertip distance la, with joint 1 fixed and planar fingertip motion (solid) and with all four joints and 3-D motion (dashed).'
- image: yoshikawa1984-manipulability/figure4.webp
  width: 1062
  height: 625
  caption: 'From Figure 8: Optimal postures of a two-joint finger under (a) the condition number of Jᵀ proposed by Salisbury and Craig and (b) manipulability w, for l2 = 0.5 l1, 0.707 l1 and l1.'
---
## What they do
Choosing an arm's mechanism and link lengths, and where and in what posture it should work, had been done by intuition and experience. Yoshikawa earlier proposed the measure of manipulability, w = √det(J Jᵀ), to quantify how easily an arm can move its end-effector's position and orientation. This paper derives further properties of w and finds the posture maximizing it, the "optimal posture", for common arm types and a robot finger.

## How it works
- **Ellipsoid view.** w is the product of J's singular values and is proportional to the volume of the manipulability ellipsoid: the end-effector velocities reachable with joint velocity norm at most 1. For a non-redundant arm, w = |det J|.
- **New properties.** For a non-redundant arm, joint speeds bounded by |θ̇i| ≤ 1 map to a parallelepiped of volume 2ᵐw. Unequal joint speed limits and task speeds are handled by rescaling J, which for a non-redundant arm only multiplies w by a constant.
- **Kinematics only.** Unlike Asada's generalized inertia ellipsoid, w ignores dynamics.
- **Arm studies.** Closed-form w for two-link, SCARA, PUMA (main three joints, hand position) and Cartesian, cylindrical and polar arms; numerical maximization for a 4-joint finger.

## Results
- Two-link and SCARA arms: w = l1 l2 |sin θ2|, best at θ2 = ±90° for any l1, l2, θ1, and with l1 + l2 fixed, best at l1 = l2. A human arm roughly has l1 = l2 and bends the elbow about 90° when handling objects with both hands.
- PUMA: best with the hand level with the second joint and θ3 slightly below 90°, which moves the hand farther from joint 1's axis.
- Cartesian arms have w = 1 everywhere; cylindrical and polar arms are best fully extended, at the workspace boundary.
- 4-joint finger: w peaks at fingertip distance 0.8 for planar motion and 0.9 with all four joints, postures the author finds close to a human pinching a small object. Salisbury and Craig's condition number gives different optima.

## Limitations
Analysis and numerical computation only, with no robot experiments; the PUMA wrist is ignored. For cylindrical and polar arms the measure alone points to the workspace boundary, so other criteria must set the posture. Using w for arm design and task planning is left to future work.
