---
title: 'Robotic Grasping and Contact: A Review'
arxiv: ''
date: '2000-04-01'
added: '2026-11-05'
authors: Antonio Bicchi, Vijay Kumar
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ROBOT.2000.844081
pdf: https://www.centropiaggio.unipi.it/sites/default/files/surveys-icra00.pdf
website: ''
code: ''
topics:
- foundations
- grasping
seminal: true
tldr: A short survey of two decades of analytical grasping theory, covering contact models, form and force closure, grasp force distribution, stability, grasp quality measures and the dynamics of frictional contact. It names accurate, tractable models of contact compliance and friction as the key open problems.
abstract: In this paper, we survey the field of robotic grasping and the work that has been done in this area over the last two decades, with a slight bias toward the development of the theoretical framework and analytical results in this area.
thumb:
  image: bicchi2000-grasping-review/thumb.webp
  width: 960
  height: 317
videos: []
youtube: []
figures: []
---
## What they do
A survey of robot grasping research in the two decades before 2000, focused on the mechanics of grasping and finger-object contact. It covers both restraining objects (fixturing) and manipulating them with the fingers (dexterous manipulation). Haptics, algorithms and applications are left out.

## How it works
- **Contacts and closure.** Each contact is a frictionless point, a frictional point (Coulomb cone) or a soft contact that can also apply a torsional moment. Equilibrium is Wc + g = 0. A grasp is force closed if it can balance any external wrench. It is form closed if it does so with frictionless contacts.
- **Force analysis.** Contact forces split into equilibrating forces and internal (squeeze) forces in the nullspace of W. Choosing them without slip is the force distribution problem, solved by linear programming, pseudo-inverse or LMI methods.
- **Stability and quality.** Force closure alone does not guarantee stability. The survey covers stiffness-based stability tests, second-order effects of contact curvature and frame-invariant grasp quality measures.
- **Hands and dynamics.** It also covers kinematically defective hands, as in power grasps, and the inconsistencies of rigid-body models with Coulomb friction.

## Results
- Form-closure contact counts: at most 4 frictionless contacts for any piecewise-smooth planar object except a circle, and 7 for most spatial objects, including all polyhedra (Markenscoff et al.).
- With contacts modeled as virtual springs, force-closed grasps can always be made stable by adjusting finger forces.
- Rigid-body frictional dynamics can have no solution or several. One example is two-point contact in peg-in-hole insertion, where the accelerations have zero or two solutions.

## Limitations
The authors list open problems. No accurate, tractable model exists for contact compliance (especially tangential) or for friction that predicts slip. Most quality measures assume small perturbations. No one has done a full stability analysis that includes the control laws. Accurate simulators for dexterous manipulation remain very hard to build.
