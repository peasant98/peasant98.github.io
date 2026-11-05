---
title: Finding Locally Optimal, Collision-Free Trajectories with Sequential Convex Optimization
arxiv: ''
date: '2013-06-01'
added: '2026-11-05'
authors: John Schulman, Jonathan Ho, Alex Lee, Ibrahim Awwal, Henry Bradlow, Pieter Abbeel
venue: 'Robotics: Science and Systems (RSS)'
doi: 10.15607/RSS.2013.IX.031
pdf: https://www.roboticsproceedings.org/rss09/p31.pdf
website: http://rll.berkeley.edu/trajopt/rss
code: http://rll.berkeley.edu/trajopt
topics:
- foundations
- planning-control
seminal: true
tldr: Trajopt plans robot motion by sequential convex optimization, penalizing collisions through signed distances to the volume a link sweeps between waypoints, so paths are safe in continuous time. With four initializations it solved 99% of 198 PR2 arm problems in 0.32 s on average, against 97% in 1.2 s for OMPL's RRTConnect and 85% in 6.0 s for CHOMP.
abstract: 'We present a novel approach for incorporating collision avoidance into trajectory optimization as a method of solving robotic motion planning problems. At the core of our approach are (i) A sequential convex optimization procedure, which penalizes collisions with a hinge loss and increases the penalty coefficients in an outer loop as necessary. (ii) An efficient formulation of the no-collisions constraint that directly considers continuous-time safety and enables the algorithm to reliably solve motion planning problems, including problems involving thin and complex obstacles. We benchmarked our algorithm against several other motion planning algorithms, solving a suite of 7-degree-of-freedom (DOF) arm-planning problems and 18-DOF full-body planning problems. We compared against sampling-based planners from OMPL, and we also compared to CHOMP, a leading approach for trajectory optimization. Our algorithm was faster than the alternatives, solved more problems, and yielded higher quality paths. Experimental evaluation on the following additional problem types also confirmed the speed and effectiveness of our approach: (i) Planning foot placements with 34 degrees of freedom (28 joints + 6 DOF pose) of the Atlas humanoid robot as it maintains static stability and has to negotiate environmental constraints. (ii) Industrial box picking. (iii) Real-world motion planning for the PR2 that requires considering all degrees of freedom at the same time.'
thumb:
  image: schulman2013-trajopt/thumb.webp
  width: 582
  height: 550
videos: []
youtube:
- w1abP9vBUEU
- u4ajHBTK7Ek
figures:
- image: schulman2013-trajopt/figure1.webp
  width: 582
  height: 550
  caption: 'From Figure 1: Problems the method was used on: a PR2 arm trajectory in a simulated benchmark (top left), the PR2 opening a door with a full-body motion (top right), an industrial robot picking boxes under an end-effector orientation constraint (bottom left), and the Atlas humanoid model ducking under an obstacle while staying statically stable (bottom right).'
- image: schulman2013-trajopt/figure2.webp
  width: 471
  height: 306
  caption: 'From Figure 4: The volume link A sweeps between timesteps t and t+1, taken as the convex hull of its two poses, which the continuous-time collision cost keeps away from obstacle B.'
- image: schulman2013-trajopt/figure3.webp
  width: 1280
  height: 472
  caption: 'From Figure 6: Benchmark scenes. Left and center: two of the arm-planning scenes. Right: the path the planner found for an 18-DOF full-body problem.'
---
## What they do
Trajopt treats motion planning as trajectory optimization from scratch. It starts from a trajectory that may pass deep through obstacles and optimizes it into a collision-free, locally optimal path. Collisions are measured as signed distances between convex shapes. Continuous-time safety comes from checking the volume each link sweeps between waypoints.

## How it works
- **Sequential convex optimization.** Each step solves a QP approximation of the problem inside a trust region. Constraints become ℓ1 penalties (a hinge for inequalities, an absolute value for equalities), and an outer loop raises the penalty coefficient until every constraint holds. The objective is the sum of squared displacements between waypoints.
- **Collision penalty.** Every object pair closer than d_check pays |d_safe − sd|+. The signed distance comes from GJK and EPA in Bullet and is linearized through the robot Jacobian at the closest points.
- **Swept volumes.** Distances are computed to the convex hull of a link's poses at t and t+1, using support mappings so the hull is never built. Narrow-phase checking takes about twice as long, but thin obstacles are handled with few waypoints (11 for the arm, 41 for full-body).

## Results
- 198 PR2 arm problems (7 DOF): Trajopt-Multi solves 99% in 0.32 s on average and single-start Trajopt 84% in 0.20 s. RRTConnect solves 97% in 1.2 s, LBKPIECE 96% in 3.1 s and CHOMP-Multi 85% in 6.0 s. Normalized path length is 1.2, against 1.6-2.6 for the others.
- 96 full-body problems (18 DOF): Trajopt-multi solves 84% in 7.6 s; the OMPL planners solve 50-53% in about 18 s.
- It also plans statically stable steps for a 34-DOF Atlas model and box-picking motions, typically in 30-50 ms. On a real PR2, using SLAM maps, it completed three full-body tasks.

## Limitations
This is a local method. From a straight-line start it fails 16% of arm and 37% of full-body problems, so it needs several initializations. The swept-volume gradient is exact only to first order in non-degenerate 2D cases. The rotation correction is ignored (it stayed under 1 cm in their problems), and self-collisions are checked only at the waypoints. Only kinematic problems are tested.
