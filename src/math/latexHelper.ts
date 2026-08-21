/** Render LaTeX into an element via KaTeX (with plain-text fallback). */
export function renderLatex(
  elementOrId: HTMLElement | string,
  latexString: string,
  displayMode = false,
): void {
  const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (!el) return;

  if (window.katex) {
    try {
      window.katex.render(latexString, el, {
        displayMode,
        throwOnError: false,
      });
      return;
    } catch (err) {
      console.warn('KaTeX rendering error:', err);
    }
  }

  el.textContent = latexString;
}
