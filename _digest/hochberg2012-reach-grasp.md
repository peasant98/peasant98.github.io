---
title: Reach and grasp by people with tetraplegia using a neurally controlled robotic arm
arxiv: ''
date: '2012-05-01'
added: '2026-11-12'
authors: Leigh R. Hochberg, Daniel Bacher, Beata Jarosiewicz, Nicolas Y. Masse, John D. Simeral, Joern Vogel, Sami Haddadin, Jie Liu, Sydney S. Cash, Patrick van der Smagt, John P. Donoghue
pis: [Sami Haddadin]
venue: Nature
doi: 10.1038/nature11076
pdf: https://ecor.mgh.harvard.edu/content/files/SAC/HochbergNature2012_11076.pdf
website: ''
code: ''
topics:
- bci
- assistive-haptics
seminal: true
must_read: true
tldr: Two people paralyzed by brainstem stroke reached for and grasped foam balls with a robot arm, driving its 3D velocity and hand closing with signals from a 96-channel array in motor cortex. Grasp success reached 62.2% of trials for one participant, and the other drank coffee from a bottle in 4 of 6 attempts.
abstract: 'Paralysis following spinal cord injury, brainstem stroke, amyotrophic lateral sclerosis and other disorders can disconnect the brain from the body, eliminating the ability to perform volitional movements. A neural interface system could restore mobility and independence for people with paralysis by translating neuronal activity directly into control signals for assistive devices. We have previously shown that people with long-standing tetraplegia can use a neural interface system to move and click a computer cursor and to control physical devices. Able-bodied monkeys have used a neural interface system to control a robotic arm, but it is unknown whether people with profound upper extremity paralysis or limb loss could use cortical neuronal ensemble signals to direct useful arm actions. Here we demonstrate the ability of two people with long-standing tetraplegia to use neural interface system-based control of a robotic arm to perform three-dimensional reach and grasp movements. Participants controlled the arm and hand over a broad space without explicit training, using signals decoded from a small, local population of motor cortex (MI) neurons recorded from a 96-channel microelectrode array. One of the study participants, implanted with the sensor 5 years earlier, also used a robotic arm to drink coffee from a bottle. Although robotic reach and grasp actions were not as fast or accurate as those of an able-bodied person, our results demonstrate the feasibility for people with tetraplegia, years after injury to the central nervous system, to recreate useful multidimensional control of complex devices directly from a small sample of neural signals.'
thumb:
  image: hochberg2012-reach-grasp/thumb.webp
  width: 960
  height: 608
videos: []
youtube: []
figures:
- image: hochberg2012-reach-grasp/figure1.webp
  width: 590
  height: 299
  caption: 'From Figure 1: Overhead view of the setup. The participant sits at a table from which a motor raises one foam-ball target (purple) at a time; the robot arm is to the right and slightly in front, and two cameras record every session.'
- image: hochberg2012-reach-grasp/figure2.webp
  width: 435
  height: 296
  caption: 'From Figure 1: Example DLR trial. The robot hand starts to the left of the target, and the participant moves it around and to the right of the target to approach it with the open part of the hand.'
- image: hochberg2012-reach-grasp/figure3.webp
  width: 1051
  height: 666
  caption: 'From Figure 2: Participant S3 uses the DLR arm to grasp a bottle, bring it to her mouth, drink coffee through a straw and put it back on the table, in her first successful trial.'
---
## What they do
Two people with tetraplegia after brainstem stroke (S3 and T2) controlled a robot arm and hand in 3D with neural activity from a 96-channel microelectrode array in motor cortex. S3 used the DLR Light-Weight Robot III and the DEKA prosthetic arm, with an array implanted 5.3 years earlier; T2 used the DEKA arm.

## How it works
- **Signals.** Threshold crossings per channel in 100 ms (S3) or 20 ms (T2) bins, with no spike sorting.
- **Decoders.** A Kalman filter decodes 3D hand velocity. In parallel, a linear classifier detects imagined hand squeezing and closes the robot hand (one open/close action, fixed orientation).
- **Calibration.** About 4 min of imagining control while watching the arm move, then four to eight closed-loop blocks with less and less help, about 31 min in all.
- **Task.** Servos raise 6 cm foam balls on flexible rods. The hand opens only 1.3x (DLR) or 1.8x (DEKA) the ball size, so reaches often need curved paths.

## Results
- Over 158 trials (S3) and 45 (T2), touch rates were 48.8% (S3, DLR), 69.2% (S3, DEKA) and 95.6% (T2); grasp rates were 21.3%, 46.2% and 62.2%, above chance in every session.
- Median time to touch was about 6 s for both; touch plus grasp took 9.4 ± 6.2 s (S3) and 9.5 ± 5.5 s (T2).
- With 2D tabletop control and the grasp signal triggering four scripted hand actions in turn, S3 picked up a bottle, drank coffee through a straw and set it down in 4 of 6 attempts. It was the first time since her stroke, over 14 years earlier, that she drank on her own.

## Limitations
Reaches and grasps were slower and less accurate than an able-bodied person's. Grasp was a single open/close state with fixed hand orientation, and drinking relied on automated hand actions. Only two participants were tested, and S3's array gave smaller spikes on fewer channels than in earlier years. Trials were scored by eye from video.
