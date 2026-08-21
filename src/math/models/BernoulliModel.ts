import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/**
 * Bernoulli / shift map: x_{n+1} = (r·x_n) mod 1.
 * Fully chaotic for r > 1; at r = 2 it is the iconic doubling map.
 */
export class BernoulliModel extends BifurcationModel {
  readonly id = 'bernoulli';
  readonly name = 'Mapa de Bernoulli (Shift)';
  readonly equationLatex = 'x_{n+1} = (r \\cdot x_n) \\bmod 1';
  readonly derivativeLatex = "f'(x) = r \\quad \\text{(casi dondequiera)}";
  readonly asciiFormula = 'x_{n+1} = (r·x_n) mod 1';
  readonly description =
    'Mapa de desplazamiento binario: multiplica por r y descarta la parte entera. A r = 2 es el mapa duplicador, el ejemplo canónico de caos.';
  readonly category = 'piecewise-linear';
  readonly rRange = { min: 1.0, max: 2.0 };
  readonly xRange = { min: 0.0, max: 1.0 };
  readonly defaultR = 2.0;
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly isomorphismLatex = 'c = 0.25 - 2.25 \\cdot (r - 1)';
  override readonly periodDoublingRoute = false;
  override readonly orbitSeeds = [0.21, 0.37, 0.53, 0.79];

  next(x: number, r: number): number {
    return (r * x) % 1;
  }

  derivative(_x: number, r: number): number {
    return r;
  }

  override rToC(r: number): number {
    return this.parametricRToC(r);
  }

  override cToR(c: number): number {
    return this.parametricCToR(c);
  }
}
