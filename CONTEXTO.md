# 🧠 Documento de Contexto y Arquitectura Técnica: Aura Lab

Este documento describe la arquitectura técnica del proyecto **Aura Lab: la
Sucesión de Fibonacci y el Número Áureo φ** (Aura Lab Sl).

> El stack es **Vite 8 + TypeScript estricto + Three.js + Vitest**. El build de
> producción se genera en `docs/` desde CI y se publica a GitHub Pages.

---

## 🧮 Núcleo Matemático (`src/math/fibonacci.ts`)

Módulo puro y testeable:

1. **Sucesión de Fibonacci** — `F(n) = F(n−1)+F(n−2)`, `fib`, `fibSafe`, `fibonacciSeq`.
2. **Razón áurea** — `φ = (1+√5)/2`, `φ² = φ+1`, `1/φ = φ−1`.
3. **Fórmula de Binet** — `F(n) = (φⁿ−ψⁿ)/√5`.
4. **Convergencia** — `ratio(n) = F(n)/F(n−1) → φ`, `ratioError`.
5. **Ángulo áureo** — `360°/φ² ≈ 137.50776°`.
6. **Números de Lucas** — `L(n) = φⁿ+ψⁿ`.
7. **Zeckendorf** — descomposición única en Fibonacci no consecutivos.
8. **Filotaxis** — primordios con el ángulo áureo y estilos botánicos.
9. **Esfera de Fibonacci** — distribución en espiral dorada sobre la esfera.
10. **Fracción continua** — `φ = [1; 1, 1, …]` con convergentes.

`SPIRAL_STYLES` registra 5 variantes botánicas reales (Girasol 137.5°, Hojas
222.5°, Palo verde 135.9°, Retrocruzada 90°, Concha Nautilus) y alimenta el
selector de la UI.

---

## 🏗️ Estructura del Código

```text
src/
├── core/
│   ├── AppState.ts          # Estado global tipado: n, estilo, paleta, showPhi
│   ├── EventEmitter.ts      # Emisor de eventos genérico tipado
│   ├── i18n.ts              # ES/EN bilingüe
│   ├── router.ts / urlState.ts  # Hash + params (?n=&style=&palette=)
│   ├── theme.ts             # Viz palette desde CSS vars
│   └── orrery.ts            # Fondo ambiental con glifos φ
├── math/
│   ├── fibonacci.ts         # Núcleo puro (ver arriba)
│   ├── phyllotaxisCompute.ts# Cómputo CPU espejo del shader
│   ├── fibonacci.test.ts    # 15 tests vitest
│   ├── engineeringCases.ts  # Aplicaciones reales de φ
│   └── guidedExercises.ts   # Retos de laboratorio
├── workers/
│   └── phyllotaxis.worker.ts# Filotaxis fuera del hilo principal
├── components/
│   ├── HeroPhi3D.ts         # Girador áureo 3D (Three.js)
│   ├── PhyllotaxisShader.ts # Filotaxis WebGL + fallback worker
│   ├── SequenceCanvas.ts    # Sucesión F(n) en escala log
│   ├── FibonacciSphere.ts   # Esfera de Fibonacci 3D
│   ├── RatioConvergenceCanvas.ts # F(n)/F(n−1) → φ
│   ├── PentagramCanvas.ts   # Pentágono & pentagrama
│   ├── GoldenRectCanvas.ts  # Rectángulo áureo & teselación
│   ├── GoldenInspector.ts   # Métricas y teoremas φ
│   ├── Sonifier.ts          # Ratios → notas (converge a un tono)
│   ├── EngineeringCasePanel.ts / GuidedExercisesPanel.ts
│   ├── LearnView / ExamplesView / VideosView / ResourcesView
│   └── TheoryModal.ts
├── content/                 # curriculum, examples, videos, resources (bilingüe)
├── styles/                  # tokens oro/rojo + módulos (core/nav/surfaces/views/motion)
├── types/global.d.ts        # Tipos globales (KaTeX, etc.)
└── main.ts                  # Orquestador con coalescing de render
```

---

## ⚡ Rendimiento

- La **filotaxis** se renderiza con un shader WebGL (Three.js) y tiene un
  fallback CPU en un **Web Worker** (resolución progresiva, `ImageData`).
- La **esfera de Fibonacci** y el **girador del hero** usan Three.js con DPR
  cap (≤ 2) y `prefers-reduced-motion`.
- La convergencia y los paneles 2D redibujan desde datos precomputados en el
  hilo principal (render coalescido vía `requestAnimationFrame`).

---

## 💡 Principios Pedagógicos Integrados

1. **La razón áurea es universal**: la convergencia `F(n+1)/F(n) → φ` es
   geométrica (error `O(φ⁻²ⁿ)`), verificable en el panel de convergencia.
2. **El ángulo áureo empaqueta**: la filotaxis del girasol usa 137.508° y
   produce espirales cuyos conteos son pares de Fibonacci consecutivos.
3. **Binet y Zeckendorf** conectan la sucesión con el álgebra y la teoría de
   números en el Inspector Áureo.

---

## 📐 Decisiones de Arquitectura

Consultar `adr/`:
- `ADR-0001-architecture.md` — arquitectura modular y estado tipado.
- `ADR-0003-isomorphism.md` — isomorfismo entre representaciones del número
  áureo (recurrencia ↔ fórmula cerrada ↔ fracción continua).

---

## 🧪 Calidad

```bash
npm run typecheck   # TypeScript estricto
npm run lint        # ESLint (flat config + typescript-eslint)
npm run format      # Prettier
npm run test        # Vitest (núcleo matemático)
npm run build       # Build de producción a docs/
```

CI ejecuta las 5 verificaciones en cada PR (`typecheck`, `lint`, `test`,
`build`) y despliega a GitHub Pages desde `main`.