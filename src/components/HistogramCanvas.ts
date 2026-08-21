import type { BifurcationModel } from '../math/models/BaseModel.js';
import { viz } from '../core/theme.js';

const ORBIT_LENGTH = 4000;
const TRANSIENT = 400;
const BINS = 48;

/** Histogram of the orbit distribution for the active (model, r). */
export class HistogramCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private model: BifurcationModel | null = null;
  private r = 3.0;
  private _rafId: number | null = null;
  private _dirty = false;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) throw new Error('No 2D context available');
    this.ctx = ctx;
  }

  setModel(model: BifurcationModel): void {
    this.model = model;
    this.render();
  }

  setR(r: number): void {
    this.r = r;
    this.render();
  }

  resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? { width: 400, height: 300 };
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.render();
  }

  render(): void {
    if (this._rafId !== null) return;
    this._dirty = true;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      if (this._dirty) {
        this._dirty = false;
        this._draw();
      }
    });
  }

  private _draw(): void {
    if (!this.canvas.width || !this.canvas.height || !this.model) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const colors = viz();

    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, width, height);

    const orbit = this.model.getOrbit(this.r, TRANSIENT, ORBIT_LENGTH);
    const xMin = this.model.xRange.min;
    const xMax = this.model.xRange.max;
    const span = xMax - xMin || 1;

    const counts = new Uint32Array(BINS);
    for (let i = 0; i < orbit.length; i++) {
      const v = orbit[i] ?? xMin;
      if (v < xMin || v > xMax) continue;
      const bin = Math.min(BINS - 1, Math.floor(((v - xMin) / span) * BINS));
      counts[bin] = (counts[bin] ?? 0) + 1;
    }

    let maxCount = 1;
    for (let i = 0; i < BINS; i++) if (counts[i]! > maxCount) maxCount = counts[i]!;

    const margin = 12 * dpr;
    const plotW = width - margin * 2;
    const plotH = height - margin * 2;
    const binW = plotW / BINS;

    for (let i = 0; i < BINS; i++) {
      const h = (counts[i]! / maxCount) * plotH;
      const x = margin + i * binW;
      const y = margin + plotH - h;
      const grad = this.ctx.createLinearGradient(0, y, 0, margin + plotH);
      grad.addColorStop(0, colors.violet);
      grad.addColorStop(1, colors.cyan);
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(x, y, Math.max(1, binW - 1), h);
    }

    // x-axis labels (min/max)
    this.ctx.fillStyle = colors.ink;
    this.ctx.font = `${Math.floor(10 * dpr)}px "JetBrains Mono", monospace`;
    this.ctx.fillText(xMin.toFixed(2), margin, margin + plotH + 12 * dpr);
    this.ctx.fillText(xMax.toFixed(2), margin + plotW - 34 * dpr, margin + plotH + 12 * dpr);

    // y-axis label
    this.ctx.textAlign = 'right';
    this.ctx.fillText('dens.', margin - 4 * dpr, margin + 14 * dpr);
    this.ctx.textAlign = 'left';

    this.ctx.fillStyle = colors.ink;
    this.ctx.font = `${Math.floor(11 * dpr)}px "JetBrains Mono", monospace`;
    this.ctx.fillText(
      `${this.model.name} | r = ${this.r.toFixed(4)}`,
      margin + 6 * dpr,
      margin + 16 * dpr,
    );
  }
}
