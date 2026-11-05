---
title: 'Random Sample Consensus: A Paradigm for Model Fitting with Applications to Image Analysis and Automated Cartography'
arxiv: ''
date: '1981-06-01'
added: '2026-11-05'
authors: Martin A. Fischler, Robert C. Bolles
venue: Communications of the ACM
doi: 10.1145/358669.358692
pdf: https://classes.cs.uchicago.edu/archive/2005/fall/35040-1/ransac.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
must_read: true
tldr: RANSAC fits a model to random minimal subsets of the data and keeps the hypothesis that the most other points agree with, instead of fitting all the data and pruning the worst residuals. Applied to locating a camera from landmarks with a new closed-form three-point solver, it kept every gross error out of the final fit in 50 synthetic problems.
abstract: 'A new paradigm, Random Sample Consensus (RANSAC), for fitting a model to experimental data is introduced. RANSAC is capable of interpreting/smoothing data containing a significant percentage of gross errors, and is thus ideally suited for applications in automated image analysis where interpretation is based on the data provided by error-prone feature detectors. A major portion of this paper describes the application of RANSAC to the Location Determination Problem (LDP): Given an image depicting a set of landmarks with known locations, determine that point in space from which the image was obtained. In response to a RANSAC requirement, new results are derived on the minimum number of landmarks needed to obtain a solution, and algorithms are presented for computing these minimum-landmark solutions in closed form. These results provide the basis for an automatic system that can solve the LDP under difficult viewing and analysis conditions. Implementation details and computational examples are also presented.'
thumb:
  image: fischler1981-ransac/thumb.webp
  width: 636
  height: 351
videos: []
youtube: []
figures:
- image: fischler1981-ransac/figure1.webp
  width: 636
  height: 351
  caption: 'From Figure 1: Seven points, six on a line and one gross error at (10,2). Least squares with repeated removal of the worst residual ends at the dashed line, fit to four points that include the gross error.'
- image: fischler1981-ransac/figure2.webp
  width: 420
  height: 375
  caption: 'From Figure 2: The location determination problem. Control points A, B, C on the ground appear in the image plane, so the angles between their rays from the center of perspective (CP) are known.'
- image: fischler1981-ransac/figure3.webp
  width: 392
  height: 424
  caption: 'From Figure 4: The P3P problem as a tetrahedron. The base sides Rab, Rac, Rbc and the angles at the center of perspective L are known; the leg lengths a, b, c are unknown.'
- image: fischler1981-ransac/figure4.webp
  width: 327
  height: 956
  caption: 'From Figure 5: Two of four solutions to one P3P problem. Top: an equilateral base with all legs of length 4. Bottom: the same angles at L are met with the base repositioned so that A sits at A'', 1 unit from L.'
---
## What they do
Least squares fits all the data and relies on good points averaging out bad ones; even when the worst residual is deleted repeatedly, one gross error can survive (Figure 1). RANSAC reverses the order: fit the smallest possible random subset, then grow it with the points that agree. Most of the paper applies this to finding where a camera was from an image of landmarks with known 3D positions, when some matches are wrong.

## How it works
- **Paradigm.** Fit the model to n random points (the minimum it needs) and collect the points within an error tolerance. If at least t agree, refit on them; otherwise draw again, and after a set number of trials use the largest consensus set or fail.
- **Trial count.** If w is the chance a point is good, k = log(1-z)/log(1-w^n) draws give probability z of one clean sample (35.7 for w = 0.5, n = 4, z = 0.9).
- **Minimal solver.** With known focal length and principal point this becomes the perspective-n-point problem. P3P is solved in closed form via a quartic and has at most four solutions, a bound that is reached.
- **RANSAC/LD.** Draw three correspondences, solve P3P, estimate each solution's error by perturbing image points one pixel, accept correspondences inside error ellipses, finish with least squares.

## Results
- 20 landmarks, 5 gross errors: worst-residual pruning kept 3 wrong correspondences. RANSAC found the correct solution on its second triple, with no gross errors.
- 50 synthetic problems of 30 correspondences: no gross error entered the final consensus set; about 1 s per camera position.
- Real aerial image (25 landmarks, 3 gross errors): consensus of 17 on the first triple, extended to all 22 good matches; final standard deviations of 0.1, 6.4 and 2.1 ft in X, Y, Z.
- P4P and P5P can have two solutions; four coplanar points, or six in general position, give a unique one.

## Limitations
Tolerance, trial count and t are set by hand or from rough estimates, and expected trials grow as w^-n (98 for w = 0.4, n = 5). Focal length and principal point must be known. The maximum number of P4P and P5P solutions is left open, and only one real image is tested.
