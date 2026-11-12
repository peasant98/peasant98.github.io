---
title: A high-performance speech neuroprosthesis
arxiv: ''
date: '2023-08-01'
added: '2026-11-12'
authors: Francis R. Willett, Erin M. Kunz, Chaofei Fan, Donald T. Avansino, Guy H. Wilson, Eun Young Choi, Foram Kamdar, Matthew F. Glasser, Leigh R. Hochberg, Shaul Druckmann, Krishna V. Shenoy, Jaimie M. Henderson
venue: Nature
doi: 10.1038/s41586-023-06377-x
pdf: https://www.nature.com/articles/s41586-023-06377-x.pdf
website: ''
code: https://github.com/fwillett/speechBCI
topics:
- bci
seminal: true
tldr: 'An RNN reads spiking activity from microelectrode arrays in ventral premotor cortex and, with a language model, turns attempted speech into text for a participant with ALS who can no longer speak intelligibly. She reached 62 words per minute, with a 23.8% word error rate on a 125,000-word vocabulary and 9.1% on a 50-word one.'
abstract: 'Speech brain–computer interfaces (BCIs) have the potential to restore rapid communication to people with paralysis by decoding neural activity evoked by attempted speech into text or sound. Early demonstrations, although promising, have not yet achieved accuracies sufficiently high for communication of unconstrained sentences from a large vocabulary. Here we demonstrate a speech-to-text BCI that records spiking activity from intracortical microelectrode arrays. Enabled by these high-resolution recordings, our study participant—who can no longer speak intelligibly owing to amyotrophic lateral sclerosis—achieved a 9.1% word error rate on a 50-word vocabulary (2.7 times fewer errors than the previous state-of-the-art speech BCI) and a 23.8% word error rate on a 125,000-word vocabulary (the first successful demonstration, to our knowledge, of large-vocabulary decoding). Our participant’s attempted speech was decoded at 62 words per minute, which is 3.4 times as fast as the previous record and begins to approach the speed of natural conversation (160 words per minute). Finally, we highlight two aspects of the neural code for speech that are encouraging for speech BCIs: spatially intermixed tuning to speech articulators that makes accurate decoding possible from only a small region of cortex, and a detailed articulatory representation of phonemes that persists years after paralysis. These results show a feasible path forward for restoring rapid communication to people with paralysis who can no longer speak.'
thumb:
  image: willett2023-speech-neuroprosthesis/thumb.webp
  width: 366
  height: 322
videos: []
youtube: []
figures:
- image: willett2023-speech-neuroprosthesis/figure1.webp
  width: 366
  height: 322
  caption: 'From Figure 1: Microelectrode array locations (cyan squares) on the participant’s MRI-derived brain anatomy, with the central sulcus (CS) in red.'
- image: willett2023-speech-neuroprosthesis/figure2.webp
  width: 435
  height: 338
  caption: 'From Figure 2: Online word error rate on each evaluation day for the 125,000-word and 50-word vocabularies, with vocalized (days 113-136) and silent (days 141-148) attempted speech. Vertical lines are 95% confidence intervals.'
- image: willett2023-speech-neuroprosthesis/figure3.webp
  width: 628
  height: 278
  caption: 'From Figure 3: Pairwise similarity of consonants in neural activity (left) and in articulatory data from a speaker who can talk normally (right). Ordered by place of articulation, both show the same block-diagonal structure.'
- image: willett2023-speech-neuroprosthesis/figure4.webp
  width: 703
  height: 528
  caption: 'From Figure 4: Offline word error rate versus language-model vocabulary size (a), number of electrodes (b) and number of training sentences from the evaluation day (c; dashed line is the 23.8% online result), and correlation of neural activity between pairs of days (d).'
---
## What they do
Participant T12 of the BrainGate2 trial has ALS and can no longer speak intelligibly. The authors implanted four 64-electrode arrays, two in area 6v (ventral premotor cortex) and two in area 44 (part of Broca's area), and decode her attempted speech to text in real time.

## How it works
- **Recording site.** A naive Bayes classifier on 1 s of 6v activity identifies 33 orofacial movements (92%), 39 phonemes (62%) and 50 words (94%). Area 44 stays below 12%, so decoding uses 6v only.
- **Decoder.** Threshold crossings and spike band power from each electrode feed a five-layer GRU, trained with connectionist temporal classification, that outputs phoneme probabilities every 80 ms. A language model (125,000-word trigram or 50-word) picks the most probable sentence.
- **Daily retraining.** About 41 min of new sentences each day, added to all earlier days, with day-specific input layers and rolling feature adaptation for neural drift.

## Results
- Online, 5 vocalized days: 9.1% word error rate with 50 words (2.7 times fewer errors than the previous best) and 23.8% with 125,000 words, at 62 words per minute (earlier BCI record: 18). Silent mouthing: 11.2% and 24.7%.
- Offline, a better language model brought the large-vocabulary error to 17.4%, and test sentences closer in time to training to 11.8%.
- Neural consonant structure matches articulography from a speaker who can talk normally (r = 0.61, far above chance).
- Offline, error saturates at about 1,000-word vocabularies, roughly halves per doubling of electrodes, and is 30% with no same-day training.

## Limitations
One participant. A 24% word error rate is probably too high for everyday use (state-of-the-art speech-to-text: 4-5%). Daily data collection and training averaged 140 min. Array longevity, other participants and reliable targeting of speech areas remain to be shown.
