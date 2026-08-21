import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/**
 * Generative polynomial family x_{n+1} = r·x_n·(1 − x_n^k).
 * The degree k shapes the map's maximum and the resulting attractor.
 */
export class PolynomialModel extends BifurcationModel {
  readonly id = 'polynomial';
  readonly category = 'polynomial';
  readonly rRange = { min: 1.0, max: 3.5 };
  readonly xRange = { min: 0.0, max: 1.0 };
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly description =
    'Familia generativa: el grado k controla la forma del máximo y la geometría del atractor, generando nuevas cascadas de bifurcación.';

  private _k: number;

  constructor(k = 3) {
    super();
    this._k = Math.max(1, Math.min(6, k));
  }

  get k(): number {
    return this._k;
  }

  updateK(k: number): void {
    this._k = Math.max(1, Math.min(6, k));
  }

  override getParameterState(): Record<string, number> {
    return { k: this._k };
  }

  get name(): string {
    return `Polinómico (k = ${this._k})`;
  }

  get equationLatex(): string {
    return `x_{n+1} = r \\cdot x_n \\cdot (1 - x_n^{${this._k}})`;
  }

  get derivativeLatex(): string {
    return `f'(x) = r \\cdot (1 - ${this._k + 1} \\cdot x_n^{${this._k}})`;
  }

  get asciiFormula(): string {
    return `x_{n+1} = r·x_n·(1 − x_n^${this._k})`;
  }

  get isomorphismLatex(): string {
    return `c = 0.25 - \\frac{2.25 \\cdot (r - ${this.rRange.min})}{${this.rRange.max - this.rRange.min}}`;
  }

  get defaultR(): number {
    return 2.6;
  }

  next(x: number, r: number): number {
    return r * x * (1 - Math.pow(x, this._k));
  }

  derivative(x: number, r: number): number {
    return r * (1 - (this._k + 1) * Math.pow(x, this._k));
  }

  rToC(r: number): number {
    const norm = (r - this.rRange.min) / (this.rRange.max - this.rRange.min);
    return 0.25 - norm * 2.25;
  }

  cToR(c: number): number {
    const norm = (0.25 - c) / 2.25;
    return this.rRange.min + norm * (this.rRange.max - this.rRange.min);
  }
}
