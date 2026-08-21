import { fitCanvas, cssColor } from './canvasHelpers.js';
import { PHI } from '../math/fibonacci.js';

/**
 * SYS·06 — Pentágono & Pentagrama.
 * The regular pentagon's diagonals form the pentagram, whose segments
 * are in the golden ratio. Interactive rotation via drag.
 */
export class PentagramCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private palette = 0;
  private rotation = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.bindDrag();
  }

  setN(_n: number): void {
    void _n;
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

  private bindDrag(): void {
    let dragging = false;
    let last = 0;
    this.canvas.addEventListener('pointerdown', (e) => {
      dragging = true;
      last = e.clientX;
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - last;
      last = e.clientX;
      this.rotation += dx * 0.01;
      this.draw();
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
    });
  }

  private polar(cx: number, cy: number, r: number, angle: number): [number, number] {
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  }

  private draw(): void {
    const { ctx, width: W, height: H } = this;
    if (W === 0 || H === 0) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + 6 * this.dpr;
    const r = Math.min(W, H) * 0.38;
    const offset = this.rotation - Math.PI / 2;

    // Five vertices of the regular pentagon
    const verts: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      verts.push(this.polar(cx, cy, r, offset + (i * 2 * Math.PI) / 5));
    }

    // Pentagon outline
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
    ctx.lineWidth = 2 * this.dpr;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const [x, y] = verts[i % 5]!;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Golden triangle (36°/72°/72°) highlight: top vertex + two adjacent
    const t2 = verts[2]!;
    const t3 = verts[3]!;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.10)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(...t2);
    ctx.lineTo(...t3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.4 * this.dpr;
    ctx.stroke();

    // Pentagram (diagonals)
    ctx.strokeStyle = cssColor(this.palette, 0.6);
    ctx.lineWidth = 2.6 * this.dpr;
    ctx.shadowColor = cssColor(this.palette, 0.6);
    ctx.shadowBlur = 12 * this.dpr;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const [x, y] = verts[(i * 2) % 5]!;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Nodes
    ctx.fillStyle = '#facc15';
    for (const [x, y] of verts) {
      ctx.beginPath();
      ctx.arc(x, y, 3.5 * this.dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels (angles of the golden triangle)
    ctx.fillStyle = '#fefce8';
    ctx.font = `${Math.max(11, 11 * this.dpr)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('36°', cx + 40 * this.dpr, cy - r * 0.55);
    ctx.fillText('72°', t2[0] - 26 * this.dpr, t2[1] + 26 * this.dpr);
    ctx.fillText('72°', t3[0] + 26 * this.dpr, t3[1] + 26 * this.dpr);
    ctx.fillText(`φ = ${PHI.toFixed(6)} · diagonal/lado`, cx, cy + r + 18 * this.dpr);
  }
}
