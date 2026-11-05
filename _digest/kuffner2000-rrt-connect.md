---
title: 'RRT-Connect: An Efficient Approach to Single-Query Path Planning'
arxiv: ''
date: '2000-04-01'
added: '2026-11-05'
authors: James J. Kuffner Jr., Steven M. LaValle
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ROBOT.2000.844730
pdf: https://www.cs.cmu.edu/afs/cs/academic/class/15494-s12/readings/kuffner_icra2000.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: RRT-Connect grows two Rapidly-exploring Random Trees, one from the start and one from the goal, and greedily extends each toward the other's newest vertex until they meet. It is probabilistically complete, needs no preprocessing, and solves 2D problems in 0.13-1.52 s and a 3D piano-moving problem in 12.5 s on a 270 MHz workstation.
abstract: A simple and efficient randomized algorithm is presented for solving single-query path planning problems in high-dimensional configuration spaces. The method works by incrementally building two Rapidly-exploring Random Trees (RRTs) rooted at the start and the goal configurations. The trees each explore space around them and also advance towards each other through the use of a simple greedy heuristic. Although originally designed to plan motions for a human arm (modeled as a 7-DOF kinematic chain) for the automatic graphic animation of collision-free grasping and manipulation tasks, the algorithm has been successfully applied to a variety of path planning problems. Computed examples include generating collision-free motions for rigid objects in 2D and 3D, and collision-free manipulation motions for a 6-DOF PUMA arm in a 3D workspace. Some basic theoretical analysis is also presented.
thumb:
  image: kuffner2000-rrt-connect/thumb.webp
  width: 740
  height: 699
videos: []
youtube: []
figures:
- image: kuffner2000-rrt-connect/figure1.webp
  width: 706
  height: 280
  caption: 'From Figure 1: Path planning for a 7-DOF human arm. An animated character reaches for, grasps and moves a chess piece; each motion is planned by RRT-Connect.'
- image: kuffner2000-rrt-connect/figure2.webp
  width: 850
  height: 599
  caption: 'From Figure 5: The RRT-Connect algorithm. Each iteration extends one tree toward a random configuration, CONNECTs the other tree to the new vertex by repeating EXTEND until it reaches it or is trapped, then swaps the two trees.'
- image: kuffner2000-rrt-connect/figure3.webp
  width: 740
  height: 699
  caption: 'From Figure 6: Growing two trees towards each other. Trees rooted at the start and the goal of a 2D rigid object spread out and connect; the last panel shows the object moving along the resulting path.'
- image: kuffner2000-rrt-connect/figure4.webp
  width: 742
  height: 779
  caption: 'From Figure 8: Moving a piano. A 3D grand piano model (over 4500 triangles) is planned from one room to another amid walls and low obstacles, which requires several tricky rotations.'
---
## What they do
Randomized potential fields answer single queries fast but get stuck in local minima; probabilistic roadmaps are reliable but built to preprocess an environment for many queries. RRT-Connect handles single queries with no preprocessing and no differential constraints: it grows two Rapidly-exploring Random Trees (RRTs), from the start and the goal, and greedily tries to join them.

## How it works
- **EXTEND.** Step a fixed distance ε from the nearest tree vertex toward a sample and keep the new vertex if collision-free. Vertices with large Voronoi regions are extended most, pulling the tree into unexplored space.
- **CONNECT.** Repeat EXTEND until the target or an obstacle is reached. Unlike a potential field, the target moves as the trees grow instead of staying fixed at the goal.
- **Planner.** Extend one tree toward a random configuration, CONNECT the other tree to the new vertex, swap the trees, repeat until they meet.
- **Analysis.** Proof sketches show tree vertices converge to the sampling distribution, so the planner is probabilistically complete.

## Results
On a 270 MHz SGI O2:
- Three 2D rigid-object problems: 0.13 s, 1.52 s and 1.02 s (100 trials). CONNECT often cuts running time three- or four-fold against other RRT variants in uncluttered scenes, and slightly increases it in very cluttered ones.
- 3D piano between rooms: 12.5 s (100 trials). A 6-DOF Puma moving a book between shelves: each of three queries under 4 s on average.
- 7-DOF human arm playing chess (8,000 triangles): each motion under 2 s on average, enough for interactive play. A narrow-passage hammer task (13,000 triangles): 17 s.

## Limitations
The authors call the experiments preliminary, call for a broad benchmark, and expect uncharacterized pathological cases. The greedy CONNECT pays off mainly in open spaces. No convergence rate is proven. Collision checking was non-incremental, and faster nearest-neighbor search is left to future work.
