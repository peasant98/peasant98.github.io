---
title: 'KinectFusion: Real-Time Dense Surface Mapping and Tracking'
arxiv: ''
date: '2011-10-01'
added: '2026-11-05'
authors: Richard A. Newcombe, Shahram Izadi, Otmar Hilliges, David Molyneaux, David Kim, Andrew J. Davison, Pushmeet Kohli, Jamie Shotton, Steve Hodges, Andrew Fitzgibbon
pis: [Otmar Hilliges, Andrew Davison]
venue: IEEE International Symposium on Mixed and Augmented Reality (ISMAR)
doi: 10.1109/ISMAR.2011.6092378
pdf: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/ismar2011.pdf
website: ''
code: ''
topics:
- robot-vision
- 3d-perception
seminal: true
tldr: Fuse every Kinect depth frame into one truncated signed distance volume on the GPU, and track the camera with ICP against a raycast of that model rather than the previous frame. It runs at the Kinect's 30 Hz in room-sized scenes, and the first and last poses of a 560-frame turntable loop nearly overlap with no global optimisation.
abstract: 'We present a system for accurate real-time mapping of complex and arbitrary indoor scenes in variable lighting conditions, using only a moving low-cost depth camera and commodity graphics hardware. We fuse all of the depth data streamed from a Kinect sensor into a single global implicit surface model of the observed scene in real-time. The current sensor pose is simultaneously obtained by tracking the live depth frame relative to the global model using a coarse-to-fine iterative closest point (ICP) algorithm, which uses all of the observed depth data available. We demonstrate the advantages of tracking against the growing full surface model compared with frame-to-frame tracking, obtaining tracking and mapping results in constant time within room sized scenes with limited drift and high accuracy. We also show both qualitative and quantitative results relating to various aspects of our tracking and mapping system. Modelling of natural scenes, in real-time with only commodity sensor and GPU hardware, promises an exciting step forward in augmented reality (AR), in particular, it allows dense surfaces to be reconstructed in real-time, with a level of detail and robustness beyond any solution yet presented using passive computer vision.'
thumb:
  image: newcombe2011-kinectfusion/thumb.webp
  width: 960
  height: 227
videos: []
youtube: []
figures:
- image: newcombe2011-kinectfusion/figure1.webp
  width: 1484
  height: 351
  caption: 'From Figure 1: Live, incomplete and noisy Kinect depth (left) next to normal maps (colour) and Phong-shaded renderings (grey) of the real-time reconstruction from a handheld Kinect.'
- image: newcombe2011-kinectfusion/figure2.webp
  width: 726
  height: 259
  caption: 'From Figure 3: The system loop: compute vertex and normal maps from the depth input, estimate the pose by ICP against the predicted surface, integrate the measurement into the global TSDF, and raycast the TSDF to predict the surface for the next frame.'
- image: newcombe2011-kinectfusion/figure3.webp
  width: 1478
  height: 601
  caption: 'From Figure 8: Estimated trajectories (top) and reconstructions (bottom) as the sensor orbits a table. Frame-to-frame tracking drifts into a non-circular path and a poor model (a); frame-to-model tracking gives a clean partial loop (b), a full loop whose first and last frames nearly overlap (c), and tighter alignment still when the loop is fed 4 times (d).'
- image: newcombe2011-kinectfusion/figure4.webp
  width: 724
  height: 322
  caption: 'From Figure 13: Cumulative per-frame time of pre-processing, data association, pose optimisation, raycasting and integration (bottom to top) as the voxel grid grows from 64 to 512 voxels per side inside a 3 m³ volume.'
---
## What they do
KinectFusion builds a dense 3D surface model of a room in real time from a handheld Kinect, using only the depth stream and a commodity GPU. Every depth frame is fused into one global volumetric model, and the camera pose is tracked against that growing model instead of against the previous frame. Because it uses no colour, it also works in the dark.

## How it works
- **Surface measurement.** Each raw 640x480 depth map is bilateral-filtered and turned into a 3-level pyramid of vertex and normal maps.
- **Mapping.** Depth is fused into a truncated signed distance function (TSDF) on a voxel grid by a per-voxel weighted running average; capping the weight gives a moving average that copes with moving objects. Fusion uses the raw, unfiltered depth to keep fine structure.
- **Surface prediction.** The TSDF is raycast from the current pose to give a predicted vertex and normal map. Stepping quickly through truncated empty space cuts marching steps about 6x.
- **Tracking.** Coarse-to-fine point-to-plane ICP with projective data association aligns every pixel of the live frame to the prediction, with up to 4, 5 and 10 iterations per pyramid level. A null-space check and a cap on the pose update detect failures and switch to relocalisation.

## Results
- Tracking and mapping run at the Kinect's 30 Hz, in constant time for a given voxel resolution. A full 512³ volume update takes about 2 ms (over 65 gigavoxels/s).
- On a 560-frame turntable loop at 256³, frame-to-frame ICP drifts into a non-circular trajectory, while frame-to-model tracking brings the first and last frames almost into overlap with no global optimisation. Feeding the loop 4 times tightens the alignment further.
- With every 8th frame, frame-to-frame drift drops sharply but frame-to-model tracking is drift-free. At 64³ (1/64 of the memory) with every 6th frame, the reconstruction degrades gracefully.

## Limitations
A large plane filling the view leaves three degrees of freedom unconstrained, so tracking drifts or fails. The dense volume suits rooms of up to about 7 m³; whole buildings would need too much memory and would show drift at loop closures. Relocalisation is manual: the user lines the sensor up with the last known view.
