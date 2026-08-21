# φ Aura Lab — Sucesión de Fibonacci & Razón Áurea

[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4-green?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Aura Lab** es un **Laboratorio Virtual Interactivo** dedicado a la sucesión
de Fibonacci y al número áureo **φ = (1+√5)/2 ≈ 1.618**. Explora la filotaxis
del girasol, la espiral áurea, la fórmula de Binet y el teorema de Zeckendorf
con visualizaciones en vivo, bilingüe (ES/EN) y desplegable como PWA ligera en
GitHub Pages.

> Hecho por **Sebastián Laguna** — [ver en vivo](https://sebastianl1.github.io/aura_lab/)

---

## ✨ Características

- **Girador áureo 3D** en el hero: escultura dorada con esfera de Fibonacci de
  partículas y espiral logarítmica (fallback 2D sin WebGL).
- **Filotaxis WebGL** del girasol con el ángulo áureo exacto **137.508°**, zoom
  y 4 paletas cálidas (Ámbar / Rojo φ / Fuego / Áureo).
- **Sucesión F(n) en escala log**: una línea recta de pendiente `ln φ`.
- **Inspector Áureo**: F(n), Binet, error de convergencia, fracción continua
  [1;1,1,…], números de Lucas, ángulo áureo y Zeckendorf.
- **Convergencia de la razón** F(n)/F(n−1) → φ, con asíntota y banda de φ.
- **Pentágono & pentagrama** y **rectángulo áureo 1:φ** (teselación + espiral).
- **Sonificación φ**: los ratios se estabilizan en un tono único (el "sonido").
- **Aplicaciones reales**: Partenón, girasol, nautilus, mercados, música y
  telecomunicaciones.
- Bilingüe, responsive y compatible con táctil.

## 🧮 La matemática

| Concepto | Fórmula |
|---|---|
| Recurrencia | `F(n) = F(n−1) + F(n−2)` |
| Número áureo | `φ = (1+√5)/2 ≈ 1.6180339887`, `φ² = φ + 1` |
| Fórmula de Binet | `F(n) = (φⁿ − ψⁿ)/√5`, `ψ = (1−√5)/2` |
| Ángulo áureo | `360°/φ² ≈ 137.508°` |
| Convergencia | `F(n+1)/F(n) → φ` (error `O(φ⁻²ⁿ)`) |
| Fracción continua | `φ = [1; 1, 1, 1, …]` |
| Zeckendorf | todo entero = suma única de Fibonacci no consecutivos |

## 🗂️ Estructura de la aplicación (multi-pestaña)

| Pestaña | Descripción |
|---|---|
| **🧪 Laboratorio** | 7 paneles: sucesión, filotaxis, esfera 3D, inspector, convergencia, pentagrama y rectángulo áureo |
| **📚 Aprende** | 6 módulos curriculares bilingües (LaTeX, demos y autoevaluación) + glosario |
| **❋ Ejemplos** | 15 casos curados que abren el laboratorio con parámetros precargados |
| **🎬 Videos** | Playlist verificada sobre φ, filotaxis y Fibonacci (Numberphile, Nature by Numbers…) |
| **📖 Recursos** | Bibliografía de φ (Livio, Dunlap, Binet, Vogel, Zeckendorf, OEIS…) |

Cada pestaña es enlazable por hash (`#/lab`, `#/aprende`, …) y el estado se
comparte por URL (`#/lab?n=233&style=sunflower&palette=0`).

## 📂 Arquitectura

```text
src/
├── core/            # AppState (n·estilo), i18n ES/EN, router, theme, orrery φ
├── math/
│   ├── fibonacci.ts          # Secuencia, Binet, Zeckendorf, phyllotaxis, esfera
│   ├── phyllotaxisCompute.ts # Cómputo CPU espejo del shader (fallback)
│   ├── engineeringCases.ts   # Aplicaciones reales de φ
│   ├── guidedExercises.ts    # Retos de laboratorio
│   └── fibonacci.test.ts     # 15 tests del núcleo matemático
├── workers/
│   └── phyllotaxis.worker.ts # Filotaxis fuera del hilo principal
├── components/
│   ├── HeroPhi3D.ts          # Girador áureo 3D (Three.js)
│   ├── PhyllotaxisShader.ts  # Filotaxis WebGL + fallback worker
│   ├── SequenceCanvas.ts     # Sucesión F(n) en escala log
│   ├── FibonacciSphere.ts    # Esfera de Fibonacci 3D
│   ├── RatioConvergenceCanvas.ts
│   ├── PentagramCanvas.ts
│   ├── GoldenRectCanvas.ts
│   ├── GoldenInspector.ts
│   ├── Sonifier.ts           # Sonificación de ratios → φ
│   └── LearnView/ExamplesView/VideosView/ResourcesView…
├── content/          # curriculum, examples, videos, resources (bilingüe)
├── styles/           # tokens oro/rojo + 6 módulos (core/nav/surfaces/views/motion)
├── types/global.d.ts # Tipos globales (KaTeX, etc.)
└── main.ts           # Orquestador con coalescing de render
```

## 🚀 Instalación y ejecución

```bash
git clone https://github.com/sebastianl1/aura_lab.git
cd aura_lab
npm install
npm run dev        # servidor de desarrollo
npm run build      # build de producción a docs/
```

### Calidad

```bash
npm run typecheck   # TypeScript estricto
npm run lint        # ESLint
npm run format      # Prettier
npm run test        # Vitest (núcleo matemático)
```

CI ejecuta las 5 verificaciones en cada PR y despliega automáticamente a
GitHub Pages desde `main`.

## 🛠️ Tecnologías

- **Vite 8 + TypeScript 6** (estro) · **Three.js r185** (WebGL/3D) · **KaTeX**
- **Web Workers** (filotaxis fuera del hilo principal) · **Vitest**
- Paleta oro `#FACC15` + rojo `#EF4444` sobre `#0F0A08` (razón áurea)

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).