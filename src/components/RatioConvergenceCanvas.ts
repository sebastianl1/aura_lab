import { PHI, ratio } from '../math/fibonacci.js';
import { fitCanvas, cssColor } from './canvasHelpers.js';

/**
 * SYS·05 — Convergencia de la Razón → φ.
 * Line chart of F(n)/F(n-1) with the φ asymptote; the curve alternates
 * above/below φ (even/odd n). Optional "Show φ" band overlay.
 */
export class RatioConvergenceCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private n = 233;
  private palette = 0;
  private showPhi = true;
  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  setN(n: number): void {
    this.n = Math.max(4, Math.min(5000, n));
    this.draw();
  }

  setPalette(p: number): void {
    this.palette = p;
    this.draw();
  }

  setShowPhi(v: boolean): void {
    this.showPhi = v;
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
    const { ctx, width: W, height: H } = this;
    if (W === 0 || H === 0) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const padL = 50 * this.dpr;
    const padR = 14 * this.dpr;
    const padT = 12 * this.dpr;
    const padB = 30 * this.dpr;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    if (plotW <= 0 || plotH <= 0) return;

    const yMin = 1.5;
    const yMax = 2.2;
    const xCount = Math.max(2, this.n - 1); // ratios for k = 2..n

    const yOf = (v: number): number => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    const xOf = (idx: number): number => padL + (plotW * idx) / Math.max(1, xCount - 1);

    // Grid
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.07)';
    ctx.lineWidth = 1;
    ctx.font = `${Math.max(10, 10 * this.dpr)}px 'JetBrains Mono', monospace`;
    for (let gy = 0; gy <= 7; gy++) {
      const v = yMin + ((yMax - yMin) * gy) / 7;
      const y = yOf(v);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      ctx.fillStyle = '#a8a29e';
      ctx.textAlign = 'right';
      ctx.fillText(v.toFixed(2), padL - 6, y + 4);
    }

    // "Show φ" reference band
    if (this.showPhi) {
      const band = 0.012;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
      ctx.fillRect(padL, yOf(PHI + band), plotW, yOf(PHI - band) - yOf(PHI + band));
    }

    // φ asymptote
    const phiY = yOf(PHI);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.6 * this.dpr;
    ctx.setLineDash([6 * this.dpr, 5 * this.dpr]);
    ctx.beginPath();
    ctx.moveTo(padL, phiY);
    ctx.lineTo(W - padR, phiY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'left';
    ctx.font = `${Math.max(11, 11 * this.dpr)}px 'JetBrains Mono', monospace`;
    ctx.fillText('φ = 1.6180339887', padL + 6, phiY - 6);

    // Ratio curve, alternating colour above/below φ (even/odd n)
    const step = Math.max(1, Math.floor(xCount / Math.min(plotW, 1600)));
    ctx.lineWidth = 2.2 * this.dpr;
    ctx.beginPath();
    for (let i = 0; i < xCount; i += step) {
      const val = ratio(i + 2);
      const x = xOf(i);
      const y = yOf(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    // Two-tone overlay: stroke with gold base, then red for the above-φ part
    ctx.strokeStyle = cssColor(this.palette, 0.5);
    ctx.globalAlpha = 0.55;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    let started = false;
    for (let i = 0; i < xCount; i += step) {
      const val = ratio(i + 2);
      if (val < PHI) continue;
      const x = xOf(i);
      const y = yOf(val);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = '#ef4444';
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 2.6 * this.dpr;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // X axis labels
    ctx.fillStyle = '#a8a29e';
    ctx.textAlign = 'center';
    ctx.lineWidth = 1;
    ctx.font = `${Math.max(10, 10 * this.dpr)}px 'JetBrains Mono', monospace`;
    for (let gx = 0; gx <= 5; gx++) {
      const idx = Math.round((xCount - 1) * (gx / 5));
      ctx.fillText(`n = ${idx + 2}`, xOf(idx), padT + plotH + 14 * this.dpr);
    }
  }
}
