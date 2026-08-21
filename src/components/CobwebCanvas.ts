import type { BifurcationModel } from '../math/models/BaseModel.js';
import { viz } from '../core/theme.js';

/** 2D cobweb / staircase plot of x_{n+1} = f(x_n). */
export class CobwebCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private model: BifurcationModel | null = null;
  private r = 3.0;
  private x0 = 0.4;
  private animatingStep = 60;

  private _rafId: number | null = null;
  private _dirty = false;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) throw new Error('No 2D context available');
    this.ctx = ctx;
    this.initEvents();
  }

  private _scheduleRender(): void {
    if (this._rafId !== null) return;
    this._dirty = true;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      if (this._dirty) {
        this._dirty = false;
        this._render();
      }
    });
  }

  setModel(model: BifurcationModel): void {
    this.model = model;
    this.x0 = Math.max(model.xRange.min, Math.min(model.xRange.max, this.x0));
    this.render();
  }

  resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? { width: 400, height: 300 };
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.imageSmoothingEnabled = true;
    this.render();
  }

  setR(r: number): void {
    this.r = r;
    this.render();
  }

  setX0(x0: number): void {
    if (!this.model) return;
    this.x0 = Math.max(this.model.xRange.min, Math.min(this.model.xRange.max, x0));
    this.render();
  }

  render(): void {
    this._scheduleRender();
  }

  private _render(): void {
    if (!this.canvas.width || !this.canvas.height || !this.model) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const colors = viz();

    const margin = Math.min(width, height) * 0.1;
    const size = Math.min(width, height) - margin * 2;
    const startX = (width - size) / 2;
    const startY = height - (height - size) / 2;

    const xMin = this.model.xRange.min;
    const xMax = this.model.xRange.max;
    const xSpan = xMax - xMin;

    const mapX = (val: number): number => startX + ((val - xMin) / xSpan) * size;
    const mapY = (val: number): number => startY - ((val - xMin) / xSpan) * size;

    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, width, height);

    // Border
    this.ctx.strokeStyle = colors.grid;
    this.ctx.lineWidth = 1.5 * dpr;
    this.ctx.strokeRect(startX, startY - size, size, size);

    // Identity line y = x
    this.ctx.beginPath();
    this.ctx.moveTo(mapX(xMin), mapY(xMin));
    this.ctx.lineTo(mapX(xMax), mapY(xMax));
    this.ctx.strokeStyle = colors.ink;
    this.ctx.lineWidth = 1.5 * dpr;
    this.ctx.setLineDash([5 * dpr, 5 * dpr]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Curve y = f(x)
    this.ctx.beginPath();
    const resolution = 300;
    for (let i = 0; i <= resolution; i++) {
      const x = xMin + (i / resolution) * xSpan;
      const y = this.model.next(x, this.r);
      const px = mapX(x);
      const py = mapY(y);
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.strokeStyle = colors.violet;
    this.ctx.lineWidth = 3 * dpr;
    this.ctx.shadowColor = colors.violet;
    this.ctx.shadowBlur = 10 * dpr;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Cobweb staircase from the user-defined initial condition x0
    let currX = this.x0;
    this.ctx.beginPath();
    this.ctx.moveTo(mapX(currX), mapY(this.x0));

    for (let step = 0; step < this.animatingStep; step++) {
      const nextY = this.model.next(currX, this.r);
      this.ctx.lineTo(mapX(currX), mapY(nextY));
      this.ctx.lineTo(mapX(nextY), mapY(nextY));
      currX = nextY;
    }

    this.ctx.strokeStyle = colors.rose;
    this.ctx.lineWidth = 2 * dpr;
    this.ctx.shadowColor = colors.rose;
    this.ctx.shadowBlur = 8 * dpr;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Initial condition marker
    this.ctx.beginPath();
    this.ctx.arc(mapX(this.x0), mapY(this.x0), 4 * dpr, 0, Math.PI * 2);
    this.ctx.fillStyle = colors.ink;
    this.ctx.fill();

    this.ctx.fillStyle = colors.ink;
    this.ctx.font = `${Math.floor(12 * dpr)}px "JetBrains Mono", monospace`;
    this.ctx.fillText(
      `${this.model.name} | r = ${this.r.toFixed(4)} | x₀ = ${this.x0.toFixed(4)}`,
      startX + 10 * dpr,
      startY - size + 24 * dpr,
    );
  }

  private initEvents(): void {
    let draggingX0 = false;

    const getClientX = (e: MouseEvent | TouchEvent): number => {
      if ('touches' in e && e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) return touch.clientX;
      }
      return (e as MouseEvent).clientX;
    };

    const startDrag = (e: MouseEvent | TouchEvent): void => {
      draggingX0 = true;
      this.updateX0FromEventCoords(getClientX(e));
    };

    const moveDrag = (e: MouseEvent | TouchEvent): void => {
      if (draggingX0) this.updateX0FromEventCoords(getClientX(e));
    };

    const endDrag = (): void => {
      draggingX0 = false;
    };

    this.canvas.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    this.canvas.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        startDrag(e);
      },
      { passive: false },
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (!draggingX0) return;
        e.preventDefault();
        moveDrag(e);
      },
      { passive: false },
    );

    window.addEventListener('touchend', endDrag);
  }

  private updateX0FromEventCoords(clientX: number): void {
    if (!this.model) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = this.canvas.width;
    const height = this.canvas.height;
    const margin = Math.min(width, height) * 0.1;
    const size = Math.min(width, height) - margin * 2;
    const startX = (width - size) / 2;

    const px = (clientX - rect.left) * (this.canvas.width / rect.width);
    const xSpan = this.model.xRange.max - this.model.xRange.min;
    const newX0 = this.model.xRange.min + ((px - startX) / size) * xSpan;
    this.setX0(newX0);
  }
}
