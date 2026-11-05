---
title: Probabilistic Roadmaps for Path Planning in High-Dimensional Configuration Spaces
arxiv: ''
date: '1996-08-01'
added: '2026-11-05'
authors: Lydia E. Kavraki, Petr Švestka, Jean-Claude Latombe, Mark H. Overmars
venue: IEEE Transactions on Robotics and Automation
doi: 10.1109/70.508439
pdf: https://www.cs.cmu.edu/~motionplanning/papers/sbp_papers/PRM/prmbasic_01.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
must_read: true
tldr: The paper builds a roadmap once, from random collision-free configurations joined by a fast local planner, and answers each start-goal query by connecting both ends to it and searching the graph. For 7-dof planar robots among narrow passages, 60 s (fixed base) or 70 s (free base) of learning connects all eight hard test configurations in all 30 roadmaps, and a query then takes a fraction of a second.
abstract: 'A new motion planning method for robots in static workspaces is presented. This method proceeds in two phases: a learning phase and a query phase. In the learning phase, a probabilistic roadmap is constructed and stored as a graph whose nodes correspond to collision-free configurations and whose edges correspond to feasible paths between these configurations. These paths are computed using a simple and fast local planner. In the query phase, any given start and goal configurations of the robot are connected to two nodes of the roadmap; the roadmap is then searched for a path joining these two nodes. The method is general and easy to implement. It can be applied to virtually any type of holonomic robot. It requires selecting certain parameters (e.g., the duration of the learning phase) whose values depend on the scene, that is the robot and its workspace. But these values turn out to be relatively easy to choose. Increased efficiency can also be achieved by tailoring some components of the method (e.g., the local planner) to the considered robots. In this paper the method is applied to planar articulated robots with many degrees of freedom. Experimental results show that path planning can be done in a fraction of a second on a contemporary workstation (≈ 150 MIPS), after learning for relatively short periods of time (a few dozen seconds).'
thumb:
  image: kavraki1996-prm/thumb.webp
  width: 257
  height: 206
videos: []
youtube: []
figures:
- image: kavraki1996-prm/figure1.webp
  width: 355
  height: 220
  caption: 'From Figure 2: Scene 1, a fixed-base planar robot with 7 revolute joints among obstacles with several narrow gates, shown in the eight hand-picked test configurations C1 to C8.'
- image: kavraki1996-prm/figure2.webp
  width: 355
  height: 214
  caption: 'From Figure 6: Scene 2, a free-base robot with 5 revolute joints (7 dof), shown in its eight test configurations C1 to C8.'
- image: kavraki1996-prm/figure3.webp
  width: 257
  height: 206
  caption: 'From Figure 9: The general implementation solving a query for a 4-dof robot with three revolute joints and one prismatic joint. Configurations along the path are drawn in grey levels, from the start (dark grey) to the goal (white).'
- image: kavraki1996-prm/figure4.webp
  width: 258
  height: 180
  caption: 'From Figure 10: The general implementation solving a query for a 5-revolute-joint robot in a workspace with narrow areas, from the start (dark grey) to the goal (white).'
---
## What they do
Robots with five or more dof are hard to plan for: complete planners are too expensive, and potential-field planners such as the Randomized Path Planner (RPP) get stuck in local minima behind narrow passages. PRM splits planning into a learning phase that captures the free configuration space as a graph, and a query phase that answers many queries on it.

## How it works
- **Construction.** Sample each dof uniformly, keep collision-free samples, and connect each new node, nearest first, to up to about 30 nearby nodes in other components with a fast deterministic local planner, whose paths are recomputed rather than stored.
- **Expansion.** Nodes the local planner often failed to connect likely lie in difficult regions; they are picked in proportion to their failure ratio and grown with short random-bounce walks. A 2:1 split of construction to expansion time worked well.
- **Query.** Connect start and goal to the roadmap with the local planner (random-bounce walks as a fallback), search the graph, and concatenate local paths.
- **Customized version for planar arms.** A local planner that moves odd joints along workspace lines, and constant-time collision checks against a precomputed C-space bitmap per link.

## Results
Success is the rate of connecting hand-picked hard configurations to 30 independent roadmaps within 2.5 s.
- 7-dof fixed-base arm: all eight connect in every roadmap after 60 s of learning; at 20 s some reach only 36.7%, or 10% without expansion.
- 7-dof free-base robot: 70 s with expansion reaches 100%; without, most configurations stay at 90%.
- Connecting a configuration takes tens to a few thousand collision checks, 2-3 orders of magnitude fewer than learning. RPP needs a few tens of minutes on the first scene.
- The general (uncustomized) planner solves the 4-dof scene in all 30 cases after 7.5 s, but needs about 25 minutes on the 7-dof scene.

## Limitations
The roadmap is never guaranteed to capture free-space connectivity, and learning time is tuned per scene. For one-off queries, RPP is often faster once learning is counted. Experiments are planar and static only; bitmap collision checking would need 6-D bitmaps in 3-D.
