import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/**
 * Ricker population map: x_{n+1} = r·x_n·e^(−x_n).
 * Unimodal transcendental map with a full period-doubling route to chaos.
 */
export class RickerModel extends BifurcationModel {
  readonly id = 'ricker';
  readonly name = 'Mapa de Ricker';
  readonly equationLatex = 'x_{n+1} = r \\cdot x_n \\cdot e^{-x_n}';
  readonly derivativeLatex = "f'(x) = r \\cdot e^{-x_n} \\cdot (1 - x_n)";
  readonly asciiFormula = 'x_{n+1} = r·x_n·e^(−x_n)';
  readonly description =
    'Modelo ecológico de Ricker para dinámica de poblaciones: unimodal, con cascada de duplicación de periodo y caos determinista.';
  readonly category = 'transcendental';
  readonly rRange = { min: 0.5, max: 25.0 };
  readonly xRange = { min: 0.0, max: 12.0 };
  readonly defaultR = 15.0;
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly isomorphismLatex = 'c = 0.25 - \\frac{2.25 \\cdot (r - 0.5)}{24.5}';

  next(x: number, r: number): number {
    return r * x * Math.exp(-x);
  }

  derivative(x: number, r: number): number {
    return r * Math.exp(-x) * (1 - x);
  }

  override rToC(r: number): number {
    return this.parametricRToC(r);
  }

  override cToR(c: number): number {
    return this.parametricCToR(c);
  }
}
