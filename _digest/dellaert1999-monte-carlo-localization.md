---
title: Monte Carlo Localization for Mobile Robots
arxiv: ''
date: '1999-05-01'
added: '2026-11-05'
authors: Frank Dellaert, Dieter Fox, Wolfram Burgard, Sebastian Thrun
pis: [Frank Dellaert, Dieter Fox, Wolfram Burgard]
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ROBOT.1999.772544
pdf: https://www.cvlibs.net/projects/autonomous_vision_survey/literature/Dellaert1999ICRA.pdf
website: ''
code: ''
topics:
- foundations
seminal: true
tldr: Monte Carlo Localization represents a mobile robot's position belief as a set of random samples and updates it with a particle filter, so the robot can localize itself without knowing where it started. With 5000 samples it tracked a museum tour-guide robot for 75 minutes and over 2200 m without once losing track.
abstract: To navigate reliably in indoor environments, a mobile robot must know where it is. Thus, reliable position estimation is a key problem in mobile robotics. We believe that probabilistic approaches are among the most promising candidates to providing a comprehensive and real-time solution to the robot localization problem. However, current methods still face considerable hurdles. In particular, the problems encountered are closely related to the type of representation used to represent probability densities over the robot's state space. Recent work on Bayesian filtering with particle-based density representations opens up a new approach for mobile robot localization, based on these principles. In this paper we introduce the Monte Carlo Localization method, where we represent the probability density involved by maintaining a set of samples that are randomly drawn from it. By using a sampling-based representation we obtain a localization method that can represent arbitrary distributions. We show experimentally that the resulting method is able to efficiently localize a mobile robot without knowledge of its starting location. It is faster, more accurate and less memory-intensive than earlier grid-based methods.
thumb:
  image: dellaert1999-monte-carlo-localization/thumb.webp
  width: 740
  height: 393
videos: []
youtube: []
figures:
- image: dellaert1999-monte-carlo-localization/figure1.webp
  width: 740
  height: 393
  caption: 'From Figure 1: One filter iteration, exact densities on top and particle sets below. A robot with a fairly well known position but unknown heading moves 1 m, which spreads the particles onto a circle; they are then weighted by the likelihood of a landmark seen half a meter away and resampled.'
- image: dellaert1999-monte-carlo-localization/figure2.webp
  width: 1411
  height: 383
  caption: 'From Figures 3-5: Global localization with sonar in an office building. Samples cover the free space after the first scan, gather at two positions because the corridor is symmetric, and settle on the true position once the robot enters a room that looks different.'
- image: dellaert1999-monte-carlo-localization/figure3.webp
  width: 461
  height: 381
  caption: 'From Figure 8: Average position error of MCL with sonar and laser against the number of samples (log scale).'
- image: dellaert1999-monte-carlo-localization/figure4.webp
  width: 576
  height: 385
  caption: 'From Figure 9: Laser map of the Smithsonian museum, an area of about 40 by 40 m, with a tracked robot path of over 2 km.'
---
## What they do
Kalman filters track a robot's pose well but cannot represent ambiguity or relocalize after a failure. The authors' earlier grid-based Markov localization handles arbitrary densities, but costs a lot of memory and computation, and its resolution is fixed in advance. Monte Carlo Localization (MCL) instead represents the density over position and heading by a set of samples drawn from it. The set is updated with the particle filter also known as the bootstrap filter or Condensation.

## How it works
- **Prediction.** Each particle is moved by drawing one sample from the motion model, given the control input.
- **Update.** Each predicted particle is weighted by the measurement likelihood, and N particles are resampled from the weighted set (sampling/importance resampling, O(N) time).
- **Initialization.** For global localization the samples start uniform over free space, so the move from global localization to tracking needs no switch.

## Results
- Data logged on RHINO (an RWI B21, office) and MINERVA (an RWI B18, Smithsonian museum) was replayed using the logs' time stamps to recreate the real-time sensor stream.
- Global localization with sonar and 20,000 samples: the samples split between the true pose and its mirror image in a symmetric corridor, then settle on the true pose.
- Against 22 reference positions, grid-based Markov localization only reaches MCL's accuracy with 4 cm cells. MCL's error falls as samples are added, then rises once longer updates force measurements to be dropped.
- In the museum, with laser and 5000 samples, MINERVA was tracked for 75 minutes and over 2200 m at up to 1.6 m/s without once losing track. Global localization there took under 10 seconds.

## Limitations
Resampling selects high-weight samples many times and can lose sample diversity. The sample count is fixed, although tracking needs far fewer samples than global localization; adapting it is left to future work. The memory and speed advantages over grids are stated but not measured. All runs use recorded logs, and the museum run had no visitors present.
