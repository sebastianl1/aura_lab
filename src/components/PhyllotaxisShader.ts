import * as THREE from 'three';
import { GOLDEN_ANGLE_RAD, getSpiralStyle } from '../math/fibonacci.js';
import type {
  PhyllotaxisComputeRequest,
  PhyllotaxisComputeResult,
} from '../math/phyllotaxisCompute.js';
import { computePhyllotaxis } from '../math/phyllotaxisCompute.js';

const K0 = 0.05;

/** GLSL golden palettes (mirrored in phyllotaxisCompute.ts). */
const FRAG = `
precision mediump float;
varying float vT;
uniform float uPalette;

vec3 goldColor(float t, float p) {
  float x = 6.28318 * t;
  if (p < 0.5) {
    return vec3(0.93, 0.05 + 0.8 * pow(t, 0.7), 0.22);
  } else if (p < 1.5) {
    return vec3(0.5 + 0.5 * cos(x), 0.5 + 0.42 * cos(x + 1.1), 0.35 + 0.2 * cos(x + 2.2));
  } else if (p < 2.5) {
    return vec3(0.85 + 0.15 * cos(x), 0.45 + 0.35 * cos(x + 1.1), 0.15 + 0.1 * cos(x + 2.2));
  }
  return vec3(0.1 + 0.85 * pow(t, 0.9), 0.12 + 0.6 * pow(t, 1.1), 0.08 + 0.2 * pow(t, 2.0));
}

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  if (dot(c, c) > 0.25) discard;
  float edge = smoothstep(0.5, 0.40, length(c));
  vec3 col = goldColor(vT, uPalette);
  gl_FragColor = vec4(col, 0.95 * edge);
}
`;

const VERT = `
attribute float aT;
uniform float uScale;
uniform float uPanX;
uniform float uPanY;
uniform float uPointSize;
varying float vT;
void main() {
  vT = aT;
  vec3 p = position * uScale + vec3(uPanX * 1.8, uPanY * 1.8, 0.0);
  vec4 clip = vec4(p, 1.0);
  gl_Position = clip;
  gl_PointSize = clamp(uPointSize * uScale, 1.0, 26.0);
}
`;

export class PhyllotaxisShader {
  private canvas: HTMLCanvasElement;
  private n = 233;
  private styleId = 'sunflower';
  private palette = 0;
  private zoom = 1.0;
  private panX = 0;
  private panY = 0;

  // WebGL path
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private points: THREE.Points | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private geometry: THREE.BufferGeometry | null = null;

  // CPU-worker fallback path
  private worker: Worker | null = null;
  private ctx2d: CanvasRenderingContext2D | null = null;
  private pendingId = 0;
  private resizeW = 0;
  private resizeH = 0;

  constructor(
    canvas: HTMLCanvasElement,
    private onSelectCenter?: (x: number, y: number) => void,
  ) {
    this.canvas = canvas;
    this.initRenderer();
    this.bindInteractions();
  }

