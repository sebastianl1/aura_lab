/**
 * Pure CPU Mandelbrot computation used by the WebGL-fallback renderer.
 * Runs on the main thread synchronously or inside a Web Worker.
 */

export interface MandelbrotComputeRequest {
  id: number;
  centerX: number;
  centerY: number;
  zoom: number;
  maxIter: number;
  width: number;
  height: number;
  palette: number;
  /** Pixel stride (1 = full res, 2 = half res during drag). */
  step: number;
}

export interface MandelbrotComputeResult {
  id: number;
  data: Uint8ClampedArray;
  width: number;
  height: number;
  step: number;
}

/**
 * Mirrors the WebGL fragment-shader palettes so the CPU fallback produces
 * identical colors. Palettes follow the Fibonacci aura identity (oro → rojo).
 */
function shade(smooth: number, maxIter: number, palette: number): [number, number, number] {
  if (smooth >= maxIter) return [15, 10, 8];
  const t = smooth / maxIter;
  const cycle = (smooth * 0.08) % 1;

  // Ámbar — oro → blanco cálido (mirrors GLSL palette0)
  if (palette === 0) {
    const r = 0.06 + 0.93 * Math.pow(t, 0.5);
    const g = 0.05 + 0.8 * Math.pow(t, 0.7);
    const b = 0.01 + 0.22 * Math.pow(t, 1.6);
    return [r * 255, g * 255, b * 255];
  }
  // Rojo φ — oro ↔ rojo brillante
  if (palette === 1) {
    const x = 6.28318 * cycle;
    const r = 0.5 + 0.5 * Math.cos(x);
    const g = 0.5 + 0.42 * Math.cos(x + 1.1);
    const b = 0.35 + 0.2 * Math.cos(x + 2.2);
    return [r * 255, g * 255, b * 255];
  }
  // Fuego — rosa → ámbar → rojo profundo
  if (palette === 2) {
    const x = 6.28318 * cycle;
    const r = 0.85 + 0.15 * Math.cos(x);
    const g = 0.45 + 0.35 * Math.cos(x + 1.1);
    const b = 0.15 + 0.1 * Math.cos(x + 2.2);
    return [r * 255, g * 255, b * 255];
  }
  // Áureo — oro suave → ámbar cálido
  const r = 0.1 + 0.85 * Math.pow(t, 0.9);
  const g = 0.12 + 0.6 * Math.pow(t, 1.1);
  const b = 0.08 + 0.2 * Math.pow(t, 2.0);
  return [r * 255, g * 255, b * 255];
}

export function computeMandelbrot(req: MandelbrotComputeRequest): MandelbrotComputeResult {
  const { centerX, centerY, zoom, maxIter, width, height, palette, step } = req;
  const w2 = Math.ceil(width / step);
  const h2 = Math.ceil(height / step);
  const data = new Uint8ClampedArray(w2 * h2 * 4);

  const aspect = width / height;
  const minX = centerX - zoom * 0.5 * aspect;
  const maxY = centerY + zoom * 0.5;
  const dx = (zoom * aspect) / width;
  const dy = zoom / height;

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
      while (zr2 + zi2 <= 4 && n < maxIter) {
        zi = 2 * zr * zi + ci;
        zr = zr2 - zi2 + cr;
        zr2 = zr * zr;
        zi2 = zi * zi;
        n++;
      }

      const idx = rowOffset + px * 4;
      let r: number;
      let g: number;
      let b: number;
      if (n >= maxIter) {
        r = 10;
        g = 14;
        b = 26;
      } else {
        const logZn = Math.log(zr2 + zi2) / 2;
        const nu = Math.log(logZn / Math.LN2) / Math.LN2;
        const smooth = n + 1 - nu;
        [r, g, b] = shade(smooth, maxIter, palette);
      }
      data[idx] = Math.min(255, r);
      data[idx + 1] = Math.min(255, g);
      data[idx + 2] = Math.min(255, b);
      data[idx + 3] = 255;
    }
  }

  return { id: req.id, data, width: w2, height: h2, step };
}
