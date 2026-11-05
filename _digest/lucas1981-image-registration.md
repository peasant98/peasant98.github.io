---
title: An Iterative Image Registration Technique with an Application to Stereo Vision
arxiv: ''
date: '1981-08-01'
added: '2026-11-05'
authors: Bruce D. Lucas, Takeo Kanade
venue: International Joint Conference on Artificial Intelligence (IJCAI)
doi: ''
pdf: https://www.ijcai.org/Proceedings/81-2/Papers/017.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: Align two images by using the spatial intensity gradient to step the displacement toward the best match in a Newton-Raphson-style iteration, instead of trying every displacement. A converging iteration takes O(M² log N) steps on average versus O(M²N²) for exhaustive search, and the same method recovers object depths in a stereo pair.
abstract: Image registration finds a variety of applications in computer vision. Unfortunately, traditional image registration techniques tend to be costly. We present a new image registration technique that makes use of the spatial intensity gradient of the images to find a good match using a type of Newton-Raphson iteration. Our technique is faster because it examines far fewer potential matches between the images than existing techniques. Furthermore, this registration technique can be generalized to handle rotation, scaling and shearing. We show how our technique can be adapted for use in a stereo vision system.
thumb:
  image: lucas1981-image-registration/thumb.webp
  width: 502
  height: 247
videos: []
youtube: []
figures:
- image: lucas1981-image-registration/figure1.webp
  width: 502
  height: 247
  caption: 'From Figure 1: The image registration problem: find the disparity h that makes image G(x) best match F(x + h) over a region of interest R.'
- image: lucas1981-image-registration/figure2.webp
  width: 326
  height: 253
  caption: 'From Figure 2: Two one-dimensional curves F(x) and G(x) = F(x + h), offset by a horizontal disparity h; the algorithm is first derived for this case.'
- image: lucas1981-image-registration/figure3.webp
  width: 364
  height: 319
  caption: 'From Figure 3: Stereo geometry. An object at position x in picture 1 and distance z lies at p(x,z) in space and appears at q(p,c) in picture 2, where c are the camera parameters.'
---
## What they do
Registering two images means finding the displacement h that makes F(x + h) best match G(x) over a region R. Exhaustive search over an MxM range of displacements costs O(M²N²) for an NxN image. Lucas and Kanade instead use the spatial intensity gradient to tell the search which way to move, assuming the images start in approximate registration, and apply the method to depth estimation from a stereo pair.

## How it works
- **Linearize and solve.** For small h, F(x + h) ≈ F(x) + h F'(x). Minimizing the squared difference to G(x) then gives h in closed form as a gradient-weighted sum of G − F over R; in 2D this means accumulating five products per pixel.
- **Iterate.** Shift F by the estimate and repeat, a Newton-Raphson-style iteration. A weighting term down-weights pixels where the linear approximation is poor; derivatives come from one-pixel differences.
- **Coarse-to-fine.** For a sinusoid the iteration converges for misregistrations up to half a wavelength, so smoothing the images widens the convergence range, and low-resolution matches seed higher-resolution ones.
- **Generalizations.** The same linearization handles an arbitrary linear transform (rotation, scaling, shearing) plus contrast and brightness terms. For stereo it solves for object depth z and five camera parameters via the chain rule through the camera projection.

## Results
- Analysis: a converging iteration takes O(M² log N) steps on average, versus O(M²N²) for exhaustive search.
- Stereo session on bandpass-filtered images: two hand-selected regions started at depth 7.0 (in units of the camera baseline) and converged after seven iterations to 6.05 and 5.86.
- One octave higher, five new points initialized from those depths converged after five iterations to depths between 5.76 and 6.09.
- Camera parameters for this session were found separately from hand-picked matching points.

## Limitations
The system needs considerable hand guidance: interest points and initial depths are chosen by hand. It converges only when the initial estimate places each object within about its own size of the true position, smoothing trades accuracy for range, and depth jumps at object edges are left to future work.
