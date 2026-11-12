---
title: A generic non-invasive neuromotor interface for human-computer interaction
arxiv: ''
date: '2025-09-01'
added: '2026-11-12'
authors: Patrick Kaifosh, Thomas R. Reardon, CTRL-labs at Reality Labs
venue: Nature
doi: 10.1038/s41586-025-09255-w
pdf: https://www.nature.com/articles/s41586-025-09255-w.pdf
website: ''
code: https://github.com/facebookresearch/generic-neuromotor-interface-data
topics:
- bci
- hri-teleop
seminal: true
tldr: A dry-electrode wristband reads muscle signals (sEMG), and networks trained on data from thousands of people decode wrist movement, finger gestures and handwriting for new users without calibration. Naive users reach 0.88 gesture detections per second and handwrite at 20.9 words per minute; 20 min of a user's own data cuts handwriting errors a further 16%.
abstract: 'Since the advent of computing, humans have sought computer input technologies that are expressive, intuitive and universal. While diverse modalities have been developed, including keyboards, mice and touchscreens, they require interaction with a device that can be limiting, especially in on-the-go scenarios. Gesture-based systems use cameras or inertial sensors to avoid an intermediary device, but tend to perform well only for unobscured movements. By contrast, brain–computer or neuromotor interfaces that directly interface with the body’s electrical signalling have been imagined to solve the interface problem, but high-bandwidth communication has been demonstrated only using invasive interfaces with bespoke decoders designed for single individuals. Here, we describe the development of a generic non-invasive neuromotor interface that enables computer input decoded from surface electromyography (sEMG). We developed a highly sensitive, easily donned sEMG wristband and a scalable infrastructure for collecting training data from thousands of consenting participants. Together, these data enabled us to develop generic sEMG decoding models that generalize across people. Test users demonstrate a closed-loop median performance of gesture decoding of 0.66 target acquisitions per second in a continuous navigation task, 0.88 gesture detections per second in a discrete-gesture task and handwriting at 20.9 words per minute. We demonstrate that the decoding performance of handwriting models can be further improved by 16% by personalizing sEMG decoding models. To our knowledge, this is the first high-bandwidth neuromotor interface with performant out-of-the-box generalization across people.'
thumb:
  image: kaifosh2025-neuromotor-interface/thumb.webp
  width: 960
  height: 845
videos: []
youtube: []
figures:
- image: kaifosh2025-neuromotor-interface/figure1.webp
  width: 1600
  height: 1408
  caption: 'From Figure 1: Data collection. A participant wears the sEMG wristband, which talks to the laptop through a Bluetooth receiver, and performs the hand and wrist movements prompted on screen while a webcam films the hand.'
- image: kaifosh2025-neuromotor-interface/figure2.webp
  width: 593
  height: 656
  caption: 'From Figure 1: The sEMG research wristband. 48 dry electrode pins form 16 bipolar channels around the wrist, and a compute capsule digitizes the signal and streams it over Bluetooth.'
- image: kaifosh2025-neuromotor-interface/figure3.webp
  width: 670
  height: 606
  caption: 'From Figure 3: Closed-loop performance of naive users in a practice block and two evaluation blocks. Wrist cursor (d, e): target-acquisition and dial-in times, with motion-capture and trackpad baselines as dashed lines. Discrete gestures (f, g): first-hit probability and gesture completion rate, with a gaming-controller baseline.'
- image: kaifosh2025-neuromotor-interface/figure4.webp
  width: 364
  height: 390
  caption: 'From Figure 5: Relative reduction in offline handwriting character error rate from fine-tuning the generic model on one person, against the number of participants it was pretrained on. One line per personalization budget from 1 to 20 min; more data gives larger gains, but the gains shrink as the generic model grows.'
---
## What they do
Meta's CTRL-labs built a wristband that records surface electromyography (sEMG), the electrical activity of the forearm muscles, and decoders that work for people they were never trained on, unlike earlier high-bandwidth interfaces, which were invasive and calibrated per person. The generic models drive 1D cursor control from wrist angle, nine thumb and finger gestures, and handwriting with an imaginary pen.

## How it works
- **Hardware.** The sEMG-RD is a wireless dry-electrode band with 16 bipolar channels sampled at 2 kHz with 2.46 μVrms noise, made in four sizes. It is sensitive enough to pick up putative single motor-unit action potentials.
- **Data at scale.** Automated prompting software recorded 162 to 6,627 participants per task, re-donning the band between sessions. Wrist-angle labels come from motion capture.
- **Models.** An LSTM regresses wrist-angle velocity from spectral features; a 1D convolution and three LSTM layers detect gestures from raw sEMG; a 15-layer streaming Conformer trained with CTC transcribes characters. The wrist and handwriting models average over ±1-channel rotations of the band.
- **Personalization.** Optionally fine-tune the whole generic handwriting model on one user's data.

## Results
- Single-person gesture models transfer poorly to others; generic models improve as a power law in training participants and model size.
- Offline on held-out people: over 90% accuracy for gestures and handwriting, and under 13°/s error on wrist velocity.
- Closed loop, naive users completed every trial: 0.66 target acquisitions/s with the wrist (1.51 s median acquisition vs 0.68 s on a trackpad), 0.88 gestures/s (1.45 with a game controller) and 20.9 words/min handwriting (25.1 writing on a surface without a pen).
- 20 min of personal data improves the 6,400-participant handwriting model's median error by 16%. Gains are largest for users the generic model serves worst; a model personalized to one person helped another in only 7% of pairs.

## Limitations
Every sEMG decoder is slower than its conventional baseline. Continuous control is shown for one degree of freedom only, and some participants needed coaching during evaluation. All participants were able-bodied, and the authors say it is unclear whether the models generalize to clinical populations.
