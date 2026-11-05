---
title: Rapid Object Detection using a Boosted Cascade of Simple Features
arxiv: ''
date: '2001-12-01'
added: '2026-11-05'
authors: Paul Viola, Michael Jones
venue: IEEE Conference on Computer Vision and Pattern Recognition (CVPR)
doi: 10.1109/CVPR.2001.990517
pdf: https://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: A face detector that scans a cascade of AdaBoost classifiers built on simple rectangle features, computed fast with an integral image, so most image windows are rejected after a few features. It matches the best published detection rates on MIT+CMU and runs at 15 frames per second on a 700 MHz Pentium III, about 15x faster than Rowley et al.
abstract: 'This paper describes a machine learning approach for visual object detection which is capable of processing images extremely rapidly and achieving high detection rates. This work is distinguished by three key contributions. The first is the introduction of a new image representation called the "Integral Image" which allows the features used by our detector to be computed very quickly. The second is a learning algorithm, based on AdaBoost, which selects a small number of critical visual features from a larger set and yields extremely efficient classifiers. The third contribution is a method for combining increasingly more complex classifiers in a "cascade" which allows background regions of the image to be quickly discarded while spending more computation on promising object-like regions. The cascade can be viewed as an object specific focus-of-attention mechanism which unlike previous approaches provides statistical guarantees that discarded regions are unlikely to contain the object of interest. In the domain of face detection the system yields detection rates comparable to the best previous systems. Used in real-time applications, the detector runs at 15 frames per second without resorting to image differencing or skin color detection.'
thumb:
  image: viola2001-boosted-cascade/thumb.webp
  width: 960
  height: 308
videos: []
youtube: []
figures:
- image: viola2001-boosted-cascade/figure1.webp
  width: 496
  height: 429
  caption: 'From Figure 1: The rectangle features inside the detection window: two-rectangle (A, B), three-rectangle (C) and four-rectangle (D). A feature''s value is the pixel sum in the grey rectangles minus the sum in the white ones.'
- image: viola2001-boosted-cascade/figure2.webp
  width: 664
  height: 440
  caption: 'From Figure 3: The first two features selected by AdaBoost, alone and overlaid on a training face. The first compares the dark eye region with the upper cheeks, the second compares the eyes with the bridge of the nose.'
- image: viola2001-boosted-cascade/figure3.webp
  width: 594
  height: 386
  caption: 'From Figure 4: The detection cascade. Each stage either rejects a sub-window or passes it on to the next, more complex stage.'
- image: viola2001-boosted-cascade/figure4.webp
  width: 1198
  height: 384
  caption: 'From Figure 7: Detector output on test images from the MIT+CMU test set.'
---
## What they do
A frontal face detector built to be fast on a single greyscale image, with no frame differencing or skin color. It combines an integral image that makes rectangle features cheap, AdaBoost to pick a few features out of a very large set, and a cascade of classifiers that discards background windows early.

## How it works
- **Integral image.** Each entry is the sum of all pixels above and to the left, computed in one pass. Any rectangle sum then takes four array lookups, at any scale or position. A 24x24 window has over 180,000 rectangle features.
- **AdaBoost as feature selection.** Each weak classifier thresholds a single feature, so every boosting round picks one feature.
- **Attentional cascade.** Each stage is a boosted classifier whose threshold is lowered so almost no faces are missed. A window rejected by any stage is dropped. Later stages train on the false positives that passed the earlier ones.

## Results
- The first stage uses two features (about 60 instructions), keeps 100% of validation faces and rejects 60% of non-faces.
- The final cascade has 38 stages and 6061 features, but evaluates an average of 10 features per sub-window.
- A 384x288 image takes about 0.067 s on a 700 MHz Pentium III, roughly 15x faster than Rowley-Baluja-Kanade and 600x faster than Schneiderman-Kanade.
- On MIT+CMU (507 faces), detection is 76.1% at 10 false detections and 93.9% at 167, against 83.2% and 90.1% for Rowley-Baluja-Kanade.

## Limitations
Only frontal, upright faces are tested. Rectangle features are coarse, with only vertical, horizontal and diagonal orientations. Stage count, features per stage and thresholds come from simple per-stage targets, because the authors find joint optimization too hard. A vote over three detectors helps only modestly, because their errors are correlated.
