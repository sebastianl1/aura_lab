export interface ModelRange {
  min: number;
  max: number;
}

/**
 * How a model maps its parameter r to the real-axis Mandelbrot parameter c.
 * - `exact`: the mapping is a true conjugacy (Logistic ↔ Mandelbrot slice).
 * - `parametric`: the mapping is a convenient slice of the Mandelbrot real axis,
 *   not a mathematical conjugacy. Shown honestly to the student in the UI.
 */
export type IsomorphismKind = 'exact' | 'parametric';

/**
 * Unified interface for 1-D discrete dynamical systems
 *   x_{n+1} = f_r(x_n)
 * used across every panel (bifurcation, cobweb, phase space, Lyapunov...).
 */
export abstract class BifurcationModel {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly equationLatex: string;
  abstract readonly derivativeLatex: string;
  abstract readonly asciiFormula: string;
  abstract readonly description: string;
  abstract readonly category: string;
  abstract readonly rRange: ModelRange;
  abstract readonly xRange: ModelRange;
  abstract readonly defaultR: number;
  abstract readonly isomorphismKind: IsomorphismKind;
  /** LaTeX of the r → c mapping shown in the isomorphism connector. */
  abstract readonly isomorphismLatex: string;

  /** The doubling route to chaos (period-1 → 2 → 4 → … → chaos) applies. */
  readonly periodDoublingRoute: boolean = true;

  /**
   * Serializable parameters that change the shape of the diagram
   * (e.g. the polynomial degree k). Used for worker payloads and cache keys.
   */
  getParameterState(): Record<string, number> {
    return {};
  }

  /**
   * Initial conditions used when accumulating the bifurcation density.
   * Piecewise-linear maps (tent, Bernoulli) collapse rational seeds onto
   * short cycles, so they override this with several generic seeds.
   */
  readonly orbitSeeds: number[] = [0.5];

  /** Clamp r into the valid parameter range. */
  clampR(r: number): number {
    return Math.max(this.rRange.min, Math.min(this.rRange.max, r));
  }

  /** Next iterate x_{n+1} = f_r(x_n). */
  abstract next(x: number, r: number): number;

  /** Derivative f'_r(x), used for the Lyapunov exponent. */
  abstract derivative(x: number, r: number): number;

  /** Collect an orbit after discarding the transient. */
  getOrbit(r: number, transient = 300, points = 200, x0 = 0.5): Float64Array {
    let x = x0;
    for (let i = 0; i < transient; i++) x = this.next(x, r);
    const orbit = new Float64Array(points);
    for (let i = 0; i < points; i++) {
      x = this.next(x, r);
      orbit[i] = x;
    }
    return orbit;
  }

  /**
   * Lyapunov exponent
   *   λ = lim (1/N) Σ ln|f'(x_i)|
   * λ < 0 stable attractor · λ ≈ 0 critical bifurcation · λ > 0 chaos.
   */
  computeLyapunov(r: number, iterations = 600, transient = 200, x0 = 0.5): number {
    let x = x0;
    for (let i = 0; i < transient; i++) x = this.next(x, r);
    let sum = 0;
    let count = 0;
    for (let i = 0; i < iterations; i++) {
      x = this.next(x, r);
      const deriv = Math.abs(this.derivative(x, r));
      if (deriv > 1e-12) {
        sum += Math.log(deriv);
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }

  /** Detect the orbit period; returns -1 for chaos / large period. */
  detectPeriod(r: number, maxPeriod = 64, tolerance = 1e-5): number {
    const orbit = this.getOrbit(r, 500, maxPeriod * 4);
    const lastVal = orbit[orbit.length - 1]!;
    for (let p = 1; p <= maxPeriod; p++) {
      const diff = Math.abs(orbit[orbit.length - 1 - p]! - lastVal);
      if (diff < tolerance) {
        let confirmed = true;
        for (let k = 1; k <= 3; k++) {
          if (Math.abs(orbit[orbit.length - 1 - k * p]! - lastVal) > tolerance * 5) {
            confirmed = false;
            break;
          }
        }
        if (confirmed) return p;
      }
    }
    return -1;
  }

  /** Map parameter r to the Mandelbrot real-axis parameter c. */
  rToC(r: number): number {
    return (2 * r - r * r) / 4;
  }

  /** Map Mandelbrot real-axis parameter c back to parameter r. */
  cToR(c: number): number {
    if (c > 0.25) return this.rRange.min;
    return 1 + Math.sqrt(1 - 4 * c);
  }

  /**
   * Parametric (non-conjugacy) slice of the Mandelbrot real axis:
   * maps this model's r ∈ [min, max] linearly onto c ∈ [0.25, -2].
   */
  protected parametricRToC(r: number): number {
    return 0.25 - ((r - this.rRange.min) / (this.rRange.max - this.rRange.min)) * 2.25;
  }

  protected parametricCToR(c: number): number {
    return this.rRange.min + ((0.25 - c) / 2.25) * (this.rRange.max - this.rRange.min);
  }
}
