---
title: Efficient Bipedal Robots Based on Passive-Dynamic Walkers
arxiv: ''
date: '2005-02-01'
added: '2026-11-05'
authors: Steve Collins, Andy Ruina, Russ Tedrake, Martijn Wisse
pis: [Steven Collins, Russ Tedrake]
venue: Science
doi: 10.1126/science.1107799
pdf: https://groups.csail.mit.edu/robotics-center/public_papers/Collins05.pdf
website: ''
code: ''
topics:
- foundations
- legged-locomotion
seminal: true
tldr: Three bipeds built at Cornell, Delft and MIT add small ankle or hip actuators to passive-dynamic ramp walkers, so they walk on level ground with very simple control. The Cornell biped's mechanical cost of transport is about 0.055, close to a human's 0.05; the authors estimate 1.6 for Honda's Asimo.
abstract: Passive-dynamic walkers are simple mechanical devices, composed of solid parts connected by joints, that walk stably down a slope. They have no motors or controllers, yet can have remarkably humanlike motions. This suggests that these machines are useful models of human locomotion; however, they cannot walk on level ground. Here we present three robots based on passive-dynamics, with small active power sources substituted for gravity, which can walk on level ground. These robots use less control and less energy than other powered robots, yet walk more naturally, further suggesting the importance of passive-dynamics in human locomotion.
thumb:
  image: collins2005-passive-dynamic/thumb.webp
  width: 386
  height: 251
videos: []
youtube: []
figures:
- image: collins2005-passive-dynamic/figure1.webp
  width: 386
  height: 251
  caption: 'From Figure 2: The three level-ground powered walkers, based on the ramp-walking designs of Figure 1. (A) The Cornell biped. (B) The Delft biped. (C) The MIT learning biped.'
- image: collins2005-passive-dynamic/figure2.webp
  width: 386
  height: 254
  caption: 'From Figure 1: The passive-dynamic ramp walkers the powered robots are based on. (A) The Wilson "Walkie". (B) MIT''s improved version. (C) Cornell''s copy of McGeer''s four-legged "biped", whose inner and outer leg pairs prevent falling sideways. (D) The Cornell passive biped with knees and arms.'
- image: collins2005-passive-dynamic/figure3.webp
  width: 384
  height: 312
  caption: 'From Figure 3: Step-to-step dynamics of the MIT biped walking in place on a level surface, before and after learning: roll angular velocity at right-foot collision on step n+1 versus step n. Before learning the robot loses energy every step and comes to rest; after learning it converges near the desired 0.75 per second.'
- image: collins2005-passive-dynamic/figure4.webp
  width: 672
  height: 310
  caption: 'From Figure 4: Two sets of video stills of the Cornell ankle-powered biped walking on level ground next to a person, both at about 1 step/s, with stick figures showing the robot''s leg angles.'
---
## What they do
Passive-dynamic walkers have no motors or controllers. Powered only by gravity, they walk stably down shallow slopes with humanlike gaits, but they cannot walk on level ground. The authors built three level-ground robots at Cornell, Delft and MIT by adding small actuators to passive designs in place of gravity.

## How it works
- **Cornell biped.** Spring-loaded motors drive ankle push-off: one ankle extends when the other foot hits the ground. The hip is unpowered and the knees only latch, so the actuators never do negative work.
- **Delft biped.** Passive ankles and pneumatic hip actuation, which also swings the leg forward quickly to recover from fore-aft disturbances. Like the Cornell biped, it senses only ground contact and sends on/off commands once per step.
- **MIT learning biped.** Ankle servos on a simpler ramp-walker design. It starts from a zero policy that imitates the passive walker. Actor-critic RL then tunes a 35-parameter feedback policy on the real robot, perturbing the parameters slightly each step to estimate the performance gradient.

## Results
- The 13 kg Cornell biped walks at 0.4 m/s on 11 W in total, 3 W of it ankle mechanical power. Its energetic and mechanical costs of transport are about 0.2 and 0.055, against about 0.2 and 0.05 for humans. The Delft biped's mechanical cost is about 0.08 and the MIT biped's is estimated at 0.02 or more; the authors estimate Asimo's two costs at 3.2 and 1.6.
- The MIT biped learns from real-robot data only, typically converging in 10 min or about 600 steps. It then adapts continually to bricks, wooden tiles and carpet.
- The Cornell and Delft bipeds walk with humanlike motions without continuously sensing torques, angles or attitudes.

## Limitations
Pushing off just before heel-strike takes about a quarter of the energy in theory. But it raised torque demands and was too timing-sensitive for the Cornell biped's simple controller. The Delft biped could not balance sideways without enough swing-leg actuation. The MIT biped walks only within a small range of speeds.
