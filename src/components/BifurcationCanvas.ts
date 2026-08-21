import type { BifurcationModel } from '../math/models/BaseModel.js';
import type { ModelRange } from '../math/models/BaseModel.js';
import { computeBifurcationData, colorizeDensity } from '../math/bifurcationCompute.js';
import type {
  BifurcationComputeRequest,
  BifurcationComputeResult,
} from '../math/bifurcationCompute.js';
import { viz } from '../core/theme.js';

/**
 * 2D canvas rendering of the bifurcation diagram + Lyapunov curve.
 *
 * The density grid and the Lyapunov curve depend only on the model and the
 * current r-zoom window, NOT on the selected parameter r. Both are therefore
 * computed once per (model, zoom) in a Web Worker and cached; moving the r
 * cursor only redraws the (cheap) overlay.
 */
export class BifurcationCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private onSelectR: (r: number) => void;

  private model: BifurcationModel | null = null;
  private rRange: ModelRange = { min: 1.0, max: 4.0 };
  private xRange: ModelRange = { min: 0.0, max: 1.0 };
  private selectedR = 3.0;

  private showLyapunov = true;
  private orbitDensity = 800;
  private _isDragging = false;

  /** Use fewer points during drag for responsiveness. */
  private get effectiveOrbitDensity(): number {
    return this._isDragging ? Math.min(400, this.orbitDensity) : this.orbitDensity;
  }

  private worker: Worker | null = null;
  private computeId = 0;

  private cacheCanvas: HTMLCanvasElement | null = null;
  private lyapunovNorm: Float32Array | null = null;
  private cacheKey = '';

  private _rafId: number | null = null;
  private _dirty = false;
  private _lastPinchDist = 0;

  constructor(canvasElement: HTMLCanvasElement, onSelectR: (r: number) => void) {
    this.canvas = canvasElement;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) throw new Error('No 2D context available');
    this.ctx = ctx;
    this.onSelectR = onSelectR;
    this.initWorker();
    this.initEvents();
  }

  private initWorker(): void {
    try {
      this.worker = new Worker(new URL('../workers/bifurcation.worker.ts', import.meta.url), {
        type: 'module',
      });
      this.worker.onmessage = (e: MessageEvent<BifurcationComputeResult>) => {
        this.onComputeResult(e.data);
      };
      this.worker.onerror = (e) => {
        console.warn('Bifurcation worker failed, computing on main thread:', e);
        this.worker?.terminate();
        this.worker = null;
        this.computeSync();
      };
    } catch (e) {
      console.warn('Bifurcation worker unavailable, computing on main thread:', e);
      this.worker = null;
    }
  }

  private currentKey(): string {
    if (!this.model || !this.canvas.width || !this.canvas.height) return '';
    return [
      this.model.id,
      JSON.stringify(this.model.getParameterState()),
      this.rRange.min.toFixed(6),
      this.rRange.max.toFixed(6),
      this.canvas.width,
      this.canvas.height,
    ].join('|');
  }

  private buildRequest(): BifurcationComputeRequest | null {
    if (!this.model || !this.canvas.width || !this.canvas.height) return null;
    const params = this.model.getParameterState();
    return {
      id: ++this.computeId,
      modelId: this.model.id,
      polyK: params.k,
      rMin: this.rRange.min,
      rMax: this.rRange.max,
      width: this.canvas.width,
      height: this.canvas.height,
      xMin: this.xRange.min,
      xMax: this.xRange.max,
      orbitDensity: this.effectiveOrbitDensity,
      computeLyapunov: this.showLyapunov,
    };
  }

  private requestCompute(): void {
    const req = this.buildRequest();
    if (!req) return;
    if (this.worker) {
      this.worker.postMessage(req);
    } else {
      this.computeSync();
    }
  }

  private computeSync(): void {
    if (!this.model) return;
    const req = this.buildRequest();
    if (!req) return;
    const result = computeBifurcationData(req, this.model);
    this.onComputeResult(result);
  }

  private onComputeResult(res: BifurcationComputeResult): void {
    if (res.id !== this.computeId) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    if (!width || !height || res.density.length !== width * height) return;

    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const octx = off.getContext('2d');
    if (!octx) return;
    const img = octx.createImageData(width, height);
    colorizeDensity(res.density, res.maxDensity, img.data);
    octx.putImageData(img, 0, 0);

    this.cacheCanvas = off;
    this.lyapunovNorm = res.lyapunovNorm ?? null;
    this.cacheKey = this.currentKey();
    this.render();
  }

  setModel(model: BifurcationModel): void {
    // Same model → preserve cached image (prevents flicker on every R drag in syncUI)
    if (this.model === model) return;
    this.model = model;
    this.rRange = { ...model.rRange };
    this.xRange = { ...model.xRange };
    this.selectedR = model.clampR(this.selectedR);
    this.cacheCanvas = null;
    this.lyapunovNorm = null;
    this.cacheKey = '';
    this.requestCompute();
    this.render();
  }

  resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? { width: 400, height: 300 };
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.imageSmoothingEnabled = false;
    this.render();
  }

  setSelectedR(r: number): void {
    if (!this.model) return;
    this.selectedR = this.model.clampR(r);
    this.render();
  }

  setSelectedC(c: number): void {
    if (!this.model) return;
    const r = this.model.cToR(c);
    this.setSelectedR(r);
  }

  toggleLyapunov(show: boolean): void {
    if (this.showLyapunov === show) return;
    this.showLyapunov = show;
    // Lyapunov array may not exist yet (was computed with it off).
    if (show && (!this.lyapunovNorm || this.lyapunovNorm.length !== this.canvas.width)) {
      this.cacheKey = '';
      this.requestCompute();
    }
    this.render();
  }

  private rToPixelX(r: number): number {
    return ((r - this.rRange.min) / (this.rRange.max - this.rRange.min)) * this.canvas.width;
  }

  private pixelXToR(px: number): number {
    return this.rRange.min + (px / this.canvas.width) * (this.rRange.max - this.rRange.min);
  }

  private xToPixelY(x: number): number {
    return (1.0 - (x - this.xRange.min) / (this.xRange.max - this.xRange.min)) * this.canvas.height;
  }

  render(): void {
    // If cache is valid and we have an image, render immediately (no rAF delay)
    if (this.cacheCanvas && this.model && this.currentKey() === this.cacheKey) {
      this._render();
      return;
    }
    this._scheduleRender();
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

  private _render(): void {
    if (!this.canvas.width || !this.canvas.height || !this.model) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    if (this.currentKey() !== this.cacheKey) {
      this.requestCompute();
    }

    const colors = viz();
    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, width, height);

    // Grid lines
    this.ctx.strokeStyle = colors.grid;
    this.ctx.lineWidth = 1;
    const stepR = (this.rRange.max - this.rRange.min) / 6;
    for (let r = this.rRange.min; r <= this.rRange.max; r += stepR) {
      const px = this.rToPixelX(r);
      this.ctx.beginPath();
      this.ctx.moveTo(px, 0);
      this.ctx.lineTo(px, height);
      this.ctx.stroke();
    }

    // Axis labels (r axis at bottom, x axis at left)
    this.ctx.fillStyle = colors.ink;
    this.ctx.font = '11px "JetBrains Mono", monospace';
    this.ctx.textAlign = 'center';
    const rMin = this.rRange.min;
    const rMax = this.rRange.max;
    this.ctx.globalAlpha = 0.6;
    this.ctx.fillText(rMin.toFixed(1), this.rToPixelX(rMin + (rMax - rMin) * 0.06), height - 10);
    this.ctx.fillText(rMax.toFixed(1), this.rToPixelX(rMin + (rMax - rMin) * 0.94), height - 10);
    this.ctx.textAlign = 'left';
    const yLabels = [this.xRange.min, this.xRange.max];
    for (const yv of yLabels) {
      this.ctx.fillText(yv.toFixed(1), 4, this.xToPixelY(yv) + 4);
    }
    this.ctx.globalAlpha = 1;

    // Cached density bitmap
    if (this.cacheCanvas) {
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.drawImage(this.cacheCanvas, 0, 0, width, height);
    } else if (this.model) {
      // Subtle loading indicator while computing
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      this.ctx.fillStyle = colors.ink;
      this.ctx.globalAlpha = 0.15;
      this.ctx.fillRect(width * 0.35, height * 0.48, width * 0.3, 3 * dpr);
      this.ctx.globalAlpha = 1;
    }

    // Cached Lyapunov curve
    if (this.showLyapunov && this.lyapunovNorm && this.lyapunovNorm.length === width) {
      this.drawLyapunovFromCache(width, height);
    }

    // Selected r cursor
    const selPx = this.rToPixelX(this.selectedR);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(selPx, 0);
    this.ctx.lineTo(selPx, height);
    this.ctx.strokeStyle = colors.rose;
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = colors.rose;
    this.ctx.shadowBlur = 14;
    this.ctx.stroke();

    // Cursor tooltip
    const labelX = Math.min(selPx + 8, width - 95);
    this.ctx.fillStyle = 'rgba(15, 10, 8, 0.75)';
    this.ctx.fillRect(labelX - 4, 12, 90, 18);
    this.ctx.fillStyle = colors.amber;
    this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
    this.ctx.fillText(`r = ${this.selectedR.toFixed(4)}`, labelX, 26);
    this.ctx.restore();
  }

  private drawLyapunovFromCache(width: number, height: number): void {
    const arr = this.lyapunovNorm;
    if (!arr) return;
    const colors = viz();
    this.ctx.save();
    this.ctx.beginPath();
    let prevPy: number | null = null;
    for (let s = 0; s < width; s++) {
      const px = s;
      const norm = arr[s] ?? 0;
      const py = (1.0 - norm) * height;
      if (prevPy !== null && Math.abs(py - prevPy) > height * 0.3) {
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
      } else if (s === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
      prevPy = py;
    }
    this.ctx.strokeStyle = colors.amber;
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowColor = colors.amber;
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();

    const zeroPy = (1.0 - 2.0 / 3.0) * height;
    this.ctx.beginPath();
    this.ctx.setLineDash([5, 5]);
    this.ctx.moveTo(0, zeroPy);
    this.ctx.lineTo(width, zeroPy);
    this.ctx.strokeStyle = colors.grid;
    this.ctx.stroke();
    this.ctx.restore();
  }

  resetZoom(): void {
    if (!this.model) return;
    this.rRange = { ...this.model.rRange };
    this.cacheKey = '';
    this.requestCompute();
    this.render();
  }

  private initEvents(): void {
    const target = this.canvas.parentElement ?? this.canvas;

    const startDrag = (clientX: number): void => {
      this._isDragging = true;
      const rect = target.getBoundingClientRect();
      const px = (clientX - rect.left) * (this.canvas.width / rect.width);
      const newR = this.pixelXToR(px);
      this.setSelectedR(newR);
      if (this.onSelectR) this.onSelectR(newR);
    };

    const moveDrag = (clientX: number): void => {
      if (!this._isDragging) return;
      const rect = target.getBoundingClientRect();
      const px = (clientX - rect.left) * (this.canvas.width / rect.width);
      const newR = this.pixelXToR(px);
      this.setSelectedR(newR);
      if (this.onSelectR) this.onSelectR(newR);
    };

    const endDrag = (): void => {
      this._isDragging = false;
    };

    target.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
    window.addEventListener('mouseup', endDrag);

    target.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        if (e.touches.length === 2) {
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          if (t0 && t1) {
            this._lastPinchDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
          }
          return;
        }
        startDrag(e.touches[0]!.clientX);
      },
      { passive: false },
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 2 && this._lastPinchDist > 0) {
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          if (!t0 || !t1 || !this.model) return;
          e.preventDefault();
          const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
          const scale = dist / this._lastPinchDist;
          const span = (this.rRange.max - this.rRange.min) * (1 / scale);
          const mid = (this.rRange.min + this.rRange.max) / 2;
          const newMin = Math.max(this.model.rRange.min, mid - span / 2);
          const newMax = Math.min(this.model.rRange.max, mid + span / 2);
          if (newMax - newMin > 0.005) {
            const cursorPx = this.rToPixelX(this.selectedR);
            this.rRange.min = newMin;
            this.rRange.max = newMax;
            this.selectedR = this.pixelXToR(cursorPx);
            this.cacheKey = '';
            this.requestCompute();
            this.render();
          }
          this._lastPinchDist = dist;
          return;
        }
        if (!this._isDragging) return;
        e.preventDefault();
        moveDrag(e.touches[0]!.clientX);
      },
      { passive: false },
    );

    window.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) this._lastPinchDist = 0;
      endDrag();
    });

    target.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = target.getBoundingClientRect();
        const px = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseR = this.pixelXToR(px);

        const zoom = e.deltaY < 0 ? 0.8 : 1.25;
        const span = (this.rRange.max - this.rRange.min) * zoom;
        const ratio = (mouseR - this.rRange.min) / (this.rRange.max - this.rRange.min);

        if (!this.model) return;
        const newMin = Math.max(this.model.rRange.min, mouseR - span * ratio);
        const newMax = Math.min(this.model.rRange.max, mouseR + span * (1 - ratio));

        if (newMax - newMin > 0.005) {
          // Remember cursor pixel position before zoom
          const cursorPx = this.rToPixelX(this.selectedR);

          this.rRange.min = newMin;
          this.rRange.max = newMax;

          // Keep the cursor at the same screen position after zoom
          this.selectedR = this.pixelXToR(cursorPx);

          this.cacheKey = '';
          this.requestCompute();
          this.render();
        }
      },
      { passive: false },
    );
  }
}
