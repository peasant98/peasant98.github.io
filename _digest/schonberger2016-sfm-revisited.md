---
title: Structure-from-Motion Revisited
arxiv: ''
date: '2016-06-01'
added: '2026-11-05'
authors: Johannes L. Schönberger, Jan-Michael Frahm
venue: IEEE Conference on Computer Vision and Pattern Recognition (CVPR)
doi: 10.1109/CVPR.2016.445
pdf: https://openaccess.thecvf.com/content_cvpr_2016/papers/Schonberger_Structure-From-Motion_Revisited_CVPR_2016_paper.pdf
website: ''
code: https://github.com/colmap/colmap
topics:
- robot-vision
- 3d-perception
seminal: true
tldr: COLMAP, an open-source incremental Structure-from-Motion pipeline with new geometric verification, next-best-view selection, robust triangulation and iterative bundle adjustment. It registers the most images on all 17 Internet photo collections tested, e.g. 20,918 of 74,394 Rome photos versus 14,797 for VisualSFM.
abstract: Incremental Structure-from-Motion is a prevalent strategy for 3D reconstruction from unordered image collections. While incremental reconstruction systems have tremendously advanced in all regards, robustness, accuracy, completeness, and scalability remain the key problems towards building a truly general-purpose pipeline. We propose a new SfM technique that improves upon the state of the art to make a further step towards this ultimate goal. The full reconstruction pipeline is released to the public as an open-source implementation.
thumb:
  image: schonberger2016-sfm-revisited/thumb.webp
  width: 960
  height: 288
videos: []
youtube: []
figures:
- image: schonberger2016-sfm-revisited/figure1.webp
  width: 1600
  height: 481
  caption: 'From Figure 1: Reconstruction of Rome, with 21K of 75K images registered.'
- image: schonberger2016-sfm-revisited/figure2.webp
  width: 830
  height: 226
  caption: 'From Figure 2: The incremental SfM pipeline. Correspondence search (feature extraction, matching, geometric verification) feeds incremental reconstruction (initialization, image registration, triangulation, bundle adjustment, outlier filtering).'
- image: schonberger2016-sfm-revisited/figure3.webp
  width: 795
  height: 378
  caption: 'From Figure 3: Next-best-view scores on a three-level grid pyramid. The same number of points scores higher when spread evenly over the image (80 vs 66 with few points, 200 vs 146 with more).'
- image: schonberger2016-sfm-revisited/figure4.webp
  width: 1600
  height: 409
  caption: 'From Figure 9: Gendarmenmarkt reconstructed by Bundler (left) and by this method (right).'
---
## What they do
Incremental SfM rebuilds 3D scenes from unordered photos by registering one image at a time, triangulating points and running bundle adjustment (BA). Existing systems (Bundler, VisualSFM) often leave many registrable images out or produce broken models from mis-registration and drift. This paper reworks each stage of the pipeline and releases it as COLMAP.

## How it works
- **Scene graph augmentation.** Geometric verification labels each image pair as general, panoramic or planar and drops pairs linked only by watermarks, timestamps or frames. Panoramic pairs are never used to seed the model or to triangulate.
- **Next best view.** Each candidate image is scored on a multi-resolution grid of its visible points, so images that see more points, spread more evenly, are registered first.
- **Robust triangulation.** RANSAC over two-view triangulations of a feature track, run recursively so a track wrongly merged from several points yields all of them.
- **Bundle adjustment.** Local BA after each registration, global BA after the model grows by a set percentage, then repeated BA, re-triangulation and filtering. Redundant view mining collapses groups of highly overlapping cameras into one camera to speed up BA.

## Results
- On 17 datasets (144,953 Internet photos) it registers the most images on every one: Rome 20,918 of 74,394 vs 14,797 (VisualSFM) and 13,455 (Bundler), with longer tracks. It is over 50x faster than Bundler but slightly slower than VisualSFM; Theia is fastest.
- On Quad, camera locations are closest to ground truth: 0.85 m vs 0.89 m (VisualSFM), 1.01 m (Bundler) and 1.16 m (DISCO).
- On Dubrovnik's 2.9M feature tracks, recursive RANSAC triangulation recovers 906,501 points (Bundler: 713,824) and is 10-40x faster than exhaustive sampling.
- Grouped BA cuts total Colosseum runtime by 36% with an equivalent reconstruction.

## Limitations
The paper states none. Grouped BA trades accuracy for speed, and quality degrades for overlap thresholds below 0.3. Timings exclude correspondence search, and ground-truth accuracy is measured on only one dataset.
