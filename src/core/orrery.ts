/**
 * AETHERION cosmic background generator: starfield, constellation connectors
 * and floating mathematical glyphs, plus a throttled scroll-parallax driver.
 * Everything is decorative (aria-hidden) and disabled under reduced motion.
 */

const GLYPH_SET = ['∑', '∫', 'π', '∞', 'λ', '∂', 'φ', '√'];

export function initOrrery(): void {
  const ambient = document.querySelector<HTMLElement>('.ambient-bg');
  if (!ambient) return;

  buildStars(ambient);
  buildConstellations(ambient);
  buildGlyphs(ambient);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) initParallax(ambient);
}

function buildStars(ambient: HTMLElement): void {
  const field = document.createElement('div');
  field.className = 'starfield';
  field.setAttribute('aria-hidden', 'true');
  ambient.appendChild(field);

  const count = Math.min(110, Math.max(60, Math.floor(window.innerWidth / 14)));
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = `star size-${1 + Math.floor(Math.random() * 3)}`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--tw-dur', `${2.5 + Math.random() * 5}s`);
    star.style.setProperty('--tw-delay', `${-Math.random() * 5}s`);
    field.appendChild(star);
  }
}

function buildConstellations(ambient: HTMLElement): void {
  const wrap = document.createElement('div');
  wrap.className = 'constellations';
  wrap.setAttribute('aria-hidden', 'true');
  ambient.appendChild(wrap);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'constellations');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

  // Deterministic-ish pseudo-random pairs across the viewport.
  let seed = 7;
  const rand = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < 6; i++) {
    const x1 = rand() * 100;
    const y1 = rand() * 100;
    const x2 = x1 + (rand() - 0.5) * 26;
    const y2 = y1 + (rand() - 0.5) * 26;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${x1}%`);
    line.setAttribute('y1', `${y1}%`);
    line.setAttribute('x2', `${x2}%`);
    line.setAttribute('y2', `${y2}%`);
    svg.appendChild(line);
  }

  wrap.appendChild(svg);
}

function buildGlyphs(ambient: HTMLElement): void {
  const field = document.createElement('div');
  field.className = 'glyph-field';
  field.setAttribute('aria-hidden', 'true');
  ambient.appendChild(field);

  const count = 4;
  for (let i = 0; i < count; i++) {
    const glyph = document.createElement('span');
    glyph.className = 'glyph';
    glyph.textContent = GLYPH_SET[i % GLYPH_SET.length] ?? '∑';
    glyph.style.left = `${6 + i * 24 + (i % 3) * 4}%`;
    glyph.style.top = `${20 + ((i * 23) % 64)}%`;
    glyph.style.fontSize = `${2 + (i % 3) * 1.2}rem`;
    glyph.style.animationDelay = `${-i * 3}s`;
    field.appendChild(glyph);
  }
}

function initParallax(ambient: HTMLElement): void {
  const layers = Array.from(ambient.querySelectorAll<HTMLElement>('.plx[data-depth]'));
  let ticking = false;

  const update = (): void => {
    const y = window.scrollY;
    for (const layer of layers) {
      const depth = parseFloat(layer.dataset.depth ?? '0.5');
      layer.style.transform = `translate3d(0, ${(-y * depth).toFixed(1)}px, 0)`;
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
