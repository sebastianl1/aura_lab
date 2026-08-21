import { EXAMPLE_CASES } from '../content/examples.js';
import type { ExampleCase } from '../content/examples.js';
import { globalModelRegistry } from '../math/models/ModelRegistry.js';
import { i18n } from '../core/i18n.js';
import type { Lang } from '../core/i18n.js';

/** Renders the "Ejemplos" tab: a gallery of curated presets. */
export class ExamplesView {
  private container: HTMLElement;
  private onOpen: (modelId: string, r: number) => void;

  constructor(container: HTMLElement, onOpen: (modelId: string, r: number) => void) {
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
        <h2>🖼️ ${i18n.t('tab.ejemplos')}</h2>
        <p>${
          lang === 'es'
            ? 'Casos matemáticos y aplicaciones de ingeniería listos para explorar. Cada tarjeta abre el laboratorio con los parámetros precargados.'
            : 'Mathematical cases and engineering applications ready to explore. Each card opens the laboratory with preset parameters.'
        }</p>
      </div>
      ${section(lang === 'es' ? 'Hitos matemáticos' : 'Mathematical milestones', math)}
      ${section(lang === 'es' ? 'Aplicaciones de ingeniería' : 'Engineering applications', eng)}
    `;

    this.container.querySelectorAll<HTMLElement>('[data-open-example]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.openExample;
        const example = EXAMPLE_CASES.find((c) => c.id === id);
        if (example) this.onOpen(example.modelId, example.r);
      });
    });
  }

  private card(c: ExampleCase, lang: Lang): string {
    const model = globalModelRegistry.getModel(c.modelId);
    const badge = `${model.name} · r = ${c.r.toFixed(4)}`;
    return `
      <article class="example-card" data-category="${c.category}">
        <div class="example-icon">${c.icon}</div>
        <h4>${this.esc(c.title[lang])}</h4>
        <p>${this.esc(c.description[lang])}</p>
        <div class="example-equation font-mono">${this.esc(model.asciiFormula)}</div>
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
