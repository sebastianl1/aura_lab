import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/**
 * Tent map: x_{n+1} = r·min(x_n, 1 − x_n).
 * Piecewise-linear, chaotic at r = 2. Not part of the Feigenbaum route.
 */
export class TentModel extends BifurcationModel {
  readonly id = 'tent';
  readonly name = 'Mapa Tienda (Tent)';
  readonly equationLatex = 'x_{n+1} = r \\cdot \\min(x_n,\\; 1 - x_n)';
  readonly derivativeLatex =
    "f'(x) = \\begin{cases} r & x_n < 1/2 \\\\ -r & x_n \\geq 1/2 \\end{cases}";
  readonly asciiFormula = 'x_{n+1} = r·min(x_n, 1−x_n)';
  readonly description =
    'Mapa lineal por tramos con un pico en x = 1/2. A r = 2 es totalmente caótico y conjugado al mapa binario de desplazamiento.';
  readonly category = 'piecewise-linear';
  readonly rRange = { min: 0.0, max: 2.0 };
  readonly xRange = { min: 0.0, max: 1.0 };
  readonly defaultR = 2.0;
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly isomorphismLatex = 'c = 0.25 - \\frac{2.25 \\cdot r}{2}';
  override readonly periodDoublingRoute = false;
  override readonly orbitSeeds = [0.23, 0.47, 0.71, 0.83];

  next(x: number, r: number): number {
    return x < 0.5 ? r * x : r * (1 - x);
  }

  derivative(x: number, r: number): number {
    return x < 0.5 ? r : -r;
  }

  override rToC(r: number): number {
    return this.parametricRToC(r);
  }

  override cToR(c: number): number {
    return this.parametricCToR(c);
  }
}
