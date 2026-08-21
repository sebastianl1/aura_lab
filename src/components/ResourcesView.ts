import { RESOURCES } from '../content/resources.js';
import { i18n } from '../core/i18n.js';
import type { Lang } from '../core/i18n.js';
import type { ResourceEntry, ResourceKind } from '../content/resources.js';

/** Renders the "Recursos" tab with categorized bibliography. */
export class ResourcesView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(lang: Lang): void {
    const books = RESOURCES.filter((r) => r.kind === 'book');
    const papers = RESOURCES.filter((r) => r.kind === 'paper');
    const online = RESOURCES.filter((r) => r.kind === 'online' || r.kind === 'tool');

    const primary = RESOURCES.find((r) => r.primary);
    const primaryBanner = primary
      ? `<div class="resource-primary">
           <span class="resource-primary-badge">📖 ${lang === 'es' ? 'OBRA MAESTRA' : 'FOUNDATIONAL WORK'}</span>
           <p class="resource-primary-citation">${this.esc(primary.citation[lang])}</p>
           <p class="resource-primary-note">${this.esc(primary.note?.[lang] ?? '')}</p>
           ${primary.url ? `<a class="resource-link" href="${primary.url}" target="_blank" rel="noopener noreferrer">↗ Wikipedia</a>` : ''}
         </div>`
      : '';

    const section = (title: string, items: ResourceEntry[]): string => {
      if (items.length === 0) return '';
      const entries = items.map((r) => this.renderEntry(r, lang)).join('');
      return `<div class="resources-section"><h3 class="resources-section-title">${title}</h3><div class="resources-list">${entries}</div></div>`;
    };

    this.container.innerHTML = `
      <div class="resources-hero">
        <h2>📖 ${i18n.t('resources.title')}</h2>
        <p>${i18n.t('resources.subtitle')}</p>
        <p class="resources-read-more">
          ${
            lang === 'es'
              ? 'La base conceptual de Aura Lab es la proporción áurea y la dinámica no lineal de las órbitas, de Fibonacci a Lorenz (1963).'
              : 'The conceptual foundation of Aura Lab is the golden ratio and the nonlinear dynamics of orbits, from Fibonacci to Lorenz (1963).'
          }
        </p>
      </div>
      ${primaryBanner}
      ${section(lang === 'es' ? '📕 Libros de Referencia' : '📕 Reference Books', books)}
      ${section(lang === 'es' ? '📄 Artículos Seminales' : '📄 Seminal Papers', papers)}
      ${section(lang === 'es' ? '🌐 Recursos Online' : '🌐 Online Resources', online)}
    `;
  }

  private renderEntry(r: ResourceEntry, lang: Lang): string {
    const link = r.url
      ? `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener noreferrer">↗ ${lang === 'es' ? 'Enlace' : 'Link'}</a>`
      : '';
    const note = r.note ? `<p class="resource-note">${this.esc(r.note[lang])}</p>` : '';
    const primaryTag = r.primary
      ? `<span class="resource-kind" style="color:var(--accent-amber);font-weight:600">⭐ ${lang === 'es' ? 'PRINCIPAL' : 'PRIMARY'}</span>`
      : '';
    return `
      <article class="resource-entry" data-kind="${r.kind}">
        ${primaryTag}
        <span class="resource-kind">${this.kindLabel(r.kind, lang)}</span>
        <p class="resource-citation">${this.esc(r.citation[lang])}</p>
        ${note}
        ${link}
      </article>
    `;
  }

  private kindLabel(kind: ResourceKind, lang: Lang): string {
    const labels: Record<ResourceKind, { es: string; en: string }> = {
      book: { es: '📕 Libro', en: '📕 Book' },
      paper: { es: '📄 Artículo', en: '📄 Paper' },
      online: { es: '🌐 Recurso online', en: '🌐 Online' },
      tool: { es: '🔧 Herramienta', en: '🔧 Tool' },
    };
    return labels[kind]?.[lang] ?? kind;
  }

  private esc(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
