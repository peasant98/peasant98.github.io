---
title: 'Templates and Anchors: Neuromechanical Hypotheses of Legged Locomotion on Land'
arxiv: ''
date: '1999-12-01'
added: '2026-11-05'
authors: Robert J. Full, Daniel E. Koditschek
venue: Journal of Experimental Biology
doi: 10.1242/jeb.202.23.3325
pdf: https://kodlab.seas.upenn.edu/uploads/Kod/Full99a.pdf
website: ''
code: ''
topics:
- foundations
- legged-locomotion
seminal: true
tldr: A perspective that splits locomotion models into templates, the simplest models that capture a behavior (such as the spring-loaded inverted pendulum for running), and anchors, detailed models of legs, joints and muscles whose control collapses them onto a template. It offers twelve hypotheses, not new experiments.
abstract: Locomotion results from complex, high-dimensional, non-linear, dynamically coupled interactions between an organism and its environment. Fortunately, simple models we call templates have been and can be made to resolve the redundancy of multiple legs, joints and muscles by seeking synergies and symmetries. A template is the simplest model (least number of variables and parameters) that exhibits a targeted behavior. For example, diverse species that differ in skeletal type, leg number and posture run in a stable manner like sagittal- and horizontal-plane spring-mass systems. Templates suggest control strategies that can be tested against empirical data. Templates must be grounded in more detailed morphological and physiological models to ask specific questions about multiple legs, the joint torques that actuate them, the recruitment of muscles that produce those torques and the neural networks that activate the ensemble. We term these more elaborate models anchors. They introduce representations of specific biological details whose mechanism of coordination is of interest. Since mechanisms require controls, anchors incorporate specific hypotheses concerning the manner in which unnecessary motion or energy from legs, joints and muscles is removed, leaving behind the behavior of the body in the low-degree-of-freedom template. Locating the origin of control is a challenge because neural and mechanical systems are dynamically coupled and both play a role. The control of slow, variable-frequency locomotion appears to be dominated by the nervous system, whereas during rapid, rhythmic locomotion, the control may reside more within the mechanical system. Anchored templates of many-legged, sprawled-postured animals suggest that passive, dynamic self-stabilization from a feedforward, tuned mechanical system can reject rapid perturbations and simplify control. Future progress would benefit from the creation of a field embracing comparative neuromechanics.
thumb:
  image: full1999-templates-anchors/thumb.webp
  width: 779
  height: 512
videos: []
youtube: []
figures:
- image: full1999-templates-anchors/figure1.webp
  width: 545
  height: 358
  caption: 'From Figure 1: The modeling hierarchy. Templates (simple, general, prescriptive) such as the sagittal-plane spring-loaded inverted pendulum (SLIP) and the horizontal-plane lateral leg spring (LLS) sit above anchors with multiple legs, joints and muscles, which sit above the complex, redundant organism, here a cockroach.'
- image: full1999-templates-anchors/figure2.webp
  width: 779
  height: 512
  caption: 'From Figure 2: How template and anchor relate. Adding joints and muscles from the animal (here a kangaroo) turns the SLIP template into an anchor that can reveal mechanisms; trimming away degrees of freedom collapses the anchor back to the template, which serves as the target for control.'
---
## What they do
A biologist and a roboticist ask how to model legged locomotion when animals have far more joints, muscles and neurons than the six "payload" dimensions of the body need. A *template* is the simplest model (fewest variables and parameters) that exhibits a targeted behavior and implies a high-level control strategy. An *anchor* is a more realistic model, grounded in the animal's morphology and physiology, that must have its template's behavior embedded in it. They list twelve hypotheses (Table 1).

## How it works
- **Templates** come from seeking synergies (legs, joints or muscles acting as one) and symmetries, and are judged by whether data refute them: the inverted pendulum for walking, the spring-loaded inverted pendulum (SLIP) for sagittal-plane running, the lateral leg spring (LLS) for horizontal-plane running.
- **Anchors.** A complex system anchors a template if its motions collapse onto a copy of the template's low-dimensional motion space and, there, it mimics the template's behavior.
- **Hierarchical control.** A within-stride policy actuates ankle, knee and hip to trim the mass center's motion to a SLIP; a stride-to-stride policy drives the virtual SLIP (speed, hopping height, duty factor).
- **Where control resides** depends on the task: neural feedback for slow, precise, variable-frequency locomotion; feedforward patterns, mechanical feedback and muscle "preflexes" for rapid, rhythmic locomotion.

## Results
No new experiments; the evidence comes from cited work:
- The inverted pendulum can save as much as 70% of the energy muscles would otherwise supply in humans, birds and dogs; walking lizards show 51% energy exchange.
- Humans, dogs, lizards, crabs, cockroaches and centipedes run like a SLIP, with similar relative leg stiffness across six-, four- and two-legged runners.
- The LLS, with no energy losses modeled and only state-event feedback, is stable in heading and body orientation when the leg attaches behind the center of mass.
- A feedforward hexapod model with no neural feedback runs stably at the animal's preferred speed and rejects imposed perturbations.

## Limitations
Most hypotheses are untested: the LLS results were still in preparation and fitting the SLIP to human runners was preliminary. Human walking departs enough from the inverted pendulum that it is unlikely to be a literal control target, and insects show no sign of the pendulum mechanism. Data on rapid disturbance rejection during cyclic locomotion are lacking.
