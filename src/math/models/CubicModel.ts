import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/**
 * Symmetric cubic map: x_{n+1} = r·x_n·(1 − x_n²).
 * Shows a pitchfork bifurcation, period doubling and order windows.
 */
export class CubicModel extends BifurcationModel {
  readonly id = 'cubic';
  readonly name = 'Mapa Cúbico';
  readonly equationLatex = 'x_{n+1} = r \\cdot x_n \\cdot (1 - x_n^2)';
  readonly derivativeLatex = "f'(x) = r \\cdot (1 - 3x_n^2)";
  readonly asciiFormula = 'x_{n+1} = r·x_n·(1 − x_n²)';
  readonly description =
    'Familia cúbica simétrica: bifurcación de pitchfork, duplicación de periodo y ventanas de orden dentro del caos.';
  readonly category = 'polynomial';
  readonly rRange = { min: 0.5, max: 3.0 };
  readonly xRange = { min: -1.5, max: 1.5 };
  readonly defaultR = 2.5;
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly isomorphismLatex = 'c = 0.25 - \\frac{2.25 \\cdot (r - 0.5)}{2.5}';

  next(x: number, r: number): number {
    return r * x * (1 - x * x);
  }

  derivative(x: number, r: number): number {
    return r * (1 - 3 * x * x);
  }

  override rToC(r: number): number {
    return this.parametricRToC(r);
  }

  override cToR(c: number): number {
    return this.parametricCToR(c);
  }
}
