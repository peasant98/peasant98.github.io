---
title: Good Features to Track
arxiv: ''
date: '1994-06-01'
added: '2026-11-05'
authors: Jianbo Shi, Carlo Tomasi
venue: IEEE Conference on Computer Vision and Pattern Recognition (CVPR)
doi: 10.1109/CVPR.1994.323794
pdf: https://users.cs.duke.edu/~tomasi/papers/shi/shiCvpr94.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: Pick feature windows whose 2x2 gradient matrix has a large smallest eigenvalue, because that is exactly when the tracker can solve for motion reliably, and drop features whose appearance, after an affine warp back to the first frame, stops matching. On a 26-frame real sequence with 102 features, this affine check singles out the occluded and depth-straddling features that a translation-only check misses.
abstract: No feature-based vision system can work unless good features can be identified and tracked from frame to frame. Although tracking itself is by and large a solved problem, selecting features that can be tracked well and correspond to physical points in the world is still hard. We propose a feature selection criterion that is optimal by construction because it is based on how the tracker works, and a feature monitoring method that can detect occlusions, disocclusions, and features that do not correspond to points in the world. These methods are based on a new tracking algorithm that extends previous Newton-Raphson style search methods to work under affine image transformations. We test performance with several simulations and experiments.
thumb:
  image: shi1994-good-features/thumb.webp
  width: 281
  height: 281
videos: []
youtube: []
figures:
- image: shi1994-good-features/figure1.webp
  width: 281
  height: 281
  caption: 'From Figure 6: the original image, four circular blobs, used in the convergence simulations.'
- image: shi1994-good-features/figure2.webp
  width: 281
  height: 281
  caption: 'From Figure 6: the blobs warped by an affine change computed by the tracker at an intermediate iteration, approaching the target.'
- image: shi1994-good-features/figure3.webp
  width: 281
  height: 281
  caption: 'From Figure 6: the target, the blobs warped, translated and corrupted with Gaussian noise of standard deviation 16 percent of the maximum intensity.'
---
## What they do
A feature tracker only works if its windows can be tracked well and stay attached to one point in the world. Shi and Tomasi derive the selection rule from the tracker itself instead of from a separate "interest" or "cornerness" measure. They also add a monitor that flags features that get occluded, disoccluded or do not correspond to a real point.

## How it works
- **Two motion models.** Between consecutive frames, a window is tracked by pure translation, solving the 2x2 system Zd = e as Lucas and Kanade do. Estimating deformation over small motions only adds error to the displacement. To compare the current window with the first frame, they solve the full 6x6 affine system (deformation D and translation d) iteratively, in Newton-Raphson style.
- **Selection.** Z is built from the image gradients in the window. A window is accepted if min(λ1, λ2) > λ, so both eigenvalues are above the noise level. This rejects flat regions and edges but accepts corners and salt-and-pepper textures.
- **Monitoring.** Dissimilarity is the rms residue between the first-frame window and the affinely warped current window. A feature is abandoned when its dissimilarity grows too large.

## Results
- Simulations with noise at 16 percent of maximum intensity: the computed translations are within 0.1 pixel of the true 2-3 pixel shifts, and the deformation entries are within 0.025. Matching four blobs to a cross keeps dissimilarity high.
- Movie clip: a traffic sign grows about 15 percent. Translation-only dissimilarity climbs, while affine dissimilarity stays small and roughly constant. An occlusion of another feature shows up as a sharp jump.
- Real sequence: 26 frames, with the camera moving forward 2 mm per frame and 102 non-overlapping features. Under translation only, features 58 and 89 stand out. Under affine dissimilarity, the bad features 3, 4, 58, 78 and 89 (occlusions, disocclusions, a glossy reflection, a window straddling depths) separate clearly from the good ones.

## Limitations
A bright spot on a glossy surface is non-rigid but may change little, so dissimilarity can miss it; rigidity is not a local property. Fine lettering near pixel size (features 24 and 60) aliases and gives erratic dissimilarity. The paper does not give values for λ or the dissimilarity cutoff.
