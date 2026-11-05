---
title: A Computational Approach to Edge Detection
arxiv: ''
date: '1986-11-01'
added: '2026-11-05'
authors: John Canny
venue: IEEE Transactions on Pattern Analysis and Machine Intelligence
doi: 10.1109/TPAMI.1986.4767851
pdf: https://www.cs.princeton.edu/courses/archive/fall13/cos429/papers/Canny86.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: Canny writes three goals for an edge detector (good detection, good localization, one response per edge) as functionals of the filter and optimizes them. The optimal step-edge operator is closely approximated by the first derivative of a Gaussian, about 20% below the optimum, and the full detector marks gradient maxima of the smoothed image and links them with hysteresis thresholds.
abstract: This paper describes a computational approach to edge detection. The success of the approach depends on the definition of a comprehensive set of goals for the computation of edge points. These goals must be precise enough to delimit the desired behavior of the detector while making minimal assumptions about the form of the solution. We define detection and localization criteria for a class of edges, and present mathematical forms for these criteria as functionals on the operator impulse response. A third criterion is then added to ensure that the detector has only one response to a single edge. We use the criteria in numerical optimization to derive detectors for several common image features, including step edges. On specializing the analysis to step edges, we find that there is a natural uncertainty principle between detection and localization performance, which are the two main goals. With this principle we derive a single operator shape which is optimal at any scale. The optimal detector has a simple approximate implementation in which edges are marked at maxima in gradient magnitude of a Gaussian-smoothed image. We extend this simple detector using operators of several widths to cope with different signal-to-noise ratios in the image. We present a general method, called feature synthesis, for the fine-to-coarse integration of information from operators at different scales. Finally we show that step edge detector performance improves considerably as the operator point spread function is extended along the edge. This detection scheme uses several elongated operators at each point, and the directional operator outputs are integrated with the gradient maximum detector.
thumb:
  image: canny1986-edge-detection/thumb.webp
  width: 960
  height: 748
videos: []
youtube: []
figures:
- image: canny1986-edge-detection/figure1.webp
  width: 1084
  height: 1092
  caption: 'From Figure 1: a noisy step edge (a), a difference-of-boxes operator (b) and its output (c), and a first-derivative-of-Gaussian operator (d) and its output (e). The boxes output has several local maxima near the edge.'
- image: canny1986-edge-detection/figure2.webp
  width: 1383
  height: 321
  caption: 'From Figure 6: the numerically optimal step edge operator (a) and the first derivative of a Gaussian (b) used to approximate it.'
- image: canny1986-edge-detection/figure3.webp
  width: 1333
  height: 1039
  caption: 'From Figure 7: a 576 by 454 parts image (a), thresholded at T1 (b), at 2T1 (c), and with hysteresis using both thresholds (d).'
- image: canny1986-edge-detection/figure4.webp
  width: 684
  height: 1621
  caption: 'From Figure 11: a 576 by 454 image (a), edges from the circular operator (b), and edges from directional operators at 6 mask orientations (c).'
---
## What they do
Canny writes the goals of an edge detector as functionals of the filter's impulse response and optimizes them: good detection (high signal-to-noise ratio), good localization, and one response per edge. For step edges this gives a single operator shape, approximated by a Gaussian derivative and built into a 2D detector.

## How it works
- **Criteria.** A 1D edge in white Gaussian noise is filtered and edges are marked at output maxima. SNR and localization alone favor a difference of boxes, which responds many times to a noisy step, so a third constraint limits the spacing of noise maxima.
- **Optimal step operator.** Widening the operator improves SNR and worsens localization by the same factor, so one shape is optimal at every scale and width sets the tradeoff. Its parameters are found numerically.
- **2D detector.** Smooth with a Gaussian, mark gradient-magnitude maxima along the gradient direction, estimate noise from a global histogram, and threshold with hysteresis: contours touching a high threshold are kept down to a low one (ratio 2 or 3 to 1).
- **Extensions.** Several widths merged fine-to-coarse by "feature synthesis", plus elongated directional masks at 6 orientations.

## Results
- The Gaussian derivative is about 20% worse than the optimal operator on combined detection-localization (0.92 vs 1.12) and about 10% worse on multiple responses, which the paper judges hard to see on real images.
- On a 576x454 parts image, hysteresis removes the broken contours a single threshold leaves.
- With 6 directional masks the worst-case misalignment is 15 degrees, where output falls to about 85%; each mask costs five multiplications.

## Limitations
Edges are assumed to have a locally constant cross-section, which excludes corners, and only one edge per operator support. No filter reached the target multiple-response value (best r = 0.576 vs 1). Real-image results are qualitative examples, and combining edge and ridge detectors was inconclusive.
