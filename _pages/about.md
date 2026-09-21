---
permalink: /
title: ""
excerpt: "About Me"
author_profile: false
redirect_from: 
  - /about/
  - /about.html
---

<div class="sw-hero">
  <div class="sw-hero__text">
    <h1 class="sw-hero__name">Matt Strong</h1>
    <p class="sw-hero__tagline">CS PhD student in Robotics and AI, Stanford University &middot; NSF Graduate Research Fellow</p>
    <ul class="sw-links">
      <li><a href="mailto:mastro1@stanford.edu">Email</a></li>
      <li><a href="/cv.pdf">CV</a></li>
      <li><a href="https://scholar.google.com/citations?user=HHyGg9cAAAAJ&hl=en">Google Scholar</a></li>
      <li><a href="https://github.com/peasant98">GitHub</a></li>
      <li><a href="https://www.linkedin.com/in/matthewhstrong">LinkedIn</a></li>
      <li><a href="https://www.strava.com/athletes/26495451">Strava</a></li>
    </ul>
  </div>
  <div class="sw-hero__photo">
    <img src="/images/matt_stanford.jpg" alt="Matt Strong">
  </div>
</div>

**I'm a Computer Science PhD in Robotics and AI at Stanford University**. I am currently advised by [Monroe Kennedy](https://profiles.stanford.edu/monroe-kennedy) and [Jeannette Bohg](https://web.stanford.edu/~bohg/). I am interested in **data-efficient 3D vision and tactile sensing for robotics**, and in **vision-only autonomous driving**. I am generously funded by the [National Science Foundation Graduate Fellowship](https://www.nsfgrfp.org). 

Prior to this, I worked at **Microsoft as a Software Engineer** in Redmond on the Customer Experience Platform. Before this, during my undergrad at the University of Colorado Boulder, I worked in the [HIRO](https://hiro-group.ronc.one) group as an undergraduate researcher, advised by Professor [Alessandro Roncone](https://alessandro.ronc.one/). I was also a researcher in the [SBS](https://www.colorado.edu/lab/sbs) lab, advised by Professor [Wangda Zuo](https://www.colorado.edu/ceae/wangda-zuo).

I also enjoy teaching, and I received the **Stanford Centennial Teaching Award** — you can read the [spotlight here](https://engineering.stanford.edu/spotlight/matt-strong).

I enjoy running, basketball (following+playing), driving my Corolla, frisbee, lifting, Beat Saber, and hiking. Check out my [Strava](https://www.strava.com/athletes/26495451)!

My best languages: Python, C++, Typescript, C#, 中文 (in progress)

<h2 class="sw-section-title">Selected Work</h2>

{% assign featured = site.publications | where: "featured", true | sort: "date" | reverse %}
{% for pub in featured %}
  {% include pub-entry.html pub=pub %}
{% endfor %}

<p style="margin-top:1.2em"><a href="/publications/">See all publications &rarr;</a></p>
