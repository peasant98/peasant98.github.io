---
title: 'Zero-Moment Point: Thirty Five Years of its Life'
arxiv: ''
date: '2004-03-01'
added: '2026-11-05'
authors: Miomir Vukobratović, Branislav Borovac
venue: International Journal of Humanoid Robotics
doi: 10.1142/S0219843604000083
pdf: http://www.cs.cmu.edu/~cga/legs/vukobratovic.pdf
website: ''
code: ''
topics:
- foundations
- humanoids
seminal: true
tldr: The originators of the Zero-Moment Point restate it as the point on the sole where the ground reaction has no horizontal moment, and give a two-step test that computes it and checks it against the support polygon. They separate the real ZMP from the center of pressure and from a "fictitious" ZMP outside the foot, which signals that the robot is tipping over.
abstract: 'This paper is devoted to the permanence of the concept of Zero-Moment Point, widely-known by the acronym ZMP. Thirty-five years have elapsed since its implicit presentation (actually before being named ZMP) to the scientific community and thirty-three years since it was explicitly introduced and clearly elaborated, initially in the leading journals published in English. Its first practical demonstration took place in Japan in 1984, at Waseda University, Laboratory of Ichiro Kato, in the first dynamically balanced robot WL-10RD of the robotic family WABOT. The paper gives an in-depth discussion of source results concerning ZMP, paying particular attention to some delicate issues that may lead to confusion if this method is applied in a mechanistic manner onto irregular cases of artificial gait, i.e. in the case of loss of dynamic balance of a humanoid robot. After a short survey of the history of the origin of ZMP a very detailed elaboration of ZMP notion is given, with a special review concerning "boundary cases" when the ZMP is close to the edge of the support polygon and "fictious cases" when the ZMP should be outside the support polygon. In addition, the difference between ZMP and the center of pressure is pointed out. Finally, some unresolved or insufficiently treated phenomena that may yield a significant improvement in robot performance are considered.'
thumb:
  image: vukobratovic2004-zmp/thumb.webp
  width: 787
  height: 763
videos: []
youtube: []
figures:
- image: vukobratovic2004-zmp/figure1.webp
  width: 787
  height: 763
  caption: 'From Figure 1: A biped in single support (a). The mechanism above the ankle A is replaced by a force FA and moment MA on the foot, balanced by the ground reaction R at point P (b). Friction balances the vertical moment Mz (c), and a horizontal ankle moment is balanced by shifting where the vertical reaction Rz acts (d).'
- image: vukobratovic2004-zmp/figure2.webp
  width: 1043
  height: 394
  caption: 'From Figure 3: Finding the ZMP. Step 1 computes the point P where the horizontal moments vanish, ignoring the foot size (a). If P lies outside the sole, the reaction acts at the edge and the computed point is a fictitious ZMP (FZMP); the unbalanced moment M = r × R tips the foot (b).'
- image: vukobratovic2004-zmp/figure3.webp
  width: 900
  height: 340
  caption: 'From Figure 4: ZMP and center of pressure for a non-rigid foot. (a) Balanced gait, ZMP and CoP coincide. (b) Unbalanced gait, the reaction acts at the CoP on the foot edge, the zero-moment point lies outside the support polygon (FZMP) and the robot overturns. (c) Tiptoe "balletic" balance with the ZMP inside a pinpoint area.'
---
## What they do
Thirty-five years after the Zero-Moment Point was first used implicitly, its originators restate what it means. They had found imprecise or incomplete ZMP definitions in humanoid conference papers, often tied to the ground without mentioning the support polygon. The paper re-derives the ZMP from the statics of the support foot, separates it from the center of pressure (CoP), and lists open problems in humanoid dynamics and control.

## How it works
- **Foot statics.** The mechanism above the support ankle is replaced by a force and moment. Friction absorbs the horizontal reaction forces and the vertical moment; the horizontal ankle moment can only be balanced by moving the point P where the reaction acts. The ZMP is the P with Mx = My = 0.
- **Two-step test.** Step 1 solves the foot's horizontal moment balance for P, with ankle loads from a dynamic model (on a real robot, sole force sensors measure it). Step 2 compares P with the support polygon. Inside, it is the ZMP and the robot is balanced. Outside, the reaction sits on the polygon edge and the foot starts to rotate; the computed point is a fictitious ZMP (FZMP) whose distance from the edge is proportional to the perturbing moment.
- **ZMP vs CoP.** The CoP always lies under the foot. It equals the ZMP only in a dynamically balanced gait; the FZMP never coincides with it.

## Results
The paper is conceptual, with no experiments. It establishes:
- A ZMP exists only inside the support polygon; outside, the mechanism falls by rotating about the polygon edge.
- Zero-moment conditions also hold at other passive joints, e.g. freely swinging shoulders, so the ZMP is not just a contact notion.
- Recovery once the ZMP reaches the edge: arm motion plus a longer or sideways step to enlarge the support polygon, or leaning on objects or becoming a quadruped to regain static equilibrium.

## Limitations
The analysis assumes a rigid foot resting flat without sliding. The authors note that real soles deform, so the tipping edge becomes a narrow strip where balance might still hold, and call modeling such feet unresolved. Also open: elastic, actively damped ankles, smooth ZMP transfer between single and double support, and walking on a moving platform.
