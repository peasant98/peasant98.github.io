---
title: 'Rapidly-Exploring Random Trees: A New Tool for Path Planning'
arxiv: ''
date: '1998-10-01'
added: '2026-11-05'
authors: Steven M. LaValle
venue: Technical Report TR 98-11, Iowa State University
doi: ''
pdf: http://msl.cs.illinois.edu/~lavalle/papers/Lav98c.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
must_read: true
tldr: A search tree that grows by sampling a random state and steering the nearest vertex a small step toward it, so two states never have to be joined exactly and nonholonomic and kinodynamic systems can be planned for directly. In 2D convex spaces its paths are on average 1.3 to 2.0 times the optimal length, and the report applies it to problems of up to twelve degrees of freedom.
abstract: 'We introduce the concept of a Rapidly-exploring Random Tree (RRT) as a randomized data structure that is designed for a broad class of path planning problems. While they share many of the beneficial properties of existing randomized planning techniques, RRTs are specifically designed to handle nonholonomic constraints (including dynamics) and high degrees of freedom. An RRT is iteratively expanded by applying control inputs that drive the system slightly toward randomly-selected points, as opposed to requiring point-to-point convergence, as in the probabilistic roadmap approach. Several desirable properties and a basic implementation of RRTs are discussed. To date, we have successfully applied RRTs to holonomic, nonholonomic, and kinodynamic planning problems of up to twelve degrees of freedom.'
thumb:
  image: lavalle1998-rrt/thumb.webp
  width: 388
  height: 384
videos: []
youtube: []
figures:
- image: lavalle1998-rrt/figure1.webp
  width: 388
  height: 384
  caption: 'From Figure 1: A 2D projection of a 5D RRT for a kinodynamic car, with the computed trajectory for the car drawn through the tree.'
- image: lavalle1998-rrt/figure2.webp
  width: 381
  height: 122
  caption: 'From the unnumbered figure in Section 3: Three stages of an RRT grown from (50, 50) in the square [0, 100] x [0, 100] with a holonomic model and a time step of 1. It first reaches out toward the four corners, then fills in the space between.'
- image: lavalle1998-rrt/figure3.webp
  width: 386
  height: 380
  caption: 'From the unnumbered figure in Section 4: RRTs projected into the plane with computed paths for a 2D rigid body. Upper left: a tightly constrained 3D holonomic problem. Upper right: a car that can only drive forward and turn right. Lower left: an uncontrollable car that only drives forward and turns left in three increments, in clutter. Lower right: the 5-DOF dynamical car of Figure 1 in a cluttered environment.'
---
## What they do
Probabilistic roadmaps need a local planner that connects pairs of configurations, often thousands of them. For nonholonomic and dynamical systems each connection can be as hard as designing a nonlinear controller. The Rapidly-exploring Random Tree (RRT) never connects two given states. It only applies a control input from a vertex already in the tree, so it works directly in state space, including configuration plus velocity for kinodynamic planning.

## How it works
- **Model.** Constraints are written as ẋ = f(x, u). A new state comes from integrating f over a fixed Δt (Euler, or preferably Runge-Kutta). Obstacles are known only through a check of whether a state is in collision.
- **Growth step.** Each iteration samples a random state x_rand, finds the nearest vertex under a metric, chooses the input that brings it closest to x_rand while staying collision-free, and adds the new state and the edge, labelled with that input.
- **Voronoi bias.** Frontier vertices have the largest Voronoi regions, so samples usually land nearest to them and the tree is pulled into unexplored space. A naive random tree or a random walk stays near the start.
- **Properties.** The vertices approach the sampling distribution. The tree is probabilistically complete under fairly general conditions, stays connected with the fewest edges and needs only single nearest-neighbor queries.

## Results
- Holonomic planning in a 2D square: in several convex-space experiments, tree paths to the root averaged 1.3 to 2.0 times the optimal length. Uniformity of the vertices passed repeated Chi-square tests.
- Examples: a tightly constrained 3D holonomic problem, a forward-and-right-only car, an uncontrollable car in clutter, and a 5-DOF dynamical car. The report also cites hovercraft and satellite problems up to a 3D rigid body with dynamics (a 12D state space).
- Preliminary experiments suggest RRTs may beat a basic probabilistic roadmap on holonomic problems, but no timed comparison is given.

## Limitations
There are no convergence-rate or solution-quality bounds. The ideal metric is as hard to compute as the planning problem itself, so simple metrics are used, and convergence may be slower in nonconvex or nonholonomic spaces. Paths are jagged and the implementation ignores efficiency. Fast nearest-neighbor search, goal biasing and two-tree planners are left open.
