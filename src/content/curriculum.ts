/** Bilingual curriculum for the Aprende tab (Fibonacci & golden ratio). */

export type Lang = 'es' | 'en';

export interface Block {
  type: 'paragraph' | 'aside' | 'latex';
  content: string;
}

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface LessonDemo {
  label: string;
  styleId: string;
  n: number;
}

export interface Lesson {
  id: string;
  title: { es: string; en: string };
  intro: { es: string; en: string };
  blocks: { es: Block[]; en: Block[] };
  keyPoints: { es: string[]; en: string[] };
  takeaway?: { es: string; en: string };
  demo?: LessonDemo;
  quiz?: QuizQuestion;
}

export interface Module {
  id: string;
  icon: string;
  title: { es: string; en: string };
  summary: { es: string; en: string };
  lessons: Lesson[];
}

export interface GlossaryTerm {
  term: string;
  es: string;
  en: string;
}

export const MODULES: Module[] = [
  {
    id: 'm1',
    icon: '🔢',
    title: { es: 'Sucesión de Fibonacci', en: 'The Fibonacci Sequence' },
    summary: {
      es: 'Orígenes en el Liber Abaci, la regla recurrente y el crecimiento exponencial.',
      en: 'Origins in the Liber Abaci, the recurrence rule and exponential growth.',
    },
    lessons: [
      {
        id: 'm1-l1',
        title: { es: 'Los conejos de Fibonacci', en: "Leonardo of Pisa's rabbits" },
        intro: {
          es: 'En 1202, Leonardo de Pisa (Fibonacci) estudió cuántas parejas de conejos nacen tras n meses.',
          en: 'In 1202, Leonardo of Pisa (Fibonacci) asked how many rabbit pairs exist after n months.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Cada mes, una pareja madura engendra una nueva pareja; una pareja joven necesita un mes para madurar. Si empiezas con una pareja joven, las poblaciones mensuales son 1, 1, 2, 3, 5, 8, 13…',
            },
            { type: 'latex', content: 'F(0)=0,\\ F(1)=1,\\ F(n)=F(n-1)+F(n-2)' },
            {
              type: 'aside',
              content:
                'Aunque es un modelo idealizado, marca el primer estudio matemático de crecimiento biológico en Occidente.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Each month a mature pair begets a new pair; a young pair needs one month to mature. Starting with one young pair, monthly populations read 1, 1, 2, 3, 5, 8, 13…',
            },
            { type: 'latex', content: 'F(0)=0,\\ F(1)=1,\\ F(n)=F(n-1)+F(n-2)' },
            {
              type: 'aside',
              content:
                'Though idealized, it marks the first Western mathematical study of biological growth.',
            },
          ],
        },
        keyPoints: {
          es: [
            'La sucesión nace del modelo de conejos del Liber Abaci (1202).',
            'Cada término es la suma de los dos anteriores.',
          ],
          en: [
            'The sequence comes from the rabbit model in the Liber Abaci (1202).',
            'Each term is the sum of the two previous ones.',
          ],
        },
        takeaway: {
          es: 'Una regla de crecimiento simple puede generar una sucesión con propiedades infinitas.',
          en: 'A simple growth rule can generate a sequence with infinite properties.',
        },
        quiz: {
          question: '¿Cuál es el siguiente término de 1, 1, 2, 3, 5, 8?',
          options: [
            { text: '13', correct: true },
            { text: '11', correct: false },
            { text: '16', correct: false },
            { text: '10', correct: false },
          ],
          explanation: 'F(n)=F(n−1)+F(n−2): 8 + 5 = 13.',
        },
      },
      {
        id: 'm1-l2',
        title: { es: 'La regla recurrente', en: 'The recurrence rule' },
        intro: {
          es: 'La recurrencia F(n) = F(n−1) + F(n−2) basta para generar toda la sucesión.',
          en: 'The recurrence F(n) = F(n−1) + F(n−2) generates the whole sequence.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En el laboratorio, el panel "Sucesión" dibuja log(F(n)) frente a n. Como F(n) crece como φⁿ/√5, la gráfica logarítmica es una línea recta de pendiente ln(φ) ≈ 0.4812.',
            },
            { type: 'latex', content: '\\log F(n) \\approx n\\log\\varphi - \\log\\sqrt{5}' },
            {
              type: 'aside',
              content: 'Una línea recta en escala logarítmica = crecimiento exponencial puro.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'In the lab, the Sequence panel plots log(F(n)) vs n. Since F(n) grows like φⁿ/√5, the log plot is a straight line of slope ln(φ) ≈ 0.4812.',
            },
            { type: 'latex', content: '\\log F(n) \\approx n\\log\\varphi - \\log\\sqrt{5}' },
            {
              type: 'aside',
              content: 'A straight line on a log scale means pure exponential growth.',
            },
          ],
        },
        keyPoints: {
          es: [
            'log F(n) es una recta de pendiente ln φ.',
            'La sucesión crece exponencialmente, no cuadráticamente.',
          ],
          en: [
            'log F(n) is a straight line of slope ln φ.',
            'The sequence grows exponentially, not quadratically.',
          ],
        },
      },
      {
        id: 'm1-l3',
        title: { es: 'Términos grandes y Binet', en: 'Large terms and Binet' },
        intro: {
          es: 'Con Binet podemos calcular cualquier F(n) sin sumar uno a uno.',
          en: "With Binet's formula we can compute any F(n) without adding term by term.",
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'F(100) ≈ 3.54×10²⁰, F(200) ≈ 2.8×10⁴¹. El panel Inspector muestra F(n), Lucas y la descomposición de Zeckendorf de cualquier término.',
            },
            {
              type: 'latex',
              content:
                'F(n) = \\frac{\\varphi^n - \\psi^n}{\\sqrt{5}}, \\quad \\psi = \\frac{1-\\sqrt{5}}{2}',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'F(100) ≈ 3.54×10²⁰, F(200) ≈ 2.8×10⁴¹. The Inspector panel shows F(n), Lucas numbers and the Zeckendorf decomposition of any term.',
            },
            {
              type: 'latex',
              content:
                'F(n) = \\frac{\\varphi^n - \\psi^n}{\\sqrt{5}}, \\quad \\psi = \\frac{1-\\sqrt{5}}{2}',
            },
          ],
        },
        keyPoints: {
          es: ['Binet da F(n) en forma cerrada.', 'Los términos crecen astronómicamente.'],
          en: ["Binet's formula gives F(n) in closed form.", 'Terms grow astronomically.'],
        },
      },
    ],
  },
  {
    id: 'm2',
    icon: '✨',
    title: { es: 'La razón áurea φ', en: 'The Golden Ratio φ' },
    summary: {
      es: 'Definición, irracionalidad, fracción continua y convergencia de la razón.',
      en: 'Definition, irrationality, continued fraction and the convergence of the ratio.',
    },
    lessons: [
      {
        id: 'm2-l1',
        title: { es: 'φ = (1+√5)/2', en: 'φ = (1+√5)/2' },
        intro: {
          es: 'La razón que divide un segmento en dos partes en proporción perfecta.',
          en: 'The ratio that divides a segment into two parts in perfect proportion.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Dividir un segmento AB en P tal que (AB/PB) = (PB/PA) conduce a la ecuación x² = x + 1, cuya solución positiva es φ.',
            },
            {
              type: 'latex',
              content:
                '\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1.6180339887, \\quad \\varphi^2 = \\varphi + 1, \\quad 1/\\varphi = \\varphi - 1',
            },
            { type: 'aside', content: 'φ y 1/φ difieren en 1: la proporción es autorreplicante.' },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Dividing a segment AB at P so that (AB/PB) = (PB/PA) leads to the equation x² = x + 1, whose positive solution is φ.',
            },
            {
              type: 'latex',
              content:
                '\\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1.6180339887, \\quad \\varphi^2 = \\varphi + 1, \\quad 1/\\varphi = \\varphi - 1',
            },
            {
              type: 'aside',
              content: 'φ and 1/φ differ by 1: the proportion is self-replicating.',
            },
          ],
        },
        keyPoints: {
          es: ['φ² = φ + 1 es la identidad esencial.', '1/φ = φ − 1 ≈ 0.618.'],
          en: ['φ² = φ + 1 is the essential identity.', '1/φ = φ − 1 ≈ 0.618.'],
        },
        quiz: {
          question: '¿Qué igualdad define a φ?',
          options: [
            { text: 'φ² = φ + 1', correct: true },
            { text: 'φ² = 2φ', correct: false },
            { text: 'φ = π/2', correct: false },
            { text: 'φ² = 1', correct: false },
          ],
          explanation: 'La definición geométrica de la proporción áurea conduce a x² = x + 1.',
        },
      },
      {
        id: 'm2-l2',
        title: { es: 'Irracional y continua', en: 'Irrational and continued' },
        intro: {
          es: 'φ es irracional; su fracción continua es la más simple posible.',
          en: 'φ is irrational; its continued fraction is the simplest possible.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'φ es algebraico (raíz de x²−x−1) e irracional. Su fracción continua es [1; 1, 1, 1, …]: todos sus cocientes son 1.',
            },
            {
              type: 'latex',
              content:
                '\\varphi = [1; \\overline{1}] = 1 + \\cfrac{1}{1 + \\cfrac{1}{1 + \\cdots}}',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'φ is algebraic (root of x²−x−1) and irrational. Its continued fraction is [1; 1, 1, 1, …]: all quotients equal 1.',
            },
            {
              type: 'latex',
              content:
                '\\varphi = [1; \\overline{1}] = 1 + \\cfrac{1}{1 + \\cfrac{1}{1 + \\cdots}}',
            },
          ],
        },
        keyPoints: {
          es: ['La fracción continua de φ es [1;1,1,1,…].', 'Los convergentes son F(n+1)/F(n).'],
          en: ['The continued fraction of φ is [1;1,1,1,…].', 'Convergents are F(n+1)/F(n).'],
        },
      },
      {
        id: 'm2-l3',
        title: { es: 'Convergencia de la razón', en: 'Convergence of the ratio' },
        intro: {
          es: 'F(n+1)/F(n) se acerca a φ alternando por encima y por debajo.',
          en: 'F(n+1)/F(n) approaches φ oscillating above and below.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En el panel "Convergencia" la curva de razones oscila alrededor de la asíntota roja φ. n par queda debajo; n impar arriba. Ya con n = 32 el error es ≈ 10⁻⁶.',
            },
            {
              type: 'latex',
              content:
                '\\left|\\frac{F(n+1)}{F(n)} - \\varphi\\right| \\sim \\frac{1}{\\sqrt{5}\\;\\varphi^{2n}}\\to 0',
            },
            {
              type: 'aside',
              content: 'La convergencia es geométrica (exponencial), la más rápida posible.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'In the Convergence panel the ratio curve oscillates around the red φ asymptote. Even n stays below; odd n above. At n = 32 the error is already ≈ 10⁻⁶.',
            },
            {
              type: 'latex',
              content:
                '\\left|\\frac{F(n+1)}{F(n)} - \\varphi\\right| \\sim \\frac{1}{\\sqrt{5}\\;\\varphi^{2n}}\\to 0',
            },
            {
              type: 'aside',
              content: 'The convergence is geometric (exponential), the fastest possible.',
            },
          ],
        },
        keyPoints: {
          es: ['Alternancia par/impar alrededor de φ.', 'El error cae exponencialmente.'],
          en: ['Even/odd alternation around φ.', 'The error decays exponentially.'],
        },
        demo: { label: 'Convergencia de la razón', styleId: 'sunflower', n: 233 },
      },
    ],
  },
  {
    id: 'm3',
    icon: '🧮',
    title: { es: 'Binet y números asociados', en: 'Binet and related numbers' },
    summary: {
      es: 'Fórmula cerrada, números de Lucas, sumas e identidades.',
      en: 'Closed form, Lucas numbers, sums and identities.',
    },
    lessons: [
      {
        id: 'm3-l1',
        title: { es: 'Fórmula de Binet', en: "Binet's formula" },
        intro: {
          es: 'La fórmula de Binet expresa F(n) con dos raíces φ y ψ.',
          en: "Binet's formula expresses F(n) with the two roots φ and ψ.",
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Resolviendo el "polinomio característico" de la recurrencia se obtienen α = φ y β = ψ = (1−√5)/2. Como |ψ| < 1, su potencia βⁿ se desvanece: F(n) ≈ φⁿ/√5.',
            },
            { type: 'latex', content: 'F(n) = \\frac{\\varphi^n - \\psi^n}{\\sqrt{5}}' },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                "Solving the recurrence's characteristic polynomial gives α = φ and β = ψ = (1−√5)/2. Since |ψ| < 1, its power βⁿ dies out: F(n) ≈ φⁿ/√5.",
            },
            { type: 'latex', content: 'F(n) = \\frac{\\varphi^n - \\psi^n}{\\sqrt{5}}' },
          ],
        },
        keyPoints: {
          es: [
            'Binet es la solución cerrada de la recurrencia.',
            'β < 1 explica el crecimiento de F(n).',
          ],
          en: [
            'Binet is the closed-form solution of the recurrence.',
            'β < 1 explains the growth of F(n).',
          ],
        },
      },
      {
        id: 'm3-l2',
        title: { es: 'Números de Lucas', en: 'Lucas numbers' },
        intro: {
          es: 'La "sucesión hermana" con la misma recurrencia y condiciones iniciales distintas.',
          en: 'The "sister sequence" with the same recurrence and different initial conditions.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'L(0)=2, L(1)=1, L(n)=L(n−1)+L(n−2): 2, 1, 3, 4, 7, 11, 18, 29… Lucas también admite forma cerrada con αⁿ+βⁿ. Relaciones: F(2n) = F(n)L(n).',
            },
            {
              type: 'latex',
              content: 'L(n) = \\varphi^n + \\psi^n, \\qquad F(2n) = F(n)\\cdot L(n)',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'L(0)=2, L(1)=1, L(n)=L(n−1)+L(n−2): 2, 1, 3, 4, 7, 11, 18, 29… Lucas also has a closed form αⁿ+βⁿ. Identities: F(2n) = F(n)L(n).',
            },
            {
              type: 'latex',
              content: 'L(n) = \\varphi^n + \\psi^n, \\qquad F(2n) = F(n)\\cdot L(n)',
            },
          ],
        },
        keyPoints: {
          es: ['Lucas comparte recurrencia con Fibonacci.', 'F(2n) = F(n)·L(n).'],
          en: ['Lucas shares the recurrence with Fibonacci.', 'F(2n) = F(n)·L(n).'],
        },
      },
      {
        id: 'm3-l3',
        title: { es: 'Sumas y Zeckendorf', en: 'Sums and Zeckendorf' },
        intro: {
          es: 'La suma de los n primeros Fibonacci es F(n+2)−1; todo número se descompone en Fibonacci no consecutivos.',
          en: 'The sum of the first n Fibonacci numbers is F(n+2)−1; every number decomposes into non-consecutive Fibonacci terms.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Σ_{i=1..n} F(i) = F(n+2) − 1. El teorema de Zeckendorf afirma que todo entero positivo se escribe de forma única como suma de Fibonacci no consecutivos: 100 = 89 + 8 + 3 = F(11)+F(6)+F(4).',
            },
            {
              type: 'latex',
              content:
                '\\sum_{i=1}^{n} F(i) = F(n+2) - 1, \\quad \\text{Zeckendorf: } n = \\sum F(i_j),\\ i_j\\ \\text{no consecutivos}',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Σ_{i=1..n} F(i) = F(n+2) − 1. Zeckendorf’s theorem states every positive integer has a unique representation as a sum of non-consecutive Fibonacci numbers: 100 = 89 + 8 + 3 = F(11)+F(6)+F(4).',
            },
            {
              type: 'latex',
              content:
                '\\sum_{i=1}^{n} F(i) = F(n+2) - 1, \\quad \\text{Zeckendorf: } n = \\sum F(i_j),\\ i_j\\ \\text{ non-consecutive}',
            },
          ],
        },
        keyPoints: {
          es: ['ΣF(i)=F(n+2)−1.', 'La representación de Zeckendorf es única.'],
          en: ['ΣF(i)=F(n+2)−1.', 'The Zeckendorf representation is unique.'],
        },
        quiz: {
          question: 'La suma 1+1+2+3+5+8 (n=6) vale:',
          options: [
            { text: '20', correct: true },
            { text: '21', correct: false },
            { text: '19', correct: false },
            { text: '18', correct: false },
          ],
          explanation: 'ΣF(i)=F(8)−1=21−1=20.',
        },
      },
    ],
  },
  {
    id: 'm4',
    icon: '➰',
    title: { es: 'Espiral y rectángulo áureo', en: 'Golden spiral & rectangle' },
    summary: {
      es: 'El rectángulo 1:φ, su teselación y la espiral áurea en el arte.',
      en: 'The 1:φ rectangle, its tiling and the golden spiral in art.',
    },
    lessons: [
      {
        id: 'm4-l1',
        title: { es: 'El rectángulo 1 : φ', en: 'The 1 : φ rectangle' },
        intro: {
          es: 'Si quitas un cuadrado a un rectángulo áureo, queda otro rectángulo áureo.',
          en: 'Remove a square from a golden rectangle and the remainder is another golden rectangle.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'La propiedad autorreplicante del rectángulo 1:φ: al extraer el mayor cuadrado posible, el resto mantiene la misma proporción. Es la base de la teselación y de la espiral áurea.',
            },
            {
              type: 'latex',
              content:
                '\\frac{L}{H} = \\varphi = \\frac{L-H}{H} \\;\\;\\text{si } H = L - \\frac{L}{\\varphi}',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The self-replicating property of the 1:φ rectangle: extracting the largest square leaves a remainder with the same proportion. This underlies the tiling and the golden spiral.',
            },
            {
              type: 'latex',
              content:
                '\\frac{L}{H} = \\varphi = \\frac{L-H}{H} \\;\\;\\text{if } H = L - \\frac{L}{\\varphi}',
            },
          ],
        },
        keyPoints: {
          es: [
            'El rectángulo áureo es autorreplicante.',
            'Cada cuadrado de la teselación es un término de Fibonacci.',
          ],
          en: [
            'The golden rectangle is self-replicating.',
            'Each tiling square is a Fibonacci term.',
          ],
        },
        demo: { label: 'Teselación áurea', styleId: 'sunflower', n: 233 },
      },
      {
        id: 'm4-l2',
        title: { es: 'La espiral de Fischer', en: 'The Fibonacci spiral' },
        intro: {
          es: 'Cuartos de círculo en los cuadrados de la teselación forman una espiral suave.',
          en: 'Quarter-circles in the tiling’s squares form a smooth spiral.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Concatenando arcos de 90° dentro de cada cuadrado se obtiene la espiral de Fibonacci. Su límite es la espiral logarítmica de razón φ (spira mirabilis), a la que se aproxima la concha del nautilus.',
            },
            { type: 'latex', content: 'r(\\theta) = a\\,\\varphi^{2\\theta/\\pi}' },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Concatenating 90° arcs inside each square yields the Fibonacci spiral. Its limit is the logarithmic spiral of ratio φ (spira mirabilis), approximated by the nautilus shell.',
            },
            { type: 'latex', content: 'r(\\theta) = a\\,\\varphi^{2\\theta/\\pi}' },
          ],
        },
        keyPoints: {
          es: [
            'La espiral de Fibonacci es la envolvente de arcos de 90°.',
            'Su límite es la espira mirabilis φ.',
          ],
          en: ['The Fibonacci spiral envelopes 90° arcs.', 'Its limit is the φ spira mirabilis.'],
        },
      },
      {
        id: 'm4-l3',
        title: { es: 'En arte y arquitectura', en: 'In art and architecture' },
        intro: {
          es: 'El rectángulo áureo aparece en fachadas, lienzos y composiciones famosas.',
          en: 'The golden rectangle appears in façades, canvases and famous compositions.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'La fachada del Partenón se inscribe en un rectángulo áureo; Carrá, Seurat y el diseño editorial moderno usan retículas 1:φ. La "divina proporción" de Luca Pacioli (1509) selló el mito renacentista.',
            },
            {
              type: 'aside',
              content:
                'Muchas "supuestas" apariciones son exageradas: la proporción áurea se usa como herramienta compositiva, no como ley universal.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The Parthenon’s façade inscribes in a golden rectangle; Carrà, Seurat and modern editorial design use 1:φ grids. Luca Pacioli’s "divine proportion" (1509) sealed the Renaissance myth.',
            },
            {
              type: 'aside',
              content:
                'Many "claimed" sightings are overstated: the golden ratio is a compositional tool, not a universal law.',
            },
          ],
        },
        keyPoints: {
          es: [
            'φ aparece en composiciones reales (Partenón, diseño).',
            'El mito supera a la evidencia: úsalo con criterio.',
          ],
          en: [
            'φ appears in real compositions (Parthenon, design).',
            'Myth outruns evidence: use it critically.',
          ],
        },
      },
    ],
  },
  {
    id: 'm5',
    icon: '🌻',
    title: { es: 'Filotaxis y la naturaleza', en: 'Phyllotaxis and nature' },
    summary: {
      es: 'El ángulo áureo 137.5°, las espirales del girasol y el nautilus.',
      en: 'The 137.5° golden angle, sunflower spirals and the nautilus.',
    },
    lessons: [
      {
        id: 'm5-l1',
        title: { es: 'El ángulo áureo', en: 'The golden angle' },
        intro: {
          es: 'La fracción del giro completo que deja la razón más irracional.',
          en: 'The fraction of a full turn that leaves the most irrational ratio.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El ángulo áureo es la porción del círculo que deja el número más "apartado" de cualquier fracción racional: a = 360°·(2−φ)? No: a = 360°/φ² ≈ 137.508°. Cada primordio gira ese ángulo respecto al anterior.',
            },
            { type: 'latex', content: 'a = \\frac{360°}{\\varphi^2} \\approx 137.50776°' },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The golden angle is the fraction of the circle left by the “most irrational” number: a = 360°/φ² ≈ 137.508°. Each primordium is rotated by that angle from the previous one.',
            },
            { type: 'latex', content: 'a = \\frac{360°}{\\varphi^2} \\approx 137.50776°' },
          ],
        },
        keyPoints: {
          es: ['El ángulo áureo ≈ 137.508°.', 'Es la razón más irracional: 360/φ².'],
          en: ['The golden angle is ≈ 137.508°.', 'It is the most irrational ratio: 360/φ².'],
        },
        quiz: {
          question: 'El ángulo áureo en grados es:',
          options: [
            { text: '137.5°', correct: true },
            { text: '90°', correct: false },
            { text: '180°', correct: false },
            { text: '45°', correct: false },
          ],
          explanation: '360/φ² ≈ 137.508°.',
        },
      },
      {
        id: 'm5-l2',
        title: { es: 'El girasol', en: 'The sunflower' },
        intro: {
          es: 'Las semillas del girasol dibujan espirales cuyo número es un par de Fibonacci.',
          en: 'Sunflower seeds trace spirals whose counts are a Fibonacci pair.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En un girasol típico ves espirales en dos sentidos: 34 y 55, o 55 y 89, o 89 y 144 — siempre números de Fibonacci consecutivos. El panel Filotaxis lo reproduce: con 377 semillas aparecen las espirales 144/233.',
            },
            {
              type: 'aside',
              content:
                'Un ángulo "casi áureo" alinearía muchas semillas en radios rectos y desperdiciaría espacio.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'In a typical sunflower you see spirals in two directions: 34 and 55, 55 and 89, or 89 and 144 — always consecutive Fibonacci numbers. The Phyllotaxis panel reproduces it: with 377 seeds the 144/233 spirals appear.',
            },
            {
              type: 'aside',
              content:
                'An "almost golden" angle would align many seeds on straight radii and waste space.',
            },
          ],
        },
        keyPoints: {
          es: [
            'Los números de espirales son pares de Fibonacci consecutivos.',
            'El ángulo áureo maximiza el empaquetado.',
          ],
          en: [
            'Spiral counts are consecutive Fibonacci pairs.',
            'The golden angle maximises packing.',
          ],
        },
        demo: { label: 'Filotaxis del girasol', styleId: 'sunflower', n: 377 },
      },
      {
        id: 'm5-l3',
        title: { es: 'Nautilus, piñas y romanesco', en: 'Nautilus, pinecones & romanesco' },
        intro: {
          es: 'Conchas, piñas y coliflores romanesco muestran la espiral áurea y los números de Fibonacci.',
          en: 'Shells, pinecones and romanesco cauliflower show the golden spiral and Fibonacci numbers.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'La concha del nautilus crece en espira logarítmica (mismo ángulo en cada vuelta); la piña y el romanesco usan filotaxis con 8/13 o 13/21 espirales. El estilo "Concha Nautilus" del laboratorio genera esa espiral.',
            },
            {
              type: 'latex',
              content: 'r(\\theta) = a\\;e^{b\\theta}, \\qquad b = \\frac{\\ln\\varphi}{\\pi/2}',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The nautilus shell grows in a logarithmic spiral (same angle each turn); pinecones and romanesco use phyllotaxis with 8/13 or 13/21 spirals. The lab’s "Nautilus shell" style generates that spiral.',
            },
            {
              type: 'latex',
              content: 'r(\\theta) = a\\;e^{b\\theta}, \\qquad b = \\frac{\\ln\\varphi}{\\pi/2}',
            },
          ],
        },
        keyPoints: {
          es: [
            'La espira mirabilis mantiene su forma al crecer.',
            'Piñas y romanesco: pares de Fibonacci.',
          ],
          en: [
            'The spira mirabilis keeps its shape as it grows.',
            'Pinecones and romanesco: Fibonacci pairs.',
          ],
        },
        demo: { label: 'Concha Nautilus', styleId: 'nautilus', n: 233 },
      },
    ],
  },
  {
    id: 'm6',
    icon: '⭐',
    title: { es: 'Pentagrama y aplicaciones', en: 'Pentagram & applications' },
    summary: {
      es: 'Pentágono estelar, mercados, música y telecomunicaciones.',
      en: 'Star pentagon, markets, music and telecommunications.',
    },
    lessons: [
      {
        id: 'm6-l1',
        title: { es: 'Pentágono y pentagrama', en: 'Pentagon and pentagram' },
        intro: {
          es: 'En el pentagrama, cada diagonal es φ veces el lado.',
          en: 'In the pentagram, every diagonal is φ times the side.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El triángulo 36°/72°/72° (triángulo áureo) aparece al unir los vértices del pentágono regular. Cada intersección de las diagonales divide la diagonal en razón áurea.',
            },
            {
              type: 'latex',
              content:
                '\\frac{d}{l} = \\varphi, \\qquad \\text{ángulos del triángulo áureo: } 36°, 72°, 72°',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The 36°/72°/72° golden triangle appears when connecting the vertices of a regular pentagon. Each crossing divides a diagonal in the golden ratio.',
            },
            {
              type: 'latex',
              content:
                '\\frac{d}{l} = \\varphi, \\qquad \\text{golden triangle angles: } 36°, 72°, 72°',
            },
          ],
        },
        keyPoints: {
          es: [
            'La diagonal del pentágono es φ·lado.',
            'El pentagrama era el símbolo de los pitagóricos.',
          ],
          en: ['A pentagon diagonal is φ·side.', 'The pentagram was the Pythagoreans’ symbol.'],
        },
        demo: { label: 'Pentagrama áureo', styleId: 'sunflower', n: 144 },
      },
      {
        id: 'm6-l2',
        title: { es: 'Mercados y diseño', en: 'Markets & design' },
        intro: {
          es: 'Retrocesos de Fibonacci y retículas áureas son aplicaciones modernas.',
          en: 'Fibonacci retracements and golden grids are modern applications.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En análisis técnico, los niveles 0.382, 0.5, 0.618 (1/φ) y 0.786 marcan posibles soportes. En diseño, la retícula 1:φ da jerarquía visual; el "número de oro" de la tipografía usa φ para tamaños.',
            },
            {
              type: 'aside',
              content:
                'En mercados no hay causalidad probada: son niveles de consenso, no leyes físicas.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'In technical analysis, levels 0.382, 0.5, 0.618 (1/φ) and 0.786 mark probable support. In design, the 1:φ grid gives visual hierarchy; typographic "golden numbers" use φ for sizes.',
            },
            {
              type: 'aside',
              content:
                'In markets there is no proven causality: they are consensus levels, not physical laws.',
            },
          ],
        },
        keyPoints: {
          es: ['1/φ ≈ 0.618 es el retroceso central.', 'φ como herramienta heurística, no ley.'],
          en: ['1/φ ≈ 0.618 is the core retracement.', 'φ as a heuristic tool, not a law.'],
        },
      },
      {
        id: 'm6-l3',
        title: { es: 'Música y telecom', en: 'Music & telecom' },
        intro: {
          es: 'Escalas, sonificación y antenas que escalan en φ.',
          en: 'Scales, sonification and antennas that scale by φ.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Sonifica la convergencia: los ratios F(n)/F(n−1) de 2.0 → 1.618 se estabilizan en un tono único (el "sonido de φ"). Las antenas log-periódicas escalan sus elementos por una razón constante cercana a φ para cubrir ancho de banda.',
            },
            {
              type: 'latex',
              content: 'f_{n+1} \\approx \\varphi\\, f_n \\quad\\text{(antena log-periódica)}',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Sonify the convergence: the ratios F(n)/F(n−1) from 2.0 → 1.618 stabilise on a single pitch (the "sound of φ"). Log-periodic antennas scale their elements by a constant ratio close to φ to cover bandwidth.',
            },
            {
              type: 'latex',
              content: 'f_{n+1} \\approx \\varphi\\, f_n \\quad\\text{(log-periodic antenna)}',
            },
          ],
        },
        keyPoints: {
          es: [
            'La sonificación hace audible la convergencia a φ.',
            'Las antenas log-periódicas escalan ≈ φ.',
          ],
          en: [
            'Sonification makes the convergence to φ audible.',
            'Log-periodic antennas scale ≈ φ.',
          ],
        },
      },
    ],
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Sucesión de Fibonacci',
    es: '0, 1, 1, 2, 3, 5, 8, 13… donde cada término suma los dos anteriores.',
    en: '0, 1, 1, 2, 3, 5, 8, 13… where each term sums the previous two.',
  },
  {
    term: 'φ (número áureo)',
    es: 'La razón (1+√5)/2 ≈ 1.61803… que satisface φ² = φ + 1.',
    en: 'The ratio (1+√5)/2 ≈ 1.61803… satisfying φ² = φ + 1.',
  },
  {
    term: 'Ángulo áureo',
    es: '360°/φ² ≈ 137.508°, la divergencia óptima entre primordios.',
    en: '360°/φ² ≈ 137.508°, the optimal divergence between primordia.',
  },
  {
    term: 'Rectángulo áureo',
    es: 'Rectángulo de lados 1 y φ; al quitar un cuadrado conserva la proporción.',
    en: 'Rectangle of sides 1 and φ; removing a square keeps the proportion.',
  },
  {
    term: 'Espiral áurea',
    es: 'Espiral logarítmica de razón φ; en su límite, la espira mirabilis.',
    en: 'Logarithmic spiral of ratio φ; in the limit, the spira mirabilis.',
  },
  {
    term: 'Fórmula de Binet',
    es: 'F(n) = (φⁿ − ψⁿ)/√5, solución cerrada de la recurrencia.',
    en: 'F(n) = (φⁿ − ψⁿ)/√5, closed-form solution of the recurrence.',
  },
  {
    term: 'Números de Lucas',
    es: 'Sucesión con la misma recurrencia, inicios 2 y 1: 2,1,3,4,7,11…',
    en: 'Sequence with the same recurrence, starts 2 and 1: 2,1,3,4,7,11…',
  },
  {
    term: 'Zeckendorf',
    es: 'Todo entero se escribe de forma única como suma de Fibonacci no consecutivos.',
    en: 'Every integer is uniquely a sum of non-consecutive Fibonacci numbers.',
  },
  {
    term: 'Filotaxis',
    es: 'Disposición de hojas/semillas; con el ángulo áureo maximiza el empaquetado.',
    en: 'Leaves/seeds arrangement; with the golden angle it maximises packing.',
  },
  {
    term: 'Fracción continua',
    es: 'Expresión de un número como [a₀; a₁, a₂, …]. Para φ: [1;1,1,1,…].',
    en: 'Expression of a number as [a₀; a₁, a₂, …]. For φ: [1;1,1,1,…].',
  },
  {
    term: 'Retroceso de Fibonacci',
    es: 'Niveles de soporte/resistencia en trading basados en 0.382, 0.5, 0.618…',
    en: 'Trading support/resistance levels based on 0.382, 0.5, 0.618…',
  },
  {
    term: 'Espira mirabilis',
    es: 'Espiral logarítmica que no cambia de forma al crecer; aproximada por el nautilus.',
    en: 'Logarithmic spiral that keeps its shape while growing; approximated by the nautilus.',
  },
];
