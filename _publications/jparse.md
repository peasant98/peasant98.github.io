---
title: "J-PARSE: Jacobian-based Projection Algorithm for Resolving Singularities Effectively in Inverse Kinematic Control of Serial Manipulators"
collection: publications
permalink: /publication/jparse
excerpt: 'J-PARSE is a method for smooth first-order inverse kinematic control of serial manipulators near kinematic singularities, expanding the available workspace for applications in servoing, teleoperation, and learning.'
date: 2025-05-01
venue: 'ArXiv'
---

Check out our website: [J-PARSE](https://jparse-manip.github.io/)! Arxiv [here](https://arxiv.org/abs/2505.00306)

 <img src="/files/paper_images/jparse.png" alt="A visual diagram of our method">

 A diagram of our method.

<b>Abstract:</b>

We present J-PARSE, a method for smooth first-order inverse kinematic control of a serial manipulator near kinematic singularities. The commanded end-effector velocity is interpreted component-wise, according to the available mobility in each dimension of the task space. A substitute "Safety" Jacobian matrix is created, keeping the aspect ratio of the manipulability ellipsoid above a threshold value. The desired motion is then projected onto non-singular and singular directions, and the latter projection scaled down by a factor informed by the threshold value. Velocity control with J-PARSE is benchmarked against the Least-Squares and Damped Least-Squares inversions of the Jacobian, and shows high accuracy in reaching and leaving singular target poses. By expanding the available workspace of manipulators, this method finds applications in servoing, teleoperation, and learning.

<b>Authors:</b> Shivani Guptasarma, Matthew Strong, Honghao Zhen, Monroe Kennedy III

<b>Note:</b> This work was supported by Amazon Science. Matthew Strong was supported by NSF Graduate Research Fellowship DGE-2146755.
