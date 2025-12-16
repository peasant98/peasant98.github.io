---
title: "Next Best Sense: Guiding Vision and Touch with FisherRF for 3D Gaussian Splatting"
collection: publications
permalink: /publication/next-best-sense
excerpt: 'Next Best Sense draws upon state of the art vision models to train few-shot Gaussian Splatting scenes, and turns to impressive next best view selection methods to guide robotic manipulator next best view and touch selection in the wild.'
date: 2025-10-24
venue: '2025 IEEE/International Conference on Robotics and Automation [ICRA]'
header:
  teaser: /files/paper_images/nbs.png
---

Check out our website: [NextBestSense](https://arm.stanford.edu/next-best-sense)! Arxiv [here](https://arxiv.org/abs/2410.04680)


 <img src="/files/paper_images/nbs.png" alt="A visual diagram of our method"> 

 A diagram of our method.

  <img src="/files/paper_images/sam2_depth.png" alt="SAM2 depth alignment"> 

SAM2 depth alignment.


<b>Abstract:</b>

We propose a framework for active next best view and touch selection for robotic manipulators using 3D Gaussian Splatting (3DGS). 3DGS is emerging as a useful explicit 3D scene representation for robotics, as it has the ability to represent scenes in a both photorealistic and geometrically accurate manner. However, in real-world online robotic scenes where the number of views is limited given efficiency requirements, random view selection for 3DGS becomes impractical as views are often overlapping and redundant. We address this issue by proposing an end-to-end online training and active view selection pipeline, which enhances the performance of 3DGS in few-view robotics settings. We first elevate the performance of few-shot 3DGS with a novel semantic depth alignment method using Segment Anything Model 2 (SAM2) that we supplement with Pearson depth and normal loss to improve color and depth reconstruction of real-world scenes. We then extend FisherRF, a next-best-view selection method for 3DGS, to select views and touch poses based on depth uncertainty. We perform online view selection a real robot system during live 3DGS training. We motivate our improvements to few-shot GS scenes, and extend depth-based FisherRF to these scenes, where we demonstrate both qualitative and quantitative improvements on challenging robot scenes.

[Download paper here](/files/papers/nbs.pdf)
