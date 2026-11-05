---
title: A New Extension of the Kalman Filter to Nonlinear Systems
arxiv: ''
date: '1997-07-01'
added: '2026-11-05'
authors: Simon J. Julier, Jeffrey K. Uhlmann
venue: Proc. SPIE 3068, Signal Processing, Sensor Fusion, and Target Recognition VI
doi: 10.1117/12.280797
pdf: https://people.eecs.berkeley.edu/~pabbeel/cs287-fa13/optreadings/JulierUhlmann-UKF.pdf
website: ''
code: ''
topics:
- foundations
seminal: true
tldr: The unscented filter passes 2n+1 deterministically chosen sigma points through the nonlinear models instead of linearising them, which gives a mean accurate to second order without any Jacobians. In a simulated radar reentry-tracking problem it predicts its own error accurately, while the EKF's position covariance is over a hundred times smaller than its actual peak error.
abstract: 'The Kalman filter(KF) is one of the most widely used methods for tracking and estimation due to its simplicity, optimality, tractability and robustness. However, the application of the KF to nonlinear systems can be difficult. The most common approach is to use the Extended Kalman Filter (EKF) which simply linearises all nonlinear models so that the traditional linear Kalman filter can be applied. Although the EKF (in its many forms) is a widely used filtering strategy, over thirty years of experience with it has led to a general consensus within the tracking and control community that it is difficult to implement, difficult to tune, and only reliable for systems which are almost linear on the time scale of the update intervals. In this paper a new linear estimator is developed and demonstrated. Using the principle that a set of discretely sampled points can be used to parameterise mean and covariance, the estimator yields performance equivalent to the KF for linear systems yet generalises elegantly to nonlinear systems without the linearisation steps required by the EKF. We show analytically that the expected performance of the new approach is superior to that of the EKF and, in fact, is directly comparable to that of the second order Gauss filter. The method is not restricted to assuming that the distributions of noise sources are Gaussian. We argue that the ease of implementation and more accurate estimation features of the new filter recommend its use over the EKF in virtually all applications.'
thumb:
  image: julier1997-unscented-filter/thumb.webp
  width: 393
  height: 188
videos: []
youtube: []
figures:
- image: julier1997-unscented-filter/figure1.webp
  width: 393
  height: 242
  caption: 'From Figure 2: The principle of the unscented transform. A small set of sigma points with the right mean and covariance is passed through the nonlinear transformation, and the statistics of the transformed points give the new mean and covariance.'
- image: julier1997-unscented-filter/figure2.webp
  width: 748
  height: 665
  caption: 'From Box 3.1: The prediction step of the unscented filter. Sigma points of the noise-augmented state go through the process model and then the observation model, giving the predicted state and covariance, the predicted observation, the innovation covariance and the cross-correlation.'
- image: julier1997-unscented-filter/figure3.webp
  width: 393
  height: 339
  caption: 'From Figure 3: Converting a sonar range and bearing reading (15 degree bearing error) to Cartesian coordinates. The unscented mean lies on top of the true mean, while linearisation puts the mean at 1 m (circle) with an ellipse that is too short in the range direction.'
- image: julier1997-unscented-filter/figure4.webp
  width: 786
  height: 363
  caption: 'From Figure 5: Reentry tracking over 100 Monte Carlo runs for position x1, velocity x3 and the drag parameter x5. The EKF''s actual mean squared error (solid) sits far above its estimated covariance, while the unscented filter''s error (dashed) and estimated covariance (dot-dashed) stay close together.'
---
## What they do
The extended Kalman filter (EKF) linearises the process and observation models so that the linear Kalman filter equations apply. The authors point out two drawbacks: linearisation can make the filter unstable when local linearity is violated, and the Jacobians are hard to derive. The Kalman update only needs the predicted mean and covariance of the state and the observation. So the paper reduces nonlinear filtering to one question: how to pass a mean and covariance through a nonlinear function. Their answer is the unscented transformation, and the filter built on it is the unscented filter.

## How it works
- **Sigma points.** An n-dimensional variable is replaced by 2n+1 weighted points: the mean, plus and minus the columns of a matrix square root of (n+κ)P. Each point goes through the function. The weighted mean and the weighted outer products of the results give the new mean and covariance. The points are chosen by a fixed rule, not drawn at random.
- **Accuracy.** Mean and covariance are correct to second order, so the mean is more accurate than the EKF's and the covariance just as accurate, with no Jacobians or Hessians. Any square root works, e.g. Cholesky. κ tunes higher-order moments; n+κ=3 is the suggested heuristic for Gaussians.
- **Filter.** The state is augmented with the process noise, so noise enters at the same order of accuracy as state uncertainty. The propagated points give every quantity the standard Kalman update needs.

## Results
- Sonar polar-to-Cartesian conversion (2 cm range and 15° bearing standard deviation), checked against 3.5×10^6 Monte Carlo samples: linearisation puts the range at 1 m instead of 96.7 cm, an error over 1.5 range standard deviations, and underestimates the covariance. The unscented mean coincides with the true mean on the plot.
- Reentry tracking with a 5-state model, a 10 Hz range-bearing radar and 100 Monte Carlo runs: the unscented filter's estimated variance closely matches its actual mean squared error.
- The EKF peaks at 0.4 km² position error while estimating a covariance over a hundred times smaller. Its drag-parameter estimate is highly biased, and the bias decreases only slowly.

## Limitations
The paper covers one form of the transform under one set of assumptions; matching moments up to fourth order is left to a companion paper. A negative κ can give a covariance that is not positive semidefinite, which requires a modified form. Augmenting the state with noise adds sigma points. The comparison is a single simulated example.
