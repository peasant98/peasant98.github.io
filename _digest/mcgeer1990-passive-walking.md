---
title: Passive Dynamic Walking
arxiv: ''
date: '1990-04-01'
added: '2026-11-05'
authors: Tad McGeer
venue: The International Journal of Robotics Research
doi: 10.1177/027836499000900206
pdf: http://www.cs.cmu.edu/~cga/legs/McGeer1990.pdf
website: ''
code: ''
topics:
- foundations
- legged-locomotion
seminal: true
tldr: Two stiff legs with curved feet, pin-jointed at the hip, settle into a steady human-like gait down a shallow slope with no active control or energy input besides gravity. A step-to-step analysis predicts the gait and its stability, and a 50 cm test biped walks at 0.46 m/s on a 2.5% slope.
abstract: There exists a class of two-legged machines for which walking is a natural dynamic mode. Once started on a shallow slope, a machine of this class will settle into a steady gait quite comparable to human walking, without active control or energy input. Interpretation and analysis of the physics are straightforward; the walking cycle, its stability, and its sensitivity to parameter variations are easily calculated. Experiments with a test machine verify that the passive walking effect can be readily exploited in practice. The dynamics are most clearly demonstrated by a machine powered only by gravity, but they can be combined easily with active energy input to produce efficient and dextrous walking over a broad range of terrain.
thumb:
  image: mcgeer1990-passive-walking/thumb.webp
  width: 960
  height: 1410
videos: []
youtube: []
figures:
- image: mcgeer1990-passive-walking/figure1.webp
  width: 1031
  height: 1514
  caption: 'From Figure 3: The test biped. The outer legs are joined by a crossbar and alternate like crutches with the center leg; the feet are semicircular with rubber treads. Apart from small motors that keep the swing foot from stubbing, it walks in a stable limit cycle with no active control. Leg length 50 cm, weight 3.5 kg.'
- image: mcgeer1990-passive-walking/figure2.webp
  width: 402
  height: 404
  caption: 'From Figure 2: The 2D biped model: two legs of arbitrary mass and inertia with semicircular feet, a point mass at the hip, walking down a slope.'
- image: mcgeer1990-passive-walking/figure3.webp
  width: 370
  height: 305
  caption: 'From Figure 5: The synthetic wheel. Stance and swing leg angles over one step; if support transfers when the leg angles are equal and opposite, the cycle continues without energy loss, and its period does not depend on step length.'
- image: mcgeer1990-passive-walking/figure4.webp
  width: 435
  height: 294
  caption: 'From Figure 6: Step period and leg angle of the test biped versus slope. Bars are measurements, curves the analysis with and without rolling friction; with friction, walking is calculated to be unstable on slopes below 0.8%.'
---
## What they do
Walking machines of the time generated their gait with active control. McGeer studies the other extreme: a biped whose gait comes from gravity and inertia alone. Started by hand on a shallow slope, it settles into a steady walk. The paper explains the effect with two wheel analogies, analyzes the gait and its stability for a general 2D biped, and checks the analysis on a test machine.

## How it works
- **Wheel analogies.** A rimless wheel loses speed at each leg strike but reaches a steady speed downhill. Two legs with semicircular feet and a large hip mass form a "synthetic wheel": the swing leg moves as a free pendulum and picks up the motion where the stance leg leaves off, so the cycle continues on level ground without energy loss.
- **Model.** Two stiff legs pin-jointed at the hip, with semicircular feet and a point hip mass. Stance dynamics are linearized for small angles; foot strike is an inelastic collision.
- **Step-to-step map.** The leg angle and two leg speeds at one step map to those at the next. Its fixed point is the walking cycle, and the eigenvalues of its linearization give stability.
- **Test machine.** 50 cm legs, 3.5 kg, outer legs built as crutches to keep the motion planar, and small motors that lift the feet for clearance.

## Results
- The test biped walks with a human-like stride on a 2.5% slope at 0.46 m/s, a specific resistance of about 0.025.
- Measured step period and angle match the analysis once a rolling friction of 0.007 mgl (about 25 g-force at the hip) is added.
- On that slope the speed, swing and totter modes have eigenvalues 0.70, -0.05 and -0.83, so the gait is stable. A representative walker survives about 25% of the impulse that topples the same machine with legs locked.
- Larger feet and more hip mass improve efficiency; a little hip friction destroys the cycle unless the leg mass is shifted backward.

## Limitations
The analysis is 2D and linearized, valid only on shallow slopes, and the observed step period varies less with speed than predicted. Many walkers tolerate only a few percent error in starting speed. The foot-lifting motors waste about 3 J per step against about 0.2 J of fundamental dissipation, and lateral balance is left to active control.
