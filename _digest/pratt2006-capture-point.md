---
title: 'Capture Point: A Step toward Humanoid Push Recovery'
arxiv: ''
date: '2006-12-01'
added: '2026-11-05'
authors: Jerry Pratt, John Carff, Sergey Drakunov, Ambarish Goswami
venue: IEEE-RAS International Conference on Humanoid Robots (Humanoids)
doi: 10.1109/ICHR.2006.321385
pdf: http://www.ambarish.com/paper/Pratt_Goswami_Humanoids2006.pdf
website: ''
code: ''
topics:
- foundations
- humanoids
seminal: true
tldr: Defines the Capture Point, the spot on the ground where a pushed biped must step to come to a complete stop, and computes it in closed form for a linear inverted pendulum with a flywheel body. In simulation, a planar biped walking at 0.5 m/s stops in a single step by lunging its body.
abstract: 'It is known that for a large magnitude push a human or a humanoid robot must take a step to avoid a fall. Despite some scattered results, a principled approach towards “When and where to take a step” has not yet emerged. Towards this goal, we present methods for computing Capture Points and the Capture Region, the region on the ground where a humanoid must step to in order to come to a complete stop. The intersection between the Capture Region and the Base of Support determines which strategy the robot should adopt to successfully stop in a given situation. Computing the Capture Region for a humanoid, in general, is very difficult. However, with simple models of walking, computation of the Capture Region is simplified. We extend the well-known Linear Inverted Pendulum Model to include a flywheel body and show how to compute exact solutions of the Capture Region for this model. Adding rotational inertia enables the humanoid to control its centroidal angular momentum, much like the way human beings do, significantly enlarging the Capture Region. We present simulations of a simple planar biped that can recover balance after a push by stepping to the Capture Region and using internal angular momentum. Ongoing work involves applying the solution from the simple model as an approximate solution to more complex simulations of bipedal walking, including a 3D biped with distributed mass.'
thumb:
  image: pratt2006-capture-point/thumb.webp
  width: 698
  height: 498
videos: []
youtube: []
figures:
- image: pratt2006-capture-point/figure1.webp
  width: 485
  height: 884
  caption: 'From Figure 2: A pushed humanoid and its Capture Region. If the region overlaps the support foot, no step is needed (top); if it is disjoint, the robot must step into it (middle); if it lies outside the swing leg''s workspace, the robot cannot stop in one step (bottom).'
- image: pratt2006-capture-point/figure2.webp
  width: 546
  height: 516
  caption: 'From Figure 1: The biped model in single support: a flywheel body at the center of mass on a massless, extensible leg, driven by a hip torque on the flywheel and a linear leg force.'
- image: pratt2006-capture-point/figure3.webp
  width: 776
  height: 567
  caption: 'From Figure 3: Phase portrait of the Linear Inverted Pendulum in dimensionless units, with the Capture Region expanded by the flywheel (dotted) and a trajectory that uses the flywheel to stop (green).'
- image: pratt2006-capture-point/figure4.webp
  width: 776
  height: 474
  caption: 'From Figure 8: The simulated biped stops walking in a single step by lunging its body; snapshots every 0.25 s.'
---
## What they do
A pushed humanoid has to decide whether to step and where. The paper defines a Capture Point as a ground point where, if the biped puts its base of support there and keeps its center of pressure on it, it can come to a complete stop. The Capture Region is the set of all such points. They derive it in closed form for the Linear Inverted Pendulum, then for an extension with a flywheel body that models centroidal angular momentum.

## How it works
- **Push-recovery rule.** If the Capture Region intersects the base of support, the robot balances without stepping. Otherwise it steps so the foot covers the region. If the region lies outside the swing leg's workspace, one step cannot stop it.
- **Linear Inverted Pendulum.** With the center of mass at constant height z0, the dynamics are linear. The single Capture Point puts the state on the stable eigenvector: x_capture = ẋ·sqrt(z0/g).
- **Flywheel.** A hip torque on the flywheel accelerates the center of mass, so the point grows into a region. A bang-bang torque profile, limited in torque and flywheel angle, gives the region's bounds in closed form. A friction-cone condition bounds the usable torque.

## Results
- With the flywheel, the robot can stop from a band of states around the stable eigenvector, not just the line itself. The region grows with torque and angle limits, with diminishing returns when one is fixed.
- Simulated 4-DoF planar biped (25 kg body, 100 Nm hip torque limit): a push at 0.5 s raises its velocity to 0.2 m/s; a body lunge recovers balance without a step and is complete by about 0.8 s.
- Walking at a top-of-stride velocity of 0.5 m/s, the robot is told to stop at about 3.9 s and stops in one step by lunging, finishing at about 4.25 s. In both runs orbital energy after the lunge was zero to within three decimal places.

## Limitations
The equations are exact only for the planar, constant-height, point-foot model. Transfer to a 3D humanoid with distributed mass is left to ongoing work, and there are no hardware experiments. In both simulations the foot was already inside the Capture Region, so the full torque and angle limits were not needed, and how to choose among the many valid lunge profiles is left open.
