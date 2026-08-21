import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/** x_{n+1} = r·e^(−x_n) — exponential / Ricker-type family. */
export class ExponentialModel extends BifurcationModel {
  readonly id = 'exponential';
  readonly name = 'Mapa Exponencial';
  readonly equationLatex = 'x_{n+1} = r \\cdot e^{-x_n}';
  readonly derivativeLatex = "f'(x) = -r \\cdot e^{-x_n}";
  readonly asciiFormula = 'x_{n+1} = r·e^(−x_n)';
  readonly description =
    'Familia exponencial con colapso rápido del atractor; base del modelo de Ricker en ecología de poblaciones.';
  readonly category = 'transcendental';
  readonly rRange = { min: 0.1, max: 15.0 };
  readonly xRange = { min: 0.0, max: 10.0 };
  readonly defaultR = 5.0;
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly isomorphismLatex = 'c = 0.25 - \\frac{2.25 \\cdot (r - 0.1)}{14.9}';

  next(x: number, r: number): number {
    return r * Math.exp(-x);
  }

  derivative(x: number, r: number): number {
    return -r * Math.exp(-x);
  }

  rToC(r: number): number {
    return 0.25 - (r - 0.1) * (2.25 / 14.9);
  }

  cToR(c: number): number {
    const norm = (0.25 - c) / 2.25;
    return Math.max(0.1, Math.min(15.0, 0.1 + norm * 14.9));
  }
}
