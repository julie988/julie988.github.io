/* ===========================================================
   <site-header> — shared nav, written once, used on every page.
   Usage:
     <site-header variant="hero"></site-header>       (index.html)
     <site-header variant="compact" current="code"></site-header>
=========================================================== */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'compact';
    const current = this.getAttribute('current') || '';

    const pages = [
      { id: 'code',   label: 'Code',   href: 'code.html' },
      { id: 'art',    label: 'Art',    href: 'art.html' },
    ];

    const navItems = pages.map(p => `
      <li>
        <a href="${p.href}" ${p.id === current ? 'aria-current="page"' : ''}>${p.label}</a>
      </li>
    `).join('');

    if (variant === 'hero') {
      this.innerHTML = `
        <div class="header--hero">
          <h1 class="wordmark wordmark--hero"><a href="index.html">Julie Shi</a></h1>
          <p class="hero-subtitle">with her portfolio below</p>
          <nav class="receipt" aria-label="Main">
            <ol>${navItems}</ol>
          </nav>
        </div>
      `;
    } else {
      this.innerHTML = `
        <div class="header--compact">
          <h1 class="wordmark wordmark--compact"><a href="index.html">Julie Shi</a></h1>
          <nav class="receipt" aria-label="Main">
            <ol>${navItems}</ol>
          </nav>
        </div>
      `;
    }
  }
}

customElements.define('site-header', SiteHeader);

/* ===========================================================
   DESIGN PAGE — scattered layout positioning + subtle
   cursor-reactive parallax on the scattered cards.
=========================================================== */

function initScatterField() {
  const field = document.querySelector('.scatter-field');
  if (!field) return;

  const items = Array.from(field.querySelectorAll('.scatter-item'));

  // Fixed-but-organic positions (not a grid) at a few breakpoints.
  const layout = [
    { top: '0%',   left: '2%'  },
    { top: '6%',   left: '54%' },
    { top: '34%',  left: '20%' },
    { top: '30%',  left: '68%' },
    { top: '62%',  left: '4%'  },
    { top: '58%',  left: '50%' },
  ];

  const applyLayout = () => {
    if (window.innerWidth <= 720) return; // stacked on mobile via CSS
    items.forEach((item, i) => {
      const pos = layout[i % layout.length];
      item.style.top = pos.top;
      item.style.left = pos.left;
    });
  };

  applyLayout();
  window.addEventListener('resize', applyLayout);

  // Subtle cursor-reactive tilt — motion that responds to the
  // user's own movement, not an ambient animation.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;

  field.addEventListener('mousemove', (e) => {
    const rect = field.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    items.forEach((item, i) => {
      const depth = 6 + (i % 3) * 4;
      const x = relX * depth;
      const y = relY * depth;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  field.addEventListener('mouseleave', () => {
    items.forEach(item => { item.style.transform = 'translate(0, 0)'; });
  });
}

document.addEventListener('DOMContentLoaded', initScatterField);
