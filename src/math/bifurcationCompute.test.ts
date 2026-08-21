import { describe, expect, it } from 'vitest';
import { computeBifurcationData, colorizeDensity } from './bifurcationCompute.js';
import { LogisticModel } from './models/LogisticModel.js';

describe('computeBifurcationData', () => {
  const model = new LogisticModel();

  it('produces a density grid of the requested size', () => {
    const result = computeBifurcationData(
      {
        id: 1,
        modelId: 'logistic',
        rMin: 1.0,
        rMax: 4.0,
        width: 120,
        height: 80,
        xMin: 0,
        xMax: 1,
        orbitDensity: 200,
        computeLyapunov: true,
      },
      model,
    );
    expect(result.density.length).toBe(120 * 80);
    expect(result.maxDensity).toBeGreaterThanOrEqual(1);
    // Some cells must be populated
    const total = result.density.reduce((a, b) => a + (b ?? 0), 0);
    expect(total).toBeGreaterThan(0);
  });

  it('computes a Lyapunov array when requested', () => {
    const result = computeBifurcationData(
      {
        id: 2,
        modelId: 'logistic',
        rMin: 1.0,
        rMax: 4.0,
        width: 100,
        height: 60,
        xMin: 0,
        xMax: 1,
        orbitDensity: 100,
        computeLyapunov: true,
      },
      model,
    );
    expect(result.lyapunov?.length).toBe(100);
    expect(result.lyapunovNorm?.length).toBe(100);
    // Chaos region (r near 3.9) has positive lyapunov, attractor (r=2.7) negative
    const idxChaos = Math.round(((3.9 - 1) / 3) * 100);
    const idxStable = Math.round(((2.7 - 1) / 3) * 100);
    expect(result.lyapunov![idxChaos]!).toBeGreaterThan(0);
    expect(result.lyapunov![idxStable]!).toBeLessThan(0);
  });
});

describe('colorizeDensity', () => {
  it('fills RGBA for populated cells and leaves empty cells untouched', () => {
    const density = new Uint16Array(4);
    density[1] = 5;
    const out = new Uint8ClampedArray(16);
    colorizeDensity(density, 10, out);
    expect(out[3]!).toBe(0); // empty
    expect(out[7]!).toBe(255); // alpha set on populated cell
    expect(out[4]! + out[5]! + out[6]!).toBeGreaterThan(0);
  });
});
