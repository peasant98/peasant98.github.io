---
title: "SHIRO: Soft Hierarchical Reinforcement Learning"
collection: publications
permalink: /publication/hiro-lab-shiro
excerpt: 'A method for soft hierarchical reinforcement learning to accelerate learning for challenging locomotion tasks'
date: 2022-12-24
venue: 'Arxiv'
---

 <img src="/files/paper_images/hiro-lab-shiro-image.png" alt="A visual diagram of our method"> 

<b>Abstract:</b>

Hierarchical Reinforcement Learning (HRL) algorithms have been demonstrated to perform well on high-dimensional decision making and robotic control tasks. However, because they solely optimize for rewards, the agent tends to search the same space redundantly. This problem reduces the speed of learning and achieved reward. In this work, we present an Off-Policy HRL algorithm that maximizes entropy for efficient exploration. The algorithm learns a temporally abstracted low-level policy and is able to explore broadly through the addition of entropy to the high-level. The novelty of this work is the theoretical motivation of adding entropy to the RL objective in the HRL setting. We empirically show that the entropy can be added to both levels if the Kullback-Leibler (KL) divergence between consecutive updates of the low-level policy is sufficiently small. We performed an ablative study to analyze the effects of entropy on hierarchy, in which adding entropy to high-level emerged as the most desirable configuration. Furthermore, a higher temperature in the low-level leads to Q-value overestimation and increases the stochasticity of the environment that the high-level operates on, making learning more challenging. Our method, SHIRO, surpasses state-of-the-art performance on a range of simulated robotic control benchmark tasks and requires minimal tuning.


[Download paper here](/files/papers/hiro-lab-shiro.pdf)