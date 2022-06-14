---
title: "Evaluating Performance of Different Generative Adversarial Networks for Large-Scale Building Power Demand Prediction"
collection: publications
permalink: /publication/sbs-lab-gan-models
excerpt: 'A comprehensive evaluation of different types of GANs at scale for building power demand prediction.'
date: 2022-05-30
venue: 'Energy and Buildings'
---

 <img src="/files/paper_images/sbs-lab-gan-models-image.png" alt="A visual diagram of our method"> 

<b>Abstract:</b>

As an unsupervised-learning data-driven model, Generative Adversarial Networks (GANs) have recently attracted a lot of attention for various applications. There is potential to apply GANs for large-scale building power demand prediction, which is needed for power grid operation. However, there are many GAN variations and it is unclear which GAN is suitable for this application. To answer this question, this paper identifies five promising GANs (Original GAN, cGAN, SGAN, InfoGAN, and ACGAN) and evaluates their performance for predicting building power demand at a large scale. Physics-based building energy models are developed to generate training and reference data. A new evaluation indicator that combines accuracy and reproducibility is proposed to evaluate the performance of different GANs in predicting building power demand. The results show that SGAN and Info-GAN are not suitable because they cannot control the number of generated building samples for different building types. The prediction performance among the Original GAN, cGAN, and ACGAN can vary depending on training sample sizes and number of building types. If the training sample size is sufficiently large, Original GAN and cGAN can predict building power demand more accurately than ACGAN with the same number of samples. If training samples are limited, Original GAN provides better accuracy than cGAN and ACGAN. When the number of building types increase, the prediction accuracy increases for cGAN, decreases for ACGAN, and remains the same for Original GAN. As a result, cGAN and Original GAN are recommended for large-scale building power demand prediction.

[Download paper here](/files/papers/sbs-lab-gan-models.pdf)

