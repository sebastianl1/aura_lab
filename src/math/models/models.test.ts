import { describe, expect, it } from 'vitest';
import { globalModelRegistry } from './ModelRegistry.js';
import { LogisticModel } from './LogisticModel.js';
import { QuadraticModel } from './QuadraticModel.js';

describe('ModelRegistry', () => {
  it('registers every model and resolves unknown ids to logistic', () => {
    const ids = globalModelRegistry.list().map((m) => m.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'logistic',
        'sine',
        'quadratic',
        'exponential',
        'polynomial',
        'tent',
        'bernoulli',
        'ricker',
        'cubic',
        'gauss',
      ]),
    );
    expect(globalModelRegistry.getModel('nope').id).toBe('logistic');
  });

  it('every model has a consistent defaultR and valid ranges', () => {
    for (const m of globalModelRegistry.list()) {
      expect(m.rRange.min).toBeLessThan(m.rRange.max);
      expect(m.xRange.min).toBeLessThan(m.xRange.max);
      expect(m.defaultR).toBeGreaterThanOrEqual(m.rRange.min);
      expect(m.defaultR).toBeLessThanOrEqual(m.rRange.max);
      expect(m.equationLatex.length).toBeGreaterThan(0);
      expect(m.derivativeLatex.length).toBeGreaterThan(0);
      expect(m.isomorphismLatex.length).toBeGreaterThan(0);
    }
  });
});

describe('LogisticModel dynamics', () => {
  const model = new LogisticModel();

  it('computes the logistic iterate correctly', () => {
    expect(model.next(0.5, 3.0)).toBeCloseTo(0.75, 12);
    expect(model.next(0.25, 4.0)).toBeCloseTo(0.75, 12);
  });

  it('detects the period-2 orbit at r = 3.2', () => {
    const orbit = Array.from(model.getOrbit(3.2, 500, 40));
    const a = orbit[30]!;
    const b = orbit[31]!;
    expect(Math.abs(orbit[32]! - a)).toBeLessThan(1e-8);
    expect(Math.abs(orbit[33]! - b)).toBeLessThan(1e-8);
    expect(a).not.toBeCloseTo(b, 3);
    expect(model.detectPeriod(3.2)).toBe(2);
  });

  it('detects the period-3 window at r = 3.83', () => {
    expect(model.detectPeriod(3.83)).toBe(3);
  });

  it('lyapunov is negative at a stable attractor and positive in chaos', () => {
    expect(model.computeLyapunov(2.9, 800, 200)).toBeLessThan(0);
    expect(model.computeLyapunov(3.9, 800, 200)).toBeGreaterThan(0.05);
  });

  it('returns -1 (chaos) for a chaotic parameter', () => {
    const period = model.detectPeriod(3.9, 64);
    expect(period).toBe(-1);
  });
});

describe('Exact isomorphism', () => {
  it('logistic r=3.0 maps to c=-0.75 and back', () => {
    const model = new LogisticModel();
    expect(model.rToC(3.0)).toBeCloseTo(-0.75, 12);
    expect(model.cToR(-0.75)).toBeCloseTo(3.0, 12);
    expect(model.isomorphismKind).toBe('exact');
  });

  it('quadratic r maps to c=-r exactly (y = -x conjugacy)', () => {
    const model = new QuadraticModel();
    expect(model.rToC(1.4)).toBeCloseTo(-1.4, 12);
    expect(model.cToR(-1.25)).toBeCloseTo(1.25, 12);
    expect(model.isomorphismKind).toBe('exact');
  });

  it('parametric models stay within the Mandelbrot slice [-2, 0.25]', () => {
    for (const m of globalModelRegistry.list()) {
      const cHigh = m.rToC(m.rRange.max);
      const cLow = m.rToC(m.rRange.min);
      expect(cHigh).toBeLessThanOrEqual(0.25 + 1e-9);
      expect(cLow).toBeGreaterThanOrEqual(-2.0 - 1e-9);
      // round-trip
      expect(m.cToR(cHigh)).toBeCloseTo(m.rRange.max, 6);
      expect(m.cToR(cLow)).toBeCloseTo(m.rRange.min, 6);
    }
  });
});

describe('New model sanity', () => {
  it('tent and bernoulli orbits stay in [0,1]', () => {
    const tent = globalModelRegistry.getModel('tent');
    const bern = globalModelRegistry.getModel('bernoulli');
    for (const r of [1.0, 1.5, 2.0]) {
      for (const x of Array.from(tent.getOrbit(r, 200, 200))) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(1);
      }
      for (const x of Array.from(bern.getOrbit(r, 200, 200))) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThan(1);
      }
    }
  });

  it('bernoulli at r=2 is chaotic (positive lyapunov)', () => {
    const bern = globalModelRegistry.getModel('bernoulli');
    expect(bern.computeLyapunov(2.0, 1000, 100)).toBeGreaterThan(0.05);
  });

  it('cubic map orbit stays within its x-range', () => {
    const cubic = globalModelRegistry.getModel('cubic');
    for (const r of [1.0, 2.0, 3.0]) {
      for (const x of Array.from(cubic.getOrbit(r, 200, 200))) {
        expect(Math.abs(x)).toBeLessThanOrEqual(1.6);
      }
    }
  });

  it('ricker orbit is non-negative and bounded', () => {
    const ricker = globalModelRegistry.getModel('ricker');
    for (const r of [5, 15, 25]) {
      for (const x of Array.from(ricker.getOrbit(r, 200, 200))) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(12);
      }
    }
  });
});
