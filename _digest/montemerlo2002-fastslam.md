---
title: 'FastSLAM: A Factored Solution to the Simultaneous Localization and Mapping Problem'
arxiv: ''
date: '2002-07-01'
added: '2026-11-05'
authors: Michael Montemerlo, Sebastian Thrun, Daphne Koller, Ben Wegbreit
venue: AAAI Conference on Artificial Intelligence
doi: ''
pdf: https://cdn.aaai.org/AAAI/2002/AAAI02-089.pdf
website: ''
code: ''
topics:
- foundations
- 3d-perception
seminal: true
tldr: FastSLAM splits SLAM into a particle filter over robot paths and, inside each particle, a small Kalman filter for each landmark. A shared tree structure brings each update down to O(M log K) time, and the method mapped 50,000 simulated landmarks with 100 particles.
abstract: 'The ability to simultaneously localize a robot and accurately map its surroundings is considered by many to be a key prerequisite of truly autonomous robots. However, few approaches to this problem scale up to handle the very large number of landmarks present in real environments. Kalman filter-based algorithms, for example, require time quadratic in the number of landmarks to incorporate each sensor observation. This paper presents FastSLAM, an algorithm that recursively estimates the full posterior distribution over robot pose and landmark locations, yet scales logarithmically with the number of landmarks in the map. This algorithm is based on an exact factorization of the posterior into a product of conditional landmark distributions and a distribution over robot paths. The algorithm has been run successfully on as many as 50,000 landmarks, environments far beyond the reach of previous approaches. Experimental results demonstrate the advantages and limitations of the FastSLAM algorithm on both simulated and real-world data.'
thumb:
  image: montemerlo2002-fastslam/thumb.webp
  width: 715
  height: 334
videos: []
youtube: []
figures:
- image: montemerlo2002-fastslam/figure1.webp
  width: 578
  height: 357
  caption: 'From Figure 1: The SLAM problem as a dynamic Bayes network. The robot moves through poses s1, s2, ... and takes range-and-bearing measurements of landmarks θ1 and θ2. The gray band marks the robot path; once the path is known, the landmark estimates are independent.'
- image: montemerlo2002-fastslam/figure2.webp
  width: 582
  height: 571
  caption: 'From Figure 3: Making a new particle from an old one when only landmark 3 is updated. The new particle builds just the tree path to that Gaussian. Every other branch points to the old particle''s unchanged subtrees.'
- image: montemerlo2002-fastslam/figure3.webp
  width: 1330
  height: 350
  caption: 'From Figure 4: (a) A physical robot mapping rocks in a testbed built for Mars Rover research. (b) Raw range and path data. (c) The FastSLAM map compared with rock locations measured by hand (circles).'
- image: montemerlo2002-fastslam/figure4.webp
  width: 715
  height: 334
  caption: 'From Figure 5: Maps and estimated robot paths from sensors with (a) large and (b) small perceptual fields. Dots are the true landmark locations; the ellipses are the estimates, sized by their residual uncertainty.'
---
## What they do
In EKF-based SLAM, each sensor update takes time quadratic in the number of landmarks K, which limits maps to a few hundred landmarks. FastSLAM relies on a conditional independence: once the robot's path is known, the landmark estimates are independent of each other. The posterior therefore factors exactly into one path estimate plus K landmark estimates, giving a Rao-Blackwellized particle filter.

## How it works
- **Path particles.** A particle filter similar to Monte Carlo localization samples each new pose from the motion model, weights it by how well it explains the measurement and resamples. Each particle keeps only its latest pose, so particles do not grow over time.
- **Per-particle landmarks.** Each particle holds K two-dimensional EKFs, one per landmark. Only the observed landmark is updated, in constant time. Classic EKF SLAM instead updates one Gaussian of dimension 2K+3.
- **Tree sharing.** Each particle stores its landmark Gaussians in a balanced binary tree. A resampled particle builds only the path to the updated Gaussian and shares every other subtree with its parent. This cuts the update cost from O(MK) for M particles to O(M log K).
- **Data association.** Each particle picks its own maximum-likelihood match and adds a new landmark when the likelihood falls below a threshold. Particles that guessed the association wrong tend to be removed at resampling.

## Results
- Real robot: a Pioneer with a SICK laser drove roughly straight through a field of rocks. With M = 10 particles, the average map error was 8.3 cm compared with the map measured by hand.
- Simulation: 50,000 landmarks were mapped with as few as 100 particles, using about 0.3% of the parameters a conventional EKF would need.
- More landmarks slightly reduced both map and pose error, and more particles also reduced error. M = 100 worked well in many situations.

## Limitations
The physical testbed does not allow systematic scaling experiments. The real-robot test is one roughly straight drive, and all scaling results come from simulation. The authors note that in some situations the number of particles needed for an accurate map may be prohibitively large. The measurement model is linearized, and landmarks are planar points. Data association in logarithmic time is proposed but not shown, and the paper reports no runtimes.
