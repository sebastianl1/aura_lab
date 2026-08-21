# Changelog

Todos los cambios notables del proyecto se documentan aquí.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/)
y el proyecto usa [Conventional Commits](https://www.conventionalcommits.org/).

## [En desarrollo]

### Reescritura — Laboratorio centrado en Fibonacci & φ
- **Motor matemático reemplazado**: se retira el motor de caos (logístico,
  Mandelbrot, Lyapunov, Feigenbaum) y se integra un núcleo Fibonacci puro
  (`fibonacci.ts`): sucesión, Binet, Zeckendorf, Lucas, ángulo áureo y
  filotaxis. 15 tests nuevos.
- **7 paneles nuevos**: Sucesión F(n) (escala log), Filotaxis WebGL 137.508°
  con worker de fallback, Esfera de Fibonacci 3D, Inspector Áureo,
  Convergencia → φ, Pentágono & Pentagrama, Rectángulo Áureo 1:φ.
- **Hero Girador Áureo 3D** (Three.js): icosaedro dorado + partículas en
  esfera de Fibonacci + espiral logarítmica; fallback 2D en espiral.
- **Sonifier φ**: los ratios F(n)/F(n−1) convergen a un tono único.
- **Pestañas reescritas**: Aprende (6 módulos bilingües), Ejemplos (15),
  Videos (6 embeds verificados), Recursos (bibliografía φ).
- **Aplicaciones reales de φ**: arquitectura, biología, naturaleza, mercados,
  música y telecom.
- **docs**: README, CONTEXTO y CHANGELOG reestructurados; SEO/schema y 404
  retematizados.

### Restauración — App completa + tema Fibonacci
- Se restaura la app completa (componentes, modelos, workers, contenido) con
  estructura idéntica al proyecto de referencia.
- Tema Aura Lab: paleta oro `#FACC15` + rojo `#EF4444` sobre `#0F0A08`
  (raíz áurea); distintos acentos cálidos por zona.
- Paletas del shader de la Espiral Áurea retematizadas: Ámbar, Rojo φ,
  Fuego y Áureo.
- Hero con espiral logarítmica φ animada (canvas, auto-dibujada).
- Renombrado total al vocabulario Fibonacci/φ (bardas, paneles, i18n ES/EN,
  ejercicios, curriculum, documentación).

### Correcciones — Funcionalidad del laboratorio
- **Se elimina el reveal que ocultaba el dashboard**: los diagramas son
  siempre visibles e interactivos desde el primer render (antes quedaban
  invisibles con `opacity:0`/`clip-path` y sin eventos de zoom).
- **Sin parpadeo al interactuar**: el diagrama de bifurcación conserva la
  imagen previa (escalada) mientras el worker recalcula; se reemplaza solo
  cuando llega el resultado.
- Se retira el módulo de scroll-reveal y el iris-in del laboratorio.

### Refinamiento — Editorial sobrio (sobre AETHERION)
- Paleta disciplinada: oro `#E8B84B`, cian `#7FD8F0`, violeta `#8E7CC3`,
  rosa `#F16A7A`, verde `#43D1A0` sobre `#070B18`; un acento por zona.
- Dock orbital sobrio: glifos más pequeños, etiquetas legibles, anillo
  sutil. Brackets de esquina y scanline muy tenues. Botones con corte de 6px.
- Hero editorial con orrería refinada (más pequeña, opacidad contenida).
- Decoración reducida: menos estrellas, glifos y constelaciones, nebulosas
  suaves.

### Rediseño — AETHERION: Galaxia Matemática (nuevo desde cero)
- **UI reconstruida por completo**: se sustituye el sistema previo por una
  identidad "observatorio espacial" con implementación matemática.
- Navegación **dock orbital**: nodos-estrella con glifos matemáticos
  (λ · ∫ · Σ · ◉ · ∞), estrella activa con anillo orbital y línea de
  constelación energizada hacia los vecinos.
- Superficies **visorios angulares**: brackets de esquina (HUD), scanline,
  borde luminoso y cabecera de **telemetría** (`SYS·01`…) por panel.
- Botones **instrumento** con esquinas recortadas y núcleo luminoso
  (oro cósmico / cian plasma).
- Fondo **espacio profundo** por capas (profundidad 0→5): nebulosas,
  retícula celeste, starfield generado, constelaciones y glifos flotantes,
  con **parallax al hacer scroll** (`src/core/orrery.ts`).
- Hero **orrería**: λ central con anillos orbitales y planetas.
- Paleta **Aurora Cósmica** (solo oscuro): oro `#F6C445`, cian `#4DD8FF`,
  violeta nebulosa `#9B6BFF`, rosa cósmico `#FF5D8F`, verde aurora `#2EE6A8`.
- Tipografía **Chakra Petch** (display) + Space Grotesk + JetBrains Mono.
- Reveal de paneles con **iris-in** (clip-path); respeta `prefers-reduced-motion`.
- Se **elimina el tema claro** y el toggle (solo oscuro).

### Seguridad y despliegue
- Rediseño completo del design system: paleta ámbar solar + cian profundo
  sobre casi-negro (dark) y marfil (light).
- **Toggle claro/oscuro** con persistencia en localStorage y detección por
  `prefers-color-scheme`, aplicado antes del primer render (sin flash).
- Tipografía **Space Grotesk** (display) + Inter + JetBrains Mono.
- Tokens de visualización (`--viz-*`) que re-theman todos los canvas al
  cambiar de tema: Espiral Áurea (4 paletas nuevas en shader y fallback CPU),
  heatmap de bifurcación (solar cian→ámbar), Lyapunov, cobweb, serie
  temporal, histograma, escena 3D e inspector.
- En tema claro se ocultan los efectos de espacio (starfield/grid); los
  halos ambientales se mantienen sutiles.

### Seguridad y despliegue
- Fondo ambiental cinematográfico (halos degradados, grid, starfield) con
  `prefers-reduced-motion`.
- Hero del laboratorio con título con degradado animado, órbita visual y
  badges de características.
- Paneles glassmorphism con borde degradado, hover elevado y reveal-on-scroll
  escalonado (IntersectionObserver, solo transform/opacity).
- Tabs con píldoras degradadas y botones con glow.
- Scrollbar personalizado.

### Seguridad y despliegue
- **CSP** (Content-Security-Policy) con allowlist de CDNs (KaTeX, Google Fonts,
  YouTube) y workers same-origin.
- **Página 404** personalizada.
- **Deploy de GitHub Pages corregido**: se usa el mecanismo oficial
  (`configure-pages` + `upload-pages-artifact` + `deploy-pages`) compatible con
  la fuente "GitHub Actions", eliminando el HTML obsoleto en caché que se servía.

### Añadido — Pestañas y contenido educativo
- Navegación **multi-pestaña** por hash: Laboratorio, Aprende, Ejemplos,
  Videos y Recursos.
- **Pestaña Aprende**: 6 módulos curriculares y 19 lecciones bilingües con
  bloques LaTeX, ideas clave, demos interactivas y autoevaluación, más un
  glosario de 14 términos.
- **Pestaña Ejemplos**: galería de 15 casos curados con apertura en el
  laboratorio con parámetros precargados.
- **Pestaña Videos**: reproductor embebido + playlist + schema VideoObject.
- **Pestaña Recursos**: bibliografía académica del caos.
- i18n **ES/EN** con selector de idioma y detección por navegador.
- Paneles nuevos de **Serie Temporal** e **Histograma** de la órbita.
- **Exportación PNG** de cualquier panel de canvas.
- Estado del laboratorio compartible por URL (`#/lab?model=&r=&palette=`).

### Refactor — Fundación técnica
- Migración a **TypeScript estricto** en toda la base de código.
- **Vite 8** (Rolldown): se eliminan las vulnerabilidades esbuild/vite ≤ 6.
- Tooling: **ESLint**, **Prettier**, **Vitest** (19 tests del núcleo matemático).
- CI/CD: GitHub Actions con `typecheck`, `lint`, `test`, `build` y deploy a Pages.
- Higiene del repo: `node_modules/` y `docs/` fuera de git, LICENSE y
  CONTRIBUTING añadidos.
- Rendimiento: diagrama de bifurcación y fallback de Espiral Áurea en **Web
  Workers**, caché del diagrama y curva de Lyapunov precomputada.

## [1.3.0] — 2026-07-22
- Estructura inicial del diagrama de bifurcación con sobremuestreo y heatmap.
- Vistas paralelas Bifurcación ↔ Espiral Áurea con conector isomórfico en tiempo real.
- Panel 3D de espacio de fases (Three.js) y diagrama de telaraña.
- Casos de ingeniería, ejercicios guiados y sonificación básica.
