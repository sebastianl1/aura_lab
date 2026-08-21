/** Feigenbaum constants and key bifurcation points of the logistic family. */

export const FEIGENBAUM_DELTA = 4.66920160910299; // Universal period-doubling scale ratio limit
export const FEIGENBAUM_ALPHA = 2.50290787509589; // Universal width ratio limit

export interface BifurcationMilestone {
  name: string;
  r: number;
  c: number;
  description: string;
}

export const BIFURCATION_MILESTONES: BifurcationMilestone[] = [
  {
    name: 'Extinción (Extinction)',
    r: 0.5,
    c: 0.375,
    description: 'Para r < 1 (c > 0.25), la población colapsa inevitablemente a 0.',
  },
  {
    name: 'Punto Fijo Único (Period-1 Attractor)',
    r: 2.5,
    c: -0.3125,
    description: 'El sistema converge suavemente a un valor de equilibrio estable x = (r-1)/r.',
  },
  {
    name: 'Primera Bifurcación (Period-2)',
    r: 3.0,
    c: -0.75,
    description:
      'El punto fijo pierde estabilidad. La órbita oscila eternamente entre 2 valores (Periodo 2). En el eje real de la Espiral Áurea, coincide exactamente con la frontera entre el cardioide principal y el disco izquierdo.',
  },
  {
    name: 'Segunda Bifurcación (Period-4)',
    r: 3.44949,
    c: -1.25,
    description: 'La órbita se duplica de 2 a 4 estados estables (Periodo 4).',
  },
  {
    name: 'Tercera Bifurcación (Period-8)',
    r: 3.54409,
    c: -1.368,
    description:
      'Duplicación a Periodo 8. La tasa de convergencia entre bifurcaciones tiende a la constante de Feigenbaum δ ≈ 4.6692.',
  },
  {
    name: 'Límite de Feigenbaum (Inicio del Caos)',
    r: 3.5699456,
    c: -1.401155,
    description:
      'La cascada de duplicación de periodo llega al infinito. La órbita se vuelve aperiódica y caótica.',
  },
  {
    name: 'Ventana de Periodo 3 (Orden dentro del Caos)',
    r: 3.8284,
    c: -1.75,
    description:
      "Inesperadamente en medio del caos, emerge una ventana estable de periodo 3. Teorema de Li-Yorke: 'Periodo 3 implica Caos'.",
  },
];
