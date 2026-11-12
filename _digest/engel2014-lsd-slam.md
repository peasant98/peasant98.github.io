---
title: 'LSD-SLAM: Large-Scale Direct Monocular SLAM'
arxiv: ''
date: '2014-09-01'
added: '2026-11-05'
authors: Jakob Engel, Thomas Schöps, Daniel Cremers
pis: [Daniel Cremers]
venue: European Conference on Computer Vision (ECCV)
doi: 10.1007/978-3-319-10605-2_54
pdf: https://jakobengel.github.io/pdf/engel14eccv.pdf
website: ''
code: ''
topics:
- robot-vision
- 3d-perception
seminal: true
tldr: A monocular SLAM system that uses image intensities directly instead of keypoints. It tracks the camera against keyframes with semi-dense depth maps and links the keyframes in a pose graph of sim(3) edges, so scale drift can be detected and corrected. It runs in real time on a CPU, maps hand-held outdoor trajectories of about 500 m, and reaches 1.47 cm trajectory RMSE on TUM RGB-D fr2/xyz.
abstract: 'We propose a direct (feature-less) monocular SLAM algorithm which, in contrast to current state-of-the-art regarding direct methods, allows to build large-scale, consistent maps of the environment. Along with highly accurate pose estimation based on direct image alignment, the 3D environment is reconstructed in real-time as pose-graph of keyframes with associated semi-dense depth maps. These are obtained by filtering over a large number of pixelwise small-baseline stereo comparisons. The explicitly scale-drift aware formulation allows the approach to operate on challenging sequences including large variations in scene scale. Major enablers are two key novelties: (1) a novel direct tracking method which operates on sim(3), thereby explicitly detecting scale-drift, and (2) an elegant probabilistic solution to include the effect of noisy depth values into tracking. The resulting direct monocular SLAM system runs in real-time on a CPU.'
thumb:
  image: engel2014-lsd-slam/thumb.webp
  width: 960
  height: 550
videos: []
youtube: []
figures:
- image: engel2014-lsd-slam/figure1.webp
  width: 1056
  height: 605
  caption: 'From Figure 1: Accumulated point clouds of all keyframes along a hand-held trajectory, built in real time (top), and selected keyframes with color-coded semi-dense inverse depth maps (bottom).'
- image: engel2014-lsd-slam/figure2.webp
  width: 1122
  height: 454
  caption: 'From Figure 3: The full algorithm. Tracking estimates each new frame''s SE(3) pose against the current keyframe, depth estimation refines or replaces that keyframe, and map optimization adds finished keyframes to the pose graph with Sim(3) edges.'
- image: engel2014-lsd-slam/figure3.webp
  width: 1041
  height: 628
  caption: 'From Figure 5: Direct sim(3) alignment of two keyframes. Camera images, inverse depth maps and depth variance (left), and the photometric residual, depth residual and Huber weights before and after minimization (right).'
- image: engel2014-lsd-slam/figure4.webp
  width: 1056
  height: 561
  caption: 'From Figure 7: A long outdoor trajectory after (left) and before (right) loop closure, with close-ups of the point cloud and semi-dense depth maps of selected keyframes.'
---
## What they do
Direct monocular methods align images on raw intensities rather than keypoints, but earlier ones were pure visual odometry with no global map or loop closure. LSD-SLAM builds a consistent large-scale map from a single camera. The map is a pose graph of keyframes, each with a semi-dense inverse depth map and its variance. Because monocular scale is unobservable and drifts, the edges between keyframes are 3D similarity transforms.

## How it works
- **Tracking.** Each new 640x480 frame is aligned to the current keyframe on se(3) by minimizing a photometric error. Each pixel's residual is normalized by a variance propagated from its depth uncertainty, under a Huber norm.
- **Depth estimation.** Frames that are not made keyframes refine the current keyframe's depth through many small-baseline stereo comparisons and filtering. A new keyframe gets its depth by projecting points from the previous one, then is rescaled to a mean inverse depth of one.
- **sim(3) keyframe alignment.** A depth residual is added to the photometric one, which pins down the scale between two keyframes. A reciprocal tracking check rejects bad loop closures. ESM and a pyramid that starts at 20x15 pixels widen the convergence radius.
- **Map optimization.** The pose graph is continuously optimized in the background with g2o.

## Results
- Absolute trajectory RMSE on TUM RGB-D: 4.52 cm on fr2/desk and 1.47 cm on fr2/xyz, against 13.50 and 3.79 for semi-dense mono-VO. PTAM fails on fr2/desk and scores 24.28 on fr2/xyz.
- On two simulated sequences it scores 0.04 cm and 0.35 cm.
- Maps a roughly 500 m, 6-minute hand-held outdoor trajectory with a large loop closure, and a scene whose average inverse depth spans less than 20 cm to more than 10 m.
- ESM and more pyramid levels widen the convergence radius but do not change tracking precision.

## Limitations
Initialization from a random depth map needs enough early camera translation, and its convergence is left for future evaluation. Direct alignment is non-convex, so it needs a good starting guess, which is hardest for large loop closures. In the benchmark the first depth map was used to set the initial scale. Direct RGB-D SLAM, which uses sensor depth, is more accurate on three of the four sequences.
