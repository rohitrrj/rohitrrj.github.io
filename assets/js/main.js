// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll-triggered fade-up animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ─── Scroll Progress Bar ──────────────────────────────────────────
(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

// ─── Hero Canvas: Knowledge Graph Particle Network ────────────────
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const ACCENT = [0, 200, 255];
  const PURPLE = [124, 58, 237];
  const COUNT   = 65;
  const MAX_D   = 145;
  let W, H, nodes;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = canvas.width  = Math.round(rect.width)  || window.innerWidth;
    H = canvas.height = Math.round(rect.height) || window.innerHeight;
  }

  function mkNode() {
    const col = Math.random() > 0.55 ? ACCENT : PURPLE;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.8 + 0.6,
      col,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_D) {
          const a = (1 - d / MAX_D) * 0.45;
          const c = nodes[i].col;
          ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      const [r, g, b] = n.col;
      // Soft glow halo
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7);
      grd.addColorStop(0, `rgba(${r},${g},${b},0.14)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 7, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.75)`;
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)); }
      if (n.y < 0 || n.y > H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)); }
    });
  }

  function init() {
    resize();
    nodes = Array.from({ length: COUNT }, mkNode);
  }

  const ro = new ResizeObserver(() => {
    resize();
    if (nodes) nodes.forEach(n => { n.x = Math.min(n.x, W); n.y = Math.min(n.y, H); });
  });
  ro.observe(canvas);

  init();
  (function loop() { update(); draw(); requestAnimationFrame(loop); })();
})();

// ─── Stat Counter Animation ───────────────────────────────────────
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const raw    = el.textContent.trim();
      const suffix = raw.replace(/[\d,]/g, '');
      const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
      if (isNaN(target)) return;

      el.classList.add('counting');
      const dur = 1700;
      const t0  = performance.now();

      (function tick(now) {
        const p    = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val  = Math.round(ease * target);
        el.textContent = (val >= 1000 ? val.toLocaleString() : val) + suffix;
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          el.classList.remove('counting');
        }
      })(t0);

      obs.unobserve(el);
    });
  }, { threshold: 0.7 });

  document.querySelectorAll('.stat-value').forEach(el => obs.observe(el));
})();

// ─── Typewriter: Cycling Hero Eyebrow ────────────────────────────
(function () {
  const el = document.getElementById('eyebrow-text');
  if (!el) return;

  const phrases = [
    'Computational Biology · Agentic AI · Drug Discovery',
    'Immuno-Oncology · Multi-Omics · Clinical Translation',
    'Epigenomics · Biomarker Discovery · Aging Research',
    'LLM Agents · Knowledge Graphs · Target Prioritization',
  ];

  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  el.insertAdjacentElement('afterend', cursor);

  let pi = 0, ci = phrases[0].length, deleting = false;
  el.textContent = phrases[0];

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 2400);
        return;
      }
      setTimeout(tick, 36);
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 16);
    }
  }

  setTimeout(tick, 2800);
})();

// ─── Expertise Card: 3D Tilt on Hover ────────────────────────────
document.querySelectorAll('.expertise-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = ((e.clientX - r.left)  / r.width  - 0.5) * 12;
    const y  = ((e.clientY - r.top)   / r.height - 0.5) * -12;
    card.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
