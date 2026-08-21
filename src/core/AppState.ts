import { EventEmitter } from './EventEmitter.js';
import type { BifurcationModel } from '../math/models/BaseModel.js';
import { globalModelRegistry } from '../math/models/ModelRegistry.js';

export interface AppStateEvents {
  modelChange: BifurcationModel;
  rChange: number;
  lyapunovChange: boolean;
  paletteChange: number;
  audioChange: boolean;
}

/**
 * Global application state. Every mutation is reflected through the typed
 * event emitter so views can coalesce a single redraw.
 */
class AppState extends EventEmitter<AppStateEvents> {
  private _model: BifurcationModel;
  private _r: number;
  private _lyapunovEnabled = true;
  private _palette = 0;
  private _audioEnabled = false;

  constructor() {
    super();
    this._model = globalModelRegistry.getModel('logistic');
    this._r = this._model.defaultR;
  }

  get model(): BifurcationModel {
    return this._model;
  }

  get r(): number {
    return this._r;
  }

  /** Equivalent Mandelbrot real-axis parameter c for the current model/r. */
  get c(): number {
    return this._model.rToC(this._r);
  }

  get lyapunovEnabled(): boolean {
    return this._lyapunovEnabled;
  }

  get palette(): number {
    return this._palette;
  }

  get audioEnabled(): boolean {
    return this._audioEnabled;
  }

  set modelId(id: string) {
    const newModel = globalModelRegistry.getModel(id);
    if (newModel !== this._model) {
      this._model = newModel;
      this._r = newModel.clampR(this._r);
      this.emit('modelChange', this._model);
    }
  }

  /** Update the polynomial degree k and refresh the active model. */
  setPolynomialK(k: number): void {
    globalModelRegistry.setPolynomialK(k);
    this._model = globalModelRegistry.getModel('polynomial');
    this._r = this._model.clampR(this._r);
    this.emit('modelChange', this._model);
  }

  set r(val: number) {
    const clamped = this._model.clampR(val);
    if (Math.abs(clamped - this._r) > 1e-10) {
      this._r = clamped;
      this.emit('rChange', this._r);
    }
  }

  set lyapunovEnabled(val: boolean) {
    if (this._lyapunovEnabled !== val) {
      this._lyapunovEnabled = val;
      this.emit('lyapunovChange', val);
    }
  }

  set palette(val: number) {
    if (this._palette !== val) {
      this._palette = val;
      this.emit('paletteChange', val);
    }
  }

  set audioEnabled(val: boolean) {
    if (this._audioEnabled !== val) {
      this._audioEnabled = val;
      this.emit('audioChange', val);
    }
  }
}

export const appState = new AppState();
