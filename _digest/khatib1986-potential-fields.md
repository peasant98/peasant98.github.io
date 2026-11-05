---
title: Real-Time Obstacle Avoidance for Manipulators and Mobile Robots
arxiv: ''
date: '1986-03-01'
added: '2026-11-05'
authors: Oussama Khatib
venue: The International Journal of Robotics Research
doi: 10.1177/027836498600500106
pdf: https://khatib.stanford.edu/publications/pdfs/Khatib_1986_IJRR.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: Khatib moves collision avoidance out of the path planner and into the low-level controller. The goal attracts the end effector and obstacles repel points on the arm through artificial potential fields, applied as operational-space forces. On a PUMA 560 the servo ran at 225 Hz and avoided moving obstacles seen by a vision system in real time.
abstract: This paper presents a unique real-time obstacle avoidance approach for manipulators and mobile robots based on the artificial potential field concept. Collision avoidance, traditionally considered a high level planning problem, can be effectively distributed between different levels of control, allowing real-time robot operations in a complex environment. This method has been extended to moving obstacles by using a time-varying artificial potential field. We have applied this obstacle avoidance scheme to robot arm mechanisms and have used a new approach to the general problem of real-time manipulator control. We reformulated the manipulator control problem as direct control of manipulator motion in operational space—the space in which the task is originally described—rather than as control of the task's corresponding joint space motion obtained only after geometric and kinematic transformation. Outside the obstacles' regions of influence, we caused the end effector to move in a straight line with an upper speed limit. The artificial potential field approach has been extended to collision avoidance for all manipulator links. In addition, a joint space artificial potential field is used to satisfy the manipulator internal joint constraints. This method has been implemented in the COSMOS system for a PUMA 560 robot. Real-time collision avoidance demonstrations on moving obstacles have been performed by using visual sensing.
thumb:
  image: khatib1986-potential-fields/thumb.webp
  width: 388
  height: 236
videos: []
youtube: []
figures:
- image: khatib1986-potential-fields/figure1.webp
  width: 376
  height: 302
  caption: 'From Figure 3: The control system architecture. The speed-limited goal servo and the repulsive force on each point subjected to the potential pass through the end-effector inertia and their Jacobians, and are summed with joint-limit, Coriolis, centrifugal and gravity torques. An estimator feeds the servo, and a separate level updates the parameters.'
- image: khatib1986-potential-fields/figure2.webp
  width: 388
  height: 236
  caption: 'From Figure 2: A dynamic simulation of a redundant 4-dof planar manipulator moving inside an enclosure, shown in successive configurations 1 to 10.'
- image: khatib1986-potential-fields/figure3.webp
  width: 398
  height: 290
  caption: 'From Figure 1: An n-ellipsoid with n = 4, the analytic surface used to approximate a box-shaped obstacle.'
---
## What they do
Collision avoidance was usually treated as path planning, which runs orders of magnitude slower than the robot can respond. Khatib moves it into low-level control. The goal attracts the end effector and obstacles repel the arm's parts, with the fields applied through the end-effector (operational-space) dynamics. Time-varying fields handle moving obstacles.

## How it works
- **Attraction.** The goal potential ½kp(x − xd)² gives the proportional term of a PD servo. Turned into a desired velocity capped at Vmax, it drives the end effector straight toward the goal at the speed limit whenever it is away from obstacles.
- **FIRAS repulsion.** U = ½η(1/ρ − 1/ρ0)² within distance ρ0 of an obstacle and zero beyond it, where ρ is the shortest distance; it grows without bound at the surface. The force on each "point subjected to the potential" (PSP) becomes joint torques through that point's Jacobian.
- **Geometry.** Obstacles are built from convex primitives. Each link is a line segment whose closest point to the obstacle is a PSP, so an n-link arm needs at most n PSPs. Joint limits get the same kind of barrier in joint space.
- **Architecture.** Motion, obstacle and joint-limit torques are summed. A low-rate level updates dynamics, Jacobians and geometry, and a high-rate level runs the servo.

## Results
- Implemented in COSMOS on a PUMA 560 with a Machine Intelligence Corporation vision module, with real-time avoidance for links and moving obstacles. On PDP 11/45 and 11/60 processors the servo ran at 225 Hz and the coefficient level at 100 Hz.
- A simulated redundant 4-dof planar arm moves inside an enclosure (Fig. 2). The paper reports no other numbers.

## Limitations
In clutter the field can have local minima, where the robot stops short of its goal. Because the view is local, limits for complex tasks remain even with escape procedures. Linking minima into a global path is too expensive for real-time control, so Khatib proposes having a high-level planner supply intermediate goals.
