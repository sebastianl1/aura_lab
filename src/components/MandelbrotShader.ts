import * as THREE from 'three';
import type { BifurcationModel } from '../math/models/BaseModel.js';
import { viz } from '../core/theme.js';

const RECT_FALLBACK = { width: 400, height: 300, left: 0, top: 0 };

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform vec2  uCenter;
uniform float uZoom;
uniform float uMaxIter;
uniform float uPalette;
uniform vec2  uResolution;

varying vec2 vUv;

// Aura Lab · Fibonacci palettes (mirrored in mandelbrotCompute.ts)
vec3 palette0(float t) {
  // Ámbar: dark → gold → warm white (oro de la razón áurea)
  return vec3(
    0.06 + 0.93 * pow(t, 0.5),
    0.05 + 0.8  * pow(t, 0.7),
    0.01 + 0.22 * pow(t, 1.6)
  );
}

vec3 palette1(float t) {
  // Rojo φ: oro ↔ rojo brillante
  float r = 0.5 + 0.5 * cos(6.28318 * t);
  float g = 0.5 + 0.42 * cos(6.28318 * t + 1.1);
  float b = 0.35 + 0.2 * cos(6.28318 * t + 2.2);
  return vec3(r, g, b);
}

vec3 palette2(float t) {
  // Fuego: rosa → ámbar → rojo profundo
  float r = 0.85 + 0.15 * cos(6.28318 * t);
  float g = 0.45 + 0.35 * cos(6.28318 * t + 1.1);
  float b = 0.15 + 0.1 * cos(6.28318 * t + 2.2);
  return vec3(r, g, b);
}

vec3 palette3(float t) {
  // Áureo: oro suave → ámbar cálido
  return vec3(0.1 + 0.85 * pow(t, 0.9), 0.12 + 0.6 * pow(t, 1.1), 0.08 + 0.2 * pow(t, 2.0));
}

