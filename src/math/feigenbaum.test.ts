import { describe, expect, it } from 'vitest';
import { BIFURCATION_MILESTONES, FEIGENBAUM_DELTA } from './feigenbaum.js';

describe('Feigenbaum milestones', () => {
  it('lists the key bifurcation points in order', () => {
    const rs = BIFURCATION_MILESTONES.map((m) => m.r);
    for (let i = 1; i < rs.length; i++) {
      expect(rs[i]!).toBeGreaterThan(rs[i - 1]!);
    }
    expect(BIFURCATION_MILESTONES[0]!.name).toContain('Extinción');
  });

  it('period-doubling interval ratio approaches the Feigenbaum constant δ', () => {
    // Bifurcation r values where periods 2, 4, 8 emerge (indices 2,3,4).
    const r2 = BIFURCATION_MILESTONES[2]!.r;
    const r4 = BIFURCATION_MILESTONES[3]!.r;
    const r8 = BIFURCATION_MILESTONES[4]!.r;
    const ratio = (r4 - r2) / (r8 - r4);
    // The limit is δ ≈ 4.6692; the early ratios converge toward it.
    expect(ratio).toBeGreaterThan(4.5);
    expect(ratio).toBeLessThan(5.0);
    expect(FEIGENBAUM_DELTA).toBeCloseTo(4.66920160910299, 12);
  });
});
