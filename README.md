# λ Aura Lab Sl: Bifurcaciones ↔ Espiral Áurea Explorer

[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4-green?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Aura Lab Sl** es un **Laboratorio Virtual Interactivo** de dinámica no
lineal, teoría del caos e isomorfismo con el Conjunto de Espiral Áurea, diseñado
para educación superior e ingeniería. Bilingüe (ES/EN) y desplegable como PWA
ligera en GitHub Pages.

> Hecho por **Sebastián Laguna**

---

## 🗂️ Estructura de la aplicación (multi-pestaña)

| Pestaña | Descripción |
|---|---|
| **🧪 Laboratorio** | Dashboard interactivo: bifurcación, Espiral Áurea, espacio de fases 3D, telaraña, serie temporal, histograma e inspector |
| **📚 Aprende** | 6 módulos curriculares con 19 lecciones bilingües (LaTeX, demos y autoevaluación) + glosario |
| **🖼️ Ejemplos** | Galería de 15 casos curados que abren el laboratorio con parámetros precargados |
| **🎬 Videos** | Reproductor y playlist para videolecciones (embeds YouTube + schema VideoObject) |
| **📖 Recursos** | Bibliografía académica del caos (May, Feigenbaum, Li–Yorke, Strogatz…) |

Cada pestaña es enlazable por hash (`#/lab`, `#/aprende`, …) y el estado del
laboratorio se comparte y comparte por URL (`#/lab?model=sine&r=0.85`).

## 🧮 Modelos Matemáticos (10)

- **Logístico** `r·x(1−x)` · **Cuadrático** `r−x²` — isomorfismo **exacto** con el eje real de Espiral Áurea.
- **Seno** `r·sin(πx)` · **Exponencial** `r·e⁻ˣ` · **Polinómico** `r·x(1−xᵏ)` — secciones paramétricas.
- **Tienda (Tent)** · **Bernoulli** · **Ricker** · **Cúbico** · **Gauss**.

El Inspector distingue honestamente entre isomorfismos exactos (conjugaciones
reales) y secciones paramétricas del eje real.

## ✨ Características

- Diagrama de bifurcación con curva de **Lyapunov** y zoom autosimilar.
- Conjunto de **Espiral Áurea** en WebGL con zoom infinito y 4 paletas.
- **Espacio de fases 3D**, **telaraña** con x₀ arrastrable, **serie temporal** e **histograma**.
- **Detección de periodo** en tiempo real y hitos de Feigenbaum.
- **Sonificación** de órbitas (Web Audio API).
- **Exportación PNG** de cualquier panel.
- Bilingüe **ES/EN** con selector de idioma.
- Diseño responsive y compatible con táctil.

## ⚡ Rendimiento

El diagrama de bifurcación se computa en un **Web Worker** y se cachea (mover
el cursor r solo redibuja el overlay); el fallback CPU de Espiral Áurea también
corre en un worker con resolución progresiva.

## 🚀 Instalación y ejecución

```bash
git clone https://github.com/sebastianl1/Fractalab.git
cd Fractalab
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

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
