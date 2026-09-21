---
title: "Touch-GS: Visual-Tactile Supervised 3D Gaussian Splatting
"
collection: publications
permalink: /publication/touch-gs
excerpt: 'Touch-GS combines the power of vision and touch to generate high-quality few-shot and challenging scenes, such as few-view object centric scenes, mirrors, and transparent objects.'
authors: "Aiden Swann*, Matthew Strong*, Won Kyung Do, Gadiel Sznaier Camps, Mac Schwager, Monroe Kennedy III"
venue: "IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)"
date: 2024-10-01
teaser: "/assets/teasers/touch-gs.mp4"
teaser_poster: "/assets/teasers/touch-gs.jpg"
featured: true
badge: "Oral"
links:
  website: "https://touch-gs.github.io/"
  arxiv: "https://arxiv.org/abs/2403.09875"
  camera_ready: "https://ieeexplore.ieee.org/abstract/document/10802412"
---

Check out our website: [TouchGS](https://armlabstanford.github.io/touch-gs)! Arxiv [here](https://arxiv.org/abs/2403.09875)

<video id="splash-video" autoplay controls muted loop playsinline
              preload="metadata" width="100%">
              <source src="/files/videos/all-renders.mp4"
                type="video/mp4">
            </video>

 <img src="/files/paper_images/touch-gs-method.png" alt="A visual diagram of our method"> 

 A diagram of our method.

  <img src="/files/paper_images/touch-gs-results.jpg" alt="Touch-GS qualitative results"> 

Touch-GS results.


<b>Abstract:</b>

In this work, we propose a novel method to supervise 3D Gaussian Splatting (3DGS) scenes using optical tactile sensors. Optical tactile sensors have become widespread in their use in robotics for manipulation and object representation; however, raw optical tactile sensor data is unsuitable to directly supervise a 3DGS scene. Our representation leverages a Gaussian Process Implicit Surface to implicitly represent the object, combining many touches into a unified representation with uncertainty. We merge this model with a monocular depth estimation network, which is aligned in a two stage process, coarsely aligning with a depth camera and then finely adjusting to match our touch data. For every training image, our method produces a corresponding fused depth and uncertainty map. Utilizing this additional information, we propose a new loss function, variance weighted depth supervised loss, for training the 3DGS scene model. We leverage the DenseTact optical tactile sensor and RealSense RGB-D camera to show that combining touch and vision in this manner leads to quantitatively and qualitatively better results than vision or touch alone in a few-view scene syntheses on opaque as well as on reflective and transparent objects.

[Download paper here](/files/papers/touch-gs.pdf)
