---
title: Parallel Tracking and Mapping for Small AR Workspaces
arxiv: ''
date: '2007-11-01'
added: '2026-11-05'
authors: Georg Klein, David Murray
venue: IEEE/ACM International Symposium on Mixed and Augmented Reality (ISMAR)
doi: 10.1109/ISMAR.2007.4538852
pdf: https://www.robots.ox.ac.uk/~gk/publications/KleinMurray2007ISMAR.pdf
website: ''
code: ''
topics:
- robot-vision
- 3d-perception
seminal: true
tldr: 'Track a hand-held camera in an unknown scene by splitting tracking and mapping into two parallel threads, so the map can be built from keyframes with full bundle adjustment. Frames track in about 20 ms against maps of thousands of points, and on a synthetic sequence the trajectory error is 6 mm versus 135 mm for EKF-SLAM.'
abstract: 'This paper presents a method of estimating camera pose in an unknown scene. While this has previously been attempted by adapting SLAM algorithms developed for robotic exploration, we propose a system specifically designed to track a hand-held camera in a small AR workspace. We propose to split tracking and mapping into two separate tasks, processed in parallel threads on a dual-core computer: one thread deals with the task of robustly tracking erratic hand-held motion, while the other produces a 3D map of point features from previously observed video frames. This allows the use of computationally expensive batch optimisation techniques not usually associated with real-time operation: The result is a system that produces detailed maps with thousands of landmarks which can be tracked at frame-rate, with an accuracy and robustness rivalling that of state-of-the-art model-based systems.'
thumb:
  image: klein2007-ptam/thumb.webp
  width: 960
  height: 720
videos: []
youtube: []
figures:
- image: klein2007-ptam/figure1.webp
  width: 1600
  height: 1200
  caption: 'From Figure 1: Tracking a desktop. The map holds close to 3000 points; of the 1000 searched for in this frame, the 660 found are shown as dots, and the dominant plane is drawn as a grid. The frame was tracked in 18 ms.'
- image: klein2007-ptam/figure2.webp
  width: 693
  height: 765
  caption: 'From Figure 2: The asynchronous mapping thread. After stereo initialisation it loops forever: integrating new keyframes from the tracker, otherwise running local and global bundle adjustment and refining data association.'
- image: klein2007-ptam/figure3.webp
  width: 1496
  height: 1191
  caption: 'From Figure 3: Two views of the desk map with point features and keyframe poses (top), and the 57 keyframes used to build it (bottom).'
- image: klein2007-ptam/figure4.webp
  width: 1496
  height: 421
  caption: 'From Figure 5: Synthetic two-wall sequence. Map from this system (left), map from EKF-SLAM (centre), and both trajectories against ground truth (right, with an exaggerated z-axis).'
---
## What they do
PTAM tracks a calibrated hand-held camera in a small, mostly static, unknown scene (such as a desk) for augmented reality, with no prior map or initialisation target. Incremental systems such as EKF-SLAM update the pose and every landmark at every frame. PTAM instead runs tracking and mapping in two threads, and the mapper processes only keyframes, with batch bundle adjustment.

## How it works
- **Initialisation.** The user captures two views with a small sideways move. The five-point algorithm with RANSAC triangulates the first map, which is scaled by assuming a 10 cm baseline and aligned so the dominant plane lies at z=0.
- **Tracking.** On a four-level image pyramid, 50 coarse patches are searched over a wide radius, then up to 1000 in a tight radius. The pose is solved with Tukey-weighted least squares. The fraction of patches found gates keyframe insertion and triggers relocalisation.
- **Mapping.** New points come from epipolar search against the nearest keyframe. Local bundle adjustment (the newest keyframe and its four nearest neighbours) alternates with global adjustment, and both are interrupted when a new keyframe arrives.

## Results
- On a 1656-frame desk video the map grows to 57 keyframes and 4997 points. Most frames track in about 20 ms (19.2 ms with 4000 points), with spikes up to 90 ms during relocalisation.
- Global bundle adjustment takes 380 ms with 2-49 keyframes but 6.9 s with 100-149. The authors put the practical limit at about 6000 points and 150 keyframes.
- On a synthetic sequence (18.2 m of camera travel), the trajectory deviates from ground truth by 6 mm (standard deviation), against 135 mm for EKF-SLAM. PTAM maps 6600 features to EKF-SLAM's 114.

## Limitations
Tracking needs FAST corners, so motion blur and weak texture break it. Repeated structure adds map outliers and can corrupt the map. Stereo initialisation needs the user and sometimes fails. The map is a point cloud with no occlusion reasoning, large loops are not closed, and live experiments were limited to a single office.
