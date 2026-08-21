import { EventEmitter } from './EventEmitter.js';
import { getSpiralStyle } from '../math/fibonacci.js';

export interface AppStateEvents {
  nChange: number;
  styleChange: string;
  showPhiChange: boolean;
  paletteChange: number;
  audioChange: boolean;
}

export const N_MIN = 3;
export const N_MAX = 1000;
export const N_DEFAULT = 233; // a Fibonacci number, in homage

/**
 * Global application state (Fibonacci theme). Every mutation is reflected
 * through the typed event emitter so views can coalesce a single redraw.
 */
class AppState extends EventEmitter<AppStateEvents> {
  private _n = N_DEFAULT;
  private _style = 'sunflower';
  private _showPhi = true;
  private _palette = 0;
  private _audioEnabled = false;

  get n(): number {
    return this._n;
  }

  get styleId(): string {
    return this._style;
  }

  get style() {
    return getSpiralStyle(this._style);
  }

  get showPhi(): boolean {
    return this._showPhi;
  }

  get palette(): number {
    return this._palette;
  }

  get audioEnabled(): boolean {
    return this._audioEnabled;
  }

  set n(val: number) {
    const clamped = Math.max(N_MIN, Math.min(N_MAX, Math.round(val)));
    if (clamped !== this._n) {
      this._n = clamped;
      this.emit('nChange', this._n);
    }
  }

  set styleId(id: string) {
    if (id !== this._style && getSpiralStyle(id)) {
      this._style = id;
      this.emit('styleChange', this._style);
    }
  }

  set showPhi(val: boolean) {
    if (this._showPhi !== val) {
      this._showPhi = val;
      this.emit('showPhiChange', val);
    }
  }

  set palette(val: number) {
    const clamped = Math.max(0, Math.min(3, Math.round(val)));
    if (this._palette !== clamped) {
      this._palette = clamped;
      this.emit('paletteChange', clamped);
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
