---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% assign pubs = site.publications | sort: "date" | reverse %}

{% assign papers = pubs | where_exp: "p", "p.category == nil" %}
{% for pub in papers %}
  {% include pub-entry.html pub=pub %}
{% endfor %}

<h2 class="sw-section-title">Workshop Papers</h2>

{% assign workshops = pubs | where: "category", "workshop" %}
{% for pub in workshops %}
  {% include pub-entry.html pub=pub %}
{% endfor %}

<h2 class="sw-section-title">Theses</h2>

{% assign theses = pubs | where: "category", "thesis" %}
{% for pub in theses %}
  {% include pub-entry.html pub=pub %}
{% endfor %}
