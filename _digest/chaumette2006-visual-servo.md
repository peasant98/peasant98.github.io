---
title: 'Visual Servo Control, Part I: Basic Approaches'
arxiv: ''
date: '2006-12-01'
added: '2026-11-05'
authors: François Chaumette, Seth Hutchinson
pis: [Seth Hutchinson]
venue: IEEE Robotics & Automation Magazine
doi: 10.1109/MRA.2006.250573
pdf: https://inria.hal.science/inria-00350283/document
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: A tutorial that casts visual servoing as driving a visual-feature error to zero with the velocity law v = -lambda L+ e, then compares image-based (IBVS) and position-based (PBVS) control. It reports no benchmark numbers; noise-free simulations of one positioning task show IBVS is only locally stable, while PBVS is globally stable only if the pose estimate is perfect.
abstract: 'This article is the first of a two-part series on the topic of visual servo control, using computer vision data in the servo loop to control the motion of a robot. In the present article, we describe the basic techniques that are by now well established in the field. We first give a general overview of the formulation of the visual servo control problem. We then describe the two archetypal visual servo control schemes: image-based and position-based visual servo control. Finally, we discuss performance and stability issues that pertain to these two schemes, motivating the second article in the series, in which we consider advanced techniques.'
thumb:
  image: chaumette2006-visual-servo/thumb.webp
  width: 960
  height: 372
videos: []
youtube: []
figures:
- image: chaumette2006-visual-servo/figure1.webp
  width: 1469
  height: 570
  caption: 'From Figure 1: The positioning task used in the simulations: (a) desired camera pose relative to a target with four points, (b) initial camera pose, (c) initial and desired images of the target.'
- image: chaumette2006-visual-servo/figure2.webp
  width: 719
  height: 599
  caption: 'From Figure 4: IBVS on the four image points using the mean of the current and desired interaction matrices: (a) image trajectories of the points, (b) camera velocity components per iteration, (c) 3-D trajectory of the camera. Velocities show no large oscillations and both paths are smooth.'
- image: chaumette2006-visual-servo/figure3.webp
  width: 750
  height: 658
  caption: 'From Figure 5: Geometric interpretation of IBVS for a pure rotation about the optical axis, from the initial points (blue) to the desired ones (red). The current interaction matrix gives straight image paths (green) and makes the camera retreat; the desired one gives the blue motion and a forward drift; their mean gives the black motion, a pure rotation.'
- image: chaumette2006-visual-servo/figure4.webp
  width: 750
  height: 639
  caption: 'From Figure 8: PBVS with the camera translation expressed in the desired camera frame plus an angle-axis rotation. With a perfect pose estimate the camera moves in a straight 3-D line (c), but the image trajectories (a) are less satisfactory.'
---
## What they do
Visual servo control puts camera data in the loop that moves a robot. This tutorial, Part I of two, covers the basic schemes for a 6-DOF eye-in-hand camera, a fixed goal and a motionless target. Every scheme regulates an error e = s - s*, and schemes differ in how the feature vector s is chosen: image coordinates in image-based visual servoing (IBVS), a 3-D pose estimated from the image in position-based visual servoing (PBVS).

## How it works
- **Velocity control.** The interaction matrix relates feature motion to camera velocity. Asking for an exponential decrease of e gives v_c = -lambda L+ e, where L+ approximates the pseudoinverse of that matrix.
- **IBVS.** A point's interaction matrix depends on its depth Z, so Z must be estimated. L+ can use the current matrix, the constant matrix at the goal, or the mean of the two. Three points give singular configurations and four indistinguishable goal poses, so more are used. Stereo works by stacking left and right image coordinates.
- **PBVS.** s is a translation plus an angle-axis rotation, computed with known intrinsics and a 3-D object model. Expressing the translation in the desired camera frame decouples translation from rotation.
- **Stability.** Lyapunov analysis on 1/2 ||e||^2 gives the sufficient condition L_e L+ > 0.

## Results
All results are noise-free simulations of one task: bringing a far-off, strongly rotated camera to see four points as a centered square.
- IBVS with the goal matrix converges but behaves poorly for the first 30 or so iterations; the current matrix gives near-straight image paths but large initial velocities; the mean is smooth in the image and in 3-D.
- With more than 6 features IBVS is only locally asymptotically stable, and one simulated run converges to a local minimum far from the goal.
- PBVS is globally asymptotically stable only if the pose is perfect. One variant moves the camera in a straight 3-D line, but points can leave the field of view.

## Limitations
No real-robot experiments. IBVS can hit local minima or singularities on large displacements, and the size of its convergence region is an open issue. PBVS treats the camera as a 3-D sensor: small image errors bias the pose, which degrades both the trajectory and the final accuracy.
