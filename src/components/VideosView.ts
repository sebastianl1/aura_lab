import { VIDEO_LESSONS } from '../content/videos.js';
import { i18n } from '../core/i18n.js';
import type { Lang } from '../core/i18n.js';

/** Renders the "Videos" tab: an embedded player + playlist grid. */
export class VideosView {
  private container: HTMLElement;
  private activeId: string | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.activeId = VIDEO_LESSONS.find((v) => v.youtubeId)?.id ?? null;
  }

  render(lang: Lang): void {
    const hasVideos = VIDEO_LESSONS.some((v) => v.youtubeId);
    const active =
      VIDEO_LESSONS.find((v) => v.id === this.activeId && v.youtubeId) ??
      VIDEO_LESSONS.find((v) => v.youtubeId);

    const player = active
      ? `<div class="video-player-wrap">
           <iframe
             class="video-player"
             src="https://www.youtube-nocookie.com/embed/${active.youtubeId}"
             title="${this.esc(active.title[lang])}"
             frameborder="0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             allowfullscreen
           ></iframe>
         </div>`
      : `<div class="video-coming-soon">
           <div class="video-coming-icon">🎬</div>
           <h3>${i18n.t('videos.comingSoon')}</h3>
           <p>${this.esc(
             lang === 'es'
               ? 'Cuando se publiquen los videotutoriales aparecerán aquí, listos para reproducir. Mientras tanto, explora los módulos interactivos de la pestaña Aprende.'
               : 'When the video tutorials are published they will appear here, ready to play. Meanwhile, explore the interactive modules in the Learn tab.',
           )}</p>
         </div>`;

    const playlist = VIDEO_LESSONS.map((v) => {
      const published = v.youtubeId !== '';
      return `
        <button class="video-card ${v.id === this.activeId ? 'active' : ''}" data-video="${v.id}" ${published ? '' : 'disabled'}>
          <span class="video-card-thumb">${published ? '▶️' : '🔒'}</span>
          <span class="video-card-body">
            <strong>${this.esc(v.title[lang])}</strong>
            <span>${this.esc(v.description[lang])}</span>
          </span>
        </button>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="video-hero">
        <h2>🎬 ${i18n.t('videos.title')}</h2>
        <p>${i18n.t('videos.subtitle')}</p>
      </div>
      <div class="video-layout ${hasVideos ? '' : 'video-layout-empty'}">
        ${player}
        <div class="video-playlist">${playlist}</div>
      </div>
    `;

    this.container.querySelectorAll<HTMLElement>('[data-video]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.video;
        if (id && btn.dataset.video !== undefined && !btn.hasAttribute('disabled')) {
          this.activeId = id;
          this.render(i18n.lang);
        }
      });
    });

    if (active && active.youtubeId) {
      this.injectVideoSchema(active, lang);
    }
  }

  /** Inject a VideoObject + LearningResource JSON-LD for the active video. */
  private injectVideoSchema(
    video: { youtubeId: string; title: { es: string; en: string } },
    lang: Lang,
  ): void {
    const existing = document.getElementById('video-schema');
    existing?.remove();
    const title = video.title[lang];
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: title,
      embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
      uploadDate: '2026-01-01',
      description: 'Videolección de Aura Lab sobre la proporción áurea y la espiral de órbitas.',
    });
    document.head.appendChild(script);
  }

  private esc(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
