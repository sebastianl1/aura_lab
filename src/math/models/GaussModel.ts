import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/**
 * Iterated Gauss map: x_{n+1} = exp(−r·x_n²).
 * Transcendental decreasing map reaching chaos through flip bifurcations.
 */
export class GaussModel extends BifurcationModel {
  readonly id = 'gauss';
  readonly name = 'Mapa de Gauss';
  readonly equationLatex = 'x_{n+1} = e^{-r \\cdot x_n^2}';
  readonly derivativeLatex = "f'(x) = -2r \\cdot x_n \\cdot e^{-r \\cdot x_n^2}";
  readonly asciiFormula = 'x_{n+1} = e^(−r·x_n²)';
  readonly description =
    'Mapa trascendente decreciente: la pendiente negativa produce bifurcaciones de volteo (flip) hacia el caos.';
  readonly category = 'transcendental';
  readonly rRange = { min: 0.5, max: 20.0 };
  readonly xRange = { min: 0.0, max: 1.0 };
  readonly defaultR = 6.0;
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly isomorphismLatex = 'c = 0.25 - \\frac{2.25 \\cdot (r - 0.5)}{19.5}';

  next(x: number, r: number): number {
    return Math.exp(-r * x * x);
  }

  derivative(x: number, r: number): number {
    return -2 * r * x * Math.exp(-r * x * x);
  }

  override rToC(r: number): number {
    return this.parametricRToC(r);
  }

  override cToR(c: number): number {
    return this.parametricCToR(c);
  }
}
