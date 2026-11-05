---
title: 'ORB: An Efficient Alternative to SIFT or SURF'
arxiv: ''
date: '2011-11-01'
added: '2026-11-05'
authors: Ethan Rublee, Vincent Rabaud, Kurt Konolige, Gary Bradski
venue: IEEE International Conference on Computer Vision (ICCV)
doi: 10.1109/ICCV.2011.6126544
pdf: https://sites.cc.gatech.edu/classes/AY2024/cs4475_summer/images/ORB_an_efficient_alternative_to_SIFT_or_SURF.pdf
website: ''
code: ''
topics:
- robot-vision
- foundations
seminal: true
tldr: ORB is a binary feature that adds an orientation to FAST corners and learns a rotation-aware set of BRIEF tests. It matches about as well as SIFT in their tests and takes 15.3 ms per 640x480 frame, against 217.3 ms for SURF and 5228.7 ms for SIFT.
abstract: 'Feature matching is at the base of many computer vision problems, such as object recognition or structure from motion. Current methods rely on costly descriptors for detection and matching. In this paper, we propose a very fast binary descriptor based on BRIEF, called ORB, which is rotation invariant and resistant to noise. We demonstrate through experiments how ORB is at two orders of magnitude faster than SIFT, while performing as well in many situations. The efficiency is tested on several real-world applications, including object detection and patch-tracking on a smart phone.'
thumb:
  image: rublee2011-orb/thumb.webp
  width: 708
  height: 289
videos: []
youtube: []
figures:
- image: rublee2011-orb/figure1.webp
  width: 708
  height: 289
  caption: 'From Figure 1: ORB matches between real images with a viewpoint change. Green lines are valid matches, red circles are unmatched points.'
- image: rublee2011-orb/figure2.webp
  width: 707
  height: 355
  caption: 'From Figure 6: binary tests chosen only for high variance under orientation (left) and the learned rBRIEF tests (right). Color shows each test''s maximum pairwise correlation, black and purple lowest.'
- image: rublee2011-orb/figure3.webp
  width: 617
  height: 423
  caption: 'From Figure 7: percentage of inlier matches against in-plane rotation angle for ORB (rBRIEF), SIFT, SURF and BRIEF, with Gaussian noise of 10.'
- image: rublee2011-orb/figure4.webp
  width: 553
  height: 804
  caption: 'From Figure 12: textured object recognition with pose estimation; blue training features are overlaid where an object''s pose was found. The top image misses two objects, the bottom finds all of them.'
---
## What they do
SIFT is too slow for real-time systems such as visual odometry and for low-power devices such as phones. ORB (Oriented FAST and Rotated BRIEF) is a cheaper replacement built from the FAST keypoint detector and the BRIEF binary descriptor. Its main fix is BRIEF's sensitivity to in-plane rotation. Unlike SIFT and SURF, it carries no licensing restrictions.

## How it works
- **oFAST.** FAST-9 corners on a five-level image pyramid (scale factor √2), ranked by a Harris corner measure to keep the top N. Each keypoint gets an orientation from its patch's intensity centroid, which recovers the angle of rotated noisy patches better than gradient-histogram or max-gradient methods.
- **Steered BRIEF.** 256 binary intensity comparisons between 5x5 sub-windows of a smoothed 31x31 patch, rotated by the keypoint angle using a lookup table in 12° steps. Steering lowers the variance of the bits and leaves them correlated, so the descriptor discriminates less well.
- **rBRIEF.** A greedy search over 205,590 candidate tests on about 300k PASCAL keypoints keeps tests whose mean is near 0.5 and that are uncorrelated with the tests already chosen, until 256 remain.
- **Large-scale matching.** Multi-probe LSH on Hamming distance; less correlated bits give more even hash buckets.

## Results
- Synthetic rotation with noise: ORB has the best inlier rate, over 70%, while BRIEF falls off after about 10°. SIFT loses about 10% per noise increment of 5; ORB degrades much more slowly.
- Real images (inlier %): outdoor boat scene ORB 45.8 vs SURF 28.6 and SIFT 30.2; indoor magazines ORB 36.2 vs SURF 38.3 and SIFT 34.0.
- Speed, single thread on a 2.8 GHz i7: 15.3 ms per frame vs 217.3 ms (SURF) and 5228.7 ms (SIFT). It runs at 640x480 and 7 Hz on a 1 GHz ARM phone.
- Object detection on 49 household objects with PROSAC and EPnP: 61% of objects retrieved. Detection takes 14 ms and LSH matching 17 ms against a database of 1.2M descriptors.

## Limitations
Scale invariance is not adequately addressed: ORB only uses an image pyramid, and per-keypoint scale from depth cues or tuning the number of octaves was not explored. On the indoor magazine set it is no better than SIFT or SURF. The centroid orientation becomes unstable when the centroid lies near the patch center, which the authors found rare for FAST corners.