  private initRenderer(): void {
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      this.renderer = renderer;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      this.camera.position.z = 5;
      this.buildGeometry();
    } catch {
      // WebGL unavailable → CPU worker path.
      this.ctx2d = this.canvas.getContext('2d');
      if (typeof Worker !== 'undefined') {
        const v = { requesting: true };
        void v;
        try {
          this.worker = new Worker(new URL('../workers/phyllotaxis.worker.js', import.meta.url), {
            type: 'module',
          });
        } catch {
          this.worker = null;
        }
      }
    }
  }

  private buildGeometry(): void {
    if (!this.renderer || !this.scene) return;
    const n = this.n;
    const positions = new Float32Array(n * 3);
    const aT = new Float32Array(n);
    const style = getSpiralStyle(this.styleId);
    const angle = style.logSpiral ? 2 * Math.PI * 0.61803 : (style.angleDeg * Math.PI) / 180;
    // Normalize so the disc always fills the viewport regardless of n.
    const maxR = Math.max(1e-6, K0 * Math.sqrt(n));
    for (let i = 0; i < n; i++) {
      const r = (K0 * Math.sqrt(i + 1) * 0.98) / maxR;
      const a = (i + 1) * angle;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = 0;
      aT[i] = i / Math.max(1, n - 1);
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aT', new THREE.BufferAttribute(aT, 1));

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uScale: { value: this.zoom },
        uPanX: { value: this.panX },
        uPanY: { value: this.panY },
        uPointSize: { value: 7 },
        uPalette: { value: this.palette },
      },
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  private bindInteractions(): void {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    this.canvas.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const k = (0.004 / this.zoom) * 2.4;
      this.panX += dx * k;
      this.panY -= dy * k;
      this.applyUniforms();
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
    });
    this.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.zoom *= e.deltaY > 0 ? 0.9 : 1.12;
        this.zoom = Math.max(0.4, Math.min(30, this.zoom));
        this.applyUniforms();
      },
      { passive: false },
    );
    this.canvas.addEventListener('dblclick', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = 1 - ((e.clientY - rect.top) / rect.height) * 2;
      this.panX = nx / 1.8;
      this.panY = ny / 1.8;
      this.applyUniforms();
      this.onSelectCenter?.(this.panX, this.panY);
    });
  }

  private applyUniforms(): void {
    const u = this.material?.uniforms;
    if (!u) return;
    u.uScale!.value = this.zoom;
    u.uPanX!.value = this.panX;
    u.uPanY!.value = this.panY;
    u.uPalette!.value = this.palette;
    this.render();
  }

  private render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  setN(n: number): void {
    this.n = Math.max(3, n);
    // Rebuild geometry on the WebGL path; recompute on the worker path.
    if (this.geometry && this.renderer) {
      this.geometry.dispose();
      this.scene?.remove(this.points as THREE.Object3D);
      this.buildGeometry();
      this.applyUniforms(); // preserve zoom / pan / palette across rebuilds
    } else {
      this.requestCpuRender();
    }
  }

  setStyle(styleId: string): void {
    if (this.styleId === styleId) return;
    this.styleId = styleId;
    this.setN(this.n);
  }

  setPalette(p: number): void {
    this.palette = p;
    this.applyUniforms();
    this.requestCpuRender();
  }

  resetView(): void {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.applyUniforms();
    this.requestCpuRender();
  }

  resize(): void {
    if (this.renderer) {
      const rect = this.canvas.parentElement?.getBoundingClientRect();
      const w = Math.max(80, rect?.width ?? 400);
      const h = Math.max(120, rect?.height ?? 260);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(w, h, false);
      this.camera!.aspect = w / h;
      this.camera!.updateProjectionMatrix();
      this.applyUniforms();
    } else {
      this.requestCpuRender();
    }
  }

  // ─── CPU worker fallback ─────────────────────────────────────────

  private requestCpuRender(): void {
    if (!this.ctx2d) return;
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const w = Math.max(80, rect?.width ?? 400);
    const h = Math.max(120, rect?.height ?? 260);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.resizeW = Math.floor(w * dpr);
    this.resizeH = Math.floor(h * dpr);
    this.canvas.width = this.resizeW;
    this.canvas.height = this.resizeH;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';

    if (!this.worker) {
      const data = computePhyllotaxis(this.buildRequest(1));
      this.blitResult(data);
      return;
    }
    const id = ++this.pendingId;
    this.worker.onmessage = (e: MessageEvent<PhyllotaxisComputeResult>) => {
      if (e.data.id === id) this.blitResult(e.data);
    };
    this.worker.postMessage(this.buildRequest(1));
  }

  private buildRequest(step: number): PhyllotaxisComputeRequest {
    return {
      id: this.pendingId,
      n: this.n,
      style: this.styleId,
      k: K0,
      width: this.resizeW,
      height: this.resizeH,
      zoom: this.zoom,
      centerX: this.panX,
      centerY: this.panY,
      palette: this.palette,
      step,
    };
  }

  private blitResult(res: PhyllotaxisComputeResult): void {
    if (!this.ctx2d) return;
    const data = new Uint8ClampedArray(res.data);
    this.ctx2d.putImageData(new ImageData(data, res.width, res.height), 0, 0);
  }

  dispose(): void {
    this.geometry?.dispose();
    this.material?.dispose();
    this.renderer?.dispose();
    this.worker?.terminate();
  }
}

export { GOLDEN_ANGLE_RAD };
