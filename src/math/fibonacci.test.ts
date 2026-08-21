import { describe, it, expect } from 'vitest';
import {
  PHI,
  GOLDEN_ANGLE_DEG,
  fib,
  fibSafe,
  fibonacciSeq,
  logFib,
  ratio,
  ratioError,
  binet,
  lucas,
  zeckendorf,
  sumFirst,
  phiPower,
  convergent,
  fibonacciSphere,
  phyllotaxis,
  getSpiralStyle,
} from './fibonacci.js';

describe('Fibonacci core', () => {
  it('computes the classical sequence', () => {
    expect(fibSafe(0)).toBe(0);
    expect(fibSafe(1)).toBe(1);
    expect(fibSafe(2)).toBe(1);
    expect(fibSafe(10)).toBe(55);
    expect(fibSafe(20)).toBe(6765);
    expect(fibSafe(50)).toBe(12586269025);
  });

  it('fib matches fibSafe within safe range', () => {
    for (let i = 0; i <= 78; i++) {
      expect(fib(i)).toBe(fibSafe(i));
    }
  });

  it('sequence builder matches known prefix', () => {
    expect(fibonacciSeq(9)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21]);
  });

  it('big F(n) grows like φ^n (log-linear)', () => {
    expect(logFib(500)).toBeCloseTo(500 * Math.log(PHI) - Math.log(Math.sqrt(5)), 2);
    expect(fib(400) / fib(399)).toBeCloseTo(PHI, 4);
  });

  it('Binet reproduces the sequence', () => {
    for (let i = 1; i <= 12; i++) {
      expect(binet(i)).toBeCloseTo(fibSafe(i), 6);
    }
  });

  it('ratio F(n)/F(n-1) converges to φ', () => {
    expect(ratio(3)).toBeCloseTo(2, 6);
    expect(ratio(10)).toBeCloseTo(PHI, 3);
    expect(ratio(50)).toBeCloseTo(PHI, 8);
    expect(Math.abs(ratioError(50))).toBeLessThan(1e-8);
  });

  it('golden angle is ~137.50776°', () => {
    expect(GOLDEN_ANGLE_DEG).toBeCloseTo(137.50776, 4);
  });

  it('lucas numbers L_n = α^n + β^n', () => {
    expect(lucas(0)).toBeCloseTo(2, 4);
    expect(lucas(1)).toBeCloseTo(1, 4);
    expect(lucas(2)).toBeCloseTo(3, 4);
    expect(lucas(10)).toBeCloseTo(123, 4);
  });

  it('sum identity ΣF(i)=F(n+2)−1', () => {
    expect(sumFirst(7)).toBe(33);
    expect(fibSafe(9) - 1).toBe(33);
  });

  it('φ^n = F(n-1) + F(n)·φ', () => {
    const { a, b } = phiPower(6);
    expect(a).toBe(5); // F(5)
    expect(b).toBe(8); // F(6)
  });

  it('continued-fraction convergents approximate φ', () => {
    const c = convergent(16);
    expect(c.p / c.q).toBeCloseTo(PHI, 6);
  });

  it('Zeckendorf representation is unique and non-consecutive', () => {
    expect(zeckendorf(10)).toEqual([6, 3]); // F(6)=8 + F(3)=2
    expect(zeckendorf(33)).toEqual([8, 6, 4, 2]); // 21+8+3+1 = F(8)+F(6)+F(4)+F(2)
  });

  it('fibonacci sphere has unit-radius points', () => {
    const pts = fibonacciSphere(200);
    let allUnit = true;
    for (let i = 0; i < 200; i++) {
      const x = pts[i * 3]!;
      const y = pts[i * 3 + 1]!;
      const z = pts[i * 3 + 2]!;
      const norm = Math.hypot(x, y, z);
      if (Math.abs(norm - 1) > 1e-6) allUnit = false;
    }
    expect(allUnit).toBe(true);
  });

  it('phyllotaxis returns n*3 coords and first seed is centered', () => {
    const style = getSpiralStyle('sunflower');
    const pts = phyllotaxis(10, style);
    expect(pts.length).toBe(30);
    expect(pts[0]!).toBeCloseTo(Math.cos((1 * 137.50776 * Math.PI) / 180) * 0.05 * Math.sqrt(1), 6);
  });
});

describe('fibonacci metrics correctness', () => {
  it('zeckendorf sums to its input', () => {
    for (const target of [1, 2, 3, 10, 34, 100, 233]) {
      const idx = zeckendorf(target);
      let sum = 0;
      for (const i of idx) sum += fibSafe(i);
      expect(sum).toBe(target);
    }
  });
});
