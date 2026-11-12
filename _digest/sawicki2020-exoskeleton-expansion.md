---
title: 'The exoskeleton expansion: improving walking and running economy'
arxiv: ''
date: '2020-12-01'
added: '2026-11-12'
authors: Gregory S. Sawicki, Owen N. Beck, Inseung Kang, Aaron J. Young
venue: Journal of NeuroEngineering and Rehabilitation
doi: 10.1186/s12984-020-00663-9
pdf: https://jneuroengrehab.biomedcentral.com/track/pdf/10.1186/s12984-020-00663-9
website: ''
code: ''
topics:
- exoskeletons
seminal: true
tldr: A review of the 23 studies, through December 2019, in which a lower-limb exoskeleton made walking or running cheaper than going without one. On level ground the devices cut net metabolic cost by 3.3-19.8% for walking and 3.9-8.0% for running.
abstract: 'Since the early 2000s, researchers have been trying to develop lower-limb exoskeletons that augment human mobility by reducing the metabolic cost of walking and running versus without a device. In 2013, researchers finally broke this ''metabolic cost barrier''. We analyzed the literature through December 2019, and identified 23 studies that demonstrate exoskeleton designs that improved human walking and running economy beyond capable without a device. Here, we reviewed these studies and highlighted key innovations and techniques that enabled these devices to surpass the metabolic cost barrier and steadily improve user walking and running economy from 2013 to nearly 2020. These studies include, physiologically-informed targeting of lower-limb joints; use of off-board actuators to rapidly prototype exoskeleton controllers; mechatronic designs of both active and passive systems; and a renewed focus on human-exoskeleton interface design. Lastly, we highlight emerging trends that we anticipate will further augment wearable-device performance and pose the next grand challenges facing exoskeleton technology for augmenting human mobility.'
thumb:
  image: sawicki2020-exoskeleton-expansion/thumb.webp
  width: 960
  height: 725
videos: []
youtube: []
figures:
- image: sawicki2020-exoskeleton-expansion/figure1.webp
  width: 1183
  height: 1788
  caption: 'From Figure 1: Milestone exoskeletons that improved natural walking (left) and running (right) economy versus no device, 2013-2020. Tethered devices are blue, autonomous red; circles, triangles and squares mark ankle, knee and hip assistance.'
- image: sawicki2020-exoskeleton-expansion/figure2.webp
  width: 1600
  height: 825
  caption: 'From Figure 2: Change in net metabolic cost versus no device for each study, by publication year. Red is autonomous, blue tethered; the symbol gives the assisted joint(s), an asterisk a special condition and a cross a passive device.'
---
## What they do
A review of lower-limb exoskeletons that break the "metabolic cost barrier": walking or running costs the user less energy with the device than without it. The authors searched Web of Science through December 2019 (235 indexed articles). They kept only studies that statistically improved economy against a no-exoskeleton condition. 23 publications qualified, six of them only under "special" penalties such as load carriage, inclines, stair ascent or enforced long steps. They chart progress since the first success in 2013 and what enabled it.

## How it works
- **Study log.** Each study is tabulated by metabolic reduction, sample size, joint, tethered or autonomous, active or passive, gait, speed and device mass.
- **Testbeds.** Off-board motors driving light end-effectors through Bowden cables or air hoses allow high-throughput treadmill studies of assistance timing and magnitude, and can emulate designs before they are built.
- **Passive devices.** They store and return energy without net positive work and are cheap and light (400 g for Collins et al.'s ankle device), but their properties are fixed. The authors propose pseudo-passive designs that spend a little power retuning the passive structure while it is unloaded.
- **Interfaces and control.** Custom orthotics and soft textile exosuits target comfort; time-based controllers and human-in-the-loop optimization tune torque profiles.

## Results
- Level-ground walking improved by 3.3 to 19.8%, the top figure equal to shedding a ~25 kg rucksack. Running improved by 3.9 to 8.0%.
- Tethered systems have not beaten autonomous ones so far (t-test p = 0.90): 5.4-17.4% versus 3.3-19.8% for walking.
- Ankle devices broke the barrier first, but hip devices save the most (17.4% tethered, 19.8% autonomous, versus 12% and 11% at the ankle). Only one knee exoskeleton improved walking economy.
- Optimized torque patterns match biological torques in neither timing nor magnitude. At the ankle, timing seems paramount, and more torque is not always better.

## Limitations
The pooled studies differ in devices, speeds and controllers, so the tethered-versus-autonomous comparison is uncontrolled; the authors note a rigorous one may favor tethered systems. In two special-condition studies the device did not significantly lower (and may have raised) metabolic cost in unpenalized level walking. Real-world benefits are still extrapolated from lab results.
