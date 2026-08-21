import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/** x_{n+1} = r·x_n·(1 − x_n) — the canonical unimodal map. */
export class LogisticModel extends BifurcationModel {
  readonly id = 'logistic';
  readonly name = 'Mapa Logístico';
  readonly equationLatex = 'x_{n+1} = r \\cdot x_n \\cdot (1 - x_n)';
  readonly derivativeLatex = "f'(x) = r \\cdot (1 - 2x_n)";
  readonly asciiFormula = 'x_{n+1} = r·x_n·(1 − x_n)';
  readonly description =
    'El mapa más estudiado de la dinámica no lineal: modela poblaciones con capacidad de carga y exhibe la ruta universal de duplicación de periodo hacia el caos.';
  readonly category = 'unimodal';
  readonly rRange = { min: 1.0, max: 4.0 };
  readonly xRange = { min: 0.0, max: 1.0 };
  readonly defaultR = 3.0;
  readonly isomorphismKind: IsomorphismKind = 'exact';
  readonly isomorphismLatex = 'c = \\frac{2r - r^2}{4}';

  next(x: number, r: number): number {
    return r * x * (1 - x);
  }

  derivative(x: number, r: number): number {
    return r * (1 - 2 * x);
  }
}
