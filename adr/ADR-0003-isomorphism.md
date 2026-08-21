# ADR-0003: Isomorfismo r ↔ c honesto

**Estado**: Aceptado
**Fecha**: 2026-08-15

## Contexto

La interfaz mostraba la conversión `c = (2r − r²)/4` como un "isomorfismo
exacto" para todos los mapas. Esa identidad solo es una conjugación real para
el **mapa logístico** (vía `z = −r·x + r/2`). Para el mapa seno, exponencial y
polinómico, los `rToC`/`cToR` existentes eran **mapeos lineales ad-hoc** del
intervalo de r al segmento real del Mandelbrot `[-2, 0.25]`, sin ser
isomorfismos matemáticos. Presentarlos como exactos era pedagógicamente
incorrecto.

El **mapa cuadrático** `x_{n+1} = r − x_n²` sí es exactamente conjugado al eje
real de Mandelbrot vía `y = −x` ⇒ `y_{n+1} = y_n² + c` con `c = −r`.

## Decisión

- Cada modelo declara `isomorphismKind: 'exact' | 'parametric'`:
  - `exact` → logístico (`c = (2r − r²)/4`) y cuadrático (`c = −r`).
  - `parametric` → seno, exponencial y polinómico (mapeo del intervalo).
- Cada modelo expone `isomorphismLatex` con la fórmula real que se muestra en
  el conector de la interfaz.
- El Inspector etiqueta explícitamente cada modelo como "exacto (conjugado)"
  o "sección paramétrica".

## Consecuencias

- Honestidad matemática: el estudiante distingue conjugación real de una
  simple re-parametrización del eje real.
- Los modelos nuevos (Tent, Gauss, Ricker…) deben elegir conscientemente su
  `isomorphismKind`.
