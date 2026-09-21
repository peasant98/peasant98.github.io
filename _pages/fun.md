---
permalink: /fun/
title: "Fun"
excerpt: "Fun"
author_profile: true
---

## Photography

Here's some of my best nature pictures in one album:

<b>[Full album here](https://photos.app.goo.gl/AAMZ1BjVA2jfkRh29/)</b>

<div class="sw-gallery">
{% for i in (0..6) %}
  <a href="{{ base_path }}/files/showcase_images/{{ i }}.jpg"><img src="/files/showcase_images/{{ i }}.jpg" alt="Nature photo {{ i | plus: 1 }}" loading="lazy"></a>
{% endfor %}
</div>
