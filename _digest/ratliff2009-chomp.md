---
title: 'CHOMP: Gradient Optimization Techniques for Efficient Motion Planning'
arxiv: ''
date: '2009-05-01'
added: '2026-11-05'
authors: Nathan Ratliff, Matt Zucker, J. Andrew Bagnell, Siddhartha Srinivasa
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ROBOT.2009.5152817
pdf: https://www.ri.cmu.edu/pub_files/2009/5/icra09-chomp.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: CHOMP plans by optimizing the trajectory directly, using a covariant gradient step that keeps it smooth while pushing it out of obstacles, starting from a straight line that may pass through obstacles. Without a separate planner it found collision-free paths for 99 of 105 household problems on a WAM arm, and it is the footstep controller for the LittleDog quadruped.
abstract: 'Existing high-dimensional motion planning algorithms are simultaneously overpowered and underpowered. In domains sparsely populated by obstacles, the heuristics used by sampling-based planners to navigate "narrow passages" can be needlessly complex; furthermore, additional post-processing is required to remove the jerky or extraneous motions from the paths that such planners generate. In this paper, we present CHOMP, a novel method for continuous path refinement that uses covariant gradient techniques to improve the quality of sampled trajectories. Our optimization technique converges over a wider range of input paths and is able to optimize higher-order dynamics of trajectories than previous path optimization strategies. As a result, CHOMP can be used as a standalone motion planner in many real-world planning queries. The effectiveness of our proposed method is demonstrated in manipulation planning for a 6-DOF robotic arm as well as in trajectory generation for a walking quadruped robot.'
thumb:
  image: ratliff2009-chomp/thumb.webp
  width: 620
  height: 297
videos: []
youtube: []
figures:
- image: ratliff2009-chomp/figure1.webp
  width: 620
  height: 297
  caption: 'From Figure 1: The two test platforms, the Boston Dynamics LittleDog quadruped (left) and the Barrett WAM arm (right).'
- image: ratliff2009-chomp/figure2.webp
  width: 665
  height: 217
  caption: 'From Figure 3: Left, a 2D trajectory passing through an obstacle potential (red is high cost, blue low), with the gradient at each waypoint drawn as a green arrow. Right, the continuous functional gradient (red) and the Euclidean gradient of the discretized trajectory at each waypoint (blue).'
- image: ratliff2009-chomp/figure3.webp
  width: 1362
  height: 326
  caption: 'From Figure 6: The initial straight-line trajectory through configuration space (left), the final trajectory after optimization (middle), and the 15 end configurations used to build the 105 planning problems (right).'
- image: ratliff2009-chomp/figure4.webp
  width: 1414
  height: 257
  caption: 'From Figure 7: LittleDog on a Jersey barrier and on steps. Stepping over the barrier, the initial trajectory puts the swing leg''s shin and knee in collision (third panel); after 75 gradient steps it is smooth and collision-free, with the trunk tipping forward for clearance (right).'
---
## What they do
Sampling-based planners such as PRM and RRT find a feasible path, then need a separate smoothing step. CHOMP (Covariant Hamiltonian Optimization for Motion Planning) optimizes the trajectory directly for smoothness and obstacle clearance. Unlike elastic bands and similar path optimizers, it does not need a collision-free starting path, so it can turn a straight line in configuration space into an executable trajectory with no separate planner.

## How it works
- **Objective.** The trajectory is a fixed set of waypoints. Its cost is a smoothness prior (sums of squared finite-difference derivatives, a quadratic form with matrix A) plus an obstacle cost.
- **Covariant update.** Each step is ξ ← ξ − (1/λ) A⁻¹ g. Multiplying the gradient by A⁻¹ spreads a local obstacle push smoothly over the whole trajectory. Near a local optimum, the authors expect this to converge about O(n) times faster than plain gradient descent.
- **Obstacles.** A precomputed signed distance field gives distances and gradients everywhere, even inside obstacles. The robot is reduced to spheres and capsules, or to points along each link. To handle thin household obstacles, terms past the first collision along the arm are ignored.
- **Joint limits.** Violations are removed by a smooth projection: the usual correction is passed through A⁻¹ and then scaled.

## Results
- WAM arm (6 of 7 joints planned): 105 problems built from all pairs of 15 household configurations. CHOMP found collision-free trajectories for 99. 400 iterations took about 12 s in Matlab, with most progress in the first 100 (about 3 s).
- When CHOMP succeeded, a straight-line start ended about 0.5 lower in log-objective than a start from a bi-directional RRT solution (the scale ran roughly 17 to 24). Euclidean gradient descent (A = I) could not pull trajectories free of obstacles.
- LittleDog: CHOMP alternately optimizes the trunk and swing-leg trajectories for each footstep. It almost always reaches a collision-free trajectory, even from initial trajectories with many collisions.

## Limitations
The fixed discretization fixes the trajectory's duration in advance. CHOMP is a local optimizer: a poor RRT start leads it to a worse local minimum, and even the Hamiltonian Monte Carlo variant gets stuck on harder problems under time limits. On LittleDog, optimization can take about 1.5 times as long as execution, so trajectories are computed before execution.
