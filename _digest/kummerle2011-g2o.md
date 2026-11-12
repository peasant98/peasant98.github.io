---
title: 'g2o: A General Framework for Graph Optimization'
arxiv: ''
date: '2011-05-01'
added: '2026-11-05'
authors: Rainer Kümmerle, Giorgio Grisetti, Hauke Strasdat, Kurt Konolige, Wolfram Burgard
pis: [Wolfram Burgard]
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ICRA.2011.5979949
pdf: http://ais.informatik.uni-freiburg.de/publications/papers/kuemmerle11icra.pdf
website: ''
code: ''
topics:
- foundations
- 3d-perception
seminal: true
tldr: An open-source C++ framework that optimizes any least-squares problem that can be written as a graph, such as 2D/3D SLAM and bundle adjustment, once the user defines an error function and an update operator. On ten datasets it is faster per iteration than √SAM on every SLAM dataset, on par with problem-specific solvers elsewhere, and about twice as fast as RobotVision.
abstract: 'Many popular problems in robotics and computer vision including various types of simultaneous localization and mapping (SLAM) or bundle adjustment (BA) can be phrased as least squares optimization of an error function that can be represented by a graph. This paper describes the general structure of such problems and presents g2o, an open-source C++ framework for optimizing graph-based nonlinear error functions. Our system has been designed to be easily extensible to a wide range of problems and a new problem typically can be specified in a few lines of code. The current implementation provides solutions to several variants of SLAM and BA. We provide evaluations on a wide range of real-world and simulated datasets. The results demonstrate that while being general g2o offers a performance comparable to implementations of state-of-the-art approaches for the specific problems.'
thumb:
  image: kummerle2011-g2o/thumb.webp
  width: 672
  height: 772
videos: []
youtube: []
figures:
- image: kummerle2011-g2o/figure1.webp
  width: 672
  height: 772
  caption: 'From Figure 1: Victoria Park 2D landmark SLAM (top) and a 3D pose graph of a multi-level parking garage (middle), before (left) and after (right) optimization; bottom, full and zoomed views of the optimized Venice bundle adjustment dataset (871 camera poses, 2,838,740 projections).'
- image: kummerle2011-g2o/figure2.webp
  width: 698
  height: 424
  caption: 'From Figure 3: Overview of the framework. For a new problem only the gray boxes (error function and increment operator) need to be specified; the linear solver is interchangeable.'
- image: kummerle2011-g2o/figure3.webp
  width: 639
  height: 215
  caption: 'From Figure 7: Time per iteration of √SAM, g2o, SPA/sSBA and RobotVision on the 2D datasets (left) and the 3D pose-graph, scale-drift and bundle adjustment datasets (right).'
---
## What they do
Graph-based SLAM and bundle adjustment both minimize a sum of squared errors in which each term links two state variables. That makes the problem a graph: nodes are poses or landmarks, edges are measurements with an information matrix. g2o is an open-source C++ back-end that optimizes any such graph. The user defines an edge's error function and how an increment is applied to a node; a 2D SLAM problem takes fewer than 30 lines of code.

## How it works
- **Least squares on the graph.** Gauss-Newton or Levenberg-Marquardt linearize every error term and sum the per-edge blocks into a sparse system whose block pattern is the graph's adjacency matrix, then solve and iterate.
- **Manifold increments.** States such as rotations stay over-parameterized (quaternions, rotation matrices), while increments use a minimal local representation applied through a user-defined ⊞ operator, which keeps them away from singularities.
- **Exploiting structure.** In BA and landmark SLAM the landmark block of the system is block-diagonal, so landmarks can be eliminated with the Schur complement. Fixed-size blocks, Eigen's SSE code and a reused symbolic Cholesky factorization speed up the rest.
- **Pluggable solvers.** Sparse Cholesky (CHOLMOD, CSparse) or PCG with a block-Jacobi preconditioner.

## Results
Ten datasets (2D/3D pose graphs, landmark SLAM, BA with up to 2.8M projections), run on one core of an i7-930.
- Faster per iteration than √SAM on all 2D and 3D datasets, comparable to SPA on 2D pose graphs, slightly slower than sSBA on BA, and on average 2x faster than RobotVision.
- Schur elimination cuts Venice from 33.87 s to 13.03 s per iteration, but slows Victoria Park, where poses outnumber landmarks, from 0.026 s to 0.150 s.
- PCG is about 7x faster than CHOLMOD on New College and Venice but far slower on MIT (0.381 s vs 0.0086 s). Analytic Jacobians halve a Garage iteration from 80 ms to 40 ms, with no accuracy loss observed for numeric ones.

## Limitations
g2o is a batch optimizer that assumes a good initial guess; incremental use means re-optimizing every 10 nodes or loosening the PCG termination. No solver or elimination choice wins everywhere, so the user must pick per problem, and the problem-specific sSBA remains slightly faster on BA.
