---
layout: default
title: Research Areas
description: Explore our research in bioinformatics, computational biology, and emerging quantum applications
---

<div class="research-hub">
    <div class="hero">
        <div class="container">
            <h1>{{ page.title }}</h1>
            <p>{{ page.description }}</p>
        </div>
    </div>

    <div class="container">
        <div class="research-grid">
            {% assign categories = site.research | group_by: "category" %}
            {% for category in categories %}
            <section class="research-category">
                <h2>{{ category.name }}</h2>
                <div class="research-cards">
                    {% for post in category.items %}
                    <a href="{{ post.url }}" class="research-card">
                        {% if post.image %}
                        <div class="card-image" style="background-image: url('{{ post.image }}')"></div>
                        {% endif %}
                        <div class="card-content">
                            <h3>{{ post.title }}</h3>
                            <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
                        </div>
                    </a>
                    {% endfor %}
                </div>
            </section>
            {% endfor %}
        </div>

        <section class="featured-topics">
            <h2>Featured Research Topics</h2>
            <div class="topics-grid">
                <div class="topic-card">
                    <h3>Genomics Analysis</h3>
                    <p>Advanced techniques in DNA/RNA sequencing analysis, variant calling, and functional genomics.</p>
                    <a href="/research/genomics" class="button">Learn More</a>
                </div>
                
                <div class="topic-card">
                    <h3>Protein Analysis</h3>
                    <p>Structural prediction, molecular dynamics, and protein-protein interaction analysis.</p>
                    <a href="/research/proteomics" class="button">Learn More</a>
                </div>
                
                <div class="topic-card">
                    <h3>Systems Biology</h3>
                    <p>Network analysis, pathway modeling, and system-level understanding of biological processes.</p>
                    <a href="/research/systems-biology" class="button">Learn More</a>
                </div>
                
                <div class="topic-card">
                    <h3>Machine Learning in Biology</h3>
                    <p>AI applications in biological data analysis, pattern recognition, and prediction.</p>
                    <a href="/research/machine-learning" class="button">Learn More</a>
                </div>
                
                <div class="topic-card">
                    <h3>Quantum Biology</h3>
                    <p>Exploring quantum effects in biological systems and quantum computing applications.</p>
                    <a href="/research/quantum-biology" class="button">Learn More</a>
                </div>
            </div>
        </section>
    </div>
</div>

<style>
.research-hub {
    padding-top: var(--spacing-xl);
}

.research-grid {
    display: grid;
    gap: var(--spacing-xl);
    margin: var(--spacing-xl) 0;
}

.research-category h2 {
    margin-bottom: var(--spacing-lg);
    color: var(--primary-color);
}

.research-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}

.research-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    color: var(--text-color);
    transition: all var(--transition-base);
    border: 1px solid var(--light-gray);
}

.research-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-image {
    height: 200px;
    background-size: cover;
    background-position: center;
}

.card-content {
    padding: var(--spacing-lg);
}

.card-content h3 {
    margin-bottom: var(--spacing-sm);
    color: var(--primary-color);
}

.featured-topics {
    margin: var(--spacing-xl) 0;
}

.topics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
}

.topic-card {
    padding: var(--spacing-lg);
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid var(--light-gray);
}

.topic-card h3 {
    margin-bottom: var(--spacing-sm);
    color: var(--primary-color);
}

.topic-card p {
    margin-bottom: var(--spacing-lg);
}

.topic-card .button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
}

@media (max-width: 768px) {
    .research-cards {
        grid-template-columns: 1fr;
    }

    .topics-grid {
        grid-template-columns: 1fr;
    }
}
</style>
