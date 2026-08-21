/**
 * Educational curriculum for the "Aprende" tab.
 * Every lesson is bilingual (ES/EN) and can embed LaTeX blocks, an
 * interactive demo (model + r) and a self-assessment quiz.
 */

export type Lang = 'es' | 'en';

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface LessonBlock {
  type: 'paragraph' | 'latex' | 'aside';
  content: string;
}

export interface LessonDemo {
  modelId: string;
  r: number;
  label: string;
}

export interface Lesson {
  id: string;
  title: { es: string; en: string };
  intro: { es: string; en: string };
  blocks: { es: LessonBlock[]; en: LessonBlock[] };
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
    icon: '🔁',
    title: { es: 'Fundamentos: Iteración y Mapas', en: 'Fundamentals: Iteration & Maps' },
    summary: {
      es: 'Sistemas dinámicos discretos, órbitas, puntos fijos y estabilidad.',
      en: 'Discrete dynamical systems, orbits, fixed points and stability.',
    },
    lessons: [
      {
        id: 'm1-l1',
        title: { es: 'Sistemas dinámicos discretos', en: 'Discrete dynamical systems' },
        intro: {
          es: 'Un mapa es una regla que transforma cada estado en el siguiente.',
          en: 'A map is a rule that turns each state into the next one.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Un sistema dinámico discreto está definido por una función f que lleva un estado xₙ al siguiente:',
            },
            { type: 'latex', content: 'x_{n+1} = f(x_n), \\quad n = 0, 1, 2, \\ldots' },
            {
              type: 'paragraph',
              content:
                'Partiendo de una condición inicial x₀, obtenemos la órbita x₀, x₁, x₂, … Los primeros pasos suelen ser un transitorio que se descarta; lo relevante es la evolución a largo plazo, que revela el atractor del sistema.',
            },
            {
              type: 'aside',
              content:
                'En el laboratorio, el diagrama de telaraña (cobweb) dibuja la órbita paso a paso. Arrastra x₀ en la base y observa cómo la escalera avanza.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'A discrete dynamical system is defined by a function f taking a state xₙ to the next one:',
            },
            { type: 'latex', content: 'x_{n+1} = f(x_n), \\quad n = 0, 1, 2, \\ldots' },
            {
              type: 'paragraph',
              content:
                'Starting from an initial condition x₀, we obtain the orbit x₀, x₁, x₂, … The early steps are usually a transient to be discarded; what matters is the long-term evolution, which reveals the system attractor.',
            },
            {
              type: 'aside',
              content:
                'In the laboratory, the cobweb plot draws the orbit step by step. Drag x₀ on the base and watch the staircase advance.',
            },
          ],
        },
        keyPoints: {
          es: [
            'Un mapa discreto genera la órbita a partir de x₀.',
            'El transitorio se descarta; la dinámica a largo plazo define el atractor.',
          ],
          en: [
            'A discrete map generates the orbit from x₀.',
            'The transient is discarded; long-term dynamics define the attractor.',
          ],
        },
      },
      {
        id: 'm1-l2',
        title: { es: 'Puntos fijos y estabilidad', en: 'Fixed points and stability' },
        intro: {
          es: '¿A dónde converge la órbita? La derivada decide la estabilidad.',
          en: 'Where does the orbit converge? The derivative decides stability.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Un punto fijo x* satisface f(x*) = x*. Para saber si las iteraciones cercanas convergen a él, evaluamos la pendiente de f en x*:',
            },
            {
              type: 'latex',
              content:
                "|f'(x^*)| < 1 \\; \\Rightarrow \\; \\text{estable} \\qquad |f'(x^*)| > 1 \\; \\Rightarrow \\; \\text{inestable}",
            },
            {
              type: 'paragraph',
              content:
                'En el mapa logístico, el punto fijo x* = 1 − 1/r existe para r > 1 y es estable mientras |r(1 − 2x*)| < 1, es decir, mientras r < 3. Al llegar a r = 3, el punto fijo pierde estabilidad: nace una bifurcación.',
            },
            {
              type: 'latex',
              content: "x^* = 1 - \\frac{1}{r} \\qquad \\left| f'(x^*) \\right| = |2 - r|",
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'A fixed point x* satisfies f(x*) = x*. To tell whether nearby iterates converge to it, we evaluate the slope of f at x*:',
            },
            {
              type: 'latex',
              content:
                "|f'(x^*)| < 1 \\; \\Rightarrow \\; \\text{stable} \\qquad |f'(x^*)| > 1 \\; \\Rightarrow \\; \\text{unstable}",
            },
            {
              type: 'paragraph',
              content:
                'For the logistic map, the fixed point x* = 1 − 1/r exists for r > 1 and is stable while |r(1 − 2x*)| < 1, that is, while r < 3. At r = 3 the fixed point loses stability: a bifurcation is born.',
            },
            {
              type: 'latex',
              content: "x^* = 1 - \\frac{1}{r} \\qquad \\left| f'(x^*) \\right| = |2 - r|",
            },
          ],
        },
        keyPoints: {
          es: [
            "|f'(x*)| < 1 ⇒ atractor estable; |f'(x*)| > 1 ⇒ inestable.",
            'En el logístico, el punto fijo es estable para 1 < r < 3.',
          ],
          en: [
            "|f'(x*)| < 1 ⇒ stable attractor; |f'(x*)| > 1 ⇒ unstable.",
            'For the logistic map the fixed point is stable for 1 < r < 3.',
          ],
        },
        demo: { modelId: 'logistic', r: 2.6, label: 'Punto fijo estable' },
        quiz: {
          question: '¿Cuándo es estable el punto fijo x* = 1 − 1/r del mapa logístico?',
          options: [
            { text: 'Siempre, para cualquier r > 1', correct: false },
            { text: 'Mientras |2 − r| < 1, es decir r < 3', correct: true },
            { text: 'Solo cuando r = 4', correct: false },
            { text: 'Nunca es estable', correct: false },
          ],
          explanation:
            "f'(x*) = r(1 − 2x*) = 2 − r. El punto fijo es estable cuando |2 − r| < 1, que ocurre para 1 < r < 3.",
        },
      },
      {
        id: 'm1-l3',
        title: {
          es: 'El logístico como modelo de población',
          en: 'The logistic map as a population model',
        },
        intro: {
          es: 'Un modelo sencillo de población revela una riqueza inesperada.',
          en: 'A simple population model reveals unexpected richness.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El mapa logístico x_{n+1} = r·xₙ(1 − xₙ) describe una población normalizada a una capacidad de carga. El término xₙ(1 − xₙ) modela la competencia por recursos: cuando la población es grande, el crecimiento se frena.',
            },
            {
              type: 'paragraph',
              content:
                'El parámetro r es la tasa de crecimiento efectiva. Para r pequeños, la población tiende a un equilibrio. Al aumentar r, el equilibrio se vuelve oscilatorio y, para r > 3.57, el comportamiento se vuelve caótico: todo esto sin añadir ninguna aleatoriedad.',
            },
            {
              type: 'aside',
              content:
                'El mapa de Ricker x_{n+1} = r·xₙ·e^(−xₙ) es otro modelo poblacional clásico con la misma ruta al caos. Compáralos en el laboratorio.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The logistic map x_{n+1} = r·xₙ(1 − xₙ) describes a population normalized to a carrying capacity. The term xₙ(1 − xₙ) models competition for resources: when the population is large, growth slows down.',
            },
            {
              type: 'paragraph',
              content:
                'The parameter r is the effective growth rate. For small r the population tends to an equilibrium. As r grows, the equilibrium becomes oscillatory and, beyond r > 3.57, the behavior turns chaotic — with no randomness added at all.',
            },
            {
              type: 'aside',
              content:
                'The Ricker map x_{n+1} = r·xₙ·e^(−xₙ) is another classic population model with the same route to chaos. Compare them in the laboratory.',
            },
          ],
        },
        keyPoints: {
          es: [
            'El logístico modela población con competencia por recursos.',
            'Caos emergente a partir de un modelo totalmente determinista.',
          ],
          en: [
            'The logistic map models population with resource competition.',
            'Chaos emerges from a fully deterministic model.',
          ],
        },
      },
    ],
  },
  {
    id: 'm2',
    icon: '⚡',
    title: { es: 'Duplicación de periodo y Feigenbaum', en: 'Period doubling & Feigenbaum' },
    summary: {
      es: 'La cascada 2 → 4 → 8 → … y la constante universal δ.',
      en: 'The 2 → 4 → 8 → … cascade and the universal constant δ.',
    },
    lessons: [
      {
        id: 'm2-l1',
        title: { es: 'La primera bifurcación', en: 'The first bifurcation' },
        intro: {
          es: 'En r = 3, un punto fijo se convierte en un ciclo de dos estados.',
          en: 'At r = 3 a fixed point becomes a cycle of two states.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En r = 3 el punto fijo del mapa logístico pierde estabilidad y nace un ciclo de periodo 2: la órbita alterna eternamente entre dos valores x_a y x_b, con x_a = f(x_b) y x_b = f(x_a). Esta es la primera bifurcación de duplicación de periodo.',
            },
            {
              type: 'latex',
              content: 'x_a = f(x_b), \\qquad x_b = f(x_a), \\qquad x_a \\neq x_b',
            },
            {
              type: 'paragraph',
              content:
                'En el diagrama de bifurcación, en r = 3 la línea única se parte en dos ramas. El punto c = −0.75 del eje real de Mandelbrot corresponde exactamente a esta bifurcación.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'At r = 3 the logistic fixed point loses stability and a period-2 cycle is born: the orbit alternates forever between two values x_a and x_b, with x_a = f(x_b) and x_b = f(x_a). This is the first period-doubling bifurcation.',
            },
            {
              type: 'latex',
              content: 'x_a = f(x_b), \\qquad x_b = f(x_a), \\qquad x_a \\neq x_b',
            },
            {
              type: 'paragraph',
              content:
                'In the bifurcation diagram, the single line splits into two branches at r = 3. The point c = −0.75 on the Mandelbrot real axis corresponds exactly to this bifurcation.',
            },
          ],
        },
        keyPoints: {
          es: [
            'En r = 3: punto fijo → ciclo de periodo 2.',
            'c = −0.75 marca la frontera periodo 1 → 2 en Mandelbrot.',
          ],
          en: [
            'At r = 3: fixed point → period-2 cycle.',
            'c = −0.75 marks the period 1 → 2 boundary in Mandelbrot.',
          ],
        },
        demo: { modelId: 'logistic', r: 3.2, label: 'Órbita de periodo 2' },
        quiz: {
          question: '¿Qué ocurre exactamente en r = 3 para el mapa logístico?',
          options: [
            { text: 'La población se extingue', correct: false },
            {
              text: 'El punto fijo pierde estabilidad y nace un ciclo de periodo 2',
              correct: true,
            },
            { text: 'El sistema se vuelve caótico de inmediato', correct: false },
            { text: 'El punto fijo se hace más estable', correct: false },
          ],
          explanation:
            "En r = 3 la derivada en el punto fijo alcanza |f'(x*)| = 1 y el punto fijo se vuelve inestable: aparece una órbita de periodo 2.",
        },
      },
      {
        id: 'm2-l2',
        title: { es: 'La cascada de duplicación', en: 'The doubling cascade' },
        intro: {
          es: 'Periodo 2 → 4 → 8 → … cada vez más rápido.',
          en: 'Period 2 → 4 → 8 → … faster and faster.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Al aumentar r, el ciclo de periodo 2 pierde estabilidad en r ≈ 3.449 y cada punto se duplica, generando periodo 4. En r ≈ 3.544, periodo 8. Los valores de r donde ocurre cada duplicación se acumulan cada vez más rápido.',
            },
            {
              type: 'latex',
              content:
                'r_1 = 3.0 \\; \\to \\; r_2 = 3.449 \\; \\to \\; r_3 = 3.544 \\; \\to \\; r_4 = 3.564 \\; \\to \\; \\ldots',
            },
            {
              type: 'paragraph',
              content:
                'Haz zoom en el diagrama de bifurcación: cada rama repite, a menor escala, la estructura completa. Esta autosimilitud es la firma del caos determinista.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'As r grows, the period-2 cycle loses stability at r ≈ 3.449 and each point doubles, producing period 4. At r ≈ 3.544, period 8. The r values where each doubling occurs accumulate faster and faster.',
            },
            {
              type: 'latex',
              content:
                'r_1 = 3.0 \\; \\to \\; r_2 = 3.449 \\; \\to \\; r_3 = 3.544 \\; \\to \\; r_4 = 3.564 \\; \\to \\; \\ldots',
            },
            {
              type: 'paragraph',
              content:
                'Zoom into the bifurcation diagram: each branch repeats, at a smaller scale, the whole structure. This self-similarity is the fingerprint of deterministic chaos.',
            },
          ],
        },
        keyPoints: {
          es: [
            'Las bifurcaciones se acumulan en r∞ ≈ 3.5699.',
            'El diagrama es autosimilar: repite su estructura a menor escala.',
          ],
          en: [
            'Bifurcations accumulate at r∞ ≈ 3.5699.',
            'The diagram is self-similar: it repeats its structure at smaller scales.',
          ],
        },
      },
      {
        id: 'm2-l3',
        title: { es: 'La constante de Feigenbaum', en: 'The Feigenbaum constant' },
        intro: {
          es: 'Una razón universal que gobierna la cascada en toda familia unimodal.',
          en: 'A universal ratio governing the cascade in every unimodal family.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'La distancia entre bifurcaciones consecutivas se encoge con una razón que tiende a una constante universal:',
            },
            {
              type: 'latex',
              content:
                '\\delta = \\lim_{n\\to\\infty} \\frac{r_{n} - r_{n-1}}{r_{n+1} - r_{n}} \\approx 4.6692016',
            },
            {
              type: 'paragraph',
              content:
                'Lo sorprendente es que δ no depende de la función: el mapa logístico, el seno r·sin(πx), el cúbico y el de Ricker comparten exactamente la misma constante. Es la evidencia más clara de la universalidad del caos.',
            },
            {
              type: 'aside',
              content:
                'En el laboratorio, activa la curva de Lyapunov y observa cómo cruza a valores positivos justo en el límite de acumulación r∞ ≈ 3.57.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The distance between consecutive bifurcations shrinks with a ratio that tends to a universal constant:',
            },
            {
              type: 'latex',
              content:
                '\\delta = \\lim_{n\\to\\infty} \\frac{r_{n} - r_{n-1}}{r_{n+1} - r_{n}} \\approx 4.6692016',
            },
            {
              type: 'paragraph',
              content:
                'The surprise is that δ does not depend on the function: the logistic map, the sine map r·sin(πx), the cubic and Ricker maps share exactly the same constant. It is the clearest evidence of the universality of chaos.',
            },
            {
              type: 'aside',
              content:
                'In the laboratory, enable the Lyapunov curve and watch it cross to positive values right at the accumulation limit r∞ ≈ 3.57.',
            },
          ],
        },
        keyPoints: {
          es: [
            'δ ≈ 4.6692 es universal.',
            'Logístico, seno, cúbico y Ricker comparten la misma ruta.',
          ],
          en: [
            'δ ≈ 4.6692 is universal.',
            'Logistic, sine, cubic and Ricker share the same route.',
          ],
        },
        demo: { modelId: 'logistic', r: 3.57, label: 'Límite de Feigenbaum' },
        quiz: {
          question: '¿Qué afirma la constante de Feigenbaum δ ≈ 4.6692?',
          options: [
            { text: 'Es el número de bifurcaciones del mapa logístico', correct: false },
            {
              text: 'La razón de intervalos de bifurcación tiende a δ en cualquier familia unimodal suave',
              correct: true,
            },
            { text: 'Es la tasa de crecimiento máxima del logístico', correct: false },
            { text: 'Solo es válida para el mapa seno', correct: false },
          ],
          explanation:
            'δ es la razón límite (rₙ − rₙ₋₁)/(rₙ₊₁ − rₙ) y es la misma para toda familia unimodal suave: universalidad del caos.',
        },
      },
    ],
  },
  {
    id: 'm3',
    icon: '📈',
    title: { es: 'Lyapunov y sensibilidad', en: 'Lyapunov & sensitivity' },
    summary: {
      es: 'El exponente de Lyapunov, el efecto mariposa y cómo medir el caos.',
      en: 'The Lyapunov exponent, the butterfly effect and how to measure chaos.',
    },
    lessons: [
      {
        id: 'm3-l1',
        title: { es: 'El exponente de Lyapunov', en: 'The Lyapunov exponent' },
        intro: {
          es: 'Un número que cuantifica la separación de órbitas vecinas.',
          en: 'A number that quantifies the divergence of nearby orbits.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El exponente de Lyapunov promedia el logaritmo de la pendiente del mapa a lo largo de la órbita:',
            },
            {
              type: 'latex',
              content:
                "\\lambda = \\lim_{N\\to\\infty} \\frac{1}{N} \\sum_{i=1}^{N} \\ln \\left| f'(x_i) \\right|",
            },
            {
              type: 'paragraph',
              content:
                'Si λ < 0, las órbitas vecinas se acercan (atractor periódico); si λ = 0, estamos en un punto crítico de bifurcación; si λ > 0, se separan exponencialmente: caos.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The Lyapunov exponent averages the logarithm of the map slope along the orbit:',
            },
            {
              type: 'latex',
              content:
                "\\lambda = \\lim_{N\\to\\infty} \\frac{1}{N} \\sum_{i=1}^{N} \\ln \\left| f'(x_i) \\right|",
            },
            {
              type: 'paragraph',
              content:
                'If λ < 0, nearby orbits converge (periodic attractor); if λ = 0, we are at a critical bifurcation point; if λ > 0, they separate exponentially: chaos.',
            },
          ],
        },
        keyPoints: {
          es: [
            'λ < 0: atractor periódico; λ > 0: caos.',
            'El Inspector muestra λ en tiempo real para cada r.',
          ],
          en: [
            'λ < 0: periodic attractor; λ > 0: chaos.',
            'The Inspector shows λ in real time for every r.',
          ],
        },
      },
      {
        id: 'm3-l2',
        title: { es: 'El efecto mariposa', en: 'The butterfly effect' },
        intro: {
          es: 'Errores microscópicos que crecen exponencialmente.',
          en: 'Microscopic errors that grow exponentially.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Si dos condiciones iniciales difieren en δ₀, tras n pasos su separación crece como δ ≈ δ₀·e^{λn}. Con λ > 0, un error de una millonésima puede dominar la evolución en pocas decenas de pasos.',
            },
            {
              type: 'latex',
              content: '\\delta_n \\approx \\delta_0 \\, e^{\\lambda n}',
            },
            {
              type: 'paragraph',
              content:
                'Esta es la razón por la que el clima a largo plazo es impredecible: los modelos son deterministas, pero los errores de medida se amplifican. Lorenz lo llamó "efecto mariposa": el aleteo de una mariposa puede, en principio, alterar un huracán.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'If two initial conditions differ by δ₀, after n steps their separation grows as δ ≈ δ₀·e^{λn}. With λ > 0, a one-in-a-million error can dominate the evolution within a few tens of steps.',
            },
            {
              type: 'latex',
              content: '\\delta_n \\approx \\delta_0 \\, e^{\\lambda n}',
            },
            {
              type: 'paragraph',
              content:
                'This is why long-term weather is unpredictable: the models are deterministic, but measurement errors get amplified. Lorenz called it the "butterfly effect": the flap of a butterfly could, in principle, alter a hurricane.',
            },
          ],
        },
        keyPoints: {
          es: [
            'La separación de órbitas crece como e^{λn}.',
            'Sensibilidad extrema ⇒ límite fundamental a la predicción.',
          ],
          en: [
            'Orbit separation grows like e^{λn}.',
            'Extreme sensitivity ⇒ fundamental prediction limit.',
          ],
        },
      },
      {
        id: 'm3-l3',
        title: {
          es: 'Midiendo el caos en el laboratorio',
          en: 'Measuring chaos in the laboratory',
        },
        intro: {
          es: 'Usa la curva de Lyapunov para localizar las regiones caóticas.',
          en: 'Use the Lyapunov curve to locate the chaotic regions.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En el diagrama de bifurcación, activa la opción Lyapunov. La curva ámbar muestra λ(r): donde es positiva, el diagrama es una nube densa (caos); donde es negativa, hay ramas periódicas definidas.',
            },
            {
              type: 'paragraph',
              content:
                'Ajusta r = 3.9: λ > 0 y la órbita recorre una nube. Luego r = 3.2: λ < 0 y la órbita alterna entre dos valores. El Inspector identifica el periodo de la órbita automáticamente.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'In the bifurcation diagram, enable the Lyapunov option. The amber curve shows λ(r): where it is positive, the diagram is a dense cloud (chaos); where negative, there are well-defined periodic branches.',
            },
            {
              type: 'paragraph',
              content:
                'Set r = 3.9: λ > 0 and the orbit sweeps a cloud. Then r = 3.2: λ < 0 and the orbit alternates between two values. The Inspector identifies the orbit period automatically.',
            },
          ],
        },
        keyPoints: {
          es: [
            'La curva de Lyapunov es el "termómetro" del caos.',
            'Comprueba r = 3.9 (caos) vs r = 3.2 (periodo 2).',
          ],
          en: [
            'The Lyapunov curve is the "thermometer" of chaos.',
            'Check r = 3.9 (chaos) vs r = 3.2 (period 2).',
          ],
        },
        demo: { modelId: 'logistic', r: 3.9, label: 'Régimen caótico (λ > 0)' },
        quiz: {
          question: 'Si λ > 0 para un parámetro r, el sistema:',
          options: [
            { text: 'Converge a un punto fijo estable', correct: false },
            { text: 'Es caótico: las órbitas vecinas divergen exponencialmente', correct: true },
            { text: 'Se apaga por completo', correct: false },
            { text: 'Oscila con periodo exactamente 1', correct: false },
          ],
          explanation:
            'λ > 0 indica divergencia exponencial de órbitas vecinas, la definición operativa del caos determinista.',
        },
      },
    ],
  },
  {
    id: 'm4',
    icon: '🌀',
    title: { es: 'Caos, atractores y universalidad', en: 'Chaos, attractors & universality' },
    summary: {
      es: 'Qué es el caos determinista, las ventanas de orden y la universalidad.',
      en: 'What deterministic chaos is, order windows and universality.',
    },
    lessons: [
      {
        id: 'm4-l1',
        title: { es: '¿Qué es el caos determinista?', en: 'What is deterministic chaos?' },
        intro: {
          es: 'Determinismo no implica predictibilidad.',
          en: 'Determinism does not imply predictability.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Caos determinista es el comportamiento aperiódico y sensible a las condiciones iniciales de un sistema regido por reglas exactas. No hay azar: con la misma x₀, la órbita es idéntica. Pero cualquier error inicial, por pequeño que sea, se amplifica.',
            },
            {
              type: 'paragraph',
              content:
                'Tres ingredientes definen el caos: (1) sensibilidad a las condiciones iniciales, (2) aperiodicidad (la órbita no se repite), y (3) estructura determinista (la regla f es fija y precisa).',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Deterministic chaos is the aperiodic, initial-condition-sensitive behavior of a system governed by exact rules. There is no randomness: with the same x₀, the orbit is identical. But any initial error, however small, gets amplified.',
            },
            {
              type: 'paragraph',
              content:
                'Three ingredients define chaos: (1) sensitivity to initial conditions, (2) aperiodicity (the orbit never repeats), and (3) deterministic structure (the rule f is fixed and precise).',
            },
          ],
        },
        keyPoints: {
          es: [
            'Caos ≠ azar: hay regla exacta y órbita única.',
            'Sensibilidad + aperiodicidad + determinismo.',
          ],
          en: [
            'Chaos ≠ randomness: exact rule and unique orbit.',
            'Sensitivity + aperiodicity + determinism.',
          ],
        },
      },
      {
        id: 'm4-l2',
        title: { es: 'Ventanas de orden dentro del caos', en: 'Order windows inside chaos' },
        intro: {
          es: 'Periodo 3 implica caos: el teorema de Li–Yorke.',
          en: 'Period 3 implies chaos: the Li–Yorke theorem.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En r ≈ 3.83, dentro del mar caótico, emerge de repente una ventana periódica de periodo 3. El teorema de Li–Yorke (1975) demostró un hecho profundo: si un mapa continuo en el intervalo tiene una órbita de periodo 3, entonces tiene órbitas de todos los periodos.',
            },
            {
              type: 'latex',
              content: '\\text{Periodo 3 } \\Rightarrow \\text{ caos (Li--Yorke, 1975)}',
            },
            {
              type: 'paragraph',
              content:
                'Localiza la ventana en el laboratorio (r ≈ 3.83): verás tres ramas nítidas rodeadas de caos. Dentro de cada rama, al acercarte, hay nuevas cascadas: caos dentro de orden dentro de caos.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'At r ≈ 3.83, inside the chaotic sea, a period-3 window suddenly emerges. The Li–Yorke theorem (1975) proved a deep fact: if a continuous interval map has a period-3 orbit, then it has orbits of every period.',
            },
            {
              type: 'latex',
              content: '\\text{Period 3 } \\Rightarrow \\text{ chaos (Li--Yorke, 1975)}',
            },
            {
              type: 'paragraph',
              content:
                'Locate the window in the laboratory (r ≈ 3.83): you will see three crisp branches surrounded by chaos. Inside each branch, zooming in reveals new cascades: chaos within order within chaos.',
            },
          ],
        },
        keyPoints: {
          es: ['Periodo 3 ⇒ caos (Li–Yorke).', 'La ventana r ≈ 3.83 es caos dentro de orden.'],
          en: ['Period 3 ⇒ chaos (Li–Yorke).', 'The r ≈ 3.83 window is order inside chaos.'],
        },
        demo: { modelId: 'logistic', r: 3.83, label: 'Ventana de periodo 3' },
      },
      {
        id: 'm4-l3',
        title: { es: 'La universalidad del caos', en: 'The universality of chaos' },
        intro: {
          es: 'La misma ruta al caos en familias muy distintas.',
          en: 'The same route to chaos in very different families.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Cambia el modelo en el laboratorio: seno (r·sin(πx)), cúbico (r·x(1−x²)), Ricker (r·x·e^(−x)) o polinómico. Todos muestran la misma cascada de duplicación de periodo y la misma constante de Feigenbaum.',
            },
            {
              type: 'paragraph',
              content:
                'Esta universalidad hace del caos un fenómeno transversal a disciplinas: matemáticas, física, biología, ingeniería y economía comparten la misma fenomenología aunque las ecuaciones concretas sean distintas.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Change the model in the laboratory: sine (r·sin(πx)), cubic (r·x(1−x²)), Ricker (r·x·e^(−x)) or polynomial. They all show the same period-doubling cascade and the same Feigenbaum constant.',
            },
            {
              type: 'paragraph',
              content:
                'This universality makes chaos a cross-cutting phenomenon: mathematics, physics, biology, engineering and economics share the same phenomenology even though the concrete equations differ.',
            },
          ],
        },
        keyPoints: {
          es: [
            'La ruta al caos es universal entre familias unimodales.',
            'δ ≈ 4.6692 conecta disciplinas muy distintas.',
          ],
          en: [
            'The route to chaos is universal among unimodal families.',
            'δ ≈ 4.6692 bridges very different disciplines.',
          ],
        },
        demo: { modelId: 'sine', r: 0.72, label: 'Cascada en el mapa seno' },
      },
    ],
  },
  {
    id: 'm5',
    icon: '🧭',
    title: { es: 'Espiral Áurea: el atlas complejo', en: 'The Golden Spiral atlas' },
    summary: {
      es: 'Del eje real al plano complejo: la Espiral Áurea como atlas de órbitas.',
      en: 'From the real axis to the complex plane: the Golden Spiral as an atlas of orbits.',
    },
    lessons: [
      {
        id: 'm5-l1',
        title: { es: 'De los reales al plano complejo', en: 'From the reals to the complex plane' },
        intro: {
          es: 'Iterar con números complejos abre un universo nuevo.',
          en: 'Iterating with complex numbers opens a new universe.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El conjunto de Mandelbrot se define iterando z_{n+1} = zₙ² + c con c complejo. Si la órbita que parte de z₀ = 0 no escapa al infinito, el punto c pertenece al conjunto. El color de cada punto depende de la velocidad de escape.',
            },
            {
              type: 'latex',
              content: 'z_{n+1} = z_n^2 + c, \\qquad z_0 = 0, \\qquad c \\in \\mathbb{C}',
            },
            {
              type: 'paragraph',
              content:
                'En el laboratorio puedes hacer zoom en el Mandelbrot infinitamente: la frontera es un fractal, con autosimilitud a todas las escalas.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The Mandelbrot set is defined by iterating z_{n+1} = zₙ² + c with complex c. If the orbit starting at z₀ = 0 does not escape to infinity, then c belongs to the set. The color of each point depends on the escape speed.',
            },
            {
              type: 'latex',
              content: 'z_{n+1} = z_n^2 + c, \\qquad z_0 = 0, \\qquad c \\in \\mathbb{C}',
            },
            {
              type: 'paragraph',
              content:
                'In the laboratory you can zoom into the Mandelbrot set forever: the boundary is a fractal, self-similar at every scale.',
            },
          ],
        },
        keyPoints: {
          es: [
            'Espiral Áurea: c complejo cuya órbita desde 0 no escapa.',
            'La frontera es un fractal infinitamente detallado.',
          ],
          en: [
            'Golden Spiral: complex c whose orbit from 0 does not escape.',
            'The boundary is an infinitely detailed fractal.',
          ],
        },
      },
      {
        id: 'm5-l2',
        title: { es: 'El isomorfismo exacto', en: 'The exact isomorphism' },
        intro: {
          es: 'Un cambio de variable conecta el logístico con Mandelbrot.',
          en: 'A change of variables connects the logistic map with Mandelbrot.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Aplicando el cambio de variable z = −r·x + r/2 al mapa logístico se obtiene, tras reescalar, la iteración cuadrática z² + c con:',
            },
            {
              type: 'latex',
              content:
                'c = \\frac{2r - r^2}{4} \\quad \\Longleftrightarrow \\quad r = 1 + \\sqrt{1 - 4c}',
            },
            {
              type: 'paragraph',
              content:
                'Esta conjugación exacta significa que la dinámica del logístico y la del eje real de la Espiral Áurea son la misma bajo un cambio de coordenadas. El laboratorio muestra el conector r ↔ c en tiempo real.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Applying the change of variables z = −r·x + r/2 to the logistic map yields, after rescaling, the quadratic iteration z² + c with:',
            },
            {
              type: 'latex',
              content:
                'c = \\frac{2r - r^2}{4} \\quad \\Longleftrightarrow \\quad r = 1 + \\sqrt{1 - 4c}',
            },
            {
              type: 'paragraph',
              content:
                'This exact conjugacy means the logistic dynamics and the Mandelbrot real axis are the same under a change of coordinates. The laboratory shows the r ↔ c connector in real time.',
            },
          ],
        },
        keyPoints: {
          es: [
            'c = (2r − r²)/4 es una conjugación exacta.',
            'El conector r ↔ c es la "traducción" entre ambos mundos.',
          ],
          en: [
            'c = (2r − r²)/4 is an exact conjugacy.',
            'The r ↔ c connector is the "translation" between both worlds.',
          ],
        },
      },
      {
        id: 'm5-l3',
        title: {
          es: 'El eje real como atlas de bifurcaciones',
          en: 'The real axis as an atlas of bifurcations',
        },
        intro: {
          es: 'Cada disco de la Espiral Áurea es un ciclo límite cuadrático.',
          en: 'Every bulb of the Golden Spiral is a quadratic limit cycle.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El eje real de la Espiral Áurea es un mapa topológico de la duplicación de periodo: el cardioide principal corresponde a puntos fijos estables (periodo 1), el disco izquierdo a periodo 2, y cada disco más pequeño a periodos cada vez mayores.',
            },
            {
              type: 'paragraph',
              content:
                'Comprueba en el laboratorio: c = −0.75 (periodo 2), c = −1.25 (periodo 4), c = −1.401 (límite caótico) y c = −1.75 (ventana de periodo 3). Haz clic sobre el eje real para mover el sistema al punto exacto.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The Golden Spiral real axis is a topological map of period doubling: the main cardioid corresponds to stable fixed points (period 1), the left bulb to period 2, and each smaller bulb to larger and larger periods.',
            },
            {
              type: 'paragraph',
              content:
                'Check it in the laboratory: c = −0.75 (period 2), c = −1.25 (period 4), c = −1.401 (chaos threshold) and c = −1.75 (period-3 window). Click on the real axis to move the system to the exact point.',
            },
          ],
        },
        keyPoints: {
          es: [
            'El eje real de la Espiral Áurea cartografía todas las bifurcaciones cuadráticas.',
            'c = −0.75, −1.25, −1.401 y −1.75 son los hitos clave.',
          ],
          en: [
            'The Golden Spiral real axis maps all quadratic bifurcations.',
            'c = −0.75, −1.25, −1.401 and −1.75 are the key milestones.',
          ],
        },
        demo: { modelId: 'logistic', r: 3.0, label: 'c = −0.75 (frontera periodo 1 → 2)' },
        quiz: {
          question: '¿Qué representa el punto c = −0.75 del eje real de Mandelbrot?',
          options: [
            { text: 'El límite exterior del conjunto', correct: false },
            {
              text: 'La frontera entre el cardioide y el disco de periodo 2 (primera bifurcación)',
              correct: true,
            },
            { text: 'El centro exacto del conjunto', correct: false },
            { text: 'Una región caótica total', correct: false },
          ],
          explanation:
            'Con el isomorfismo, r = 3.0 corresponde a c = −0.75, el punto donde nace la duplicación de periodo 1 → 2.',
        },
      },
    ],
  },
  {
    id: 'm6',
    icon: '🏭',
    title: { es: 'Aplicaciones reales', en: 'Real-world applications' },
    summary: {
      es: 'De la teoría a la ingeniería, la ecología y la criptografía.',
      en: 'From theory to engineering, ecology and cryptography.',
    },
    lessons: [
      {
        id: 'm6-l1',
        title: { es: 'Convertidores de potencia', en: 'Power converters' },
        intro: {
          es: 'Rizado caótico en convertidores DC–DC.',
          en: 'Chaotic ripple in DC–DC converters.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'En convertidores conmutados (buck/boost) regulados por PWM, la corriente del inductor puede presentar duplicación de periodo al aumentar la ganancia del lazo de control. El rizado resultante es caótico y genera ruido electromagnético.',
            },
            {
              type: 'paragraph',
              content:
                'Comprender este régimen permite diseñar controladores que eviten las regiones caóticas o que las usen deliberadamente para reducir picos de conmutación.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'In switched converters (buck/boost) regulated by PWM, the inductor current can undergo period doubling as the control-loop gain increases. The resulting ripple is chaotic and produces electromagnetic noise.',
            },
            {
              type: 'paragraph',
              content:
                'Understanding this regime lets engineers design controllers that avoid chaotic regions or deliberately exploit them to reduce switching peaks.',
            },
          ],
        },
        keyPoints: {
          es: [
            'La ganancia del lazo puede inducir rizado caótico.',
            'Los controladores deben evitar o dominar el caos.',
          ],
          en: ['Loop gain can induce chaotic ripple.', 'Controllers must avoid or tame the chaos.'],
        },
        demo: { modelId: 'logistic', r: 3.57, label: 'Rizado caótico en convertidores' },
      },
      {
        id: 'm6-l2',
        title: { es: 'Reactores químicos', en: 'Chemical reactors' },
        intro: {
          es: 'Oscilaciones aperiódicas en reactores CSTR.',
          en: 'Aperiodic oscillations in CSTR reactors.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'Los reactores continuos de tanque agitado (CSTR) con reacciones autocatalíticas exotérmicas pueden oscilar de forma aperiódica: la concentración y la temperatura nunca se repiten exactamente.',
            },
            {
              type: 'paragraph',
              content:
                'El control de temperatura se vuelve crítico: en la región caótica, pequeñas perturbaciones se amplifican y el reactor puede abandonar el punto de operación seguro.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'Continuous stirred-tank reactors (CSTR) with exothermic autocatalytic reactions can oscillate aperiodically: concentration and temperature never repeat exactly.',
            },
            {
              type: 'paragraph',
              content:
                'Temperature control becomes critical: in the chaotic region, small perturbations are amplified and the reactor can leave its safe operating point.',
            },
          ],
        },
        keyPoints: {
          es: [
            'CSTR autocatalítico ⇒ oscilaciones aperiódicas.',
            'El control debe evitar la región caótica.',
          ],
          en: [
            'Autocatalytic CSTR ⇒ aperiodic oscillations.',
            'Control must avoid the chaotic region.',
          ],
        },
      },
      {
        id: 'm6-l3',
        title: { es: 'Vibraciones y poblaciones', en: 'Vibrations & populations' },
        intro: {
          es: 'Duffing y Ricker: la misma fenomenología en mecánica y ecología.',
          en: 'Duffing and Ricker: the same phenomenology in mechanics and ecology.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El oscilador de Duffing (mecánica estructural) y el mapa de Ricker (ecología) comparten la firma del caos: bifurcaciones, ventanas periódicas y sensibilidad a las condiciones iniciales.',
            },
            {
              type: 'paragraph',
              content:
                'Para poblaciones con alta tasa de reproducción, el modelo de Ricker predice fluctuaciones extremas que aumentan el riesgo de colapso ecológico. La teoría del caos explica por qué algunas poblaciones fluctúan de forma irregular sin una causa externa.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The Duffing oscillator (structural mechanics) and the Ricker map (ecology) share the fingerprint of chaos: bifurcations, periodic windows and sensitivity to initial conditions.',
            },
            {
              type: 'paragraph',
              content:
                'For populations with a high reproduction rate, the Ricker model predicts extreme fluctuations that increase the risk of ecological collapse. Chaos theory explains why some populations fluctuate irregularly with no external cause.',
            },
          ],
        },
        keyPoints: {
          es: [
            'Duffing y Ricker comparten la firma del caos.',
            'Alta fecundidad ⇒ fluctuaciones extremas y riesgo de colapso.',
          ],
          en: [
            'Duffing and Ricker share chaos fingerprint.',
            'High fecundity ⇒ extreme fluctuations and collapse risk.',
          ],
        },
      },
      {
        id: 'm6-l4',
        title: { es: 'Criptografía y óptica', en: 'Cryptography & optics' },
        intro: {
          es: 'El caos como fuente de entropía y modulación.',
          en: 'Chaos as a source of entropy and modulation.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'La sensibilidad extrema del caos se usa en criptografía: generadores pseudoaleatorios (PRNG) basados en mapas caóticos producen secuencias impredecibles para cifrado. En óptica, la modulación no lineal de fase en fibras introduce jitter que debe modelarse.',
            },
            {
              type: 'paragraph',
              content:
                'En el laboratorio, el mapa de Bernoulli r·x mod 1 es el ejemplo canónico: secuencias binarias con entropía máxima para aplicaciones criptográficas.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The extreme sensitivity of chaos is used in cryptography: pseudorandom generators (PRNGs) based on chaotic maps produce unpredictable sequences for encryption. In optics, nonlinear phase modulation in fibers introduces jitter that must be modeled.',
            },
            {
              type: 'paragraph',
              content:
                'In the laboratory, the Bernoulli map r·x mod 1 is the canonical example: binary sequences with maximum entropy for cryptographic applications.',
            },
          ],
        },
        keyPoints: {
          es: [
            'PRNGs caóticos: secuencias impredecibles para cifrado.',
            'El mapa de Bernoulli es el ejemplo canónico de máxima entropía.',
          ],
          en: [
            'Chaotic PRNGs: unpredictable sequences for encryption.',
            'The Bernoulli map is the canonical maximum-entropy example.',
          ],
        },
        demo: { modelId: 'bernoulli', r: 2.0, label: 'Mapa de Bernoulli (duplicador)' },
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════
  // MODULE 7 — Las Matemáticas Suena (connects with Sonifier)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'm7',
    icon: '🎵',
    title: { es: 'Las Matemáticas Suena', en: 'Mathematics Sounds' },
    summary: {
      es: 'Cómo las dinámicas no lineales generan melodías y por qué el caos suena diferente al orden.',
      en: 'How nonlinear dynamics generates melodies and why chaos sounds different from order.',
    },
    lessons: [
      {
        id: 'm7-l1',
        title: { es: 'Órbitas que generan melodías', en: 'Orbits that generate melodies' },
        intro: {
          es: 'Al mapear los valores de la órbita a notas musicales, la matemática se convierte en música.',
          en: 'When orbit values are mapped to musical notes, mathematics becomes music.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El laboratorio sonifica la órbita del mapa activo: cada valor xₙ se cuantiza a una nota musical de la escala seleccionada (pentatónica menor, menor natural, lidio, etc.). La frecuencia se calcula a partir de la posición de la nota en la escala dentro de un rango de 2-3 octavas.',
            },
            {
              type: 'latex',
              content:
                'f = f_0 \\cdot 2^{\\frac{s + 12 \\cdot \\text{oct}}{12}} \\qquad f_0 = 220\\text{ Hz (La}_3\\text{)}',
            },
            {
              type: 'paragraph',
              content:
                'En régimen estable (λ < 0), la órbita se repite → la melodía se repite cíclicamente. En período 2, alternan 2 notas; en período 3, 3 notas que forman un arpegio. En caos, la secuencia es aperiódica: suena como improvisación.',
            },
            {
              type: 'aside',
              content:
                'Prueba en el laboratorio: activa la sonificación y desplaza r entre 3.2 (período 2, melodía estable), 3.83 (período 3, arpegio) y 3.9 (caos, improvisación). Escucha el contraste.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                "The laboratory sonifies the active map's orbit: each xₙ value is quantized to a note in the selected scale (pentatonic minor, natural minor, lydian, etc.). Frequency is calculated from the note's position in the scale within a 2-3 octave range.",
            },
            {
              type: 'latex',
              content:
                'f = f_0 \\cdot 2^{\\frac{s + 12 \\cdot \\text{oct}}{12}} \\qquad f_0 = 220\\text{ Hz (A}_3\\text{)}',
            },
            {
              type: 'paragraph',
              content:
                'In stable regime (λ < 0), the orbit repeats → the melody repeats cyclically. In period-2, 2 notes alternate; in period-3, 3 notes form an arpeggio. In chaos, the sequence is aperiodic: it sounds like improvisation.',
            },
            {
              type: 'aside',
              content:
                'Try it in the lab: enable sonification and sweep r between 3.2 (period 2, stable melody), 3.83 (period 3, arpeggio), and 3.9 (chaos, improvisation).',
            },
          ],
        },
        keyPoints: {
          es: [
            'La cuantización de la órbita a notas musicales crea melodías que reflejan la dinámica.',
            'Régimen estable = melodía cíclica; período = arpegio; caos = improvisación.',
            'La escala pentatónica menor suena suave; la cromática, densa y disonante.',
          ],
          en: [
            'Quantizing the orbit to musical notes creates melodies reflecting the dynamics.',
            'Stable regime = cyclic melody; period = arpeggio; chaos = improvisation.',
            'Minor pentatonic sounds smooth; chromatic sounds dense and dissonant.',
          ],
        },
        demo: { modelId: 'logistic', r: 3.2, label: 'Período 2 — melodía estable' },
        quiz: {
          question: '¿Qué suena al cuantizar la órbita logística en r = 3.9 (caos)?',
          options: [
            { text: 'Una melodía cíclica que se repite cada 2 notas', correct: false },
            { text: 'Un arpegio de 3 notas que se repite', correct: false },
            {
              text: 'Una secuencia aperiódica que suena como improvisación caótica',
              correct: true,
            },
            { text: 'Silencio porque la órbita diverge', correct: false },
          ],
          explanation:
            'Con λ > 0, la órbita es aperiódica. Al cuantizar cada valor a una nota, la secuencia musical también es aperiódica, sonando como improvisación caótica.',
        },
      },
      {
        id: 'm7-l2',
        title: {
          es: 'El contraste caos-orden por el sonido',
          en: 'The chaos-order contrast through sound',
        },
        intro: {
          es: 'El sonido hace palpable el contraste entre orden y caos: es una experiencia auditiva de la sensibilidad a condiciones iniciales.',
          en: 'Sound makes the contrast between order and chaos tangible: an auditory experience of sensitivity to initial conditions.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'La sonificación usa un sintetizador de piano realista con 5 armónicos y envolvente ADSR. El volumen varía con el exponente de Lyapunov: en órbitas estables (λ < -0.5) suena en piano suave; en caos (λ > 0.05) suena en forte.',
            },
            {
              type: 'paragraph',
              content:
                'Esta diferencia dinámica hace que el contraste entre orden y caos se oiga como contraste musical: suave vs. intenso, predecible vs. inesperado. El estudiante puede cerrar los ojos y distinguir los regímenes solo por el sonido.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The sonification uses a realistic piano synthesizer with 5 harmonics and an ADSR envelope. Volume varies with the Lyapunov exponent: stable orbits (λ < -0.5) play softly; chaos (λ > 0.05) plays forte.',
            },
            {
              type: 'paragraph',
              content:
                'This dynamic contrast makes the chaos-order contrast audible: soft vs intense, predictable vs unpredictable. Students can close their eyes and distinguish regimes by sound alone.',
            },
          ],
        },
        keyPoints: {
          es: [
            'El volumen se modula con λ: piano en órbitas estables, forte en caos.',
            'El contraste sonoro refuerza la comprensión intuitiva de la sensibilidad a C.I.',
            'Se puede distinguir el régimen solo con el oído.',
          ],
          en: [
            'Volume modulates with λ: piano for stable orbits, forte for chaos.',
            'Sound contrast reinforces intuitive understanding of sensitivity to initial conditions.',
            'The regime can be distinguished by ear alone.',
          ],
        },
        demo: { modelId: 'logistic', r: 3.5, label: 'Transición caos ↔ orden' },
      },
      {
        id: 'm7-l3',
        title: {
          es: 'Escalas musicales y dinámica no lineal',
          en: 'Musical scales and nonlinear dynamics',
        },
        intro: {
          es: 'Cada escala musical crea un color sonoro diferente para la misma dinámica, revelando aspectos distintos del comportamiento caótico.',
          en: 'Each musical scale creates a different sound-color for the same dynamics, revealing distinct aspects of chaotic behavior.',
        },
        blocks: {
          es: [
            {
              type: 'paragraph',
              content:
                'El laboratorio ofrece 8 escalas: pentatónica menor (suave), menor natural (clásico), lidio (etéreo), blues (soul), cromática (densa) y acordes de piano. Cada una mapea los valores de la órbita a notas diferentes, generando melodías distintas.',
            },
            {
              type: 'paragraph',
              content:
                'Los presets de estilo (Melancólica de Einaudi, Clásica de Beethoven, Serenata de Debussy) combinan escala + tempo + timbre para evocar el carácter de cada compositor. En período 3, la cuantización produce notas que recuerdan el tema principal de "Für Elise" de Beethoven.',
            },
            {
              type: 'aside',
              content:
                'Experimenta: selecciona "Lidio" en el laboratorio y compara con "Cromática" en la misma órbita. El lidio suena etéreo y luminoso; el cromático su denso y tenso.',
            },
          ],
          en: [
            {
              type: 'paragraph',
              content:
                'The laboratory offers 8 scales: minor pentatonic (smooth), natural minor (classical), lydian (ethereal), blues (soul), chromatic (dense) and piano chords. Each maps orbit values to different notes, generating different melodies.',
            },
            {
              type: 'paragraph',
              content:
                'Style presets (Einaudi Melancholy, Beethoven Classical, Debussy Serenade) combine scale + tempo + timbre to evoke each composer\'s character. In period 3, quantization produces notes reminiscent of "Für Elise."',
            },
            {
              type: 'aside',
              content:
                'Experiment: select "Lydian" in the lab and compare with "Chromatic" on the same orbit. Lydian sounds ethereal and luminous; chromatic sounds dense and tense.',
            },
          ],
        },
        keyPoints: {
          es: [
            'Cada escala musical crea un color sonoro diferente para la misma dinámica.',
            'Los presets de estilo combinan escala + tempo + timbre para evocar compositores.',
            'La música refleja la estructura matemática subyacente de la órbita.',
          ],
          en: [
            'Each musical scale creates a different sound-color for the same dynamics.',
            'Style presets combine scale + tempo + timbre to evoke composers.',
            'The music reflects the underlying mathematical structure of the orbit.',
          ],
        },
        takeaway: {
          es: 'La música y las matemáticas comparten la misma estructura: patrones, repeticiones, variaciones y rupturas. Las escalas musicales son a los mapas dinámicos lo que las paletas de color son a los fractales.',
          en: 'Music and mathematics share the same structure: patterns, repetitions, variations, and ruptures. Musical scales are to dynamic maps what color palettes are to fractals.',
        },
        demo: { modelId: 'logistic', r: 3.83, label: 'Período 3 — suena a "Für Elise"' },
        quiz: {
          question: '¿Qué preset de estilo suena más parecido a la música de Einaudi?',
          options: [
            { text: 'Clásica (Beethoven) — menor natural, rápido', correct: false },
            {
              text: 'Melancólica (Einaudi) — menor natural, tempo medio, timbre cálido',
              correct: true,
            },
            { text: 'Serenata (Debussy) — lidio, lento, suave', correct: false },
            { text: 'Ninguno se parece', correct: false },
          ],
          explanation:
            'El preset "Melancólica (Einaudi)" usa la escala menor natural con tempo medio (140ms) y timbre cálido (warmth 0.6), evocando el estilo melancólico y contemplativo de Einaudi.',
        },
      },
    ],
  },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Mapa iterado',
    es: 'Función que transforma un estado en el siguiente: x_{n+1} = f(x_n).',
    en: 'A function that maps a state to the next one: x_{n+1} = f(x_n).',
  },
  {
    term: 'Órbita',
    es: 'Sucesión de estados generada al iterar el mapa desde una condición inicial.',
    en: 'The sequence of states generated by iterating the map from an initial condition.',
  },
  {
    term: 'Punto fijo',
    es: 'Estado x* tal que f(x*) = x*.',
    en: 'A state x* such that f(x*) = x*.',
  },
  {
    term: 'Atractor',
    es: 'Conjunto hacia el que converge la órbita a largo plazo.',
    en: 'The set the orbit converges to in the long run.',
  },
  {
    term: 'Periodo',
    es: 'Número de estados distintos que se repiten en un ciclo.',
    en: 'The number of distinct states that repeat in a cycle.',
  },
  {
    term: 'Bifurcación',
    es: 'Cambio cualitativo de la dinámica al variar un parámetro.',
    en: 'A qualitative change of the dynamics as a parameter varies.',
  },
  {
    term: 'Duplicación de periodo',
    es: 'Ruta al caos en la que cada ciclo se duplica (2 → 4 → 8 → …).',
    en: 'The route to chaos where each cycle doubles (2 → 4 → 8 → …).',
  },
  {
    term: 'Constante de Feigenbaum',
    es: 'δ ≈ 4.6692: razón universal de intervalos entre bifurcaciones.',
    en: 'δ ≈ 4.6692: universal ratio of intervals between bifurcations.',
  },
  {
    term: 'Exponente de Lyapunov',
    es: 'Mide la divergencia exponencial de órbitas vecinas; λ > 0 indica caos.',
    en: 'Measures the exponential divergence of nearby orbits; λ > 0 indicates chaos.',
  },
  {
    term: 'Caos determinista',
    es: 'Comportamiento aperiódico y sensible a condiciones iniciales en un sistema determinista.',
    en: 'Aperiodic, initial-condition-sensitive behavior in a deterministic system.',
  },
  {
    term: 'Efecto mariposa',
    es: 'Amplificación exponencial de diferencias iniciales diminutas.',
    en: 'Exponential amplification of tiny initial differences.',
  },
  {
    term: 'Conjunto de Mandelbrot',
    es: 'Puntos c del plano complejo cuya órbita desde z₀ = 0 no escapa al iterar z² + c.',
    en: 'Complex c points whose orbit from z₀ = 0 does not escape when iterating z² + c.',
  },
  {
    term: 'Ventana periódica',
    es: 'Intervalo de parámetros con dinámica periódica dentro de una región caótica.',
    en: 'A parameter interval with periodic dynamics inside a chaotic region.',
  },
  {
    term: 'Isomorfismo',
    es: 'Correspondencia que preserva la dinámica entre dos sistemas.',
    en: 'A correspondence that preserves the dynamics between two systems.',
  },
  {
    term: 'Mapa unimodal',
    es: 'Función con un único máximo en el intervalo (como la campana del logístico).',
    en: 'A function with a single maximum on the interval (like the logistic bell).',
  },
  {
    term: 'Atractor extraño',
    es: 'Conjunto fractal hacia el que convergen las órbitas en sistemas caóticos, con dimensión fraccionaria.',
    en: 'A fractal set toward which orbits converge in chaotic systems, with fractional dimension.',
  },
  {
    term: 'Entropía topológica',
    es: 'Medida de la complejidad de la dinámica: cuánta información se pierde al observar el sistema a baja resolución.',
    en: 'Measure of dynamical complexity: how much information is lost observing the system at low resolution.',
  },
  {
    term: 'Conjugación topológica',
    es: 'Homeomorfismo que conjugá dos mapas dinámicos, preservando su estructura orbital.',
    en: 'A homeomorphism conjugating two dynamical maps, preserving their orbital structure.',
  },
  {
    term: 'Bifurcación de flip',
    es: 'Transición donde un punto fijo estable se vuelve inestable y nace un ciclo de periodo 2 (el punto fijo "da un vuelco").',
    en: 'Transition where a stable fixed point becomes unstable and a period-2 cycle is born (the fixed point "flips").',
  },
  {
    term: 'Transitorio',
    es: 'Fase inicial de la órbita antes de que el sistema se establezca en su comportamiento a largo plazo.',
    en: 'The initial phase of the orbit before the system settles into its long-term behavior.',
  },
  {
    term: 'Resolución de fase',
    es: 'Espacio multidimensional (xₙ, xₙ₊₁, xₙ₊₂, …) que revela la geometría del atractor.',
    en: 'Multidimensional space revealing the geometry of the attractor.',
  },
  {
    term: 'Sensibilidad a parámetros',
    es: 'Cambio cualitativo abrupto de la dinámica ante una tiny variación del parámetro r.',
    en: 'Abrupt qualitative change in dynamics upon a tiny variation of parameter r.',
  },
  {
    term: 'Modo musical',
    es: 'Conjunto de notas que define el "color sonoro" al mapear la órbita a frecuencias.',
    en: 'Set of notes defining the "sound-color" when mapping the orbit to frequencies.',
  },
  {
    term: 'Armadónico',
    es: 'Componente de frecuencia que no es exactamente múltiplo de la fundamental (como en las cuerdas de piano reales).',
    en: 'A frequency component that is not an exact integer multiple of the fundamental (like real piano strings).',
  },
  {
    term: 'Envolvente ADSR',
    es: 'Perfil temporal del volumen de una nota: Ataque, Decaimiento, Sostenimiento, Liberación.',
    en: 'Temporal volume profile of a note: Attack, Decay, Sustain, Release.',
  },
  {
    term: 'Sensibilidad a C.I.',
    es: 'Propiedad del caos: dos condiciones iniciales infinitesimalmente cercanas evolucionan exponencialmente lejos.',
    en: 'A property of chaos: two infinitesimally close initial conditions evolve exponentially far apart.',
  },
];

/** Convenience accessors used by the Learn view. */
export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}
