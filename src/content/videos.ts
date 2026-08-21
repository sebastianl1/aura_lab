/**
 * Video lesson registry. All YouTube ids below were verified via oEmbed.
 * Each entry also feeds a VideoObject schema in the Videos tab.
 */
export interface VideoLesson {
  id: string;
  /** YouTube video id (the part after v=). */
  youtubeId: string;
  title: { es: string; en: string };
  duration?: string; // ISO 8601, e.g. "PT9M" (approx; optional)
  uploadDate?: string; // ISO 8601 date
  description: { es: string; en: string };
}

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'v1',
    youtubeId: 'sj8Sg8qnjOg',
    title: {
      es: 'El número áureo (y por qué es tan irracional)',
      en: 'The Golden Ratio (why it is so irrational)',
    },
    description: {
      es: 'Ben Sparks (Numberphile) explica por qué φ es el más irracional de los números y su fracción continua [1;1,1,…].',
      en: 'Ben Sparks (Numberphile) explains why φ is the most irrational number and its continued fraction [1;1,1,…].',
    },
  },
  {
    id: 'v2',
    youtubeId: 'dTWKKvlZB08',
    title: { es: 'La prueba dorada', en: 'Golden Proof' },
    description: {
      es: 'Segunda parte de la trilogía del número áureo: demostración de que toda sucesión con la "propiedad dorada" converge a φ.',
      en: 'Part two of the golden trilogy: proof that every sequence with the "golden property" converges to φ.',
    },
  },
  {
    id: 'v3',
    youtubeId: 'o3QBgkQi_HA',
    title: { es: 'Pentágonos y el número áureo', en: 'Pentagons and the Golden Ratio' },
    description: {
      es: 'El pentagrama y el triángulo 36°/72°/72°: por qué la diagonal del pentágono mide φ veces el lado.',
      en: 'The pentagram and the 36°/72°/72° triangle: why the pentagon diagonal is φ times the side.',
    },
  },
  {
    id: 'v4',
    youtubeId: 'kkGeOWYOFoA',
    title: {
      es: 'Naturaleza por números (φ en la animación)',
      en: 'Nature by Numbers (φ in animation)',
    },
    description: {
      es: 'La celebrada animación de Cristóbal Vila donde φ, la sucesión de Fibonacci y la filotaxis sostienen la materia.',
      en: 'Cristóbal Vila’s acclaimed animation where φ, the Fibonacci sequence and phyllotaxis underpin matter.',
    },
  },
  {
    id: 'v5',
    youtubeId: 'c8QCdioazUY',
    title: {
      es: 'Hoja a hoja: la ciencia fibonacciana de la filotaxis',
      en: 'Leaf by Leaf: the Fibonacci science of phyllotaxis',
    },
    description: {
      es: 'Cómo plantas, girasoles y piñas disponen sus órganos con el ángulo áureo y pares de Fibonacci.',
      en: 'How plants, sunflowers and pinecones arrange their organs with the golden angle and Fibonacci pairs.',
    },
  },
  {
    id: 'v6',
    youtubeId: 'MCWepKUuFlc',
    title: {
      es: 'Las espirales del girasol: la lógica oculta de la filotaxis',
      en: 'Why sunflowers follow Fibonacci: the hidden logic of phyllotaxis',
    },
    description: {
      es: 'El ángulo áureo 137.5° explica por qué las semillas del girasol dibujan espirales 34/55 o 55/89.',
      en: 'The 137.5° golden angle explains why sunflower seeds draw 34/55 or 55/89 spirals.',
    },
  },
];
