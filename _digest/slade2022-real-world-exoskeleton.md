---
title: Personalizing exoskeleton assistance while walking in the real world
arxiv: ''
date: '2022-10-01'
added: '2026-11-12'
authors: Patrick Slade, Mykel J. Kochenderfer, Scott L. Delp, Steven H. Collins
pis: [Steven Collins]
venue: Nature
doi: 10.1038/s41586-022-05191-1
pdf: https://www.nature.com/articles/s41586-022-05191-1.pdf
website: ''
code: ''
topics:
- exoskeletons
- assistive-haptics
seminal: true
must_read: true
tldr: A model that ranks ankle-exoskeleton torque patterns from the wearer's ankle motion replaces lab respirometry, so a portable exoskeleton can personalize its assistance during everyday walking. After one hour of optimization on a public sidewalk, assistance cut the energy cost of transport by 17% and raised walking speed by 9% compared with normal shoes.
abstract: Personalized exoskeleton assistance provides users with the largest improvements in walking speed and energy economy but requires lengthy tests under unnatural laboratory conditions. Here we show that exoskeleton optimization can be performed rapidly and under real-world conditions. We designed a portable ankle exoskeleton based on insights from tests with a versatile laboratory testbed. We developed a data-driven method for optimizing exoskeleton assistance outdoors using wearable sensors and found that it was equally effective as laboratory methods, but identified optimal parameters four times faster. We performed real-world optimization using data collected during many short bouts of walking at varying speeds. Assistance optimized during one hour of naturalistic walking in a public setting increased self-selected speed by 9 ± 4% and reduced the energy used to travel a given distance by 17 ± 5% compared with normal shoes. This assistance reduced metabolic energy consumption by 23 ± 8% when participants walked on a treadmill at a standard speed of 1.5 m s⁻¹. Human movements encode information that can be used to personalize assistive devices and enhance performance.
thumb:
  image: slade2022-real-world-exoskeleton/thumb.webp
  width: 630
  height: 622
videos: []
youtube: []
figures:
- image: slade2022-real-world-exoskeleton/figure1.webp
  width: 630
  height: 622
  caption: 'From Figure 1: During optimization the wearer walks through a sequence of k control laws, each a torque pattern over the gait cycle set by four parameters (peak torque, peak time, rise time, fall time). The exoskeleton records ankle angle and ankle velocity under each control law and stores them with the control law parameters for the classifier.'
- image: slade2022-real-world-exoskeleton/figure2.webp
  width: 721
  height: 1064
  caption: 'From Figure 4: The untethered ankle exoskeleton, 1.2 kg per ankle. A motor with a drum and rope transmission produces the assistive torque, electronics on the shank read the sensors, command the motor and run the optimization, and a carbon fibre and aluminium frame, shoe and calf strap carry the forces to the body.'
- image: slade2022-real-world-exoskeleton/figure3.webp
  width: 328
  height: 1091
  caption: 'From Figure 2: Lab tests used a tethered ankle exoskeleton emulator on a treadmill, with respirometry (a). Walking at 1.25 m/s (n = 9), metabolic cost relative to Zero Torque was 15% lower in Normal Shoes, 33% lower with Generic assistance, 41% lower with Metabolic Optimized and 43% lower with Data-driven Optimized assistance (d).'
- image: slade2022-real-world-exoskeleton/figure4.webp
  width: 706
  height: 461
  caption: 'From Figure 5: A participant walking on the public validation course (a), and a map of the 566 m course used for optimization and validation, with the colour scale giving walking speed from 0.9 to 1.6 m/s (b).'
---
## What they do
Human-in-the-loop optimization gives the largest exoskeleton benefits, but it ranks torque patterns with respirometry during long treadmill bouts in a lab. The authors replace respirometry with a model that ranks torque patterns from the wearer's ankle motion, build a portable ankle exoskeleton, and personalize assistance during short bouts of walking on a public sidewalk.

## How it works
- **Classifier.** A lasso-regularized logistic regression, trained on a previous dataset of about 3,600 control laws, predicts which of two control laws costs less energy. Its inputs are differences in gait-cycle-binned ankle angle and velocity and in the four torque parameters. Summed pairwise probabilities rank each generation for the CMA-ES optimizer.
- **Hardware.** 1.2 kg per ankle: a brushless motor and drum-and-cable transmission on the shank give a 54 Nm peak torque, and a Raspberry Pi 4b runs control and optimization at 200 Hz.
- **Real-world optimization.** Each control law is evaluated over 44 continuous steps of a walking bout. Data go into three speed bins, each with its own optimization of peak torque and rise time, and a speed-adaptive controller interpolates between them on every step.

## Results
- Tethered treadmill tests (n = 9): data-driven optimization took 32 min instead of 128, came within 5% of the metabolic-optimized parameters, and lowered metabolic cost 43% versus Zero Torque (metabolic optimization: 41%).
- Outdoors, after about 1 h of optimization (n = 10): cost of transport fell 17 ± 5% and walking speed rose 9 ± 4% versus Normal Shoes, roughly twice the benefit of Generic Speed-adaptive assistance.
- On a treadmill, the same assistance cut metabolic cost 16% at 1.25 m/s, 23% at 1.5 m/s and 18% on a 10° incline versus Normal Shoes.

## Limitations
The model approximates a biological relationship, so there is no guarantee of optimality, and the outdoor optimizer had not reached steady state after an hour. Participants were healthy adults with exoskeleton experience; tests at other speeds, inclines and with speed adaptation used three people, and several participants hit the 54 Nm torque limit. The prototype would need substantial work for unsupervised daily use.
