---
title: A Combined Corner and Edge Detector
arxiv: ''
date: '1988-09-01'
added: '2026-11-05'
authors: Chris Harris, Mike Stephens
venue: Proceedings of the Alvey Vision Conference
doi: 10.5244/C.2.23
pdf: https://bmva-archive.org.uk/bmvc/1988/avc-88-023.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: Moravec's corner detector, rebuilt on the local auto-correlation matrix of image gradients, so that one response R = Det(M) - k Tr(M)^2 labels each pixel as corner, edge or flat. The paper has no numbers; on outdoor image pairs it finds corners and thin edges and links them into an edge-vertex graph.
abstract: Consistency of image edge filtering is of prime importance for 3D interpretation of image sequences using feature tracking algorithms. To cater for image regions containing texture and isolated features, a combined corner and edge detector based on the local auto-correlation function is utilised, and it is shown to perform with good consistency on natural imagery.
thumb:
  image: harris1988-corner-detector/thumb.webp
  width: 960
  height: 467
videos: []
youtube: []
figures:
- image: harris1988-corner-detector/figure1.webp
  width: 1573
  height: 741
  caption: 'From Figure 3: Linked Canny edges for two outdoor frames after hysteresis, spur deletion and junction completion. In the bushes, very few edges can be matched between the frames.'
- image: harris1988-corner-detector/figure2.webp
  width: 688
  height: 753
  caption: 'From Figure 4: Corners found on a synthetic test image by the Moravec (a), Beaudet (b) and Kitchen & Rosenfeld (c) operators, and by the new detector (d).'
- image: harris1988-corner-detector/figure3.webp
  width: 693
  height: 644
  caption: 'From Figure 5: The space of auto-correlation principal curvatures (alpha, beta). Heavy lines split it into corner, edge and flat regions; fine lines are contours of equal response.'
- image: harris1988-corner-detector/figure4.webp
  width: 1578
  height: 768
  caption: 'From Figure 7: Completed edges for the outdoor frames (white = corners, black = edges). Many corners in the bushes have no edges attached because they lie in textured regions.'
---
## What they do
To build a 3D model of the world from a moving monocular camera, the tracked features have to be discrete and detected the same way in every frame. Canny edges fail this test. When an edge's response sits near the threshold, a small change in edge strength or pixellation changes the edge topology, so in textured regions like bushes few edges match between frames. The authors detect corners and edges with a single operator built on the local auto-correlation function. A junction is then simply edges meeting at a corner.

## How it works
- **Moravec revisited.** Moravec's detector shifts a binary rectangular window in four directions and keeps local maxima of the smallest intensity change E. The authors list three problems with it: the response is anisotropic, it is noisy, and it fires too readily on edges.
- **Auto-correlation matrix.** Expanding E for small shifts gives E(x,y) = (x,y) M (x,y)^T. M is a 2x2 matrix of products of first gradients, smoothed by a Gaussian window. Its eigenvalues alpha and beta are proportional to the principal curvatures of the auto-correlation function. Both small means a flat region, one large means an edge, both large means a corner.
- **Response.** R = Det(M) - k Tr(M)^2, which avoids computing the eigenvalues explicitly. R is positive at corners, negative at edges and small in flat regions. A pixel counts as flat when Tr(M) falls below a threshold.
- **Selection.** Corners are positive-R pixels that are 8-way local maxima. Edge pixels are negative-R pixels that are local minima in x or y, whichever gradient is larger, which keeps edges thin. Hysteresis, spur removal and gap bridging follow, and edge ends are then linked to corners to form an edge-vertex graph.

## Results
- On a synthetic test image, the detector's corners are shown next to those of the Moravec, Beaudet and Kitchen & Rosenfeld operators.
- On two outdoor frames, the edges come out continuous and thin and generally end in corner regions. Corners in the bushes stand alone, without edges. The authors say many corners and edges can be matched directly between the frames, "although not readily apparent from the Figure".
- There is no quantitative evaluation.

## Limitations
All results are qualitative, on one test image and one pair of outdoor frames, and the paper does not give the value of k. The authors call the junction completion algorithm "quite rudimentary" and leave it, along with adaptive thresholding, to future work.
