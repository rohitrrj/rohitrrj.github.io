---
layout: default
title: "Research & Publications"
description: "Explore our latest research in quantum biology, computational genomics, and bioinformatics"
---

<div class="research-index">
    <div class="hero">
        <div class="container">
            <h1>{{ page.title }}</h1>
            <p>{{ page.description }}</p>
        </div>
    </div>

    <div class="container">
        <div class="research-grid">
            {% for research in site.research %}
                {% unless research.url contains 'index' %}
                <a href="{{ research.url }}" class="research-card">
                    <h2>{{ research.title }}</h2>
                    <p>{{ research.description }}</p>
                    <div class="meta">
                        {% if research.authors %}
                        <div class="authors">
                            {% for author in research.authors limit:1 %}
                            <span class="author">{{ author }}</span>
                            {% endfor %}
                            {% if research.authors.size > 1 %}
                            <span class="et-al">et al.</span>
                            {% endif %}
                        </div>
                        {% endif %}
                        {% if research.date %}
                        <time datetime="{{ research.date | date_to_xmlschema }}">{{ research.date | date: "%B %d, %Y" }}</time>
                        {% endif %}
                    </div>
                </a>
                {% endunless %}
            {% endfor %}
        </div>
    </div>
</div>

<style>
.research-index {
    padding-top: 80px;
}

.hero {
    background: var(--primary-color);
    color: white;
    padding: 4rem 0;
    margin-bottom: 3rem;
}

.hero h1 {
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

.hero p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.research-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem 1rem;
}

.research-card {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    text-decoration: none;
    color: inherit;
    border: 1px solid var(--light-gray);
    transition: all 0.3s ease;
}

.research-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: var(--accent-color);
}

.research-card h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.research-card p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    color: var(--text-color);
}

.meta {
    font-size: 0.9rem;
    color: #666;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.authors {
    display: flex;
    gap: 0.5rem;
}

.author {
    color: var(--accent-color);
}

.et-al {
    opacity: 0.7;
}

@media (max-width: 768px) {
    .hero {
        padding: 3rem 0;
    }

    .hero h1 {
        font-size: 2rem;
    }

    .hero p {
        font-size: 1rem;
    }

    .research-grid {
        grid-template-columns: 1fr;
    }
}
</style>
