import { EXAMPLE_CASES } from '../content/examples.js';
import type { ExampleCase } from '../content/examples.js';
import { getSpiralStyle } from '../math/fibonacci.js';
import { i18n } from '../core/i18n.js';
import type { Lang } from '../core/i18n.js';

/** Renders the "Ejemplos" tab: a gallery of curated golden-ratio presets. */
export class ExamplesView {
  private container: HTMLElement;
  private onOpen: (styleId: string, n: number) => void;

  constructor(container: HTMLElement, onOpen: (styleId: string, n: number) => void) {
    this.container = container;
    this.onOpen = onOpen;
  }

  render(lang: Lang): void {
    const math = EXAMPLE_CASES.filter((c) => c.category === 'math');
    const eng = EXAMPLE_CASES.filter((c) => c.category === 'engineering');

    const section = (title: string, cases: ExampleCase[]): string => `
      <h3 class="examples-section-title">${title}</h3>
      <div class="examples-grid">${cases.map((c) => this.card(c, lang)).join('')}</div>
    `;

    this.container.innerHTML = `
      <div class="examples-hero">
        <h2>❋ ${i18n.t('tab.ejemplos')}</h2>
        <p>${
          lang === 'es'
            ? 'Hitos de la sucesión áurea y aplicaciones reales listas para explorar. Cada tarjeta abre el laboratorio con los parámetros precargados.'
            : 'Milestones of the golden sequence and real-world applications ready to explore. Each card opens the laboratory with preset parameters.'
        }</p>
      </div>
      ${section(lang === 'es' ? 'Hitos matemáticos' : 'Mathematical milestones', math)}
      ${section(lang === 'es' ? 'Aplicaciones de φ' : 'Applications of φ', eng)}
    `;

    this.container.querySelectorAll<HTMLElement>('[data-open-example]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.openExample;
        const example = EXAMPLE_CASES.find((c) => c.id === id);
        if (example) this.onOpen(example.styleId, example.n);
      });
    });
  }

  private card(c: ExampleCase, lang: Lang): string {
    const style = getSpiralStyle(c.styleId);
    const badge = `${style.label || style.id} · n = ${c.n}`;
    return `
      <article class="example-card" data-category="${c.category}">
        <div class="example-icon">${c.icon}</div>
        <h4>${this.esc(c.title[lang])}</h4>
        <p>${this.esc(c.description[lang])}</p>
        <div class="example-equation font-mono">${this.esc(c.formula)}</div>
        <div class="example-meta">
          <span class="example-badge">${this.esc(badge)}</span>
          <button class="btn btn-accent example-open" data-open-example="${c.id}">
            🔬 ${i18n.t('learn.openLab')}
          </button>
        </div>
      </article>
    `;
  }

  private esc(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
