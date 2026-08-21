/**
 * Curated bibliography and resources for Aura Lab.
 * "The Golden Ratio" by Mario Livio is the foundational work.
 */

export type ResourceKind = 'book' | 'paper' | 'online' | 'tool';

export interface ResourceEntry {
  id: string;
  kind: ResourceKind;
  primary?: boolean;
  citation: { es: string; en: string };
  note?: { es: string; en: string };
  url?: string;
}

export const RESOURCES: ResourceEntry[] = [
  // ═══════════════════════════════════════════════════════════════════
  // LIBROS — La obra fundacional primero
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'r-livio',
    kind: 'book',
    primary: true,
    citation: {
      es: 'Livio, M. (2002). The Golden Ratio: The Story of Phi, the World’s Most Astonishing Number. Broadway Books.',
      en: 'Livio, M. (2002). The Golden Ratio: The Story of Phi, the World’s Most Astonishing Number. Broadway Books.',
    },
    note: {
      es: 'La obra de referencia del número áureo: historia, geometría, arte y evidencia científica. Distingue con rigor los usos reales de φ de los mitos populares.',
      en: 'The reference work on the golden ratio: history, geometry, art and scientific evidence. It rigorously separates real uses of φ from popular myths.',
    },
    url: 'https://en.wikipedia.org/wiki/The_Golden_Ratio:_The_Story_of_Phi,_the_World%27s_Most_Astonishing_Number',
  },
  {
    id: 'r-dunlap',
    kind: 'book',
    citation: {
      es: 'Dunlap, R. A. (1997). The Golden Ratio and Fibonacci Numbers. World Scientific.',
      en: 'Dunlap, R. A. (1997). The Golden Ratio and Fibonacci Numbers. World Scientific.',
    },
    note: {
      es: 'Introducción técnica y accesible con las demostraciones de Binet, Zeckendorf y las identidades de la sucesión.',
      en: 'A technical yet accessible introduction with proofs of Binet, Zeckendorf and sequence identities.',
    },
    url: 'https://www.worldscientific.com/worldscibooks/10.1142/3355',
  },
  {
    id: 'r-pacioli',
    kind: 'book',
    citation: {
      es: 'Pacioli, L. (1509). De Divina Proportione.',
      en: 'Pacioli, L. (1509). De Divina Proportione.',
    },
    note: {
      es: 'El tratado renacentista que bautizó a φ como "divina proporción", ilustrado por Leonardo da Vinci.',
      en: 'The Renaissance treatise that named φ the "divine proportion", illustrated by Leonardo da Vinci.',
    },
    url: 'https://en.wikipedia.org/wiki/De_divina_proportione',
  },
  {
    id: 'r-posamentier',
    kind: 'book',
    citation: {
      es: 'Posamentier, A. S. & Lehmann, I. (2012). The Glorious Golden Ratio. Prometheus Books.',
      en: 'Posamentier, A. S. & Lehmann, I. (2012). The Glorious Golden Ratio. Prometheus Books.',
    },
    note: {
      es: 'Compendio de curiosidades y aplicaciones con ejemplos resueltos.',
      en: 'A compendium of curiosities and applications with worked examples.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // ARTÍCULOS SEMINALES
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'r-binet',
    kind: 'paper',
    citation: {
      es: 'Binet, J. P. M. (1843). "Mémoire sur l’intégration des équations linéaires aux différences finies." J. Éc. polytech.',
      en: 'Binet, J. P. M. (1843). "Mémoire sur l’intégration des équations linéaires aux différences finies." J. Éc. polytech.',
    },
    note: {
      es: 'El artículo que estableció la fórmula en forma cerrada F(n) = (φⁿ − ψⁿ)/√5.',
      en: 'The paper that established the closed form F(n) = (φⁿ − ψⁿ)/√5.',
    },
  },
  {
    id: 'r-vogel',
    kind: 'paper',
    citation: {
      es: 'Vogel, H. (1979). "A better way to construct the sunflower head." Math. Biosciences, 44, 179–189.',
      en: 'Vogel, H. (1979). "A better way to construct the sunflower head." Math. Biosciences, 44, 179–189.',
    },
    note: {
      es: 'El modelo computacional de filotaxis que este laboratorio reproduce.',
      en: 'The computational phyllotaxis model this laboratory reproduces.',
    },
    url: 'https://doi.org/10.1016/0025-5564(79)90080-4',
  },
  {
    id: 'r-zeckendorf',
    kind: 'paper',
    citation: {
      es: 'Zeckendorf, E. (1972). "Représentation des nombres naturels par une somme de nombres de Fibonacci." Bull. Soc. Roy. Sci. Liège.',
      en: 'Zeckendorf, E. (1972). "Représentation des nombres naturels par une somme de nombres de Fibonacci." Bull. Soc. Roy. Sci. Liège.',
    },
    note: {
      es: 'El teorema de representación única por Fibonacci no consecutivos.',
      en: 'The unique-representation theorem via non-consecutive Fibonacci numbers.',
    },
  },
  {
    id: 'r-prusinkiewicz',
    kind: 'paper',
    citation: {
      es: 'Prusinkiewicz, P. & Lindenmayer, A. (1990). The Algorithmic Beauty of Plants. Springer.',
      en: 'Prusinkiewicz, P. & Lindenmayer, A. (1990). The Algorithmic Beauty of Plants. Springer.',
    },
    note: {
      es: 'Bases computacionales de la filotaxis y los sistemas-L, con la filotaxis de Fibonacci como caso canónico.',
      en: 'Computational foundations of phyllotaxis and L-systems, with Fibonacci phyllotaxis as the canonical case.',
    },
    url: 'http://algorithmicbotany.org/papers/#abop',
  },

  // ═══════════════════════════════════════════════════════════════════
  // RECURSOS ONLINE
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'r-oeis',
    kind: 'online',
    citation: {
      es: 'OEIS — Sucesión A000045 (Fibonacci) y A000032 (Lucas).',
      en: 'OEIS — Sequence A000045 (Fibonacci) and A000032 (Lucas).',
    },
    note: {
      es: 'La enciclopedia de sucesiones enteras: referencias y propiedades de cada término.',
      en: 'The on-line encyclopedia of integer sequences: references and properties for every term.',
    },
    url: 'https://oeis.org/A000045',
  },
  {
    id: 'r-wolfram-phi',
    kind: 'online',
    citation: {
      es: 'Wolfram MathWorld — "Golden Ratio".',
      en: 'Wolfram MathWorld — "Golden Ratio".',
    },
    note: {
      es: 'Entrada enciclopédica con continuantes, identidades y relaciones con números de Fibonacci.',
      en: 'Encyclopedic entry with convergents, identities and relations to Fibonacci numbers.',
    },
    url: 'https://mathworld.wolfram.com/GoldenRatio.html',
  },
  {
    id: 'r-khan',
    kind: 'online',
    citation: {
      es: 'Numberphile — "The Golden Ratio" y "Pentagons and the Golden Ratio".',
      en: 'Numberphile — "The Golden Ratio" and "Pentagons and the Golden Ratio".',
    },
    note: {
      es: 'Videos didácticos verificados sobre la irracionalidad de φ y el pentagrama.',
      en: 'Verified educational videos on the irrationality of φ and the pentagram.',
    },
    url: 'https://www.youtube.com/watch?v=sj8Sg8qnjOg',
  },
  {
    id: 'r-sunflower',
    kind: 'tool',
    citation: {
      es: 'Simulador interactivo de filotaxis (ángulo áureo).',
      en: 'Interactive phyllotaxis simulator (golden angle).',
    },
    note: {
      es: 'Ajusta el ángulo de divergencia y observa cómo se rompen las espirales de Fibonacci.',
      en: 'Tune the divergence angle and watch the Fibonacci spirals break apart.',
    },
    url: 'https://phyllotaxis.app',
  },
];
