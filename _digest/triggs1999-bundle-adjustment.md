---
title: 'Bundle Adjustment: A Modern Synthesis'
arxiv: ''
date: '1999-09-01'
added: '2026-11-05'
authors: Bill Triggs, Philip F. McLauchlan, Richard I. Hartley, Andrew W. Fitzgibbon
venue: 'Vision Algorithms: Theory and Practice (ICCV Workshop)'
doi: 10.1007/3-540-44480-7_21
pdf: https://inria.hal.science/inria-00548290/document
website: ''
code: ''
topics:
- robot-vision
- 3d-perception
seminal: true
tldr: A survey that brings photogrammetry's bundle adjustment methods to computer vision, covering robust cost functions, sparse Newton solvers, gauge freedom and quality control. On a weakly connected 'strip' of images, sparse Gauss-Newton converges in about 6 steps, while resection-intersection fails to converge within 3000 iterations once there are 16 or more images.
abstract: 'This paper is a survey of the theory and methods of photogrammetric bundle adjustment, aimed at potential implementors in the computer vision community. Bundle adjustment is the problem of refining a visual reconstruction to produce jointly optimal structure and viewing parameter estimates. Topics covered include: the choice of cost function and robustness; numerical optimization including sparse Newton methods, linearly convergent approximations, updating and recursive methods; gauge (datum) invariance; and quality control. The theory is developed for general robust cost functions rather than restricting attention to traditional nonlinear least squares.'
thumb:
  image: triggs1999-bundle-adjustment/thumb.webp
  width: 960
  height: 531
videos: []
youtube: []
figures:
- image: triggs1999-bundle-adjustment/figure1.webp
  width: 1128
  height: 624
  caption: 'From Figure 3: The network graph, parameter connection graph, Jacobian structure and Hessian structure for a toy bundle problem with five 3D features A-E, four images 1-4 and two camera calibrations, K1 (shared by images 1 and 2) and K2 (shared by images 3 and 4).'
- image: triggs1999-bundle-adjustment/figure2.webp
  width: 1106
  height: 756
  caption: 'From Figure 5: First and second order methods near the minimum of a small but ill-conditioned bundle problem, projected onto its two most variable directions. Gauss-Newton and diagonally preconditioned conjugate gradient converge quickly; resection-intersection converges slowly, and a line search helps only partly.'
- image: triggs1999-bundle-adjustment/figure3.webp
  width: 744
  height: 1188
  caption: 'From Figure 6: Total operations against number of images for several bundle optimization methods, on the strong ''spherical cloud'' geometry (top) and the weak ''strip'' geometry (bottom).'
---
## What they do
A survey of photogrammetric bundle adjustment written for computer vision implementors. Bundle adjustment refines a reconstruction so that 3D structure and camera pose and calibration are jointly optimal under a cost on the prediction (reprojection) error. The authors argue that most of the theory already exists in photogrammetry and geodesy. They also argue against common vision claims such as "bundle adjustment is slow", which they attribute to general-purpose optimizers that ignore the problem's sparsity.

## How it works
- **Cost.** The cost is a sum of independent contributions. Ideally it is the negative log likelihood of the total (inlier + outlier) error distribution. Gaussian tails are unrealistically small, so they recommend long-tailed models such as Cauchy or inlier/outlier mixtures.
- **Parametrization.** Steps are taken in well-conditioned local coordinates: quaternions or incremental rotations instead of Euler angles, and homogeneous coordinates for distant points.
- **Sparse Newton.** 3D features couple only to cameras, so the structure block of the Hessian is block diagonal. A Schur complement eliminates it, leaving the reduced camera system of Brown's 1958 method. Alternatively, sparse Cholesky can be used with a good variable ordering. Kalman filtering is framed as only the first half-iteration of a full nonlinear optimization.
- **Gauge and quality control.** The freedom to choose the coordinate frame (7 dof Euclidean, 15 projective) makes covariances frame-dependent. Outlier tests, reliability measures and model selection check the result.

## Results
- Newton methods reach 1e-16 from O(1) in about 5 iterations. Linearly convergent methods need 16, 350 or 3700 iterations at per-step error reductions of 0.9, 0.1 or 0.01.
- On a small ill-conditioned problem, Gauss-Newton takes 11 steps (1.2e6 flops). Resection-intersection takes 71 steps with a line search and 200 without.
- On a synthetic 'strip' (each feature seen in about 3 images), resection-intersection is slower even than dense Cholesky that ignores sparsity. On a well-conditioned 'spherical cloud', all methods converge quickly.

## Limitations
The authors call their recommendations very provisional. The solver comparisons use synthetic problems. Initialization is not covered, and network design gets only rules of thumb. The asymptotic Gaussian covariance may be a poor approximation for small vision problems and weak networks.
