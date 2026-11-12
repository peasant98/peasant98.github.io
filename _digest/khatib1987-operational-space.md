---
title: 'A Unified Approach for Motion and Force Control of Robot Manipulators: The Operational Space Formulation'
arxiv: ''
date: '1987-02-01'
added: '2026-11-05'
authors: Oussama Khatib
pis: [Oussama Khatib]
venue: IEEE Journal on Robotics and Automation
doi: 10.1109/JRA.1987.1087068
pdf: https://khatib.stanford.edu/publications/pdfs/Khatib_1987_RA.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
must_read: true
tldr: Khatib writes a manipulator's dynamics directly at its end-effector and uses them in one controller for both motion and contact force, extended to redundant arms and kinematic singularities. On a PUMA 560 it ran with a 200 Hz servo loop, and square-wave force commands gave rise times under 0.02 s.
abstract: A framework for the analysis and control of manipulator systems with respect to the dynamic behavior of their end-effectors is developed. First, issues related to the description of end-effector tasks that involve constrained motion and active force control are discussed. The fundamentals of the operational space formulation are then presented, and the unified approach for motion and force control is developed. The extension of this formulation to redundant manipulator systems is also presented, constructing the end-effector equations of motion and describing their behavior with respect to joint forces. These results are used in the development of a new and systematic approach for dealing with the problems arising at kinematic singularities. At a singular configuration, the manipulator is treated as a mechanism that is redundant with respect to the motion of the end-effector in the subspace of operational space orthogonal to the singular direction.
thumb:
  image: khatib1987-operational-space/thumb.webp
  width: 477
  height: 260
videos: []
youtube: []
figures:
- image: khatib1987-operational-space/figure1.webp
  width: 412
  height: 302
  caption: 'From Figure 1: Constrained end-effector tasks: a gripper holding a sphere, a cylinder and a block against a plane is left with five, four and three degrees of freedom of motion.'
- image: khatib1987-operational-space/figure2.webp
  width: 477
  height: 284
  caption: 'From Figure 3: The operational space control architecture. Motion and force loops, separated by the task specification matrices, are scaled by the end-effector inertia and mapped to joint torques through the Jacobian transpose, while a separate level updates the dynamic parameters.'
- image: khatib1987-operational-space/figure3.webp
  width: 487
  height: 272
  caption: 'From Figure 4: A simulated three-link planar arm told to hold its end-effector still while its joints start at 0.5 rad/s. (a) The links keep moving under end-effector control alone. (b) With added null-space damping the arm comes to rest.'
- image: khatib1987-operational-space/figure4.webp
  width: 547
  height: 278
  caption: 'From Figure 5: A simulated two-link arm controlled into and out of its singular configuration in two different postures (a), and the motion along the singular direction over time (b).'
---
## What they do
Robot dynamics and control were mostly written in joint space, while tasks, contact forces and force sensing are all defined at the end-effector. Khatib builds the equations of motion of the end-effector itself, in operational (task) coordinates, and uses them for one controller that handles free motion, constrained motion and active force control. He extends the model to redundant arms and uses that extension in a new treatment of kinematic singularities.

## How it works
- **Task specification.** A binary selection matrix, set in a frame aligned with the desired force or moment, marks the directions under motion control; its complement marks the force-controlled ones. Both are rotated into the base frame, where the kinematic and dynamic models are computed.
- **End-effector dynamics.** Λ(x)ẍ + μ + p = F, with Λ = J⁻ᵀAJ⁻¹ and joint torques Γ = JᵀF. Commanding F = ΛF* + μ + p makes the end-effector behave like a unit mass; motion and force commands are added through the selection matrices. Dynamic coefficients are updated at a low rate and the servo loop runs at a high rate.
- **Redundancy.** With Λ = (JA⁻¹Jᵀ)⁻¹ and the inverse J̄ = A⁻¹JᵀΛ, torques of the form (I − JᵀJ̄ᵀ)Γ₀ do not affect the end-effector. Damping in this null space stabilizes the arm without computing any pseudo-inverse.
- **Singularities.** Near a singularity the arm is treated as redundant in the directions orthogonal to the singular one, and null-space torques move it along the singular direction.

## Results
- Implemented in the COSMOS programming system on a PUMA 560 with wrist and finger sensing: contact, slide, insertion and compliance operations. On the NYMPH multiprocessor (four NS32016 processors) the servo ran at 200 Hz and the dynamics level at 100 Hz.
- An impact transition controller removed bounces on a highly stiff surface at impact velocities up to 4.0 in/s. Square-wave force commands gave rise times under 0.02 s and steady force errors under 12%.
- Redundancy and singularity handling are shown in planar simulations (Figures 4 and 5).

## Limitations
Decoupling relies on the dynamic model; the paper credits accurate identification of the PUMA 560 parameters, and its force results came despite limited control of joint torques. The rotation selection matrices only work with instantaneous angular rotations, not Euler angles or similar parameters. Redundancy and singularities are only simulated, and hardware details are deferred to another paper.
