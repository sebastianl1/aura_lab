import {
  PHI,
  fib,
  ratio,
  ratioError,
  lucas,
  GOLDEN_ANGLE_DEG,
  phiContinuedFraction,
  convergent,
  binet,
  zeckendorf,
  fibSafe,
} from '../math/fibonacci.js';
import { renderLatex } from '../math/latexHelper.js';

/**
 * SYS·04 — Inspector Áureo.
 * Live metrics about the active term count n: F(n), ratio, φ error,
 * Binet, continued fraction, golden angle, Lucas, Zeckendorf.
 */
export class GoldenInspector {
  private container: HTMLElement;
  private n = 233;

  constructor(container: HTMLElement) {
    this.container = container;
    this.update(this.n);
    window.addEventListener('resize', () => this.update(this.n));
  }

  setPalette(_p: number): void {
    void _p;
  }

  update(n: number): void {
    this.n = n;
    const show = Math.min(n, 80);
    const fn = fib(n);
    const luc = lucas(n);
    const err = ratioError(n);
    const cf = phiContinuedFraction(12);
    const conv = convergent(12);
    const zec = zeckendorf(fibSafe(Math.min(show, 60)));

    this.container.innerHTML = `
      <div class="inspector-grid">
        <div class="inspector-card">
          <span class="inspector-label">F(n) · n = ${n}</span>
          <span class="inspector-value">${fn.toPrecision(6)}</span>
          <span class="inspector-caption">≈ φⁿ/√5 para n grande</span>
        </div>
        <div class="inspector-card">
          <span class="inspector-label">F(n+1)/F(n)</span>
          <span class="inspector-value">${ratio(n).toFixed(10)}</span>
          <span class="inspector-caption">converge a φ</span>
        </div>
        <div class="inspector-card">
          <span class="inspector-label">|error − φ|</span>
          <span class="inspector-value">${err.toExponential(3)}</span>
          <span class="inspector-caption">alterna por encima/debajo</span>
        </div>
        <div class="inspector-card">
          <span class="inspector-label">φ = (1+√5)/2</span>
          <span class="inspector-value gold">${PHI.toFixed(12)}</span>
          <span class="inspector-caption">convergente ${conv.p}/${conv.q}</span>
        </div>
        <div class="inspector-card">
          <span class="inspector-label">Lucas L(n)</span>
          <span class="inspector-value">${luc.toPrecision(6)}</span>
          <span class="inspector-caption">L(n) = αⁿ + βⁿ</span>
        </div>
        <div class="inspector-card">
          <span class="inspector-label">Ángulo Áureo</span>
          <span class="inspector-value gold">${GOLDEN_ANGLE_DEG.toFixed(4)}°</span>
          <span class="inspector-caption">360/φ² ≈ 137.508°</span>
        </div>
        <div class="inspector-card">
          <span class="inspector-label">Fracción continua φ</span>
          <span class="inspector-value font-mono">[${cf.join('; ')}]</span>
          <span class="inspector-caption">φ = [1; 1, 1, …]</span>
        </div>
        <div class="inspector-card">
          <span class="inspector-label">Zeckendorf F(${show})</span>
          <span class="inspector-value font-mono">${zec.join(' + ')}</span>
          <span class="inspector-caption">suma de Fibonacci no consecutivas</span>
        </div>
      </div>
      <div class="inspector-formulae">
        <div class="inspector-latex" data-insp="binet"></div>
        <div class="inspector-latex" data-insp="phiid"></div>
      </div>
    `;

    const binetEl = this.container.querySelector('[data-insp="binet"]');
    if (binetEl) {
      renderLatex(
        binetEl as HTMLElement,
        `F(n) = \\frac{\\varphi^n - \\psi^n}{\\sqrt{5}}, \\qquad \\psi = \\frac{1-\\sqrt{5}}{2}`,
      );
    }
    const phiidEl = this.container.querySelector('[data-insp="phiid"]');
    if (phiidEl) {
      renderLatex(
        phiidEl as HTMLElement,
        `\\varphi^2 = \\varphi + 1 \\quad \\Leftrightarrow \\quad 1/\\varphi = \\varphi - 1`,
      );
    }
  }
}

export { binet };