vec3 getColor(float smooth, float maxIter, float palette) {
  if (smooth >= maxIter) return vec3(0.059, 0.039, 0.031);
  float t = smooth / maxIter;
  float cycle = fract(smooth * 0.08);
  if (palette < 0.5) return palette0(cycle);
  else if (palette < 1.5) return palette1(cycle);
  else if (palette < 2.5) return palette2(cycle);
  else return palette3(t);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float aspect = uResolution.x / uResolution.y;
  uv.x *= aspect;

  vec2 c = uCenter + uv * uZoom;
  vec2 z = vec2(0.0, 0.0);

  float n = 0.0;
  float maxIter = uMaxIter;

  for (float i = 0.0; i < 256.0; i += 1.0) {
    if (n >= maxIter) break;
    float zr2 = z.x * z.x;
    float zi2 = z.y * z.y;
    if (zr2 + zi2 > 4.0) break;
    z.y = 2.0 * z.x * z.y + c.y;
    z.x = zr2 - zi2 + c.x;
    n += 1.0;
  }

  float smoothVal = n;
  if (n < maxIter) {
    float log_zn = log(z.x * z.x + z.y * z.y) / 2.0;
    float nu = log(log_zn / 0.693147) / 0.693147;
    smoothVal = n + 1.0 - nu;
  }

  vec3 color = getColor(smoothVal, maxIter, uPalette);
  gl_FragColor = vec4(color, 1.0);
}
`;

/** WebGL (Three.js ShaderMaterial) Mandelbrot renderer with CPU fallback. */
export class MandelbrotShader {
  private canvas: HTMLCanvasElement;
  private overlayCanvas!: HTMLCanvasElement;
  private overlayCtx!: CanvasRenderingContext2D;
  private ctx: CanvasRenderingContext2D;
  private renderer: THREE.WebGLRenderer | null = null;
  private camera: THREE.OrthographicCamera | null = null;
  private scene: THREE.Scene | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private mesh: THREE.Mesh | null = null;
  private onSelectC: (c: number) => void;

  centerX = -0.75;
  centerY = 0.0;
  zoom = 3.2;
  maxIter = 150;
  palette = 0;
  selectedC = -0.75;
  model: BifurcationModel | null = null;

  isDragging = false;
  dragStart = { x: 0, y: 0 };
  dragCenterStart = { x: 0, y: 0 };

  private isPinching = false;
  private lastPinchDist = 0;
  private pinchCenter = { x: 0, y: 0 };

  private useWebGL = true;

  constructor(canvasElement: HTMLCanvasElement, onSelectC: (c: number) => void) {
    this.canvas = canvasElement;
    this.onSelectC = onSelectC;

    const ctx2d = canvasElement.getContext('2d');
    if (!ctx2d) throw new Error('No 2D context available');
    this.ctx = ctx2d;

    this.createOverlay();
    this.initGL();
    if (!this.renderer) this.useWebGL = false;
    this.initEvents();
  }

  private createOverlay(): void {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.className = 'mandelbrot-overlay';
    this.overlayCanvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;';
    parent.appendChild(this.overlayCanvas);
    const oc = this.overlayCanvas.getContext('2d');
    if (!oc) throw new Error('No overlay 2D context available');
    this.overlayCtx = oc;
  }

  private initGL(): void {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
      });

      const rect = this.canvas.parentElement?.getBoundingClientRect() ?? {
        width: 400,
        height: 300,
      };
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(rect.width, rect.height, false);
      this.overlayCanvas.width = this.canvas.width;
      this.overlayCanvas.height = this.canvas.height;

      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      this.camera.position.z = 1;
      this.scene = new THREE.Scene();

      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uCenter: { value: new THREE.Vector2(this.centerX, this.centerY) },
          uZoom: { value: this.zoom },
          uMaxIter: { value: this.maxIter },
          uPalette: { value: this.palette },
          uResolution: { value: new THREE.Vector2(rect.width * dpr, rect.height * dpr) },
        },
      });

      const geo = new THREE.PlaneGeometry(2, 2);
      this.mesh = new THREE.Mesh(geo, this.material);
      this.scene.add(this.mesh);

      this.renderGL();
    } catch (e) {
      console.warn('WebGL init failed, falling back to CPU renderer:', e);
      this.renderer = null;
    }
  }

  private renderGL(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private renderFallback(): void {
    let width = this.canvas.width;
    let height = this.canvas.height;
    if (!width || !height) {
      const rect = this.canvas.parentElement?.getBoundingClientRect() ?? RECT_FALLBACK;
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.floor(rect.width * dpr);
      this.canvas.height = Math.floor(rect.height * dpr);
      width = this.canvas.width;
      height = this.canvas.height;
    }
    if (!width || !height) return;

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.imageSmoothingEnabled = false;

    const step = this.isDragging ? 2 : 1;
    const w2 = Math.ceil(width / step);
    const h2 = Math.ceil(height / step);

    const imgData = this.ctx.createImageData(w2, h2);
    const data = imgData.data;

    const minX = this.centerX - this.zoom * 0.5 * (width / height);
    const maxY = this.centerY + this.zoom * 0.5;
    const dx = (this.zoom * (width / height)) / width;
    const dy = this.zoom / height;

    for (let py = 0; py < h2; py++) {
      const ci = maxY - py * step * dy;
      const rowOffset = py * w2 * 4;
      for (let px = 0; px < w2; px++) {
        const cr = minX + px * step * dx;
        let zr = 0;
        let zi = 0;
        let zr2 = 0;
        let zi2 = 0;
        let n = 0;
        while (zr2 + zi2 <= 4 && n < this.maxIter) {
          zi = 2 * zr * zi + ci;
          zr = zr2 - zi2 + cr;
          zr2 = zr * zr;
          zi2 = zi * zi;
          n++;
        }

        const idx = rowOffset + px * 4;
        if (n >= this.maxIter) {
          data[idx] = 10;
          data[idx + 1] = 14;
          data[idx + 2] = 26;
        } else {
          const log_zn = Math.log(zr2 + zi2) / 2;
          const nu = Math.log(log_zn / Math.LN2) / Math.LN2;
          const smooth = n + 1 - nu;
          const t = smooth / this.maxIter;
          const cycle = (smooth * 0.08) % 1;
          let r: number;
          let g: number;
          let b: number;

          if (this.palette === 0) {
            r = Math.floor(Math.sin(cycle * Math.PI * 2) * 127 + 128);
            g = Math.floor(Math.sin((cycle + 0.33) * Math.PI * 2) * 127 + 128);
            b = Math.floor(Math.sin((cycle + 0.66) * Math.PI * 2) * 127 + 128);
          } else if (this.palette === 1) {
            r = Math.floor(Math.min(255, Math.pow(t, 0.5) * 255 * 1.2));
            g = Math.floor(Math.min(255, Math.pow(t, 1.2) * 200));
            b = Math.floor(Math.min(255, Math.pow(t, 2.5) * 255));
          } else if (this.palette === 2) {
            r = Math.floor(Math.sin(cycle * Math.PI) * 180 + 20);
            g = Math.floor(Math.cos(cycle * Math.PI * 0.5) * 220 + 35);
            b = Math.floor(Math.sin(cycle * Math.PI * 1.5) * 230 + 25);
          } else {
            r = Math.floor(Math.pow(t, 2) * 80);
            g = Math.floor(Math.pow(t, 0.7) * 220);
            b = Math.floor(Math.pow(t, 0.4) * 255);
          }
          data[idx] = Math.min(255, r);
          data[idx + 1] = Math.min(255, g);
          data[idx + 2] = Math.min(255, b);
        }
        data[idx + 3] = 255;
      }
    }

    if (step > 1) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = w2;
      tempCanvas.height = h2;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.putImageData(imgData, 0, 0);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.drawImage(tempCanvas, 0, 0, width, height);
        this.ctx.imageSmoothingEnabled = false;
      }
    } else {
      this.ctx.putImageData(imgData, 0, 0);
    }
  }

  setModel(model: BifurcationModel): void {
    this.model = model;
  }

  setSelectedR(r: number): void {
    if (this.model) {
      this.selectedC = this.model.rToC(r);
    } else {
      this.selectedC = (2 * r - r * r) / 4;
    }
    if (this.useWebGL && this.renderer && this.material) {
      this.material.uniforms.uCenter!.value.set(this.centerX, this.centerY);
      this.renderGL();
    } else {
      this.renderFallback();
      this.renderOverlay();
    }
    this.renderOverlay();
  }

  setSelectedC(c: number): void {
    this.selectedC = c;
    this.renderOverlay();
  }

  setPalette(index: number): void {
    this.palette = index;
    if (this.useWebGL && this.renderer && this.material) {
      this.material.uniforms.uPalette!.value = index;
      this.renderGL();
    } else {
      this.renderFallback();
      this.renderOverlay();
    }
    this.renderOverlay();
  }

  resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? RECT_FALLBACK;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    if (this.useWebGL && this.renderer && this.material) {
      this.renderer.setSize(rect.width, rect.height, false);
      this.material.uniforms.uResolution!.value.set(rect.width * dpr, rect.height * dpr);
      this.renderGL();
    } else {
      this.canvas.width = Math.floor(rect.width * dpr);
      this.canvas.height = Math.floor(rect.height * dpr);
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
      this.renderFallback();
      this.renderOverlay();
    }

    this.overlayCanvas.width = this.canvas.width;
    this.overlayCanvas.height = this.canvas.height;
    this.renderOverlay();
  }

  private complexToPixel(cr: number, ci: number): { px: number; py: number } {
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? RECT_FALLBACK;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const aspect = rect.width / rect.height;
    const ux = (cr - this.centerX) / ((this.zoom * aspect) / 2);
    const uy = (this.centerY - ci) / (this.zoom / 2);
    return {
      px: (ux / 2 + 0.5) * width,
      py: (uy / 2 + 0.5) * height,
    };
  }

  private renderOverlay(): void {
    if (!this.overlayCtx) return;
    const colors = viz();
    const ctx = this.overlayCtx;
    ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

    const pStart = this.complexToPixel(-2.0, 0.0);
    const pEnd = this.complexToPixel(0.25, 0.0);

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(pStart.px, pStart.py);
    ctx.lineTo(pEnd.px, pEnd.py);
    ctx.strokeStyle = colors.violet;
    ctx.lineWidth = 3;
    ctx.shadowColor = colors.violet;
    ctx.shadowBlur = 10;
    ctx.stroke();

    const pSel = this.complexToPixel(this.selectedC, 0.0);
    ctx.beginPath();
    ctx.arc(pSel.px, pSel.py, 9, 0, Math.PI * 2);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = colors.rose;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(pSel.px, pSel.py, 5, 0, Math.PI * 2);
    ctx.fillStyle = colors.rose;
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colors.ink;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(`c = ${this.selectedC.toFixed(4)}`, pSel.px + 10, pSel.py - 10);

    ctx.restore();
  }

  render(): void {
    if (this.useWebGL && this.renderer) {
      this.renderGL();
    } else {
      this.renderFallback();
      this.renderOverlay();
    }
    this.renderOverlay();
  }

  private pixelToComplex(px: number, py: number): { cr: number; ci: number } {
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? RECT_FALLBACK;
    const ux = (px / rect.width) * 2 - 1;
    const uy = (py / rect.height) * 2 - 1;
    const aspect = rect.width / rect.height;
    return {
      cr: this.centerX + (ux * aspect * this.zoom) / 2,
      ci: this.centerY - (uy * this.zoom) / 2,
    };
  }

  resetView(): void {
    this.centerX = -0.75;
    this.centerY = 0.0;
    this.zoom = 3.2;
    this.maxIter = 150;

    if (this.useWebGL && this.renderer && this.material) {
      this.material.uniforms.uCenter!.value.set(this.centerX, this.centerY);
      this.material.uniforms.uZoom!.value = this.zoom;
      this.material.uniforms.uMaxIter!.value = this.maxIter;
      this.renderGL();
    } else {
      this.renderFallback();
      this.renderOverlay();
    }
    this.renderOverlay();
  }

  private initEvents(): void {
    const target = this.canvas.parentElement ?? this.canvas;

    const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
      if ('touches' in e && e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) return { x: touch.clientX, y: touch.clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const startDrag = (e: MouseEvent | TouchEvent): void => {
      this.isDragging = true;
      const c = getCoords(e);
      this.dragStart = { x: c.x, y: c.y };
      this.dragCenterStart = { x: this.centerX, y: this.centerY };
    };

    const moveDrag = (e: MouseEvent | TouchEvent): void => {
      if (!this.isDragging) return;
      const c = getCoords(e);
      const rect = target.getBoundingClientRect();
      const dx = ((c.x - this.dragStart.x) / rect.width) * this.zoom;
      const dy = ((c.y - this.dragStart.y) / rect.height) * this.zoom;

      this.centerX = this.dragCenterStart.x - dx;
      this.centerY = this.dragCenterStart.y + dy;

      if (this.useWebGL && this.renderer && this.material) {
        this.material.uniforms.uCenter!.value.set(this.centerX, this.centerY);
        this.renderGL();
        this.renderOverlay();
      } else {
        this.renderFallback();
        this.renderOverlay();
      }
    };

    const endDrag = (): void => {
      this.isDragging = false;
      if (!this.useWebGL || !this.renderer) {
        this.renderFallback();
        this.renderOverlay();
        this.renderOverlay();
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent): void => {
      const c = getCoords(e);
      if (Math.abs(this.dragStart.x - c.x) < 5 && Math.abs(this.dragStart.y - c.y) < 5) {
        const rect = target.getBoundingClientRect();
        const px = c.x - rect.left;
        const py = c.y - rect.top;
        const comp = this.pixelToComplex(px, py);
        const clickedC = Math.max(-2.0, Math.min(0.25, comp.cr));
        this.selectedC = clickedC;
        this.renderOverlay();
        if (this.onSelectC) this.onSelectC(clickedC);
      }
    };

    target.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);
    target.addEventListener('click', handleClick);

    target.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        if (e.touches.length === 2) {
          // Pinch-to-zoom: record initial distance and center
          this.isPinching = true;
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          if (t0 && t1) {
            this.lastPinchDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
            this.pinchCenter = {
              x: (t0.clientX + t1.clientX) / 2,
              y: (t0.clientY + t1.clientY) / 2,
            };
            this.dragCenterStart = { x: this.centerX, y: this.centerY };
          }
          return;
        }
        this.isPinching = false;
        startDrag(e);
      },
      { passive: false },
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        if (this.isPinching && e.touches.length === 2) {
          // Pinch-to-zoom
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          if (!t0 || !t1) return;
          const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
          const center = target.getBoundingClientRect();
          const px = this.pinchCenter.x - center.left;
          const py = this.pinchCenter.y - center.top;
          const comp = this.pixelToComplex(px, py);

          const scale = dist / this.lastPinchDist;
          this.zoom *= 1 / scale;
          this.zoom = Math.max(0.001, this.zoom);
          this.maxIter = Math.min(2000, Math.floor(100 + Math.pow(1 / this.zoom, 0.4) * 200));
          this.lastPinchDist = dist;

          // Keep center stable
          const newCr = this.centerX;
          const newCi = this.centerY;
          this.centerX += comp.cr - newCr;
          this.centerY += comp.ci - newCi;

          if (this.useWebGL && this.renderer && this.material) {
            this.material.uniforms.uCenter!.value.set(this.centerX, this.centerY);
            this.material.uniforms.uZoom!.value = this.zoom;
            this.material.uniforms.uMaxIter!.value = this.maxIter;
            this.renderGL();
            this.renderOverlay();
          } else {
            this.renderFallback();
            this.renderOverlay();
          }
          return;
        }
        if (!this.isDragging) return;
        moveDrag(e);
      },
      { passive: false },
    );

    window.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) this.isPinching = false;
      endDrag();
    });

    target.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = target.getBoundingClientRect();
        const c = getCoords(e);
        const px = c.x - rect.left;
        const py = c.y - rect.top;
        const comp = this.pixelToComplex(px, py);

        const zoomFactor = e.deltaY < 0 ? 0.8 : 1.25;
        this.zoom *= zoomFactor;
        this.maxIter = Math.min(2000, Math.floor(100 + Math.pow(1 / this.zoom, 0.4) * 200));

        const ux = (px / rect.width) * 2 - 1;
        const uy = (py / rect.height) * 2 - 1;
        const aspect = rect.width / rect.height;
        const newCr = this.centerX + (ux * aspect * this.zoom) / 2;
        const newCi = this.centerY - (uy * this.zoom) / 2;
        this.centerX += comp.cr - newCr;
        this.centerY += comp.ci - newCi;

        // Render immediately for instant visual feedback.
        if (this.useWebGL && this.renderer && this.material) {
          this.material.uniforms.uCenter!.value.set(this.centerX, this.centerY);
          this.material.uniforms.uZoom!.value = this.zoom;
          this.material.uniforms.uMaxIter!.value = this.maxIter;
          this.renderGL();
          this.renderOverlay();
        } else {
          this.renderFallback();
          this.renderOverlay();
        }
      },
      { passive: false },
    );
  }
}
