---
title: Histograms of Oriented Gradients for Human Detection
arxiv: ''
date: '2005-06-01'
added: '2026-11-05'
authors: Navneet Dalal, Bill Triggs
venue: IEEE Conference on Computer Vision and Pattern Recognition (CVPR)
doi: 10.1109/CVPR.2005.177
pdf: https://inria.hal.science/inria-00548512/document
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: Dense grids of locally contrast-normalized histograms of gradient orientations (HOG), fed to a linear SVM, detect pedestrians far better than wavelet, PCA-SIFT or shape-context features. They give near-perfect separation on the MIT set and at least an order of magnitude fewer false positives on the new, harder INRIA dataset.
abstract: 'We study the question of feature sets for robust visual object recognition, adopting linear SVM based human detection as a test case. After reviewing existing edge and gradient based descriptors, we show experimentally that grids of Histograms of Oriented Gradient (HOG) descriptors significantly outperform existing feature sets for human detection. We study the influence of each stage of the computation on performance, concluding that fine-scale gradients, fine orientation binning, relatively coarse spatial binning, and high-quality local contrast normalization in overlapping descriptor blocks are all important for good results. The new approach gives near-perfect separation on the original MIT pedestrian database, so we introduce a more challenging dataset containing over 1800 annotated human images with a large range of pose variations and backgrounds.'
thumb:
  image: dalal2005-hog/thumb.webp
  width: 960
  height: 262
videos: []
youtube: []
figures:
- image: dalal2005-hog/figure1.webp
  width: 1161
  height: 147
  caption: 'From Figure 1: The feature extraction and detection chain. HOG features from a grid of overlapping blocks are concatenated over the detection window and fed to a linear SVM for person/non-person classification; the window is scanned over all positions and scales.'
- image: dalal2005-hog/figure2.webp
  width: 1350
  height: 433
  caption: 'From Figure 6: The detector cues mainly on silhouette contours (head, shoulders and feet). (a) Average gradient image over the training examples; (b, c) maximum positive and negative SVM weight in each block; (d) a test image; (e) its R-HOG descriptor; (f, g) the descriptor weighted by the positive and negative SVM weights.'
- image: dalal2005-hog/figure3.webp
  width: 1433
  height: 599
  caption: 'From Figure 3: Miss rate versus false positives per window for different descriptors on the MIT (left) and INRIA (right) datasets. The HOG variants sit well below wavelets, PCA-SIFT and shape contexts.'
- image: dalal2005-hog/figure4.webp
  width: 612
  height: 449
  caption: 'From Figure 5: Miss rate at 1e-4 false positives per window as cell size and block size vary, with the block stride fixed at half the block size. 3x3 blocks of 6x6-pixel cells do best, at 10.4%.'
---
## What they do
Dalal and Triggs ask which image features best support detecting people, with a sliding-window linear SVM as a fixed test bed. They propose dense grids of locally normalized histograms of gradient orientations (HOG) and measure how each computation step affects detection. Because the MIT pedestrian set is essentially solved, they release a harder one, INRIA: 1805 64x128 crops of people from personal photos.

## How it works
- **Gradients and cells.** Gradients come from a plain [-1, 0, 1] filter with no smoothing. Each pixel votes, weighted by gradient magnitude, into 9 unsigned orientation bins (0-180°) of an 8x8-pixel cell, with bilinear interpolation in position and orientation.
- **Block normalization.** Cells are grouped into 16x16-pixel blocks of 2x2 cells and contrast-normalized with L2-Hys (L2 norm, clip at 0.2, renormalize). Blocks overlap with an 8-pixel stride, so each cell appears four times under different normalizations.
- **Detector.** All block descriptors in a 64x128 window, which keeps about 16 pixels of context around the person, are concatenated and classified by a soft linear SVM. The SVM is retrained once with hard negatives mined from 1218 person-free photos.

## Results
- On INRIA, HOG cuts false positives per window (FPPW) by at least an order of magnitude compared with generalized Haar wavelets, PCA-SIFT and shape contexts; on MIT it separates nearly perfectly.
- The best R-HOG setting, 3x3 blocks of 6x6-pixel cells, misses 10.4% of people at 1e-4 FPPW.
- Ablations at 1e-4 FPPW: smoothing gradients with σ=2 drops recall from 89% to 80%; omitting normalization costs 27%; the redundant overlapping normalization raises recall from 84% to 89%; a Gaussian-kernel SVM adds about 3% at much higher run time.
- The linear detector scans a 320x240 scale-space image (4000 windows) in under a second.

## Limitations
One rigid template for mostly visible, upright people; since humans are highly articulated, the authors suggest a parts-based model for more general situations. Motion cues and a faster coarse-to-fine or rejection-chain detector are left to future work.
