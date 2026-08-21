import type { BifurcationModel } from './BaseModel.js';
import { LogisticModel } from './LogisticModel.js';
import { SineModel } from './SineModel.js';
import { QuadraticModel } from './QuadraticModel.js';
import { ExponentialModel } from './ExponentialModel.js';
import { PolynomialModel } from './PolynomialModel.js';
import { TentModel } from './TentModel.js';
import { BernoulliModel } from './BernoulliModel.js';
import { RickerModel } from './RickerModel.js';
import { CubicModel } from './CubicModel.js';
import { GaussModel } from './GaussModel.js';

/** Registry of available bifurcation models. */
export class ModelRegistry {
  readonly models: Readonly<Record<string, BifurcationModel>> = {
    logistic: new LogisticModel(),
    sine: new SineModel(),
    quadratic: new QuadraticModel(),
    exponential: new ExponentialModel(),
    polynomial: new PolynomialModel(3),
    tent: new TentModel(),
    bernoulli: new BernoulliModel(),
    ricker: new RickerModel(),
    cubic: new CubicModel(),
    gauss: new GaussModel(),
  };

  currentModelId = 'logistic';

  getModel(id: string = this.currentModelId): BifurcationModel {
    return this.models[id] ?? this.models.logistic!;
  }

  setModel(id: string): BifurcationModel {
    if (this.models[id]) this.currentModelId = id;
    return this.getModel();
  }

  setPolynomialK(k: number): void {
    const poly = this.models.polynomial as PolynomialModel;
    poly.updateK(k);
  }

  list(): BifurcationModel[] {
    return Object.values(this.models);
  }
}

export const globalModelRegistry = new ModelRegistry();
