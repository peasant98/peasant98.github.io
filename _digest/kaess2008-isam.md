---
title: 'iSAM: Incremental Smoothing and Mapping'
arxiv: ''
date: '2008-12-01'
added: '2026-11-05'
authors: Michael Kaess, Ananth Ranganathan, Frank Dellaert
venue: IEEE Transactions on Robotics
doi: 10.1109/TRO.2008.2006706
pdf: https://www.cs.cmu.edu/~kaess/pub/Kaess08tro.pdf
website: ''
code: ''
topics:
- foundations
- 3d-perception
seminal: true
tldr: iSAM solves SLAM as sparse least squares and updates the QR factor of the smoothing problem with Givens rotations as measurements arrive, reordering variables periodically to keep it sparse. On the 26-minute Victoria Park run it computes the full, exact solution with data association after every frame in 7.7 minutes, over 3x faster than real time.
abstract: We present incremental smoothing and mapping (iSAM), a novel approach to the simultaneous localization and mapping problem that is based on fast incremental matrix factorization. iSAM provides an efficient and exact solution by updating a QR factorization of the naturally sparse smoothing information matrix, therefore recalculating only the matrix entries that actually change. iSAM is efficient even for robot trajectories with many loops as it avoids unnecessary fill-in in the factor matrix by periodic variable reordering. Also, to enable data association in real-time, we provide efficient algorithms to access the estimation uncertainties of interest based on the factored information matrix. We systematically evaluate the different components of iSAM as well as the overall algorithm using various simulated and real-world datasets for both landmark and pose-only settings.
thumb:
  image: kaess2008-isam/thumb.webp
  width: 502
  height: 576
videos: []
youtube: []
figures:
- image: kaess2008-isam/figure1.webp
  width: 580
  height: 378
  caption: 'From Figure 1: The SLAM problem as a Bayesian belief network over robot states x, landmarks l, control inputs u and landmark measurements z.'
- image: kaess2008-isam/figure2.webp
  width: 610
  height: 215
  caption: 'From Figure 2: One Givens rotation, a step in turning a matrix into upper triangular form, eliminates the entry marked x and changes some of the red entries in the two rotated rows.'
- image: kaess2008-isam/figure3.webp
  width: 677
  height: 1379
  caption: 'From Figure 5: A simulated 8-loop traversed twice (a). Incremental updates alone fill in the factor R at the loop closures A, B and C (b); after approximate minimum degree reordering R is sparse again (c). Time per step with no reordering (red), reordering every step (green) and reordering every 100 steps (blue), in linear and log scale (d).'
- image: kaess2008-isam/figure4.webp
  width: 1047
  height: 640
  caption: 'From Figure 8: Victoria Park. The iSAM trajectory and landmarks (yellow) manually overlaid on an aerial image, with differential GPS (blue) shown only for comparison (b), and the final factor R with side length 21,187 (c).'
---
## What they do
iSAM treats SLAM as smoothing: the full trajectory and all landmarks form one least-squares problem whose information matrix stays sparse. Rather than refactoring it at every step, as their batch square root SAM does, iSAM updates the existing QR factor as measurements arrive and gives fast access to the covariances needed for data association.

## How it works
- **Incremental QR.** New measurement rows are appended to the triangular factor R and zeroed out with Givens rotations; back-substitution gives the full trajectory and map. In pure exploration an update needs a constant number of rotations.
- **Periodic reordering.** Loop closures cause fill-in in R. Every 100 steps (20 on Intel) iSAM reorders variables with COLAMD, refactors, and relinearizes.
- **Covariances.** Maximum-likelihood data association needs pose-landmark marginals. The last block column comes from back-substitution; landmark blocks come from conservative initial uncertainties or exactly, by a recursion over the non-zeros of R.

## Results
- Victoria Park (4 km, 26-minute run): the full solution with unknown data association after every frame takes 7.7 minutes on a 2 GHz laptop, over 3x faster than real time. The final R averages 9.79 entries per column.
- Simulated Manhattan world: normalized χ² of 1.0406 against 1.0412 for the compared method; one more relinearization reaches 1.0375, matching full nonlinear optimization. 40 ms per step; 85 ms on Intel, 12.2 ms on Killian Court.
- On a simulated double 8-loop, periodic reordering is one to three orders of magnitude faster than purely incremental or always-batch updates, apart from reordering peaks.
- Data association on a 500-pose loop: 2.80 s with conservative estimates, 27.5 s exact, 429 s by full inversion.

## Limitations
Reordering and relinearization are still periodic batch steps that cause timing peaks. Exact covariances are too expensive to compute every step in large environments. On Intel the density of R kept growing. Pose-only experiments assume known data association.
