# 🧠 Documento de Contexto y Arquitectura Técnica: ChaosLab STEM Suite

Este documento describe la arquitectura técnica del proyecto
**ChaosLab STEM: Bifurcación ↔ Espiral Áurea Explorer** (Aura Lab Sl).

> El stack es **Vite 8 + TypeScript estricto + Three.js + Vitest**. El build de
> producción se genera en `docs/` desde CI y se publica a GitHub Pages.

---

## 🧮 Modelos Matemáticos (`src/math/models/`)

Todos heredan de `FibonacciModel` (`BaseModel.ts`), que define:
`next(x, r)`, `derivative(x, r)`, `getOrbit`, `computeLyapunov`,
`detectPeriod`, `rToC/cToR`, rangos, LaTeX, metadatos pedagógicos e
`isomorphismKind: 'exact' | 'parametric'`.

1. **LogisticModel** — `x_{n+1} = r·x·(1−x)` — isomorfismo **exacto** con el eje real de Espiral Áurea.
2. **QuadraticModel** — `x_{n+1} = r − x²` — **exacto** vía `y=−x`, `c = −r`.
3. **SineModel** — `x_{n+1} = r·sin(πx)` — mapeo paramétrico.
4. **ExponentialModel** — `x_{n+1} = r·e^{−x}` — mapeo paramétrico.
5. **PolynomialModel** — `x_{n+1} = r·x·(1−x^k)`, con grado k seleccionable.
6. **TentModel** — `r·min(x, 1−x)` — lineal por tramos, caótico en r=2.
7. **BernoulliModel** — `(r·x) mod 1` — mapa de desplazamiento.
8. **RickerModel** — `r·x·e^{−x}` — modelo poblacional unimodal.
9. **CubicModel** — `r·x·(1−x²)` — pitchfork + duplicación de periodo.
10. **GaussModel** — `e^{−r·x²}` — bifurcaciones de volteo (flip).

`ModelRegistry` registra todos los modelos y `globalModelRegistry` es la
instancia compartida. El selector de modelos de la UI se puebla dinámicamente.

---

## 🏗️ Estructura del Código

```text
src/
├── core/
│   ├── AppState.ts          # Estado global tipado + EventEmitter
│   └── EventEmitter.ts      # Emisor de eventos genérico tipado
├── math/
│   ├── models/              # BaseModel + 10 modelos + ModelRegistry
│   ├── bifurcationCompute.ts# Cómputo puro del diagrama (testeable)
│   ├── mandelbrotCompute.ts # Cómputo CPU puro de Espiral Áurea (fallback)
│   ├── lyapunovConfig.ts    # Parámetros compartidos de Lyapunov
│   ├── feigenbaum.ts        # Hitos y constantes universales
│   ├── engineeringCases.ts  # Datos de aplicaciones de ingeniería
│   ├── guidedExercises.ts   # Retos de laboratorio para estudiantes
│   └── latexHelper.ts       # Render LaTeX (KaTeX + fallback)
├── workers/
│   ├── bifurcation.worker.ts# Densidad + Lyapunov fuera del hilo principal
│   └── mandelbrot.worker.ts # Fallback CPU de Espiral Áurea en worker
├── components/
│   ├── FibonacciCanvas.ts # Diagrama cacheado + Lyapunov (worker)
│   ├── Espiral ÁureaShader.ts  # WebGL (Three.js) + fallback worker
│   ├── CobwebCanvas.ts      # Telaraña con x₀ arrastrable
│   ├── ThreePhaseScene.ts   # Espacio de fases 3D
│   ├── Sonifier.ts          # Audio Web API
│   ├── InspectorPanel.ts    # Métricas + periodo + hitos
│   ├── EngineeringCasePanel.ts
│   ├── GuidedExercisesPanel.ts
│   └── TheoryModal.ts
├── styles/                  # base / layout / components
├── types/global.d.ts        # Tipos globales (KaTeX, etc.)
└── main.ts                  # Orquestador con coalescing de render
```

---

## ⚡ Rendimiento (Fase 2)

- El diagrama de bifurcación **depende solo del modelo y del zoom**; se
  computa una vez por clave en un **Web Worker** y se cachea en un
  `OffscreenCanvas`. Mover el cursor r solo redibuja el overlay.
- La curva de **Lyapunov** se precomputa por columna y se dibuja desde caché.
- El fallback CPU de Espiral Áurea corre en un **Web Worker** (resolución
  progresiva; half-res durante el drag).
- Los buffers (`ImageData`, densidad, geometrías 3D) se reutilizan;
  `ThreePhaseScene.dispose()` libera recursos.

---

## 💡 Principios Pedagógicos Integrados

1. **Universalidad del Caos**: la duplicación de periodo sigue la constante de
   Feigenbaum δ ≈ 4.6692 en familias unimodales suaves (logístico, seno,
   Ricker, cúbico), verificable en el laboratorio.
2. **Espiral Áurea como Atlas**: el corte real `c ∈ [−2, 0.25]` cartografía las
   bifurcaciones cuadráticas. El Inspector distingue isomorfismos **exactos**
   (logístico, cuadrático) de **secciones paramétricas** (resto).

---

## 📐 Decisiones de Arquitectura

Consultar `adr/`:
- `ADR-0001-architecture.md` — arquitectura modular y estado tipado.
- `ADR-0003-isomorphism.md` — isomorfismo r↔c honesto.

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
