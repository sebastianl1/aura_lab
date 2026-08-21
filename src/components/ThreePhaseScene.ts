import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { BifurcationModel } from '../math/models/BaseModel.js';
import { viz } from '../core/theme.js';

const ORBIT_POINTS = 400;
const TRANSIENT = 200;

/** 3D phase-space attractor projection (x_n, x_{n+1}, x_{n+2}) using Three.js. */
export class ThreePhaseScene {
  private canvas: HTMLCanvasElement;
  private model: BifurcationModel | null = null;
  private r = 3.0;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private orbitLine: THREE.Line;
  private orbitPointsObj: THREE.Points;
  private headSphere: THREE.Mesh;
  private wireframe: THREE.LineSegments | null = null;
  private axes: THREE.ArrowHelper[] = [];

  private animationId: number | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;

    const rect = canvasElement.parentElement?.getBoundingClientRect() ?? {
      width: 400,
      height: 300,
    };

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(viz().bg);

    this.camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 20);
    this.camera.position.set(2.5, 1.8, 3.0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));
    this.renderer.setSize(rect.width, rect.height);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.autoRotate = false;
    this.controls.target.set(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0x221a0a);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7d6, 0.9);
    dirLight.position.set(1, 2, 1);
    this.scene.add(dirLight);

    this.buildBoundingBox();

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.8,
    });
    const pointsMaterial = new THREE.PointsMaterial({
      color: viz().rose,
      size: 0.035,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    this.orbitLine = new THREE.Line(new THREE.BufferGeometry(), lineMaterial);
    this.orbitPointsObj = new THREE.Points(new THREE.BufferGeometry(), pointsMaterial);
    this.scene.add(this.orbitLine);
    this.scene.add(this.orbitPointsObj);

    this.headSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      new THREE.MeshBasicMaterial({ color: viz().amber }),
    );
    this.scene.add(this.headSphere);

    this.initEvents();
    this.animate();
  }

  private buildBoundingBox(): void {
    const boxSize = 1.8;
    const geo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({
      color: 0x1a130a,
      transparent: true,
      opacity: 0.25,
    });
    this.wireframe = new THREE.LineSegments(edges, mat);
    this.scene.add(this.wireframe);

    const axisLen = 1.2;
    const colors: [number, number, number] = [0xef4444, 0xfacc15, 0xf97316];
    colors.forEach((color, i) => {
      const dir = new THREE.Vector3(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0);
      const arrow = new THREE.ArrowHelper(
        dir,
        new THREE.Vector3(0, 0, 0),
        axisLen,
        color,
        0.15,
        0.1,
      );
      this.axes.push(arrow);
      this.scene.add(arrow);
    });
  }

  setModel(model: BifurcationModel): void {
    this.model = model;
    this.computeOrbit();
  }

  setR(r: number): void {
    this.r = r;
    this.computeOrbit();
  }

  resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect() ?? { width: 400, height: 300 };
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height);
  }

  private computeOrbit(): void {
    if (!this.model) return;
    const numPoints = ORBIT_POINTS;
    const orbit = this.model.getOrbit(this.r, TRANSIENT, numPoints + 2);
    const xMin = this.model.xRange.min;
    const xMax = this.model.xRange.max;
    const xSpan = xMax - xMin || 1;

    const positions: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      const nx = ((orbit[i]! - xMin) / xSpan) * 2 - 1;
      const ny = ((orbit[i + 1]! - xMin) / xSpan) * 2 - 1;
      const nz = ((orbit[i + 2]! - xMin) / xSpan) * 2 - 1;
      positions.push(nx, ny, nz);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const colors = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      if (t < 0.5) {
        colors[i * 3] = 0.35 + t * 0.4;
        colors[i * 3 + 1] = 0.2 + t * 0.4;
        colors[i * 3 + 2] = 0.7 + t * 0.3;
      } else {
        const t2 = (t - 0.5) * 2;
        colors[i * 3] = 0.55 + t2 * 0.4;
        colors[i * 3 + 1] = 0.1 - t2 * 0.05;
        colors[i * 3 + 2] = 0.85 - t2 * 0.6;
      }
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Reuse a single vertex-colored material instead of allocating per frame.
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    this.orbitLine.geometry.dispose();
    this.orbitLine.geometry = geo;
    (this.orbitLine.material as THREE.Material).dispose();
    this.orbitLine.material = lineMaterial;

    const pointsGeo = new THREE.BufferGeometry();
    if (positions.length >= 3) {
      const lastThree = positions.slice(-3);
      pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(lastThree, 3));
    }
    this.orbitPointsObj.geometry.dispose();
    this.orbitPointsObj.geometry = pointsGeo;

    if (positions.length >= 3) {
      const lastIdx = positions.length - 3;
      this.headSphere.position.set(
        positions[lastIdx]!,
        positions[lastIdx + 1]!,
        positions[lastIdx + 2]!,
      );
    }
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private initEvents(): void {
    window.addEventListener('resize', () => this.resize());
  }

  dispose(): void {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
    this.orbitLine.geometry.dispose();
    (this.orbitLine.material as THREE.Material).dispose();
    this.orbitPointsObj.geometry.dispose();
    (this.orbitPointsObj.material as THREE.Material).dispose();
    this.headSphere.geometry.dispose();
    (this.headSphere.material as THREE.Material).dispose();
    if (this.wireframe) {
      this.wireframe.geometry.dispose();
      (this.wireframe.material as THREE.Material).dispose();
    }
    this.axes.forEach((arrow) => {
      arrow.line.geometry.dispose();
      (arrow.line.material as THREE.Material).dispose();
      arrow.cone.geometry.dispose();
      (arrow.cone.material as THREE.Material).dispose();
    });
    this.controls.dispose();
    this.renderer.dispose();
  }
}
