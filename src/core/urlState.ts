import { appState } from './AppState.js';
import { parseHash } from './router.js';

/** Apply route query params (#/lab?model=...&r=...) to the app state. */
export function applyRouteToState(): void {
  const { params } = parseHash();
  const model = params.get('model');
  const r = params.get('r');
  const palette = params.get('palette');

  if (model) appState.modelId = model;
  if (r !== null && !Number.isNaN(parseFloat(r))) appState.r = parseFloat(r);
  if (palette !== null && !Number.isNaN(parseInt(palette, 10))) {
    appState.palette = parseInt(palette, 10);
  }
}

/** Reflect the current state back into the hash (lab view only). */
export function syncRouteFromState(): void {
  const route = parseHash();
  if (route.view !== 'lab') return;
  const params = new URLSearchParams();
  params.set('model', appState.model.id);
  params.set('r', appState.r.toFixed(4));
  params.set('palette', String(appState.palette));
  const desired = `#/lab?${params.toString()}`;
  if (location.hash !== desired) {
    history.replaceState(null, '', desired);
  }
}
