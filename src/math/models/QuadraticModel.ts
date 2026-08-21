import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/**
 * x_{n+1} = r − x_n² — real quadratic family.
 * With y = −x it is exactly conjugate to z_{n+1} = z_n² + c, c = −r,
 * so this is an *exact* slice of the Mandelbrot real axis.
 */
export class QuadraticModel extends BifurcationModel {
  readonly id = 'quadratic';
  readonly name = 'Mapa Cuadrático';
  readonly equationLatex = 'x_{n+1} = r - x_n^2';
  readonly derivativeLatex = "f'(x) = -2 \\cdot x_n";
  readonly asciiFormula = 'x_{n+1} = r − x_n²';
  readonly description =
    'La familia cuadrática real, conjugada exactamente al eje real del conjunto de Mandelbrot vía c = −r (cambio de variable y = −x).';
  readonly category = 'unimodal';
  readonly rRange = { min: -0.25, max: 2.0 };
  readonly xRange = { min: -2.0, max: 2.0 };
  readonly defaultR = 1.25;
  readonly isomorphismKind: IsomorphismKind = 'exact';
  readonly isomorphismLatex = 'c = -r';

  next(x: number, r: number): number {
    return r - x * x;
  }

  derivative(x: number, _r: number): number {
    return -2 * x;
  }

  rToC(r: number): number {
    return -r;
  }

  cToR(c: number): number {
    return -c;
  }
}
