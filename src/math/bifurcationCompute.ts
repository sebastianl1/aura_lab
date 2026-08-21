import type { BifurcationModel } from './models/BaseModel.js';
import { LYAPUNOV_CONFIG } from './lyapunovConfig.js';

/**
 * Pure bifurcation-diagram computation, runnable both on the main thread and
 * inside a Web Worker (and unit-tested directly in Node).
 */

export interface BifurcationComputeRequest {
  id: number;
  /** Model id as registered in the ModelRegistry. */
  modelId: string;
  /** Polynomial degree k (only relevant for the polynomial model). */
  polyK?: number;
  rMin: number;
  rMax: number;
  width: number;
  height: number;
  xMin: number;
  xMax: number;
  orbitDensity: number;
  computeLyapunov: boolean;
}

export interface BifurcationComputeResult {
  id: number;
  density: Uint16Array;
  maxDensity: number;
  /** Raw Lyapunov exponent per column (only when computeLyapunov). */
  lyapunov?: Float32Array;
  /** Lyapunov mapped to [0, 1] for rendering (only when computeLyapunov). */
  lyapunovNorm?: Float32Array;
}

export const BIFURCATION_TRANSIENT = 300;

export function computeBifurcationData(
  req: BifurcationComputeRequest,
  model: BifurcationModel,
): BifurcationComputeResult {
  const { rMin, rMax, width, height, xMin, xMax, orbitDensity, computeLyapunov } = req;
  const density = new Uint16Array(width * height);
  const rSpan = rMax - rMin;
  const xSpan = xMax - xMin;
  const xInv = 1 / (xSpan || 1);

  const lyapunov = computeLyapunov ? new Float32Array(width) : undefined;
  const lyapunovNorm = computeLyapunov ? new Float32Array(width) : undefined;

  for (let col = 0; col < width; col++) {
    const r = rMin + (col / width) * rSpan;

    for (const seed of model.orbitSeeds) {
      const orbit = model.getOrbit(r, BIFURCATION_TRANSIENT, orbitDensity, seed);

      for (let i = 0; i < orbit.length; i++) {
        const py = Math.floor((1 - (orbit[i]! - xMin) * xInv) * height);
        if (py >= 0 && py < height) {
          const idx = py * width + col;
          density[idx] = (density[idx] ?? 0) + 1;
        }
      }
    }

    if (lyapunov && lyapunovNorm) {
      const lambda = model.computeLyapunov(
        r,
        LYAPUNOV_CONFIG.iterations,
        LYAPUNOV_CONFIG.transient,
        LYAPUNOV_CONFIG.x0,
      );
      lyapunov[col] = lambda;
      lyapunovNorm[col] = Math.max(0, Math.min(1, (lambda + 2.0) / 3.0));
    }
  }

  let maxDensity = 0;
  for (let i = 0; i < density.length; i++) {
    if (density[i]! > maxDensity) maxDensity = density[i]!;
  }

  return {
    id: req.id,
    density,
    maxDensity: Math.max(1, maxDensity),
    lyapunov,
    lyapunovNorm,
  };
}

/** Fill an RGBA buffer (ImageData.data) with the bifurcation heatmap colors.
 *  Solar map: cool cyan at low density → warm amber/white at high density. */
export function colorizeDensity(
  density: Uint16Array,
  maxDensity: number,
  out: Uint8ClampedArray,
): void {
  const invLog = 1 / Math.log(1 + maxDensity);
  for (let i = 0; i < density.length; i++) {
    const d = density[i];
    const idx = i * 4;
    if (d !== undefined && d > 0) {
      const t = Math.min(1, Math.log(1 + d) * invLog);
      if (t < 0.5) {
        const t2 = t * 2;
        out[idx] = Math.floor(t2 * 30);
        out[idx + 1] = Math.floor(120 + t2 * 100);
        out[idx + 2] = Math.floor(190 + t2 * 65);
      } else {
        const t2 = (t - 0.5) * 2;
        out[idx] = Math.floor(190 + t2 * 65);
        out[idx + 1] = Math.floor(140 + t2 * 95);
        out[idx + 2] = Math.floor(40 + t2 * 180);
      }
      out[idx + 3] = 255;
    }
  }
}
