import * as THREE from 'three';
import { fibonacciSphere } from '../math/fibonacci.js';
import { warmColor } from './canvasHelpers.js';

/**
 * SYS·03 — Esfera de Fibonacci 3D.
 * N points distributed on a sphere following the golden spiral
 * (fibonacci sphere). Auto-rotates; drag to orbit.
 */
export class FibonacciSphere {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private mesh: THREE.Points | null = null;
  private n = 233;
  private palette = 0;
  private raf = 0;
  private rotationX = 0.5;
  private rotationY = -0.6;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.z = 2.8;
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      this.renderer.setClearColor(0x000000, 0);
      this.build();
      this.bindInteractions();
      this.loop();
    } catch {
      this.renderer = null;
    }
  }

  private build(): void {
    if (!this.renderer) return;
    this.scene.clear();
    const n = this.n;
    const pts = fibonacciSphere(n);
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = pts[i * 3]!;
      positions[i * 3 + 1] = pts[i * 3 + 1]!;
      positions[i * 3 + 2] = pts[i * 3 + 2]!;
      const t = i / Math.max(1, n - 1);
      const [r, g, b] = warmColor(this.palette, t);
      colors[i * 3] = r / 255;
      colors[i * 3 + 1] = g / 255;
      colors[i * 3 + 2] = b / 255;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.045,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.mesh = new THREE.Points(geom, mat);
    this.scene.add(this.mesh);

    // Subtle golden wireframe sphere for reference
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1, 24, 16)),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(0xfacc15),
        transparent: true,
        opacity: 0.08,
      }),
    );
    this.scene.add(wire);

    const ambient = new THREE.AmbientLight(0xfef3c7, 0.6);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xfff7d6, 0.9);
    dir.position.set(2, 3, 4);
    this.scene.add(dir);
  }

  private bindInteractions(): void {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.rotationY += dx * 0.008;
      this.rotationX = Math.max(-1.2, Math.min(1.2, this.rotationX + dy * 0.008));
    });
    window.addEventListener('pointerup', () => {
      this.dragging = false;
    });
  }

  private loop(): void {
    if (!this.dragging) {
      this.rotationY += 0.003;
    }
    if (this.mesh && this.renderer) {
      this.mesh.rotation.set(this.rotationX, this.rotationY, 0);
      this.renderer.render(this.scene, this.camera);
    }
    this.raf = requestAnimationFrame(() => this.loop());
  }

  setN(n: number): void {
    this.n = Math.max(20, n);
    this.build();
  }

  setPalette(p: number): void {
    this.palette = p;
    this.build();
  }

  resize(): void {
    if (!this.renderer) return;
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const w = Math.max(80, rect?.width ?? 400);
    const h = Math.max(120, rect?.height ?? 260);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.scene.clear();
    this.renderer?.dispose();
  }
}
