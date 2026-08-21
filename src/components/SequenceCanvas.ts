import { fibonacciSeq, logFib, ratio, PHI } from '../math/fibonacci.js';
import { fitCanvas, cssColor } from './canvasHelpers.js';

/**
 * SYS·01 — Sucesión de Fibonacci.
 * Each bar is log(F(n)): on the log scale the sequence is a perfect
 * straight line of slope ln(φ) — the growth fingerprint of the golden ratio.
 */
export class SequenceCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private n = 233;
  private palette = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  setN(n: number): void {
    this.n = Math.max(3, Math.min(200, n));
    this.draw();
  }

  setPalette(p: number): void {
    this.palette = p;
    this.draw();
  }

  resize(): void {
    const s = fitCanvas(this.canvas);
    this.width = s.width;
    this.height = s.height;
    this.dpr = s.dpr;
    this.draw();
  }

  private draw(): void {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    if (W === 0 || H === 0) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const cols = this.n;
    if (cols < 2) return;

    const padL = 46 * this.dpr;
    const padR = 12 * this.dpr;
    const padT = 10 * this.dpr;
    const padB = 34 * this.dpr;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    if (plotW <= 0 || plotH <= 0) return;

    const maxLog = logFib(this.n);
    const val = (idx: number): number => logFib(idx + 1);

    // Grid
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.06)';
    ctx.lineWidth = 1;
    const steps = 6;
    for (let g = 0; g <= steps; g++) {
      const y = padT + (plotH * g) / steps;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      const tickVal = (maxLog * (steps - g)) / steps;
      ctx.fillStyle = '#a8a29e';
      ctx.font = `${Math.max(10, 10 * this.dpr)}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(tickVal.toFixed(1), padL - 6, y + 4);
    }

    // Reference φ^n growth line
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.setLineDash([4 * this.dpr, 4 * this.dpr]);
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    const slope = plotH / Math.max(1e-6, maxLog);
    for (let px = padL; px <= W - padR; px++) {
      const idx = ((px - padL) / plotW) * (cols - 1);
      const y = padT + plotH - logFib(idx + 1) * slope;
      if (px === padL) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Bars
    const barW = Math.max(2 * this.dpr, (plotW / cols) * 0.8);
    for (let i = 0; i < cols; i++) {
      const x = padL + (plotW * i) / Math.max(1, cols - 1);
      const h = (val(i) / maxLog) * plotH;
      const y = padT + plotH - h;
      const t = i / Math.max(1, cols - 1);
      ctx.fillStyle = cssColor(this.palette, t);
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x - barW / 2, y, barW, Math.max(1, h));
      ctx.globalAlpha = 1;
    }

    // Labels for a few Fibonacci milestones
    const milestones = [0, 5, 9, 14, 19];
    ctx.textAlign = 'center';
    ctx.font = `${Math.max(10, 10 * this.dpr)}px 'JetBrains Mono', monospace`;
    for (const m of milestones) {
      if (m >= cols) continue;
      const x = padL + (plotW * m) / Math.max(1, cols - 1);
      const fibv = fibonacciSeq(m + 1)[m]!;
      ctx.fillStyle = 'rgba(254, 252, 232, 0.8)';
      ctx.fillText(`${Math.round(fibv)}`, x, padT + plotH + 14 * this.dpr);
    }

    // y-axis label
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a8a29e';
    ctx.font = `${Math.max(10, 10 * this.dpr)}px sans-serif`;
    ctx.fillText('ln F(n)', 8, padT + 8);

    // Current ratio badge
    const r = ratio(this.n);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#facc15';
    ctx.font = `${Math.max(11, 11 * this.dpr)}px 'JetBrains Mono', monospace`;
    ctx.fillText(
      `F(${this.n})/F(${this.n - 1}) = ${r.toFixed(6)} · φ = ${PHI.toFixed(6)}`,
      W - padR,
      padT + 6,
    );
  }
}
