---
title: Adaptive Control of Mechanical Manipulators
arxiv: ''
date: '1987-06-01'
added: '2026-11-05'
authors: John J. Craig, Ping Hsu, S. Shankar Sastry
venue: The International Journal of Robotics Research
doi: 10.1177/027836498700600202
pdf: https://www2.eecs.berkeley.edu/Pubs/TechRpts/1986/ERL-86-3.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: An adaptive computed-torque controller that estimates unknown mass and friction parameters on-line, with a Lyapunov proof that all signals stay bounded and tracking errors go to zero. On a simulated two-link arm, link masses (3 kg guessed, 4 kg true) and Coulomb friction (0 guessed, 2 Nm true) converge within several seconds.
abstract: We present an adaptive version of the computed torque method for the control of manipulators with rigid links. The algorithm estimates parameters on-line which appear in the non-linear dynamic model of the manipulator, such as load and link mass parameters and friction parameters, and uses the latest estimates in the computed torque servo. We present what we believe is the first globally convergent, rigorous proof of the stability of such a scheme in its non-linear setting, as well as its asymptotic properties and conditions for parameter convergence. We illustrate the theory with some simulation results.
thumb:
  image: craig1987-adaptive-control/thumb.webp
  width: 960
  height: 511
videos: []
youtube: []
figures:
- image: craig1987-adaptive-control/figure1.webp
  width: 1600
  height: 851
  caption: 'From Figure 1: structure of the controller. Servo errors pass through Kv and Kp and are added to the desired acceleration; the estimated mass matrix and the estimated centrifugal, Coriolis, gravity and friction terms turn this into arm torques, while an adaptive element watches the servo errors and adjusts both estimates.'
- image: craig1987-adaptive-control/figure2.webp
  width: 829
  height: 585
  caption: 'From Figure 2: the two-link manipulator used in simulation, with point masses at the link ends, moving in a vertical plane under gravity.'
- image: craig1987-adaptive-control/figure3.webp
  width: 1600
  height: 813
  caption: 'From Figure 3: estimate of the link 1 mass over 30 seconds, adapting from an initial guess of 3 kg to the true value of 4 kg.'
- image: craig1987-adaptive-control/figure4.webp
  width: 1600
  height: 811
  caption: 'From Figure 7: servo error at joint 1 in radians, shrinking to small noise-driven fluctuations as the controller tunes itself.'
---
## What they do
Computed torque decouples and linearizes a manipulator only if its model parameters match the real arm, yet loads and friction are often unknown and change over time. This paper adds an adaptive element: the dynamic structure is known, some or all mass and friction parameters are unknown within known (possibly very loose) bounds, and only the unknown ones are estimated on-line. The authors believe this is the first globally convergent, rigorous stability proof for such a scheme in its nonlinear setting.

## How it works
- **Control law.** Torque is the estimated mass matrix times (desired acceleration + Kv·velocity error + Kp·position error), plus estimated centrifugal, Coriolis, gravity and friction terms. With exact parameters, each joint becomes an independent second-order system.
- **Adaptation law.** The dynamics are linear in the parameters, so servo error is driven by parameter error through known functions of the trajectory. Each joint's error is filtered as e + αė (α chosen to make a transfer function strictly positive real), and a Lyapunov function in servo and parameter errors yields the update law. Estimates leaving their bounds are reset to the bound, which keeps the estimated mass matrix positive definite and happens only finitely often.
- **Convergence.** Position and velocity errors go to zero; parameters converge too if the desired trajectory is persistently exciting.

## Results
- Simulation only: a two-link arm with viscous and Coulomb friction and random torque noise, six unknown parameters, and a sum-of-sinusoids trajectory.
- All parameters start with substantial errors and are corrected over the first several seconds: link masses from 3 to 4 kg and from 2 to 4 kg, Coulomb friction from 0 to 2 Nm and 1 Nm; viscous friction behaves similarly.
- Remaining servo error matches the noise amplitude divided by the closed-loop position gain.

## Limitations
No real-arm experiments; the authors say adaptation speed must be verified on hardware. The update law needs joint acceleration, which manipulators usually do not sense, though its integrating action reduces the need for good acceleration measurements.
