---
title: A New Approach to Linear Filtering and Prediction Problems
arxiv: ''
date: '1960-03-01'
added: '2026-11-05'
authors: Rudolf E. Kalman
venue: Journal of Basic Engineering
doi: 10.1115/1.3662552
pdf: https://www.cs.yale.edu/homes/yry/readings/general/Kalman1960.pdf
website: ''
code: ''
topics:
- foundations
seminal: true
must_read: true
tldr: Recast the Wiener filtering and prediction problem in state-space form, so the optimal estimate comes from a recursive linear filter whose gain is computed step by step from the estimation-error covariance. One derivation covers stationary and nonstationary statistics and growing or infinite memory, and filtering turns out to be the dual of the noise-free optimal regulator problem.
abstract: 'The classical filtering and prediction problem is re-examined using the Bode-Shannon representation of random processes and the "state transition" method of analysis of dynamic systems. New results are: (1) The formulation and methods of solution of the problem apply without modification to stationary and nonstationary statistics and to growing-memory and infinite-memory filters. (2) A nonlinear difference (or differential) equation is derived for the covariance matrix of the optimal estimation error. From the solution of this equation the coefficients of the difference (or differential) equation of the optimal linear filter are obtained without further calculations. (3) The filtering problem is shown to be the dual of the noise-free regulator problem. The new method developed here is applied to two well-known problems, confirming and extending earlier results. The discussion is largely self-contained and proceeds from first principles; basic concepts of the theory of random processes are reviewed in the Appendix.'
thumb:
  image: kalman1960-linear-filtering/thumb.webp
  width: 332
  height: 103
videos: []
youtube: []
figures:
- image: kalman1960-linear-filtering/figure1.webp
  width: 360
  height: 109
  caption: 'From Figure 1: Matrix block diagram of the general linear continuous-dynamic system dx/dt = F(t)x + D(t)u(t), y(t) = M(t)x(t). The integrator stands for n integrators whose outputs are the state variables, fed back through F(t).'
- image: kalman1960-linear-filtering/figure2.webp
  width: 332
  height: 103
  caption: 'From Figure 2: Matrix block diagram of the general linear discrete-dynamic system x(t+1) = Φ(t+1; t)x(t) + Δ(t)u(t), y(t) = M(t)x(t), with a unit delay in place of the integrator. The random-process model and the optimal filter both take this form.'
---
## What they do
Wiener's theory specifies the optimal filter by its impulse response, which is hard to synthesize, poorly suited to machine computation, and needs a new derivation for each generalization. Kalman restates the problem with conditional expectations and a state-transition model of random processes, so one derivation gives the optimal filter as a recursive linear system.

## How it works
- **Estimates as projections.** For Gaussian processes, or linear estimates with quadratic loss, the optimal estimate is the orthogonal projection of the state onto the past observations. Only first and second moments matter.
- **Model.** x(t+1) = Φ(t+1; t)x(t) + u(t), y(t) = M(t)x(t), with independent zero-mean Gaussian u(t) of covariance Q(t). Noise is modelled as extra states, and fewer quantities may be observed than there are states.
- **Recursive filter.** Only the unpredicted part of each measurement adds information: x*(t+1|t) = Φ x*(t|t−1) + Δ*(t)[y(t) − M x*(t|t−1)], with gain Δ* = Φ P* Mᵀ(M P* Mᵀ)⁻¹ and error covariance P*(t+1) = (Φ − Δ*M) P* Φᵀ + Q, started from cov x(t0). This covariance equation replaces the Wiener-Hopf equation.
- **Duality.** Transposing the matrices and reversing time turns these recursions into the author's earlier noise-free optimal regulator.

## Results
- The filter is a feedback loop whose internal error signal is white noise; the author calls this the first rigorous proof that every Wiener filter is realizable by feedback. With constant Φ and M it becomes stationary as t → ∞, the classical Wiener case.
- Signal plus white noise: the gain factor C(t) is near 1 when the noise-to-signal ratio b²/a² ≪ 1 and near 0 when b²/a² ≫ 1.
- Particle with unknown constant velocity, position measured in correlated noise: closed-form covariances, valid also for time-varying noise dynamics. For white noise and many samples the error matches Shinbrot's and Solodovnikov's continuous-data results.

## Limitations
The model (Φ, Q) must be known; identifying it from data is left aside. Dynamics are linear, sources Gaussian, and the derivation covers prediction and filtering but not smoothing. Convergence, stability and the continuous-time form are deferred to later papers, and the two examples are analytic, with no numerical computations.
