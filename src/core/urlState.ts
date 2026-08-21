import { appState } from './AppState.js';
import { parseHash } from './router.js';

/** Apply route query params (#/lab?n=...&style=...&palette=...) to the state. */
export function applyRouteToState(): void {
  const { params } = parseHash();
  const n = params.get('n');
  const style = params.get('style');
  const palette = params.get('palette');
  const phi = params.get('phi');

  if (n !== null && !Number.isNaN(parseFloat(n))) appState.n = parseFloat(n);
  if (style) appState.styleId = style;
  if (palette !== null && !Number.isNaN(parseInt(palette, 10))) {
    appState.palette = parseInt(palette, 10);
  }
  if (phi !== null) appState.showPhi = phi !== '0';
}

/** Reflect the current state back into the hash (lab view only). */
export function syncRouteFromState(): void {
  const route = parseHash();
  if (route.view !== 'lab') return;
  const params = new URLSearchParams();
  params.set('n', String(appState.n));
  params.set('style', appState.styleId);
  params.set('palette', String(appState.palette));
  params.set('phi', appState.showPhi ? '1' : '0');
  const desired = `#/lab?${params.toString()}`;
  if (location.hash !== desired) {
    history.replaceState(null, '', desired);
  }
}
