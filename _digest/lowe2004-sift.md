---
title: Distinctive Image Features from Scale-Invariant Keypoints
arxiv: ''
date: '2004-11-01'
added: '2026-11-05'
authors: David G. Lowe
venue: International Journal of Computer Vision
doi: 10.1023/B:VISI.0000029664.99615.94
pdf: https://www.cs.ubc.ca/~lowe/papers/ijcv04.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
must_read: true
tldr: SIFT detects keypoints at extrema of a difference-of-Gaussian scale space and describes each with a 128-element histogram of local gradient orientations, invariant to scale and rotation. With a nearest-neighbor ratio test, Hough clustering and an affine fit, it recognizes occluded objects in clutter from as few as 3 matches in under 0.3 s.
abstract: This paper presents a method for extracting distinctive invariant features from images that can be used to perform reliable matching between different views of an object or scene. The features are invariant to image scale and rotation, and are shown to provide robust matching across a substantial range of affine distortion, change in 3D viewpoint, addition of noise, and change in illumination. The features are highly distinctive, in the sense that a single feature can be correctly matched with high probability against a large database of features from many images. This paper also describes an approach to using these features for object recognition. The recognition proceeds by matching individual features to a database of features from known objects using a fast nearest-neighbor algorithm, followed by a Hough transform to identify clusters belonging to a single object, and finally performing verification through least-squares solution for consistent pose parameters. This approach to recognition can robustly identify objects among clutter and occlusion while achieving near real-time performance.
thumb:
  image: lowe2004-sift/thumb.webp
  width: 960
  height: 334
videos: []
youtube: []
figures:
- image: lowe2004-sift/figure1.webp
  width: 495
  height: 419
  caption: 'From Figure 2: Extrema of the difference-of-Gaussian images are found by comparing a pixel (X) to its 26 neighbors in 3x3 regions at the current and adjacent scales (circles).'
- image: lowe2004-sift/figure2.webp
  width: 1090
  height: 490
  caption: 'From Figure 7: Gradient magnitudes and orientations around the keypoint, weighted by a Gaussian window (circle), are accumulated into orientation histograms over 4x4-sample subregions. Shown is a 2x2 descriptor from 8x8 samples; the paper uses 4x4 descriptors from 16x16 samples.'
- image: lowe2004-sift/figure3.webp
  width: 729
  height: 558
  caption: 'From Figure 11: Distribution of the ratio of closest to second-closest neighbor distance, for correct matches (solid) and incorrect matches (dotted), against a database of 40,000 keypoints.'
- image: lowe2004-sift/figure4.webp
  width: 1190
  height: 948
  caption: 'From Figure 13: Location recognition. Training images of places (upper left) are found in a 640x315 test image taken from a different viewpoint (upper right); recognized regions are outlined below, with their keypoints as squares.'
---
## What they do
Image matching needs local features that survive changes in scale, rotation, viewpoint, illumination and noise, and are distinctive enough to find their match in a large database. This paper fully develops the Scale Invariant Feature Transform (SIFT) from the author's 1999 work and uses it for object recognition under clutter and occlusion. A typical 500x500 image yields about 2000 stable features.

## How it works
- **Detection.** A difference-of-Gaussian pyramid (3 scales per octave, σ = 1.6, input image doubled); a pixel is kept if it is larger or smaller than all 26 neighbors in space and scale. A quadratic fit refines location and scale, and low-contrast points and edge responses (principal curvature ratio over 10) are dropped.
- **Orientation.** A 36-bin histogram of gradient directions gives each keypoint its orientation; any peak within 80% of the highest creates another keypoint (about 15% of points).
- **Descriptor.** Gradients in a 16x16 region, rotated to the keypoint orientation, fill a 4x4 grid of 8-bin histograms: 128 values, normalized, clipped at 0.2 and renormalized to reduce illumination effects.
- **Recognition.** Approximate nearest-neighbor matching (Best-Bin-First), rejecting a match if the closest distance exceeds 0.8 times the second closest; a Hough transform clusters matches by pose, and clusters of 3 or more are verified with a least-squares affine fit and a probability test.

## Results
- Orientation is correct (within 15 degrees) 95% of the time even with ±10% pixel noise. Final matching accuracy stays above 50% out to a 50 degree viewpoint change.
- The 0.8 ratio test removes 90% of false matches and under 5% of correct ones. On 100,000 keypoints, Best-Bin-First is about two orders of magnitude faster than exact search and loses under 5% of correct matches.
- Recognizing all objects in the cluttered test images takes under 0.3 s on a 2 GHz Pentium 4. Textured planar surfaces are recognized up to 50 degrees of rotation in depth, 3D objects only up to about 30 degrees.

## Limitations
The features are not fully affine invariant; beyond about 50 degrees the Harris-affine detector keeps better repeatability. 3D objects need training views about every 30 degrees, and illumination changes hurt them more. Only monochrome intensity is used, and most tests apply synthetic transformations to 32 images rather than real 3D viewpoint and illumination changes.
