---
title: 'Robot Dynamics: Equations and Algorithms'
arxiv: ''
date: '2000-04-01'
added: '2026-11-05'
authors: Roy Featherstone, David E. Orin
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ROBOT.2000.844153
pdf: https://users.cecs.anu.edu.au/~roy/papers/icra00.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: A review of rigid-body robot dynamics that writes inverse dynamics (RNEA), the joint-space inertia matrix (CRBA) and forward dynamics (ABA) for tree-structured robots in one spatial-vector notation, then extends them to closed kinematic loops. It traces the move from O(N^4) Lagrangian methods to O(N) recursive algorithms; the ABA needs fewer operations than the CRBA once N > 9.
abstract: This paper reviews some of the accomplishments in the field of robot dynamics research, from the development of the recursive Newton-Euler algorithm to the present day. Equations and algorithms are given for the most important dynamics computations, expressed in a common notation to facilitate their presentation and comparison.
thumb:
  image: featherstone2000-robot-dynamics/thumb.webp
  width: 364
  height: 202
videos: []
youtube: []
figures: []
---
## What they do
A review of robot dynamics from the recursive Newton-Euler algorithm up to 2000. It covers inverse dynamics (torques from a trajectory, for feedforward control), forward dynamics (accelerations from torques, for simulation) and the joint-space inertia matrix. Everything is written in one spatial-vector notation and applies to any tree-structured mechanism.

## How it works
- **Spatial notation.** Velocities, accelerations and forces are 6-vectors with linear and angular parts; inertias are 6x6 matrices. Link i hangs from parent λ(i) < i through a joint with motion subspace h_i.
- **RNEA (inverse dynamics).** An outward pass computes link velocities and accelerations; an inward pass sums each link's Newton-Euler force into joint forces, and τ_i = h_iᵀ f_i. Gravity enters as a fictitious base acceleration of -g.
- **CRBA (inertia matrix).** At zero velocity, a unit acceleration at joint i moves the subtree beyond it as one composite rigid body while the rest stays in static equilibrium. Summing composite inertias from the tips fills in column i of M.
- **ABA (forward dynamics) and closed loops.** Each subtree's articulated-body inertia makes force linear in its root link's acceleration. A tip-to-base pass computes these, a base-to-tip pass solves for joint accelerations. Closed loops use a spanning tree plus Lagrange-multiplier loop-closure forces.

## Results
- Lagrangian algorithms were O(N^4). The RNEA is O(N), and later versions run up to 1.7x faster than early ones on a 6-DoF robot.
- The CRBA is O(N^3) but cheap for small N. The ABA needs fewer arithmetic operations once N > 9, and the ABA is also more accurate (Ascher et al.).
- Closed loops can be solved three ways: the full system in O((n+nc)^3), via Lagrange multipliers in O(n nc^2 + nc^3), or by eliminating constraint forces, which can be fastest when n - nc is small.
- An unbranched chain can be solved in O(log N) time on O(N) parallel processors.

## Limitations
The review covers rigid bodies only; flexible links get one paragraph. Closed loops are only sketched and assume scleronomic constraints; in practice they also need constraint stabilization. Symbolic equation generation, parallel algorithms and specific applications are mentioned but not covered, and the reference list is not complete.
