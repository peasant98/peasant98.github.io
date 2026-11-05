---
title: Planning Optimal Grasps
arxiv: ''
date: '1992-05-01'
added: '2026-11-05'
authors: Carlo Ferrari, John Canny
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ROBOT.1992.219918
pdf: https://www.research.unipd.it/bitstream/11577/2532028/1/PlanningOptimal.pdf
website: ''
code: ''
topics:
- foundations
- grasping
seminal: true
tldr: Two grasp quality measures, one bounding the largest finger force and one bounding the total finger force, each equal to the radius of the largest origin-centred ball inside a convex hull of contact wrenches. They lead to a grasp planner for polygons held by two- and three-jaw grippers that runs in O(n) for n edges in the two-jaw case.
abstract: In this paper we will address the problem of planning optimal grasps. Two general optimality criteria, that consider the total finger force and the maximum finger force will be introduced and discussed. Moreover their formalization, using various metrics on a space of generalized forces, will be detailed. The geometric interpretation of the two criteria will lead to an efficient planning algorithm. An example of its use in a robotic environment equipped with two-jaw and three-jaw grippers will also be shown.
thumb:
  image: ferrari1992-optimal-grasps/thumb.webp
  width: 620
  height: 285
videos: []
youtube: []
figures:
- image: ferrari1992-optimal-grasps/figure1.webp
  width: 620
  height: 783
  caption: 'From Figure 1: a triangle held by a three-jaw gripper (a), the primitive wrenches of its three contacts (b), the wrenches each contact can produce (c), and the wrench sets for the max-force and total-force criteria with the largest inscribed sphere (d, e).'
- image: ferrari1992-optimal-grasps/figure2.webp
  width: 513
  height: 411
  caption: 'From Figure 2: a three-jaw gripper grasping a polygonal object, with one side flat against the base jaw.'
---
## What they do
Force closure says only whether a grasp can resist every external wrench. Ferrari and Canny make it quantitative: a good grasp resists every wrench without large finger forces. They define two quality criteria from finger-actuator limits, read both geometrically in wrench space, and use that to plan grasps for two- and three-jaw grippers.

## How it works
- **Contacts as wrenches.** Hard-finger point contacts with Coulomb friction. Each contact contributes the primitive wrenches along its friction-cone edges; an edge contact counts as two point contacts at its ends.
- **Quality Q.** For each wrench direction, take the largest resisted wrench per unit of applied finger force, then the worst direction. Q is the radius of the largest origin-centred sphere inside the set of wrenches reachable with unit finger force.
- **Two norms on finger force.** Bounding each finger force independently (L-infinity) gives the convex hull of the Minkowski sum of the contacts' primitive wrenches. Bounding the sum of forces (L1, proportional to total motor current) gives the convex hull of their union. Q is the distance from the origin to the nearest hull facet.
- **Planner.** For each polygon side placed flat on a jaw, find the opposing vertex or side (for three jaws, by comparing edge orientations with the finger triangle), build the hull and score it; keep the best.

## Results
- The L1 wrench set is contained in the L-infinity one, so the L-infinity quality is never smaller, but a grasp that is optimal under one criterion can be non-optimal under the other.
- The two-jaw planner is O(n) in the number of polygon edges, since each hull is built from a constant number of wrenches.
- Figure 1 works both criteria through for a triangle; no experiments or run times are reported.

## Limitations
Implemented only for planar objects. Candidate grasps are finite only because edges are assumed comparable to the finger width; the infinite case is left open. The force-torque weighting in the wrench norm is arbitrary, and contact compliance is not modelled.
