---
title: Robotic Grasping of Novel Objects using Vision
arxiv: ''
date: '2008-02-01'
added: '2026-11-05'
authors: Ashutosh Saxena, Justin Driemeyer, Andrew Y. Ng
venue: The International Journal of Robotics Research
doi: 10.1177/0278364907087172
pdf: https://ai.stanford.edu/~asaxena/learninggrasp/IJRR_saxena_etal_roboticgraspingofnovelobjects.pdf
website: http://ai.stanford.edu/~asaxena/learninggrasp/
code: ''
topics:
- foundations
- grasping
seminal: true
tldr: A classifier trained only on synthetic images of five object classes predicts where in an image to grasp an object, and the predictions from two or more views are triangulated into a 3-d grasp point without building a 3-d model. A 5-DoF arm picked up novel objects 87.8% of the time and unloaded a dishwasher with 80% success.
abstract: 'We consider the problem of grasping novel objects, specifically ones that are being seen for the first time through vision. Grasping a previously unknown object, one for which a 3-d model is not available, is a challenging problem. Further, even if given a model, one still has to decide where to grasp the object. We present a learning algorithm that neither requires, nor tries to build, a 3-d model of the object. Given two (or more) images of an object, our algorithm attempts to identify a few points in each image corresponding to good locations at which to grasp the object. This sparse set of points is then triangulated to obtain a 3-d location at which to attempt a grasp. This is in contrast to standard dense stereo, which tries to triangulate every single point in an image (and often fails to return a good 3-d model). Our algorithm for identifying grasp locations from an image is trained via supervised learning, using synthetic images for the training set. We demonstrate this approach on two robotic manipulation platforms. Our algorithm successfully grasps a wide variety of objects, such as plates, tape-rolls, jugs, cellphones, keys, screwdrivers, staplers, a thick coil of wire, a strangely shaped power horn, and others, none of which were seen in the training set. We also apply our method to the task of unloading items from dishwashers.'
thumb:
  image: saxena2008-novel-objects/thumb.webp
  width: 568
  height: 619
videos: []
youtube: []
figures:
- image: saxena2008-novel-objects/figure1.webp
  width: 1496
  height: 624
  caption: 'From Figure 3: Synthetic training images (top) and their grasp labels in red (bottom) for the five training classes: martini glasses, mugs, whiteboard erasers, books and pencils.'
- image: saxena2008-novel-objects/figure2.webp
  width: 1490
  height: 858
  caption: 'From Figure 11: The arm picking up a screwdriver, box, tape roll, wine glass, solder tool holder, coffee pot, power horn, cellphone, book, stapler and coffee mug.'
- image: saxena2008-novel-objects/figure3.webp
  width: 601
  height: 419
  caption: 'From Figure 13: Predicted grasping points on objects in a dishwasher; only the top five grasping regions are shown.'
---
## What they do
Grasping methods of the time needed a 3-d model of the object, which stereo rarely delivers for textureless, transparent or reflective objects. This paper skips the model: a learned classifier marks where to pinch-grasp the object (a mug's handle, a glass's neck) in two or more images, and only those points are triangulated into a 3-d grasp position.

## How it works
- **Synthetic training data.** 2500 ray-traced images of five object classes with randomized lighting, camera pose, color and scale, labeled automatically with the grasp region.
- **Patch classifier.** Edge, texture and color filter energies at 3 scales and over a 5x5 neighborhood (459 features) feed a logistic regression that predicts whether a patch contains a grasp point.
- **Probabilistic triangulation.** Each view's grasp probabilities are spread along camera rays into a 3-d grid, with Gaussian noise for camera pose error, and combined naive-Bayes style; the most likely cell is the grasp (1.2 s). A separate model predicts wrist orientation.

## Results
- Grasp-point error is 0.81 cm on synthetic images and 1.84 cm on 14 real objects; without the camera-noise model it is 15.4 cm.
- A 5-DoF arm with a wrist webcam picked up objects similar to the training classes 90.0% of the time and novel classes (keys, duct tape, cellphone, power horn) 87.8%, over 4 trials per object (10 for staplers).
- Unloading a dishwasher, with stereo depth features and some hand-labeled real images: 80% over 20 trials (plates 100%, mugs 60%). A 7-DoF Barrett arm and hand grasped bowls 60% and plates 80% of the time.

## Limitations
It predicts a grasp point and wrist angle, not a full hand configuration. Handle grasps on mugs and jugs fail when small errors make the gripper bump the object, some bowl poses are unreachable for the 5-DoF arm, and silverware against rack walls is hard to grasp. In about 2% of tabletop trials the points picked in different views did not correspond.
