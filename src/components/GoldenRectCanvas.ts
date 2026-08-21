import { fitCanvas } from './canvasHelpers.js';
import { PHI } from '../math/fibonacci.js';

/**
 * SYS·07 — Rectángulo Áureo & Teselación 1 : φ.
 * Recursive dissection of the golden rectangle with the quarter-circle
 * spiral arcs (the "Fibonacci spiral" of squares).
 */
export class GoldenRectCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private depth = 9;
  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  setN(n: number): void {
    this.depth = Math.max(4, Math.min(14, 4 + Math.floor(n / 40)));
    this.draw();
  }

  setPalette(_p: number): void {
    void _p;
    this.draw();
  }

  resize(): void {
    const s = fitCanvas(this.canvas);
    this.width = s.width;
    this.height = s.height;
    this.dpr = s.dpr;
    this.draw();
  }

  private drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number,
    colors: string[],
  ): void {
    const ctx = this.ctx;
    if (depth <= 0 || w < 6 || h < 6) return;
    const t = depth / 14;
    ctx.strokeStyle = colors[t % colors.length] ?? '#facc15';
    ctx.lineWidth = 1.4 * this.dpr;
    ctx.strokeRect(x, y, w, h);

    // Quarter-circle spiral arc in the largest square
    if (w > h) {
      ctx.beginPath();
      ctx.arc(x + h, y + h, h, Math.PI * 1.5, Math.PI * 2);
      ctx.stroke();
      this.drawRect(x + h, y, w - h, h, depth - 1, colors);
    } else {
      ctx.beginPath();
      ctx.arc(x + w, y + w, w, Math.PI, Math.PI * 1.5);
      ctx.stroke();
      this.drawRect(x, y + w, w, h - w, depth - 1, colors);
    }
  }

  private draw(): void {
    const { ctx, width: W, height: H } = this;
    if (W === 0 || H === 0) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const phiInv = 1 / PHI;
    const L = Math.min(W * 0.92, H * 0.8 * PHI);
    const startX = (W - L) / 2;
    const startY = (H - L * phiInv) / 2;

    const colors = ['#facc15', '#f97316', '#ef4444', '#ffd166'];
    this.drawRect(startX, startY, L, L * phiInv, this.depth, colors);

    // Aspect labels
    ctx.fillStyle = '#a8a29e';
    ctx.font = `${Math.max(11, 11 * this.dpr)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`L / h = φ = ${PHI.toFixed(6)}`, W / 2, H - 10 * this.dpr);
  }
}
