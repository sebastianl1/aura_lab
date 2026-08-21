import { MODULES, GLOSSARY } from '../content/curriculum.js';
import type { Lang, Lesson, Module, QuizQuestion } from '../content/curriculum.js';
import { renderLatex } from '../math/latexHelper.js';
import { i18n } from '../core/i18n.js';

/** Renders the "Aprende" tab: modules, lessons, quizzes and glossary. */
export class LearnView {
  private container: HTMLElement;
  private onOpenDemo: (styleId: string, n: number) => void;
  private activeModuleId: string | null = null;
  private showGlossary = false;

  constructor(container: HTMLElement, onOpenDemo: (styleId: string, n: number) => void) {
    this.container = container;
    this.onOpenDemo = onOpenDemo;
  }

  render(lang: Lang): void {
    if (this.showGlossary) {
      this.renderGlossary(lang);
    } else if (this.activeModuleId) {
      const mod = MODULES.find((m) => m.id === this.activeModuleId);
      if (mod) this.renderModule(mod, lang);
      else this.renderIndex(lang);
    } else {
      this.renderIndex(lang);
    }
  }

  setLang(lang: Lang): void {
    this.render(lang);
  }

  private renderIndex(lang: Lang): void {
    const cards = MODULES.map((m) => {
      const lessonCount = m.lessons.length;
      return `
        <button class="learn-module-card" data-module="${m.id}">
          <span class="learn-module-icon">${m.icon}</span>
          <span class="learn-module-title">${this.esc(m.title[lang])}</span>
          <span class="learn-module-summary">${this.esc(m.summary[lang])}</span>
          <span class="learn-module-meta">${lessonCount} ${i18n.t('learn.lessons')}</span>
        </button>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="learn-hero">
        <h2>${i18n.t('learn.title')}</h2>
        <p>${i18n.t('learn.subtitle')}</p>
      </div>
      <h3 class="learn-section-title">${i18n.t('learn.modules')}</h3>
      <div class="learn-modules">${cards}</div>
      <button class="btn learn-glossary-btn" data-glossary="1">📖 ${i18n.t('learn.glossary')}</button>
    `;

    this.bindIndexEvents();
  }

  private bindIndexEvents(): void {
    this.container.querySelectorAll<HTMLElement>('[data-module]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.module;
        if (id) {
          this.activeModuleId = id;
          this.render(i18n.lang);
        }
      });
    });
    this.container.querySelector<HTMLElement>('[data-glossary]')?.addEventListener('click', () => {
      this.showGlossary = true;
      this.render(i18n.lang);
    });
  }

  private renderModule(mod: Module, lang: Lang): void {
    const lessonsNav = mod.lessons
      .map(
        (l, idx) => `
          <button class="learn-lesson-nav" data-lesson="${l.id}">
            ${idx + 1}. ${this.esc(l.title[lang])}
          </button>
        `,
      )
      .join('');

    this.container.innerHTML = `
      <div class="learn-hero">
        <h2>${mod.icon} ${this.esc(mod.title[lang])}</h2>
        <p>${this.esc(mod.summary[lang])}</p>
        <button class="btn learn-back-btn" data-back="1">${i18n.t('learn.backToModules')}</button>
      </div>
      <nav class="learn-lessons-nav">${lessonsNav}</nav>
      <div id="learn-lesson-body"></div>
    `;

    this.container.querySelector<HTMLElement>('[data-back]')?.addEventListener('click', () => {
      this.activeModuleId = null;
      this.render(i18n.lang);
    });

    this.container.querySelectorAll<HTMLElement>('[data-lesson]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.lesson;
        if (id) {
          const lesson = mod.lessons.find((l) => l.id === id);
          if (lesson) this.renderLesson(lesson, lang, mod);
        }
      });
    });

    this.renderLesson(mod.lessons[0]!, lang, mod);
  }

  private renderLesson(lesson: Lesson, lang: Lang, mod: Module): void {
    const bodyEl = this.container.querySelector<HTMLElement>('#learn-lesson-body');
    if (!bodyEl) return;

    const blocks = lesson.blocks[lang]
      .map((b) => {
        if (b.type === 'latex') {
          return `<div class="learn-latex" data-latex="${this.escAttr(b.content)}"></div>`;
        }
        if (b.type === 'aside') {
          return `<div class="learn-aside">💡 ${this.esc(b.content)}</div>`;
        }
        return `<p>${this.esc(b.content)}</p>`;
      })
      .join('');

    const keyPoints = lesson.keyPoints[lang].map((k) => `<li>${this.esc(k)}</li>`).join('');
    const demo = lesson.demo
      ? `
        <button class="btn btn-accent learn-demo-btn" data-demo-style="${lesson.demo.styleId}" data-demo-n="${lesson.demo.n}">
          🧪 ${i18n.t('learn.openLab')}: ${this.esc(lesson.demo.label)}
        </button>
      `
      : '';
    const quiz = lesson.quiz ? this.renderQuiz(lesson.quiz, lang) : '';

    bodyEl.innerHTML = `
      <div class="learn-lesson-head">
        <span class="learn-lesson-module">${mod.icon} ${this.esc(mod.title[lang])}</span>
        <h3>${this.esc(lesson.title[lang])}</h3>
        <p class="learn-intro">${this.esc(lesson.intro[lang])}</p>
      </div>
      <div class="learn-body">${blocks}</div>
      <div class="learn-keypoints">
        <h4>📌 ${i18n.t('learn.keyPoints')}</h4>
        <ul>${keyPoints}</ul>
      </div>
      ${lesson.takeaway ? `<div class="learn-takeaway"><strong>💡 ${i18n.t('learn.takeaway')}:</strong> ${this.esc(lesson.takeaway[lang])}</div>` : ''}
      ${demo}
      ${quiz}
    `;

    bodyEl.querySelectorAll<HTMLElement>('[data-latex]').forEach((el) => {
      renderLatex(el, el.dataset.latex ?? '', true);
    });

    bodyEl.querySelector<HTMLElement>('[data-demo-style]')?.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const styleId = target.dataset.demoStyle;
      const n = parseInt(target.dataset.demoN ?? '233', 10);
      if (styleId) this.onOpenDemo(styleId, n);
    });

    if (lesson.quiz) this.bindQuizEvents(bodyEl);
  }

  private renderQuiz(quiz: QuizQuestion, lang: Lang): string {
    const options = quiz.options
      .map(
        (opt, i) => `
          <button class="learn-quiz-option" data-correct="${opt.correct}">
            ${String.fromCharCode(65 + i)}. ${this.esc(opt.text)}
          </button>
        `,
      )
      .join('');
    const explanation = lang === 'es' ? quiz.explanation : quiz.explanation;
    return `
      <div class="learn-quiz">
        <h4>❓ ${i18n.t('learn.quiz')}</h4>
        <p class="learn-quiz-question">${this.esc(quiz.question)}</p>
        <div class="learn-quiz-options">${options}</div>
        <p class="learn-quiz-feedback"></p>
        <p class="learn-quiz-explanation" hidden>${this.esc(explanation)}</p>
      </div>
    `;
  }

  private bindQuizEvents(root: HTMLElement): void {
    root.querySelectorAll<HTMLElement>('.learn-quiz-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wasAnswered = btn.classList.contains('answered');
        if (wasAnswered) return;
        const correct = btn.dataset.correct === 'true';
        const options = root.querySelectorAll<HTMLElement>('.learn-quiz-option');
        options.forEach((o) => o.classList.add('answered'));
        btn.classList.add(correct ? 'correct' : 'incorrect');
        const feedback = root.querySelector<HTMLElement>('.learn-quiz-feedback');
        const explanation = root.querySelector<HTMLElement>('.learn-quiz-explanation');
        if (feedback) {
          feedback.textContent = correct
            ? `✅ ${i18n.t('learn.correct')}`
            : `❌ ${i18n.t('learn.incorrect')}`;
          feedback.style.color = correct ? 'var(--accent-green, #10b981)' : 'var(--accent-rose)';
        }
        if (explanation) explanation.hidden = false;
      });
    });
  }

  private renderGlossary(lang: Lang): void {
    const items = GLOSSARY.map(
      (g) => `
        <div class="learn-glossary-term">
          <dt>${this.esc(g.term)}</dt>
          <dd>${this.esc(g[lang])}</dd>
        </div>
      `,
    ).join('');

    this.container.innerHTML = `
      <div class="learn-hero">
        <h2>📖 ${i18n.t('learn.glossary')}</h2>
        <button class="btn learn-back-btn" data-back="1">${i18n.t('learn.backToModules')}</button>
      </div>
      <dl class="learn-glossary">${items}</dl>
    `;

    this.container.querySelector<HTMLElement>('[data-back]')?.addEventListener('click', () => {
      this.showGlossary = false;
      this.render(i18n.lang);
    });
  }

  private esc(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private escAttr(value: string): string {
    return this.esc(value).replace(/"/g, '&quot;');
  }
}
