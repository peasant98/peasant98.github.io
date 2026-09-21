---
title: "UniQueR: Unified Query-based Feedforward 3D Reconstruction"
collection: publications
permalink: /publication/uniquer
excerpt: 'UniQueR formulates feedforward reconstruction as sparse 3D query inference, learning compact 3D anchor points that infer scene structure including occluded geometry in a single forward pass.'
authors: "Chensheng Peng, Quentin Herau, Jiezhi Yang, Yichen Xie, Yihan Hu, Wenzhao Zheng, Matthew Strong, Masayoshi Tomizuka, Wei Zhan"
venue: "European Conference on Computer Vision (ECCV)"
date: 2026-09-01
teaser: "/assets/teasers/uniquer.jpg"
links:
  arxiv: "https://arxiv.org/abs/2603.22851"
  camera_ready: "https://link.springer.com/chapter/10.1007/978-3-032-37032-7_20"
---

Arxiv [here](https://arxiv.org/abs/2603.22851)

<b>Abstract:</b>

Existing feedforward models such as DUSt3R, VGGT, and AnySplat predict per-pixel point maps or pixel-aligned Gaussians, which remain fundamentally 2.5D and limited to visible surfaces. UniQueR instead learns a compact set of 3D anchor points that act as explicit geometric queries in global 3D space, each spawning a set of 3D Gaussians for differentiable rendering. On Mip-NeRF 360 and VR-NeRF it surpasses state-of-the-art feedforward methods in rendering quality and geometric accuracy with an order of magnitude fewer primitives.
