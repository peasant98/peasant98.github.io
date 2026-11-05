---
title: Compliant Leg Behaviour Explains Basic Dynamics of Walking and Running
arxiv: ''
date: '2006-11-01'
added: '2026-11-05'
authors: Hartmut Geyer, Andre Seyfarth, Reinhard Blickhan
venue: Proceedings of the Royal Society B
doi: 10.1098/rspb.2006.3637
pdf: http://www.cs.cmu.edu/~cga/legs/GeyerEA06RoySocBiolSci.pdf
website: ''
code: ''
topics:
- foundations
- legged-locomotion
seminal: true
tldr: Add a second spring leg to the spring-mass running model and it walks, reproducing the M-shaped vertical ground reaction force, small body bob and out-of-phase energy changes of human walking at about 1.2 m/s, which the stiff-legged inverted pendulum cannot. The same model also runs, above a speed gap of about 1.5 m/s.
abstract: 'The basic mechanics of human locomotion are associated with vaulting over stiff legs in walking and rebounding on compliant legs in running. However, while rebounding legs well explain the stance dynamics of running, stiff legs cannot reproduce that of walking. With a simple bipedal spring–mass model, we show that not stiff but compliant legs are essential to obtain the basic walking mechanics; incorporating the double support as an essential part of the walking motion, the model reproduces the characteristic stance dynamics that result in the observed small vertical oscillation of the body and the observed out-of-phase changes in forward kinetic and gravitational potential energies. Exploring the parameter space of this model, we further show that it not only combines the basic dynamics of walking and running in one mechanical system, but also reveals these gaits to be just two out of the many solutions to legged locomotion offered by compliant leg behaviour and accessed by energy or speed.'
thumb:
  image: geyer2006-spring-mass/thumb.webp
  width: 656
  height: 652
videos: []
youtube: []
figures:
- image: geyer2006-spring-mass/figure1.webp
  width: 656
  height: 652
  caption: 'From Figure 1: The two standard models, the inverted pendulum for walking and the spring-mass system for running, with their predicted ground reaction forces (red) against human treadmill data for walking at 1.2 m/s and running at 4.0 m/s (black). Only the running model fits.'
- image: geyer2006-spring-mass/figure2.webp
  width: 1096
  height: 505
  caption: 'From Figure 2: The bipedal spring-mass model, a point mass on two massless spring legs of stiffness k and rest length l0, each held at angle a0 during swing. One step runs from apex to apex through left single support, double support (right touchdown to left take-off) and right single support.'
- image: geyer2006-spring-mass/figure3.webp
  width: 1175
  height: 1018
  caption: 'From Figure 3: Stance-phase patterns of three model solutions A-C at about 1.2 m/s next to five human subjects walking on a force-sensing treadmill (exp): horizontal and vertical ground reaction forces, vertical COM displacement (dashed: inverted pendulum), and changes in forward kinetic and gravitational potential energy.'
- image: geyer2006-spring-mass/figure4.webp
  width: 1274
  height: 1189
  caption: 'From Figure 4: (a) Combinations of angle of attack, leg stiffness and system energy that give stable walking (double- and multi-peak vertical force patterns) and stable running (single peak), separated by a gap of about 500 J or 1.5 m/s. (b) A slice through the double-peak walking domain at 816 J (about 1.2 m/s), split into three sub-domains exemplified by solutions A-C.'
---
## What they do
Walking has been modelled as vaulting over stiff legs (the inverted pendulum) and running as bouncing on a compliant leg (the spring-mass model). The stiff-leg model cannot produce walking's M-shaped vertical ground reaction force or its small vertical body motion. The authors add a second spring leg to the running model and show that compliant legs alone reproduce the basic stance dynamics of walking, and that the same system also runs.

## How it works
- **Model.** A point mass (80 kg) on two massless linear springs (rest length 1 m, stiffness k). A swing leg lands at a fixed angle of attack a0; a stance leg lifts off when it is back at rest length. Double support, where both springs push, is part of the gait.
- **Steady states.** A step runs from one apex to the next. Fixed points of the apex return map with eigenvalues inside the unit circle are stable gaits, found by iterating up to 99 steps from 50 initial apex heights.
- **Parameter scan.** The model has three independent parameters: angle of attack, leg stiffness and system energy (the model is conservative). They scan the physiologically plausible range of all three.

## Results
- At 816 J (about 1.2 m/s), three solutions A-C (a0 = 69-76°, k = 14-20 kN/m) match the ground reaction forces, smaller-than-pendulum vertical COM motion and energy changes of five treadmill walkers.
- Small-amplitude patterns like slow walking come from steep, stiff legs (a0 > 75°, k > 17 kN/m); larger-amplitude ones from flatter, softer legs, with stiffness approaching values reported for running.
- At lower energies, stable walking with three to five force peaks appears. Stable running needs at least about 3 m/s, leaving a gap of about 1.5 m/s between the gaits.
- Percentage recovery is only 15-35% for A-C, yet the model keeps 100% of stride energy by storing it in the springs during double support.

## Limitations
The model is conservative, with point mass, massless legs and a fixed swing-leg angle. Only period-one gaits were analysed, and the scan resolved multi-peak domains only up to five peaks. The model's walk-run speed gap is larger than the one observed in humans.
