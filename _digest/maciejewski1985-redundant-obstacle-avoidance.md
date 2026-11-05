---
title: Obstacle Avoidance for Kinematically Redundant Manipulators in Dynamically Varying Environments
arxiv: ''
date: '1985-09-01'
added: '2026-11-05'
authors: Anthony A. Maciejewski, Charles A. Klein
venue: The International Journal of Robotics Research
doi: 10.1177/027836498500400308
pdf: https://dspace.library.colostate.edu/bitstream/10217/536/1/ECEaam00001_permission.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: Keep a redundant arm's end-effector exactly on its commanded trajectory and use the Jacobian's null space to push the link point closest to an obstacle away from it. In simulation a 9-DoF arm spray-painting through a car-door window runs at a 102 ms control cycle.
abstract: 'The vast majority of work to date concerned with obstacle avoidance for manipulators has dealt with task descriptions in the form of pick-and-place movements. The added flexibility in motion control for manipulators possessing redundant degrees of freedom permits the consideration of obstacle avoidance in the context of a specified end-effector trajectory as the task description. Such a task definition is a more accurate model for such tasks as spray painting or arc welding. The approach presented here is to determine the required joint angle rates for the manipulator under the constraints of multiple goals, the primary goal described by the specified end-effector trajectory and secondary goals describing the obstacle avoidance criteria. The decomposition of the solution into a particular and a homogeneous component effectively illustrates the priority of the multiple goals that is exact end-effector control with redundant degrees of freedom maximizing the distance to obstacles. An efficient numerical implementation of the technique permits sufficiently fast cycle times to deal with dynamic environments.'
thumb:
  image: maciejewski1985-redundant-obstacle-avoidance/thumb.webp
  width: 960
  height: 786
videos: []
youtube: []
figures:
- image: maciejewski1985-redundant-obstacle-avoidance/figure1.webp
  width: 1002
  height: 983
  caption: 'From Figure 1: A planar arm with the primary goal, a velocity for the end-effector at (x, y), and the secondary goal, a velocity at the obstacle point directed away from the obstacle.'
- image: maciejewski1985-redundant-obstacle-avoidance/figure2.webp
  width: 1026
  height: 581
  caption: 'From Figure 2: The obstacle avoidance gain and the homogeneous-term gain as functions of obstacle distance, shaped by the task abort, unity gain and sphere of influence distances.'
- image: maciejewski1985-redundant-obstacle-avoidance/figure3.webp
  width: 549
  height: 1419
  caption: 'From Figure 3: A redundant planar arm follows a specified trajectory (shown in a) while avoiding a moving triangular obstacle.'
- image: maciejewski1985-redundant-obstacle-avoidance/figure4.webp
  width: 1015
  height: 831
  caption: 'From Figure 6: A single frame from a simulation of a 3-D redundant manipulator operating through the window of an automobile door.'
---
## What they do
Earlier obstacle-avoidance methods define a task by its start and goal configurations, which suits pick-and-place but not spray painting or arc welding, where the end-effector must follow a set trajectory throughout. Here the end-effector tracks its commanded velocity exactly, and at every control cycle the arm's redundant degrees of freedom push the point on the arm nearest an obstacle away from it.

## How it works
- **Two ranked goals.** Primary: the end-effector velocity ẋe = Je θ̇. Secondary: a velocity ẋo, directly away from the obstacle surface, for the obstacle avoidance point (the point on the arm closest to an obstacle, with Jacobian Jo).
- **Null-space solution.** θ̇ = Je⁺ẋe + [Jo(I − Je⁺Je)]⁺(ẋo − Jo Je⁺ẋe). The first term is the minimum-norm solution; the second moves the obstacle point as well as possible using only motions that leave the end-effector still.
- **Distance-shaped gains.** Polynomial gains taper the push-away speed and the amount of null-space motion with distance: no effect beyond a sphere of influence, a smooth blend inside it, repulsion inversely related to distance nearer in, and the task suspended at an abort distance so the arm stops before contact. The two closest obstacles are blended by relative distance to avoid oscillation.
- **Rank handling.** Je⁺ comes from Gaussian elimination; the possibly rank-deficient Jo(I − Je⁺Je) uses Greville's recursive pseudoinverse with a rank threshold set by physical speed limits, since huge velocities appear near, not at, singularities.

## Results
Simulations only, on a PDP 11/70.
- A planar 7-DoF arm, steered by joystick, ran at a 47 ms cycle including secondary-goal computation and graphics. It held its trajectory while avoiding a moving triangle, worked on conveyor-borne workpieces, and stayed centered in a cavity opening without oscillating.
- A 9-DoF 3-D arm spray-painting through a car-door window kept its inboard links off the door, at 102 ms per cycle excluding graphics and secondary-goal computation.

## Limitations
No physical robot; obstacle information comes from a mathematical world model, not sensors. Rank changes cause a discontinuity whatever the threshold. Some tasks force the obstacle point arbitrarily close to an obstacle even after full optimization, and then the end-effector command itself must change.
