# ADR-0001: Arquitectura modular y gestión de estado tipada

**Estado**: Aceptado
**Fecha**: 2026-08-15

## Contexto

FractaLab Sl era una SPA de un solo orquestador (`main.js`) con estado global
en una clase `AppState` sin tipos, eventos no tipados y código duplicado
(isomorfismos y funciones de bifurcación repartidos entre `math/bifurcation.js`
y los modelos). Parte del código (`MandelbrotCanvas`, `math/mandelbrot.js`,
`math/bifurcation.js`) era muerto: ninguna entidad lo importaba.

## Decisión

1. **Migración a TypeScript estricto** (`strict`, `noUncheckedIndexedAccess`,
   `verbatimModuleSyntax`), eliminando el código muerto.
2. **`src/core/EventEmitter<TEvents>`** como base tipada de eventos.
3. **`src/core/AppState`** como única fuente de verdad (modelo, r, paleta,
   lyapunov, audio), emitiendo eventos tipados (`modelChange`, `rChange`…).
4. **Modelo unificado `BifurcationModel`** (`src/math/models/BaseModel.ts`):
   `next`, `derivative`, `getOrbit`, `computeLyapunov`, `detectPeriod`,
   `rToC/cToR`, metadatos pedagógicos y `isomorphismKind`.
5. Cada renderizador de canvas implementa `setModel`/`setR`/`resize`/`render`
   y consume el estado vía suscripción; el orquestador `main.ts` coalesce los
   redraws con un `requestAnimationFrame` único.

## Consecuencias

- Una sola implementación de cada cómputo matemático (los paneles comparten
  el mismo resultado de Lyapunov/periodo para el mismo `(modelo, r)`).
- `typecheck` en verde permite refactorizaciones seguras.
- La interfaz `BifurcationModel` facilita añadir nuevos mapas (Tent, Gauss…).
