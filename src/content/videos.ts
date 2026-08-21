/**
 * Video lesson registry. Add entries with a YouTube video id to publish them
 * in the Videos tab; each entry also feeds a VideoObject schema.
 */
export interface VideoLesson {
  id: string;
  /** YouTube video id (the part after v=). Leave empty to mark as coming soon. */
  youtubeId: string;
  title: { es: string; en: string };
  duration?: string; // ISO 8601, e.g. "PT12M30S"
  uploadDate?: string; // ISO 8601 date, e.g. "2026-08-15"
  description: { es: string; en: string };
}

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'v1',
    youtubeId: '',
    title: { es: 'Introducción a los mapas iterados', en: 'Introduction to iterated maps' },
    description: {
      es: 'Órbitas, puntos fijos y estabilidad en sistemas dinámicos discretos.',
      en: 'Orbits, fixed points and stability in discrete dynamical systems.',
    },
  },
  {
    id: 'v2',
    youtubeId: '',
    title: {
      es: 'La ruta al caos: duplicación de periodo',
      en: 'The route to chaos: period doubling',
    },
    description: {
      es: 'De la primera bifurcación al límite de Feigenbaum.',
      en: 'From the first bifurcation to the Feigenbaum limit.',
    },
  },
  {
    id: 'v3',
    youtubeId: '',
    title: {
      es: 'Espiral Áurea como atlas de bifurcaciones',
      en: 'Golden Spiral as an atlas of bifurcations',
    },
    description: {
      es: 'El isomorfismo exacto entre el eje real y el diagrama de bifurcación.',
      en: 'The exact isomorphism between the real axis and the bifurcation diagram.',
    },
  },
];
