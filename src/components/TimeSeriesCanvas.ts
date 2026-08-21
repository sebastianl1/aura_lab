import type { BifurcationModel } from '../math/models/BaseModel.js';
import { viz } from '../core/theme.js';

const POINTS = 140;
const TRANSIENT = 200;

/** Time-series plot of the orbit x_n vs n for the active (model, r). */
export class TimeSeriesCanvas {
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

    const orbit = this.model.getOrbit(this.r, TRANSIENT, POINTS);
    const xMin = this.model.xRange.min;
    const xMax = this.model.xRange.max;
    const span = xMax - xMin || 1;

    const margin = 12 * dpr;
    const plotW = width - margin * 2;
    const plotH = height - margin * 2;
    const x0 = margin;
    const y0 = margin;
    const mapY = (v: number): number => y0 + (1 - (v - xMin) / span) * plotH;

    // zero baseline / mid line
    this.ctx.strokeStyle = colors.grid;
    this.ctx.lineWidth = 1;
    const midY = mapY(xMin + span / 2);
    this.ctx.beginPath();
    this.ctx.moveTo(x0, midY);
    this.ctx.lineTo(x0 + plotW, midY);
    this.ctx.stroke();

    // Axis labels
    this.ctx.fillStyle = colors.ink;
    this.ctx.font = '10px "JetBrains Mono", monospace';
    this.ctx.globalAlpha = 0.5;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('n=0', x0 + 10 * dpr, y0 + plotH + 14 * dpr);
    this.ctx.fillText(`n=${POINTS}`, x0 + plotW - 10 * dpr, y0 + plotH + 14 * dpr);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(xMax.toFixed(2), x0 - 6 * dpr, mapY(xMax) + 3 * dpr);
    this.ctx.fillText(xMin.toFixed(2), x0 - 6 * dpr, mapY(xMin) + 3 * dpr);
    this.ctx.globalAlpha = 1;

    // polyline
    this.ctx.beginPath();
    for (let i = 0; i < POINTS; i++) {
      const px = x0 + (i / (POINTS - 1)) * plotW;
      const py = mapY(orbit[i] ?? 0);
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.strokeStyle = colors.cyan;
    this.ctx.lineWidth = 1.6 * dpr;
    this.ctx.shadowColor = colors.cyan;
    this.ctx.shadowBlur = 6 * dpr;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // points
    this.ctx.fillStyle = colors.rose;
    for (let i = 0; i < POINTS; i += 2) {
      const px = x0 + (i / (POINTS - 1)) * plotW;
      const py = mapY(orbit[i] ?? 0);
      this.ctx.beginPath();
      this.ctx.arc(px, py, 1.4 * dpr, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.fillStyle = colors.ink;
    this.ctx.font = `${Math.floor(11 * dpr)}px "JetBrains Mono", monospace`;
    this.ctx.fillText(`${this.model.name} | r = ${this.r.toFixed(4)}`, x0 + 6 * dpr, y0 + 16 * dpr);
  }
}
