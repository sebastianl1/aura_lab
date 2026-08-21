import { BifurcationModel } from './BaseModel.js';
import type { IsomorphismKind } from './BaseModel.js';

/** x_{n+1} = r·sin(π·x_n) — transcendental unimodal map. */
export class SineModel extends BifurcationModel {
  readonly id = 'sine';
  readonly name = 'Mapa Seno';
  readonly equationLatex = 'x_{n+1} = r \\cdot \\sin(\\pi \\cdot x_n)';
  readonly derivativeLatex = "f'(x) = r \\cdot \\pi \\cdot \\cos(\\pi \\cdot x_n)";
  readonly asciiFormula = 'x_{n+1} = r·sin(π·x_n)';
  readonly description =
    'Mapa trascendente con un único máximo suave: comparte la misma ruta de duplicación de periodo del mapa logístico (universalidad del caos).';
  readonly category = 'transcendental';
  readonly rRange = { min: 0.1, max: 1.0 };
  readonly xRange = { min: 0.0, max: 1.0 };
  readonly defaultR = 0.85;
  readonly isomorphismKind: IsomorphismKind = 'parametric';
  readonly isomorphismLatex = 'c = 0.25 - \\frac{2.25 \\cdot (r - 0.1)}{0.9}';

  next(x: number, r: number): number {
    return r * Math.sin(Math.PI * x);
  }

  derivative(x: number, r: number): number {
    return r * Math.PI * Math.cos(Math.PI * x);
  }

  rToC(r: number): number {
    return 0.25 - (r - 0.1) * (2.25 / 0.9);
  }

  cToR(c: number): number {
    const norm = (0.25 - c) / 2.25;
    return Math.max(0.1, Math.min(1.0, 0.1 + norm * 0.9));
  }
}
