/** Shared Canvas2D helpers (DPR-aware sizing + colors). */
import { viz } from '../core/theme.js';

export interface CanvasSize {
  cssWidth: number;
  cssHeight: number;
  width: number;
  height: number;
  dpr: number;
}

/** Size a canvas to its parent box, honoring devicePixelRatio. */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 2): CanvasSize {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const parent = canvas.parentElement;
  const rect = parent?.getBoundingClientRect();
  const cssWidth = Math.max(80, rect?.width ?? 400);
  const cssHeight = Math.max(120, rect?.height ?? 260);
  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  canvas.style.width = cssWidth + 'px';
  canvas.style.height = cssHeight + 'px';
  return { cssWidth, cssHeight, width: canvas.width, height: canvas.height, dpr };
}

export function roundedLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  from: number,
  to: number,
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, from, to);
  ctx.stroke();
}

/** Warm gold → red helper palette (mirrors the WebGL palettes). */
export function warmColor(palette: number, t: number): [number, number, number] {
  const x = 6.28318 * t;
  if (palette === 0) {
    return [0.93 * 255, (0.05 + 0.8 * Math.pow(t, 0.7)) * 255, 0.22 * 255];
  }
  if (palette === 1) {
    const r = 0.5 + 0.5 * Math.cos(x);
    const g = 0.5 + 0.42 * Math.cos(x + 1.1);
    const b = 0.35 + 0.2 * Math.cos(x + 2.2);
    return [r * 255, g * 255, b * 255];
  }
  if (palette === 2) {
    const r = 0.85 + 0.15 * Math.cos(x);
    const g = 0.45 + 0.35 * Math.cos(x + 1.1);
    const b = 0.15 + 0.1 * Math.cos(x + 2.2);
    return [r * 255, g * 255, b * 255];
  }
  return [
    (0.1 + 0.85 * Math.pow(t, 0.9)) * 255,
    (0.12 + 0.6 * Math.pow(t, 1.1)) * 255,
    (0.08 + 0.2 * Math.pow(t, 2.0)) * 255,
  ];
}

export function cssColor(palette: number, t: number): string {
  const [r, g, b] = warmColor(palette, t);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function alpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export { viz };
