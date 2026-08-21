/**
 * Pure CPU phyllotaxis computation used by the WebGL-fallback renderer.
 * Runs on the main thread synchronously or inside a Web Worker.
 */
import { getSpiralStyle } from './fibonacci.js';

export interface PhyllotaxisComputeRequest {
  id: number;
  /** Number of seeds. */
  n: number;
  /** Spiral style id (sunflower, leaves, paloverde, decussate, nautilus). */
  style: string;
  /** Packing density. */
  k: number;
  width: number;
  height: number;
  zoom: number;
  centerX: number;
  centerY: number;
  palette: number;
  /** Pixel stride (1 = full res, 2 = half res during drag). */
  step: number;
}

export interface PhyllotaxisComputeResult {
  id: number;
  data: Uint8ClampedArray;
  width: number;
  height: number;
  step: number;
}

function warmColor(t: number, palette: number): [number, number, number] {
  const x = 6.28318 * t;
  if (palette === 0) {
    // Ámbar — oro → blanco cálido
    return [0.93 * 255, (0.05 + 0.8 * Math.pow(t, 0.7)) * 255, 0.22 * 255];
  }
  if (palette === 1) {
    // Rojo φ — oro ↔ rojo
    const r = 0.5 + 0.5 * Math.cos(x);
    const g = 0.5 + 0.42 * Math.cos(x + 1.1);
    const b = 0.35 + 0.2 * Math.cos(x + 2.2);
    return [r * 255, g * 255, b * 255];
  }
  if (palette === 2) {
    // Fuego — rosa → ámbar → rojo
    const r = 0.85 + 0.15 * Math.cos(x);
    const g = 0.45 + 0.35 * Math.cos(x + 1.1);
    const b = 0.15 + 0.1 * Math.cos(x + 2.2);
    return [r * 255, g * 255, b * 255];
  }
  // Áureo — oro suave
  return [
    (0.1 + 0.85 * Math.pow(t, 0.9)) * 255,
    (0.12 + 0.6 * Math.pow(t, 1.1)) * 255,
    (0.08 + 0.2 * Math.pow(t, 2.0)) * 255,
  ];
}

export function computePhyllotaxis(req: PhyllotaxisComputeRequest): PhyllotaxisComputeResult {
  const { n, style: styleId, k, width, height, zoom, centerX, centerY, palette, step } = req;
  const w2 = Math.ceil(width / step);
  const h2 = Math.ceil(height / step);
  const data = new Uint8ClampedArray(w2 * h2 * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 15;
    data[i + 1] = 10;
    data[i + 2] = 8;
    data[i + 3] = 255;
  }

  const style = getSpiralStyle(styleId);
  const angle = style.logSpiral ? 2 * Math.PI * 0.61803 : (style.angleDeg * Math.PI) / 180;
  const cx = (w2 - 1) / 2 + centerX * (step === 2 ? 0 : 1);
  const cy = (h2 - 1) / 2 + centerY * (step === 2 ? 0 : 1);
  // Normalized fit (mirrors the WebGL shader): the disc always fills ~0.46·min.
  const maxR = Math.max(1e-6, 0.05 * Math.sqrt(n));
  const scale = (zoom * Math.min(h2, w2) * 0.46) / maxR;
  if (!isFinite(scale) || scale <= 0) {
    return { id: req.id, data, width: w2, height: h2, step };
  }

  const rad = Math.max(1, Math.round(1.5 + zoom * 2.5));
  for (let i = 0; i < n; i++) {
    const r0 = k * Math.sqrt(i + 1) * scale;
    const a = (i + 1) * angle;
    const sx = Math.round(cx + Math.cos(a) * r0);
    const sy = Math.round(cy + Math.sin(a) * r0);
    const t = (i / Math.max(1, n - 1)) % 1;
    const [r, g, b] = warmColor(t, palette);
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        const px = sx + dx;
        const py = sy + dy;
        if (px < 0 || py < 0 || px >= w2 || py >= h2) continue;
        if (dx * dx + dy * dy > rad * rad) continue;
        const idx = (py * w2 + px) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
  }

  return { id: req.id, data, width: w2, height: h2, step };
}
