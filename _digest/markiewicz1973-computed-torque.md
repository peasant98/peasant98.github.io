---
title: Analysis of the Computed Torque Drive Method and Comparison with Conventional Position Servo for a Computer-Controlled Manipulator
arxiv: ''
date: '1973-03-15'
added: '2026-11-05'
authors: B. R. Markiewicz
venue: JPL Technical Memorandum 33-601
doi: ''
pdf: https://ntrs.nasa.gov/api/citations/19730012471/downloads/19730012471.pdf
website: ''
code: ''
topics:
- foundations
- planning-control
seminal: true
tldr: A linear, single-joint analysis of the Stanford arm's computed-torque control (model-based feedforward torque plus inertia-scaled position, rate and integral feedback) against a conventional analog position servo. Computed torque follows the plan with zero error if the model is exact, while the conventional servo, even at a 100 rad/s natural frequency, lags about 1.15 degrees on a 5-second ±50-degree move.
abstract: A manipulator and its control system (modeled after a Stanford design) is being developed at JPL as part of an artificial intelligence project. This development includes an analytical study of the control system software. This report presents a comparison of the computed torque method and the conventional position servo. No conclusion is made as to the preference of one system over the other, as it is dependent upon the application and the results of a sampled data analysis.
thumb:
  image: markiewicz1973-computed-torque/thumb.webp
  width: 784
  height: 377
videos: []
youtube: []
figures:
- image: markiewicz1973-computed-torque/figure1.webp
  width: 784
  height: 377
  caption: 'From Figure 3: signal flow graph of one joint under computed torque, from the planned angle to the output angle: a feedforward torque branch to the motor and load, plus rate-error, position/integral-error and back-EMF branches.'
- image: markiewicz1973-computed-torque/figure2.webp
  width: 1440
  height: 825
  caption: 'From Figure 9: the conventional position servo for one link. The computer only sends the planned angle through a D/A; potentiometer and tachometer feedback and an integrating amplifier close the loop in hardware.'
- image: markiewicz1973-computed-torque/figure3.webp
  width: 1419
  height: 613
  caption: 'From Figure 11: typical planned joint motions from -50 to +50 degrees, about 1 s at Stanford versus 5 s at JPL, with the sinusoid used to approximate the JPL input in the error analysis.'
---
## What they do
JPL was building a manipulator modeled on the Stanford arm and studied how to control its joints. This memo analyzes one joint under Stanford's "computed torque" method: the planning program computes the joint trajectory, a model of the arm and motor turns it into a motor voltage, and position, rate and integral feedback correct for model error. It compares this with a conventional analog position servo using the same sensors. The analysis is linear and continuous-time.

## How it works
- **Feedforward torque.** Computed inertia times planned acceleration (from a cubic polynomial trajectory), converted to voltage through a lab-measured voltage-torque curve that models Coulomb friction and gear losses; back EMF from the tachometer is added. Gravity torque is computed and cancelled.
- **Inertia-scaled feedback.** Error gains are multiplied by the computed inertia, so damping and natural frequency stay constant as the arm's inertia changes. The integral gain is stable only if K_I < K_v·K_e.
- **Conventional servo.** The planned angle goes through a D/A; potentiometer, tachometer and an integrating amplifier close the loop in hardware, with gains chosen for damping ratio 1.

## Results
- With an exact model, output equals the planned input. Stanford joint-1 gains (K_v = 24.4, K_e = 132, K_I = 1080) give damping 1 and natural frequency 11.5 rad/s without the integral term; doubling K_I drops damping to 0.08, so K_I cannot go much beyond 1000.
- Without the integral term, a 16 oz force at 30 inches leaves a 0.96 degree steady-state error.
- The conventional servo at 100 rad/s lags 1.15 degrees on the 5-second JPL move, rising to 5 degrees at Stanford's input frequency of 6.28 rad/s.
- A 20% motor-resistance change barely moves the computed-torque poles (damping 0.27 to 0.23).

## Limitations
Analysis only, with no experiments. Sampling and computation delay are ignored (a sampled-data analysis is still needed for computed torque, a nonlinear one for the servo). Stanford gains and inertias stand in for the unbuilt JPL arm. Stanford experience shows high inertia-scaled gains amplify noise when handling large-inertia objects. The memo makes no recommendation.
