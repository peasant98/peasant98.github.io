---
title: A Flexible New Technique for Camera Calibration
arxiv: ''
date: '2000-11-01'
added: '2026-11-05'
authors: Zhengyou Zhang
venue: IEEE Transactions on Pattern Analysis and Machine Intelligence
doi: 10.1109/34.888718
pdf: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr98-71.pdf
website: http://research.microsoft.com/~zhang/Calib/
code: ''
topics:
- robot-vision
- foundations
seminal: true
must_read: true
tldr: Calibrate a camera from a few photos of a printed flat pattern held at different orientations, using a closed-form solution from plane homographies and then a maximum-likelihood refinement with radial distortion. On a real camera, results from 2 to 5 images agree within about 2 pixels in focal length, with reprojection errors of 0.3-0.4 pixels.
abstract: 'We propose a flexible new technique to easily calibrate a camera. It is well suited for use without specialized knowledge of 3D geometry or computer vision. The technique only requires the camera to observe a planar pattern shown at a few (at least two) different orientations. Either the camera or the planar pattern can be freely moved. The motion need not be known. Radial lens distortion is modeled. The proposed procedure consists of a closed-form solution, followed by a nonlinear refinement based on the maximum likelihood criterion. Both computer simulation and real data have been used to test the proposed technique, and very good results have been obtained. Compared with classical techniques which use expensive equipment such as two or three orthogonal planes, the proposed technique is easy to use and flexible. It advances 3D computer vision one step from laboratory environments to real world use.'
thumb:
  image: zhang2000-camera-calibration/thumb.webp
  width: 960
  height: 1012
videos: []
youtube: []
figures:
- image: zhang2000-camera-calibration/figure1.webp
  width: 1321
  height: 1393
  caption: 'From Figure 4: the five real images of the printed 8x8-square pattern used for calibration, with the extracted corners marked. The lens distortion is clearly visible.'
- image: zhang2000-camera-calibration/figure2.webp
  width: 1241
  height: 485
  caption: 'From Figure 5: the first two images after correcting radial distortion with the estimated coefficients. The curved pattern is now straight.'
- image: zhang2000-camera-calibration/figure3.webp
  width: 1305
  height: 424
  caption: 'From Figure 7: three rendered views of a tea tin, partially reconstructed from two images taken with the calibrated camera.'
---
## What they do
Classical calibration needs an object of known 3D geometry, usually two or three orthogonal planes. Self-calibration needs no target but is not always reliable. Zhang's method sits in between: the camera only has to see a printed flat pattern in at least two orientations. The pattern or the camera is moved by hand, and the motion need not be known.

## How it works
- **Plane homographies.** Each image of the pattern gives a homography H = A[r1 r2 t]. Because r1 and r2 are orthonormal, each H gives two linear constraints on B = A^-T A^-1, the image of the absolute conic.
- **Closed-form solution.** Stacking the constraints from n images gives Vb = 0, solved by SVD. Three images fix all five intrinsics, or two if skew is set to zero. Each view's extrinsics then follow from its H.
- **Maximum-likelihood refinement.** Levenberg-Marquardt minimizes reprojection error over all parameters, including two radial distortion coefficients, and converges in 3-5 iterations.
- **Degenerate cases.** A pure translation, or a plane parallel to an earlier position, adds no constraints.

## Results
- Simulation (3 planes, 0.5 px noise): errors are under 0.3% in α and β and around 1 px in the principal point. They drop sharply from 2 to 3 images and are lowest with the plane tilted about 45°.
- Real 640x480 CCD camera, 256 corners: estimates from 2 to 5 images agree, with α between 830.47 and 832.50. With 2 images, refinement cuts RMS reprojection error from 0.761 to 0.295 px. Across 4-image subsets the aspect ratio is 0.99995 ± 0.00012.
- Noise of up to 15% of a square's side (2 mm) in the model points changes α and β by under 0.02% but moves the principal point by about 20 px.

## Limitations
Only one real camera is reported, and distortion is limited to two radial terms. The pattern is assumed to be exactly known and planar. Systematic bending hurts more than random noise, and the author judges results usable below about 3% non-planarity. The simulations ignore the less precise corner detection under steep foreshortening.
