---
title: "VisTacAlign: Co-Training Dexterous Policies on Tactile Human and Robot Demonstrations"
collection: publications
permalink: /publication/vistacalign
excerpt: 'VisTacAlign co-trains 3D-visual-tactile dexterous policies on human and robot demonstrations by closing the human-robot gap in every modality: glove-tracked hand motion is retargeted to the robot hand, the human hand is replaced by the robot hand in the point cloud, and tactile glove signals are aligned to the robot fingertip sensors.'
authors: "Julien Poffet, Matthew Strong, Ankush Dhawan, Baiyu Shi, Shalika Neelaveni, Yujia Yuan, Zhenan Bao, Monroe Kennedy III"
venue: "arXiv"
date: 2026-09-25
teaser: "/assets/teasers/vistacalign.mp4"
teaser_poster: "/assets/teasers/vistacalign.jpg"
featured: true
links:
  website: "https://vis-tac-align.github.io"
  arxiv: "https://arxiv.org/abs/2609.30959"
---

Check out our website: [VisTacAlign](https://vis-tac-align.github.io)! Arxiv [here](https://arxiv.org/abs/2609.30959)

<b>Abstract:</b>

Human demonstrations are a cheap source of data for dexterous manipulation, but co-training a robot policy on them requires closing the human-robot gap in every modality the policy consumes. We present VisTacAlign, a framework for co-training 3D-visual-tactile dexterous policies on human and robot demonstrations. Glove-tracked human hand motion is retargeted to a 17-DoF tactile robot hand with a one-time fingertip correction. The human hand is then erased from both stereo views and replaced by a posed robot-hand mesh painted with pixels from robot recordings, and a real-time stereo foundation model is re-run on the composite, so the human point clouds carry the same stereo errors and visibility as the robot ones. Finally, a capacitive tactile glove is aligned to the robot's fingertip sensors in its signal space, giving one interpretable per-finger force representation. A diffusion transformer consumes point-cloud, proprioceptive, and per-finger tactile tokens. On three real-world tasks requiring precise force (Lego assembly, plucking strawberries of varying size, and activating and lifting a power drill), adding aligned human demonstrations to existing robot data improves over robot-only policies, and ablations show that both tactile input and visual alignment are necessary.
