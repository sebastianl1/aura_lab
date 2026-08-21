/** Resolve a CSS custom property to its computed value (e.g. `rgb(...)`). */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Resolved visualization palette for canvas renderers (Aurora Cósmica). */
export interface VizPalette {
  bg: string;
  grid: string;
  ink: string;
  cyan: string;
  amber: string;
  rose: string;
  emerald: string;
  violet: string;
}

export function viz(): VizPalette {
  return {
    bg: cssVar('--viz-bg'),
    grid: cssVar('--viz-grid'),
    ink: cssVar('--viz-ink'),
    cyan: cssVar('--viz-cyan'),
    amber: cssVar('--viz-amber'),
    rose: cssVar('--viz-rose'),
    emerald: cssVar('--viz-emerald'),
    violet: cssVar('--viz-violet'),
  };
}
