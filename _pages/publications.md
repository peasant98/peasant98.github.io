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

{% comment %} Conference, journal and workshop papers in one date-ordered list; each venue line already names the workshop. {% endcomment %}
{% assign papers = pubs | where_exp: "p", "p.category != 'thesis'" %}
{% for pub in papers %}
  {% include pub-entry.html pub=pub %}
{% endfor %}

<h2 class="sw-section-title">Theses</h2>

{% assign theses = pubs | where: "category", "thesis" %}
{% for pub in theses %}
  {% include pub-entry.html pub=pub %}
{% endfor %}
