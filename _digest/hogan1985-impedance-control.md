---
title: 'Impedance Control: An Approach to Manipulation, Part I: Theory'
arxiv: ''
date: '1985-03-01'
added: '2026-11-05'
authors: Neville Hogan
venue: Journal of Dynamic Systems, Measurement, and Control
doi: 10.1115/1.3140702
pdf: https://newmanlab.mit.edu/wp-content/uploads/2025/02/1985-impedance-control-an-approach-to-manipulation-part-I-theory.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
must_read: true
tldr: Hogan argues that a manipulator in contact cannot be controlled by commanding position or force alone; it must also be given an impedance, the force it produces in response to motion the environment imposes. Using bond graphs, he shows that a broad class of nonlinear manipulators splits into a virtual trajectory plus an impedance, and that impedances acting on the environment add even when they are nonlinear.
abstract: 'Manipulation fundamentally requires the manipulator to be mechanically coupled to the object being manipulated; the manipulator may not be treated as an isolated system. This three-part paper presents an approach to the control of dynamic interaction between a manipulator and its environment. In Part I this approach is developed by considering the mechanics of interaction between physical systems. Control of position or force alone is inadequate; control of dynamic behavior is also required. It is shown that as manipulation is a fundamentally nonlinear problem, the distinction between impedance and admittance is essential, and given the environment contains inertial objects, the manipulator must be an impedance. A generalization of a Norton equivalent network is defined for a broad class of nonlinear manipulators which separates the control of motion from the control of impedance while preserving the superposition properties of the Norton network. It is shown that components of the manipulator impedance may be combined by superposition even when they are nonlinear.'
thumb:
  image: hogan1985-impedance-control/thumb.webp
  width: 566
  height: 717
videos: []
youtube: []
figures:
- image: hogan1985-impedance-control/figure1.webp
  width: 756
  height: 252
  caption: 'From Figure 1: The assumed hierarchy. A supervisor or planner sends commands to a real-time controller; controller and hardware together form the manipulator, which meets the environment at a mechanical interaction port.'
- image: hogan1985-impedance-control/figure2.webp
  width: 605
  height: 740
  caption: 'From Figure 3: A planar three-link arm and a bond graph of its kinematics. Joint angles fix the tip position but not the reverse, while tip forces always map to joint torques, so seen from the tip the linkage is an admittance.'
- image: hogan1985-impedance-control/figure3.webp
  width: 566
  height: 717
  caption: 'From Figure 4: Equivalent networks for (a) pure force control, an effort source pushing on the environmental admittance Y, and (b) impedance control, a commanded motion V0(t) joined to an impedance Z through a zero-junction.'
- image: hogan1985-impedance-control/figure4.webp
  width: 780
  height: 746
  caption: 'From Figure 7: Several impedances, each with its own virtual trajectory, coupled to one environmental admittance Y through a one-junction. A non-nodic impedance is included by setting its virtual flow source to zero.'
---
## What they do
This is Part I of a three-part paper that sets out impedance control as one framework for manipulation. The framework covers tasks such as drilling, grinding or using a tool, where the manipulator does work on its environment. Hogan argues that commanding a position, velocity or force vector cannot control the work exchanged with the environment, so the controller must also command the manipulator's dynamic behavior. The argument is made with bond graphs.

## How it works
- **Physical equivalence.** No controller can make a system look, to its environment, like anything other than a physical system. Controller plus hardware can therefore be drawn as an equivalent physical network.
- **Causality.** Along each degree of freedom a system either sets force from motion (an impedance) or sets motion from force (an admittance). For nonlinear systems the two forms are not interchangeable. Because the environment contains inertias and kinematic constraints, it is an admittance, so the manipulator should be an impedance.
- **Virtual trajectory.** Pure force control cannot stably position even a mass. Assume the commands, frozen in time, define a unique zero-force equilibrium, the "virtual position". It may lie outside the workspace. Behavior is then a commanded motion plus an impedance: a Norton network that also holds for nonlinear systems.
- **Superposition.** An admittance sums the forces applied to it, so component impedances add even when they are nonlinear.

## Results
The paper is analytical only:
- A multi-axis nonlinear manipulator splits into a motion vector and an impedance that acts like a second-rank tensor. This needs no small-displacement or linearity assumption.
- Controller actions for different task requirements can be superimposed, each with its own virtual position (Figure 7).
- The manipulator's own inertia keeps superposition valid when it is out of contact.
- Commanding position and reading force feedback is recast as "admittance control", which treats the environment as an impedance.

## Limitations
No implementation or experiments; those are left to Parts II and III. The decomposition assumes that the controller can bring an unconstrained mass to equilibrium and that zero force defines a unique position. It also treats the environment as an admittance, which the paper calls the most common case. Non-nodic terms such as workspace limits are handled only by giving them a zero virtual source.
