interface KaTeXRenderOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
}

interface KaTeXStatic {
  render(latex: string, element: HTMLElement, options?: KaTeXRenderOptions): void;
}

interface Window {
  katex?: KaTeXStatic;
}
