/**
 * Curated examples for the "Ejemplos" tab: mathematical milestones of the
 * golden sequence and real-world applications. Each card opens the lab preset.
 */

export interface ExampleCase {
  id: string;
  icon: string;
  category: 'math' | 'engineering';
  title: { es: string; en: string };
  description: { es: string; en: string };
  formula: string;
  styleId: string;
  n: number;
}

export const EXAMPLE_CASES: ExampleCase[] = [
  // ---- Mathematical milestones -------------------------------------------
  {
    id: 'ex-seq40',
    icon: '🔢',
    category: 'math',
    title: { es: 'Los primeros términos', en: 'The first terms' },
    description: {
      es: 'La sucesión 0,1,1,2,3,5,8… en escala logarítmica: una línea recta de pendiente ln φ.',
      en: 'The sequence 0,1,1,2,3,5,8… on a log scale: a straight line of slope ln φ.',
    },
    formula: 'F(n) = F(n−1) + F(n−2)',
    styleId: 'sunflower',
    n: 40,
  },
  {
    id: 'ex-ratio32',
    icon: '📉',
    category: 'math',
    title: { es: 'Convergencia a φ en n = 32', en: 'Convergence to φ at n = 32' },
    description: {
      es: 'Con 32 términos el error |F(n)/F(n−1) − φ| ya es del orden de 10⁻⁶.',
      en: 'With 32 terms the error |F(n)/F(n−1) − φ| is already around 10⁻⁶.',
    },
    formula: 'F(32)/F(31) ≈ 1.618033990175',
    styleId: 'sunflower',
    n: 233,
  },
  {
    id: 'ex-fib233',
    icon: '🌻',
    category: 'math',
    title: { es: 'Girasol de 233 semillas', en: '233-seed sunflower' },
    description: {
      es: 'El ángulo áureo 137.508° y 233 semillas revelan los brazos espirales 89/144.',
      en: 'The 137.508° golden angle with 233 seeds reveals the 89/144 spiral arms.',
    },
    formula: 'a = 360°/φ² ≈ 137.508°',
    styleId: 'sunflower',
    n: 233,
  },
  {
    id: 'ex-nautilus',
    icon: '🐚',
    category: 'math',
    title: { es: 'Concha de Nautilus', en: 'Nautilus shell' },
    description: {
      es: 'La espira mirabilis (r = a·φ^{θ/π}) de la concha del nautilus.',
      en: 'The spira mirabilis (r = a·φ^{θ/π}) of the nautilus shell.',
    },
    formula: 'r(θ) = a·φ^(θ/π)',
    styleId: 'nautilus',
    n: 233,
  },
  {
    id: 'ex-paloverde',
    icon: '🌿',
    category: 'math',
    title: { es: 'Palo verde 135.9°', en: 'Paloverde 135.9°' },
    description: {
      es: 'Una divergencia cercana al ángulo áureo produce espirales casi idénticas: compárala con 137.5°.',
      en: 'A divergence near the golden angle yields almost identical spirals: compare with 137.5°.',
    },
    formula: 'a ≈ 135.9°',
    styleId: 'paloverde',
    n: 233,
  },
  {
    id: 'ex-leaves',
    icon: '🍃',
    category: 'math',
    title: { es: 'Hojas a 222.5°', en: 'Leaves at 222.5°' },
    description: {
      es: 'El ángulo complementario 222.5° (180° + 42.5°) de la foliación.',
      en: 'The complementary 222.5° (180° + 42.5°) angle of leaf phyllotaxis.',
    },
    formula: 'a = 360° − 137.5° = 222.5°',
    styleId: 'leaves',
    n: 144,
  },
  {
    id: 'ex-decussate',
    icon: '✚',
    category: 'math',
    title: { es: 'Retrocruzada 90°', en: 'Decussate 90°' },
    description: {
      es: 'Hojas opuestas a 90°: el patrón que casi alinea las semillas (muy ineficiente).',
      en: 'Opposite leaves at 90°: the pattern that nearly aligns seeds (very inefficient).',
    },
    formula: 'a = 90°',
    styleId: 'decussate',
    n: 144,
  },
  {
    id: 'ex-sphere',
    icon: '🧊',
    category: 'math',
    title: { es: 'Esfera de Fibonacci', en: 'Fibonacci sphere' },
    description: {
      es: '300 puntos sobre una esfera con la distribución de la espiral dorada.',
      en: '300 points on a sphere with the golden-spiral distribution.',
    },
    formula: 'φ = π·(3−√5)',
    styleId: 'sunflower',
    n: 300,
  },
  {
    id: 'ex-pentagram',
    icon: '⭐',
    category: 'math',
    title: { es: 'Pentagrama pitagórico', en: 'Pythagorean pentagram' },
    description: {
      es: 'El pentagrama: cada diagonal es φ y el triángulo áureo mide 36°/72°/72°.',
      en: 'The pentagram: every diagonal is φ and the golden triangle measures 36°/72°/72°.',
    },
    formula: 'd = φ·l',
    styleId: 'sunflower',
    n: 144,
  },

  // ---- Applications of φ --------------------------------------------------
  {
    id: 'ex-architecture',
    icon: '🏛️',
    category: 'engineering',
    title: { es: 'El Partenón', en: 'The Parthenon' },
    description: {
      es: 'La fachada se inscribe en un rectángulo 1:φ; verifica la teselación áurea.',
      en: 'The façade inscribes in a 1:φ rectangle; verify the golden tiling.',
    },
    formula: 'W/H = φ',
    styleId: 'sunflower',
    n: 233,
  },
  {
    id: 'ex-phyllotaxis',
    icon: '🌻',
    category: 'engineering',
    title: { es: 'Filotaxis 377 semillas', en: '377-seed phyllotaxis' },
    description: {
      es: 'El girasol real: 377 semillas y las espirales 144/233.',
      en: 'The real sunflower: 377 seeds and the 144/233 spirals.',
    },
    formula: 'a = 137.508°',
    styleId: 'sunflower',
    n: 377,
  },
  {
    id: 'ex-markets',
    icon: '📈',
    category: 'engineering',
    title: { es: 'Retroceso 0.618', en: '0.618 retracement' },
    description: {
      es: 'El nivel de retroceso de Fibonacci más usado: 1 − 1/φ ≈ 0.618.',
      en: 'The most used Fibonacci retracement level: 1 − 1/φ ≈ 0.618.',
    },
    formula: '1/φ = φ − 1 ≈ 0.618',
    styleId: 'leaves',
    n: 144,
  },
  {
    id: 'ex-music',
    icon: '🎼',
    category: 'engineering',
    title: { es: 'Sonido de φ', en: 'Sound of φ' },
    description: {
      es: 'Sonifica la convergencia: los ratios se estabilizan en un tono único.',
      en: 'Sonify the convergence: the ratios stabilise on a single pitch.',
    },
    formula: 'cent = 1200·log₂(φ) ≈ 833',
    styleId: 'sunflower',
    n: 233,
  },
  {
    id: 'ex-design',
    icon: '📡',
    category: 'engineering',
    title: { es: 'Retícula áurea', en: 'Golden grid' },
    description: {
      es: 'La retícula 1:φ en diseño editorial, UI y carteles modernos.',
      en: 'The 1:φ grid in editorial design, UI and modern posters.',
    },
    formula: 'W/H = φ',
    styleId: 'sunflower',
    n: 55,
  },
];
