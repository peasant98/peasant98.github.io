---
title: Object Modeling by Registration of Multiple Range Images
arxiv: ''
date: '1991-04-01'
added: '2026-11-05'
authors: Yang Chen, Gérard Medioni
venue: IEEE International Conference on Robotics and Automation (ICRA)
doi: 10.1109/ROBOT.1991.132043
pdf: https://graphics.stanford.edu/courses/cs164-10-spring/Handouts/paper_chenmedioni.pdf
website: ''
code: ''
topics:
- robot-vision
- 3d-perception
seminal: true
tldr: Register overlapping range images by iteratively minimizing the distance from points on one view to tangent planes of the other, starting from a rough initial pose, then merge the registered views into a complete object model. On two view pairs rotated by 15 and 20 degrees, the recovered rotations were -15.06 and -19.75 degrees.
abstract: 'We study the problem of creating a complete model of a physical object. Although this may be possible using intensity images, we use here range images which directly provide access to three dimensional information. The first problem that we need to solve is to find the transformation between the different views. Previous approaches have either assumed this transformation to be known (which is extremely difficult for a complete model), or computed it with feature matching (which is not accurate enough for integration). In this paper, we propose a new approach which works on range data directly, and registers successive views with enough overlapping area to get an accurate transformation between views. This is performed by minimizing a functional which does not require point to point matches. We give the details of the registration method and modeling procedure, and illustrate them on real range images of complex objects.'
thumb:
  image: chen1991-range-registration/thumb.webp
  width: 553
  height: 611
videos: []
youtube: []
figures:
- image: chen1991-range-registration/figure1.webp
  width: 857
  height: 712
  caption: 'From Figure 1: two range images of a Mozart bust taken from different views, shown as shaded images.'
- image: chen1991-range-registration/figure2.webp
  width: 854
  height: 753
  caption: 'From Figure 2: in 2D, surfaces Q and P before the current transform is applied (a), and the distances from the transformed P to the tangent planes of Q that the algorithm minimizes (b).'
- image: chen1991-range-registration/figure3.webp
  width: 854
  height: 909
  caption: 'From Figure 4: the first Mozart view after registration, its registration error image, and the error histogram (mean -0.046 mm, standard deviation 0.65 mm).'
- image: chen1991-range-registration/figure4.webp
  width: 852
  height: 1373
  caption: 'From Figure 6: photos of the wood blob and the plaster tooth, wireframes of the models built from their range images, and renderings of those models.'
---

## What they do
To build a complete 3D model of a physical object from several range images, the views must first be brought into one frame. Earlier systems either assumed the transformation between views was known from a calibrated setup or estimated it by matching surface features, which the authors find not accurate enough for integration. Chen and Medioni refine a rough initial transformation directly on the range data, without point-to-point matches, then merge the registered views into one model.

## How it works
- **Point-to-plane error.** Control points on view P are picked on a regular grid, kept only in smooth areas (a plane fit with low residual). Each is pushed along its surface normal to meet view Q, and the error is the summed squared distance to Q's tangent plane there. Each point is constrained in one direction only, which the authors found converges faster than distances to specific points.
- **Line-surface intersection.** The normal line is intersected with local tangent planes of Q, starting from an orthographic projection; this usually takes fewer than 5 iterations.
- **Iterative least squares.** Each iteration solves for an update transform, linearized by assuming small rotations, until the change in mean error falls below a threshold.
- **Modeling.** 4 to 8 turntable side views plus top and bottom views (user-estimated angles) are registered, each against all views merged so far to avoid error accumulation, then resampled into cylindrical or spherical coordinates and averaged where they overlap.

## Results
- With the identity as initial guess, recovered rotations were -15.06 degrees (actual -15) for a Mozart bust and -19.75 degrees (actual -20) for a model tooth.
- Error images were comparable to the 0.5 mm data resolution; the range finder is accurate to about 1 mm.
- A wood blob and a plaster tooth (about 10 cm) were modeled from 8 side views and 6 to 8 top and bottom views, giving smooth models; the authors note that poorly registered views would not fit together and would blur ridges and valleys.

## Limitations
The error may be non-convex, so a good initial transformation is required; here it came from the turntable or the user. Cylindrical and spherical coordinates cannot represent more complex objects, and the intersection step assumes locally smooth surfaces.
