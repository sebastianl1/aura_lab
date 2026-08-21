import { ENGINEERING_CASES, generateGoldenSignal } from '../math/engineeringCases.js';
import type { EngineeringCase } from '../math/engineeringCases.js';
import { renderLatex } from '../math/latexHelper.js';
import { viz } from '../core/theme.js';

/** Panel of real applications of the golden ratio with a synthetic preview. */
export class EngineeringCasePanel {
  private onSelectStyleAndN: (styleId: string, n: number) => void;

  private titleEl: HTMLElement | null;
  private subtitleEl: HTMLElement | null;
  private explanationEl: HTMLElement | null;
  private latexEqEl: HTMLElement | null;
  private tabsContainer: HTMLElement | null;
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;

  constructor(onSelectStyleAndN: (styleId: string, n: number) => void) {
    this.onSelectStyleAndN = onSelectStyleAndN;

    this.titleEl = document.getElementById('eng-title');
    this.subtitleEl = document.getElementById('eng-subtitle');
    this.explanationEl = document.getElementById('eng-explanation');
    this.latexEqEl = document.getElementById('eng-latex-eq');
    this.tabsContainer = document.getElementById('engineering-tabs');

    this.canvas = document.getElementById('canvas-engineering') as HTMLCanvasElement | null;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.initEvents();
    this.selectCase('architecture');
  }

  private initEvents(): void {
    if (!this.tabsContainer) return;
    this.tabsContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.eng-tab') as HTMLElement | null;
      if (btn && btn.dataset.case) {
        this.selectCase(btn.dataset.case);
      }
    });
  }

  selectCase(caseId: string): void {
    const caseData = ENGINEERING_CASES.find((c) => c.id === caseId) ?? ENGINEERING_CASES[0]!;

    const tabs = this.tabsContainer?.querySelectorAll('.eng-tab') ?? [];
    tabs.forEach((tab) => {
      tab.classList.toggle('active', (tab as HTMLElement).dataset.case === caseId);
    });

    if (this.titleEl) this.titleEl.textContent = caseData.title;
    if (this.subtitleEl) this.subtitleEl.textContent = caseData.subtitle;
    if (this.explanationEl) this.explanationEl.textContent = caseData.explanation;
    if (this.latexEqEl) renderLatex(this.latexEqEl, caseData.equation);

    this.renderSignal(caseData);

    this.onSelectStyleAndN(caseData.styleId, caseData.n);
  }

  private renderSignal(caseData: EngineeringCase): void {
    if (!this.canvas || !this.ctx) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? { width: 450 };
    const cssWidth = rect.width || 450;
    const cssHeight = 180;

    this.canvas.width = Math.floor(cssWidth * dpr);
    this.canvas.height = Math.floor(cssHeight * dpr);
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const colors = viz();

    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = colors.grid;
    this.ctx.lineWidth = 1 * dpr;
    for (let x = 0; x < width; x += 50 * dpr) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    const sampleCount = Math.floor(cssWidth * 1.5);
    const points = generateGoldenSignal(caseData.id, sampleCount, caseData.n);

    this.ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const val = points[i]!;
      const px = (i / sampleCount) * width;
      const py = height - val * (height * 0.75) - height * 0.12;
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }

    this.ctx.strokeStyle = colors.amber;
    this.ctx.lineWidth = 2.5 * dpr;
    this.ctx.shadowColor = colors.amber;
    this.ctx.shadowBlur = 10 * dpr;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }
}
