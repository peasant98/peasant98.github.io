---
title: ImageNet Classification with Deep Convolutional Neural Networks
arxiv: ''
date: '2012-12-01'
added: '2026-11-05'
authors: Alex Krizhevsky, Ilya Sutskever, Geoffrey E. Hinton
venue: Advances in Neural Information Processing Systems (NeurIPS)
doi: ''
pdf: https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf
website: ''
code: http://code.google.com/p/cuda-convnet/
topics:
- robot-vision
- foundations
seminal: true
tldr: An eight-layer convolutional network with 60 million parameters, trained on two GPUs with ReLUs, data augmentation and dropout, classifies the 1000 ImageNet classes at 17.0% top-5 test error on ILSVRC-2010, against 25.7% for the best earlier result. An ensemble of these networks won ILSVRC-2012 with 15.3% versus 26.2% for the runner-up.
abstract: 'We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. On the test data, we achieved top-1 and top-5 error rates of 37.5% and 17.0% which is considerably better than the previous state-of-the-art. The neural network, which has 60 million parameters and 650,000 neurons, consists of five convolutional layers, some of which are followed by max-pooling layers, and three fully-connected layers with a final 1000-way softmax. To make training faster, we used non-saturating neurons and a very efficient GPU implementation of the convolution operation. To reduce overfitting in the fully-connected layers we employed a recently-developed regularization method called “dropout” that proved to be very effective. We also entered a variant of this model in the ILSVRC-2012 competition and achieved a winning top-5 test error rate of 15.3%, compared to 26.2% achieved by the second-best entry.'
thumb:
  image: krizhevsky2012-alexnet/thumb.webp
  width: 960
  height: 323
videos: []
youtube: []
figures:
- image: krizhevsky2012-alexnet/figure1.webp
  width: 1192
  height: 401
  caption: 'From Figure 2: The network split across two GPUs. One GPU runs the layer-parts at the top, the other those at the bottom, and they communicate only at certain layers. Five convolutional layers feed three fully-connected layers ending in 1000 outputs.'
- image: krizhevsky2012-alexnet/figure2.webp
  width: 527
  height: 486
  caption: 'From Figure 1: Training error on CIFAR-10 for a four-layer CNN with ReLUs (solid) and with tanh units (dashed). The ReLU network reaches 25% training error six times faster.'
- image: krizhevsky2012-alexnet/figure3.webp
  width: 466
  height: 236
  caption: 'From Figure 3: The 96 kernels of size 11×11×3 learned by the first convolutional layer. The top 48, learned on GPU 1, are largely color-agnostic; the bottom 48, learned on GPU 2, are largely color-specific.'
- image: krizhevsky2012-alexnet/figure4.webp
  width: 820
  height: 670
  caption: 'From Figure 4: Eight ILSVRC-2010 test images with the five labels the model considers most probable. The correct label is written under each image, and its probability is shown as a red bar when it is in the top 5.'
---
## What they do
Train a large, deep CNN, purely supervised, on the 1.2 million images of ImageNet LSVRC-2010 (1000 classes). An optimized GPU implementation of convolution and a split across two GPUs make a network with 60 million parameters and 650,000 neurons trainable.

## How it works
- **Architecture.** Five convolutional layers, then three fully-connected layers (4096, 4096, 1000-way softmax), on 224×224 inputs. ReLUs instead of tanh: a four-layer CIFAR-10 net reaches 25% training error six times faster. Local response normalization and overlapping max-pooling (3×3 windows, stride 2) follow some layers.
- **Two GPUs.** Half of the kernels sit on each 3 GB GTX 580, and the GPUs exchange activations only at certain layers.
- **Against overfitting.** Random 224×224 crops and horizontal flips of the 256×256 images, PCA-based jitter of RGB intensities, and dropout (p = 0.5) in the first two fully-connected layers. At test time, predictions are averaged over ten patches.
- **Training.** SGD (batch 128, momentum 0.9, weight decay 0.0005), learning rate divided by 10 whenever validation error stops improving; about 90 epochs in five to six days.

## Results
- ILSVRC-2010 test: 37.5% top-1 and 17.0% top-5 error, against 47.1%/28.2% for the competition winner and 45.7%/25.7% for the best result published since.
- ILSVRC-2012: one CNN gets 18.2% top-5 on validation. Averaging seven CNNs, two of them pre-trained on the 15M-image ImageNet Fall 2011 release, wins with 15.3% top-5 test error versus 26.2% for the second-best entry.
- Ablations (top-1/top-5 error reduction): two-GPU layout 1.7%/1.2% over a one-GPU net with half the kernels, response normalization 1.4%/1.2%, overlapping pooling 0.4%/0.3%. Color jitter cuts top-1 by over 1%, and removing any middle convolutional layer costs about 2% top-1.

## Limitations
Network size is bounded by GPU memory and by training time. Even with 1.2 million images, the network overfits substantially without augmentation and dropout, and dropout roughly doubles the iterations needed to converge. No unsupervised pre-training is used, and the model handles static images only.
