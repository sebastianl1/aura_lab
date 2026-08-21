/**
 * Fibonacci & golden-ratio core mathematics for Aura Lab.
 * Pure, side-effect free, unit-testable.
 */

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PSI = (1 - Math.sqrt(5)) / 2; // conjugate root (negative)
export const GOLDEN_ANGLE_RAD = (2 * Math.PI) / (PHI * PHI); // ≈ 2.399963 rad
export const GOLDEN_ANGLE_DEG = 360 / (PHI * PHI); // ≈ 137.50776°

/** Exact Fibonacci numbers for n where F(n) stays within safe integers. */
export function fibSafe(n: number): number {
  if (n < 0) return 0;
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}

/** F(n) as a double (accurate up to ~1e208; beyond safe-integer range loses precision). */
export function fib(n: number): number {
  if (n <= 78) return fibSafe(n);
  return (Math.pow(PHI, n) - Math.pow(PSI, n)) / Math.sqrt(5);
}

/** Natural log of F(n) using the dominant term (exact for large n, avoids overflow). */
export function logFib(n: number): number {
  if (n <= 0) return 0;
  if (n <= 40) return Math.log(fib(n));
  return n * Math.log(PHI) - Math.log(Math.sqrt(5));
}

/** Ratio F(n) / F(n-1); converges to φ as n → ∞. */
export function ratio(n: number): number {
  if (n <= 1) return NaN;
  return fib(n) / fib(n - 1);
}

/** Signed difference ratio − φ */
export function ratioError(n: number): number {
  return ratio(n) - PHI;
}

/** Binet's closed form. */
export function binet(n: number): number {
  return (Math.pow(PHI, n) - Math.pow(PSI, n)) / Math.sqrt(5);
}

/** Lucas number L_n = α^n + β^n. */
export function lucas(n: number): number {
  return Math.pow(PHI, n) + Math.pow(PSI, n);
}

/** First `count` Fibonacci numbers (as doubles). */
export function fibonacciSeq(count: number): number[] {
  const out: number[] = [];
  let x = 0;
  let y = 1;
  for (let i = 0; i < count; i++) {
    out.push(x);
    const next = x + y;
    x = y;
    y = next;
  }
  return out;
}

/**
 * Zeckendorf representation: every positive integer is a unique sum of
 * non-consecutive Fibonacci numbers. Returns the Fibonacci term indices.
 */
export function zeckendorf(num: number): number[] {
  const indices: number[] = [];
  let remaining = num;
  // Fibonacci values up to num (safe integers only).
  const vals: number[] = [];
  let a = 1;
  let b = 2;
  vals.push(a, b);
  for (let i = 3; i < 60 && b <= remaining; i++) {
    const next = a + b;
    a = b;
    b = next;
    vals.push(b);
  }
  for (let i = vals.length - 1; i >= 0; i--) {
    const v = vals[i]!;
    if (remaining >= v) {
      remaining -= v;
      indices.push(i + 2); // F(3)=2, F(4)=3, ...
    }
  }
  return indices;
}

/** Continued-fraction of φ = [1; 1, 1, …]: first `depth` partial quotients. */
export function phiContinuedFraction(depth = 12): number[] {
  return Array.from({ length: depth }, () => 1);
}

/** Rational convergent p_n/q_n of the continued fraction [1;1,1,…]. */
export function convergent(depth: number): { p: number; q: number } {
  let p0 = 1;
  let q0 = 0;
  let p1 = 1;
  let q1 = 1;
  for (let i = 1; i < depth; i++) {
    const p2 = p1 + p0;
    const q2 = q1 + q0;
    p0 = p1;
    q0 = q1;
    p1 = p2;
    q1 = q2;
  }
  return { p: p1, q: q1 };
}

/** Sum identity Σ_{i=1..n} F(i) = F(n+2) − 1. */
export function sumFirst(n: number): number {
  return fib(n + 2) - 1;
}

/** φ satisfies x² = x + 1 → build the (n)-th power identity coefficients. */
export function phiPower(n: number): { a: number; b: number } {
  // φ^n = a + b·φ with (a,b) = (F(n-1), F(n))
  return { a: fibSafe(n - 1), b: fibSafe(n) };
}

export interface SpiralStyle {
  id: string;
  /** Human label (used by UI). */
  label: string;
  /** Divergence in degrees between consecutive primordia. */
  angleDeg: number;
  /** Whether the layout follows a logarithmic (mirabilis) spiral. */
  logSpiral: boolean;
}

export const SPIRAL_STYLES: SpiralStyle[] = [
  { id: 'sunflower', label: 'Girasol 137.5°', angleDeg: 137.50776, logSpiral: false }, // golden angle
  { id: 'leaves', label: 'Hojas 222.5°', angleDeg: 222.4922, logSpiral: false }, // complementary angle
  { id: 'paloverde', label: 'Palo verde 135.9°', angleDeg: 135.9, logSpiral: false },
  { id: 'decussate', label: 'Retrocruzada 90°', angleDeg: 90, logSpiral: false },
  { id: 'nautilus', label: 'Concha Nautilus', angleDeg: GOLDEN_ANGLE_DEG, logSpiral: true },
];

export function getSpiralStyle(id: string): SpiralStyle {
  return SPIRAL_STYLES.find((s) => s.id === id) ?? SPIRAL_STYLES[0]!;
}

/**
 * Primordia positions for phyllotaxis. Returns (cos, sin, radius01) per seed.
 * `k` scales the packing density; the layout is a sunflower disc.
 */
export function phyllotaxis(n: number, style: SpiralStyle, k = 0.05): Float64Array {
  const pts = new Float64Array(n * 3);
  const angle = style.logSpiral ? 2 * Math.PI * 0.61803 : (style.angleDeg * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    const r = k * Math.sqrt(i + 1);
    const a = (i + 1) * angle;
    pts[i * 3] = Math.cos(a) * r;
    pts[i * 3 + 1] = Math.sin(a) * r;
    pts[i * 3 + 2] = r;
  }
  return pts;
}

/** Points on a Fibonacci sphere (golden-spiral distribution), normalized. */
export function fibonacciSphere(count: number): Float64Array {
  const pts = new Float64Array(count * 3);
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians
  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    pts[i * 3] = Math.cos(phi) * r;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = Math.sin(phi) * r;
  }
  return pts;
}
