import * as THREE from 'three';
import { fibonacciSphere, PHI } from '../math/fibonacci.js';
import { warmColor } from './canvasHelpers.js';

/**
 * Hero — Girador Áureo 3D.
 * A rotating golden icosahedron wrapped in a Fibonacci-sphere particle halo
 * and a logarithmic golden spiral. Falls back to the 2D spiral canvas when
 * WebGL is unavailable. Honors prefers-reduced-motion.
 */
export class HeroPhi3D {
  private container: HTMLElement;
  private fallbackCanvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  private group = new THREE.Group();
  private halo: THREE.Points | null = null;
  private reduced = false;
  private raf = 0;
  private pointerX = 0;
  private pointerY = 0;

  constructor(container: HTMLElement, fallbackCanvas: HTMLCanvasElement) {
    this.container = container;
    this.fallbackCanvas = fallbackCanvas;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      this.enableFallback();
      return;
    }
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.z = 4.0;
    this.build();
    container.appendChild(this.renderer.domElement);
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindPointer();
    this.loop();
  }

  private build(): void {
    const scene = this.scene;

    // Golden icosahedron (pentagonal symmetry → φ).
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.22,
      emissive: new THREE.Color(0xb45309),
      emissiveIntensity: 0.25,
    });
    const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), mat);
    this.group.add(icosa);

    // Wireframe ring with golden-ratio proportion.
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.35, 1)),
      new THREE.LineBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.28 }),
    );
    this.group.add(wire);

    // Fibonacci-sphere particle halo.
    const count = 320;
    const pts = fibonacciSphere(count);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = pts[i * 3]! * 2.0;
      positions[i * 3 + 1] = pts[i * 3 + 1]! * 2.0;
      positions[i * 3 + 2] = pts[i * 3 + 2]! * 2.0;
      const [r, g, b] = warmColor(0, i / Math.max(1, count - 1));
      colors[i * 3] = r / 255;
      colors[i * 3 + 1] = g / 255;
      colors[i * 3 + 2] = b / 255;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const haloMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.035,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.halo = new THREE.Points(geom, haloMat);
    this.group.add(this.halo);

    // Logarithmic golden spiral line, tilted.
    const spiralPts: number[] = [];
    for (let i = 0; i <= 240; i++) {
      const t = i / 240;
      const a = t * 6 * Math.PI;
      const r = 0.42 * Math.pow(PHI, t * 2.5);
      spiralPts.push(Math.cos(a) * r, Math.sin(a) * r * 0.55, t * 0.9 - 0.45);
    }
    const spiralGeom = new THREE.BufferGeometry();
    spiralGeom.setAttribute('position', new THREE.Float32BufferAttribute(spiralPts, 3));
    const spiral = new THREE.Line(
      spiralGeom,
      new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.7 }),
    );
    this.group.add(spiral);

    scene.add(this.group);

    const gold = new THREE.AmbientLight(0xfff3c4, 0.7);
    scene.add(gold);
    const key = new THREE.DirectionalLight(0xfff7d6, 1.1);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xef4444, 2.2, 8);
    rim.position.set(-2.5, -1, 1.5);
    scene.add(rim);
    const fill = new THREE.PointLight(0xfacc15, 1.6, 8);
    fill.position.set(2.4, -1, 2.2);
    scene.add(fill);
  }

  private bindPointer(): void {
    window.addEventListener('pointermove', (e) => {
      this.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  private resize(): void {
    if (!this.renderer) return;
    const w = this.container.clientWidth || 360;
    const h = this.container.clientHeight || 360;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = `${w}px`;
    this.renderer.domElement.style.height = `${h}px`;
    this.renderer.setPixelRatio(dpr);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    // Auto-fit: scale the sculpture so the golden halo/spiral always fits the
    // visible field in BOTH axes, whatever the canvas aspect (no cut edges).
    const halfH = Math.tan((this.camera.fov / 2) * (Math.PI / 180)) * this.camera.position.z;
    const halfW = halfH * this.camera.aspect;
    const fit = Math.min(halfW, halfH) / 2.1; // 2.1 ≈ max sculpture extent (halo 2.0)
    this.group.scale.setScalar(Math.min(1, Math.max(0.5, fit)));
  }

  private loop(): void {
    if (!this.reduced) {
      this.group.rotation.y += 0.004;
      this.group.rotation.x = 0.15 + this.pointerY * 0.08;
      this.group.rotation.z += 0.0006;
      if (this.halo) this.halo.rotation.y -= 0.0022;
    }
    this.group.rotation.y += this.pointerX * 0.002;
    if (this.renderer) this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(() => this.loop());
  }

  private enableFallback(): void {
    this.fallbackCanvas.hidden = false;
    window.dispatchEvent(new Event('resize'));
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    this.renderer?.dispose();
  }
}
