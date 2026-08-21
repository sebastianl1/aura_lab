import { renderLatex } from '../math/latexHelper.js';
import { PHI } from '../math/fibonacci.js';

/** Modal with the pedagogical theory of the golden ratio and φ. */
export class TheoryModal {
  private modal: HTMLElement;
  private backdrop: HTMLElement;

  constructor(modalElement: HTMLElement, backdropElement: HTMLElement) {
    this.modal = modalElement;
    this.backdrop = backdropElement;
  }

  open(): void {
    this.modal.classList.add('active');
    this.backdrop.classList.add('active');
    this.renderLatexContent();
  }

  close(): void {
    this.modal.classList.remove('active');
    this.backdrop.classList.remove('active');
  }

  private renderLatexContent(): void {
    const phiEl = document.getElementById('latex-phi');
    const angleEl = document.getElementById('latex-angle');
    const binetEl = document.getElementById('latex-iso-proof');

    if (phiEl) renderLatex(phiEl, `\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx ${PHI.toFixed(10)}`);
    if (angleEl)
      renderLatex(angleEl, '\\text{ángulo áureo} = \\frac{360°}{\\varphi^2} \\approx 137.50776°');
    if (binetEl)
      renderLatex(
        binetEl,
        'F(n) = \\frac{\\varphi^n - \\psi^n}{\\sqrt{5}}, \\qquad \\psi = \\frac{1-\\sqrt{5}}{2}, \\qquad \\frac{F(n+1)}{F(n)} \\to \\varphi',
        true,
      );
  }
}
