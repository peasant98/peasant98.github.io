---
title: The GraphSLAM Algorithm with Applications to Large-Scale Mapping of Urban Structures
arxiv: ''
date: '2006-05-01'
added: '2026-11-05'
authors: Sebastian Thrun, Michael Montemerlo
venue: The International Journal of Robotics Research
doi: 10.1177/0278364906065387
pdf: http://robots.stanford.edu/papers/thrun.graphslam.pdf
website: ''
code: ''
topics:
- foundations
- 3d-perception
seminal: true
tldr: GraphSLAM turns every odometry reading and measurement into a soft constraint in a sparse graph, eliminates the map features to leave a smaller problem over robot poses, and solves it. It builds maps with 10^8 or more features; relaxing the largest urban data set (600 m by 800 m, a dozen loops) takes about 30 seconds.
abstract: This article presents GraphSLAM, a unifying algorithm for the offline SLAM problem. GraphSLAM is closely related to a recent sequence of research papers on applying optimization techniques to SLAM problems. It transforms the SLAM posterior into a graphical network, representing the log-likelihood of the data. It then reduces this graph using variable elimination techniques, arriving at a lower-dimensional problems that is then solved using conventional optimization techniques. As a result, GraphSLAM can generate maps with 10^8 or more features. The paper discusses a greedy algorithm for data association, and presents results for SLAM in urban environments with occasional GPS measurements.
thumb:
  image: thrun2006-graphslam/thumb.webp
  width: 960
  height: 536
videos: []
youtube: []
figures:
- image: thrun2006-graphslam/figure1.webp
  width: 1025
  height: 572
  caption: 'From Figure 1: The graph GraphSLAM builds from four poses and two map features. Solid edges link consecutive poses (motion constraints), dashed edges link each pose to the features sensed there (measurement constraints). Each edge is a nonlinear quadratic constraint, and minimizing their sum gives the most likely map and path.'
- image: thrun2006-graphslam/figure2.webp
  width: 884
  height: 1267
  caption: 'From Figure 3: Reducing the graph, shown as a graph and as the information matrix. Removing m1 changes the link between x1 and x2, removing m3 adds a new link between x2 and x4, and once all features are removed only links between robot poses remain.'
- image: thrun2006-graphslam/figure3.webp
  width: 901
  height: 1536
  caption: 'From Figure 6: 2-D slices of the indoor map (blue) inside the outdoor map (red). Top: indoor map built from the IMU and SLAM alone. Bottom: built jointly with the outdoor data, so GPS acquired outside also corrects the building interior.'
- image: thrun2006-graphslam/figure4.webp
  width: 1060
  height: 1582
  caption: 'From Figure 7: Top, a map of Stanford University''s main campus, about 600 m across. Bottom, a 3-D map of the Gates Computer Science building and the surrounding terrain.'
---
## What they do
GraphSLAM solves the offline (full) SLAM problem: recover the robot's whole path and the map together after all data is collected. Each control and each feature measurement becomes a soft constraint, an edge in a sparse graph; minimizing the sum of these constraints (the negative log-posterior) gives the most likely path and map. The paper derives the algorithm, adds greedy data association, and applies it to 3-D mapping of urban sites with occasional GPS.

## How it works
- **Linearize.** Initial poses come from chaining the motion model. Linearizing around them, each control or measurement adds a local block to a sparse information matrix; feature-feature entries stay zero.
- **Reduce.** Features are eliminated one at a time, each feature's links replaced by direct links between the poses that observed it. This takes linear time and leaves a problem over poses only.
- **Solve.** Poses come from matrix inversion or conjugate gradient, then each feature from its observing poses. The three steps repeat, usually two or three times.
- **Data association and GPS.** A test gives the probability that two map features are the same; pairs above a threshold are merged greedily and the map is rebuilt. A GPS fix is one more arc in the graph.

## Results
- A Segway-based robot with a vertically panning laser mapped Stanford's main campus, the Gates building and NASA's DART search-and-rescue site.
- Maps with more than 10^8 variables are computed under multiple loop closures; relaxing the pose graph for the largest data set (600 m by 800 m, a dozen cycles) takes on the order of 30 seconds.
- Mapping indoors jointly with outdoors carries GPS information inside; the joint map is more accurate and recovers the right angle at the building's center.
- Accuracy is shown in map images only; no error metrics are reported.

## Limitations
Noise is assumed independent and Gaussian; inflating covariances helps but is ad hoc. The odometry-based initial guess degrades on long runs, causing data association errors and eventual divergence. The inversion in the solve step can be very slow. Greedy association tests every feature pair, re-solves after each merge and never undoes a decision. The world is assumed static.
