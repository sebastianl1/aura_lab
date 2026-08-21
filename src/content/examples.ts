/**
 * Curated examples for the "Ejemplos" tab: mathematical milestones and
 * real engineering cases. Each card opens the laboratory with a preset.
 */

export interface ExampleCase {
  id: string;
  icon: string;
  category: 'math' | 'engineering';
  title: { es: string; en: string };
  description: { es: string; en: string };
  modelId: string;
  r: number;
}

export const EXAMPLE_CASES: ExampleCase[] = [
  // ---- Mathematical milestones -------------------------------------------
  {
    id: 'ex-period2',
    icon: '🔁',
    category: 'math',
    title: { es: 'Periodo 2', en: 'Period 2' },
    description: {
      es: 'La primera bifurcación: el punto fijo se vuelve inestable y la órbita alterna entre dos valores.',
      en: 'The first bifurcation: the fixed point destabilizes and the orbit alternates between two values.',
    },
    modelId: 'logistic',
    r: 3.2,
  },
  {
    id: 'ex-feigenbaum',
    icon: '⚡',
    category: 'math',
    title: { es: 'Límite de Feigenbaum', en: 'Feigenbaum limit' },
    description: {
      es: 'La acumulación de la cascada 2 → 4 → 8 → … donde el caos hace su primera aparición.',
      en: 'The accumulation of the 2 → 4 → 8 → … cascade where chaos first appears.',
    },
    modelId: 'logistic',
    r: 3.5699,
  },
  {
    id: 'ex-period3',
    icon: '🎵',
    category: 'math',
    title: { es: 'Ventana de periodo 3', en: 'Period-3 window' },
    description: {
      es: 'Orden dentro del caos: "periodo 3 implica caos" (Teorema de Li–Yorke).',
      en: 'Order inside chaos: "period 3 implies chaos" (Li–Yorke theorem).',
    },
    modelId: 'logistic',
    r: 3.83,
  },
  {
    id: 'ex-chaos',
    icon: '🌀',
    category: 'math',
    title: { es: 'Caos pleno', en: 'Full chaos' },
    description: {
      es: 'Exponente de Lyapunov positivo: sensibilidad extrema a las condiciones iniciales.',
      en: 'Positive Lyapunov exponent: extreme sensitivity to initial conditions.',
    },
    modelId: 'logistic',
    r: 3.9,
  },
  {
    id: 'ex-tent',
    icon: '⛺',
    category: 'math',
    title: { es: 'Mapa tienda caótico', en: 'Chaotic tent map' },
    description: {
      es: 'El mapa lineal por tramos r·min(x, 1−x) totalmente caótico en r = 2.',
      en: 'The piecewise-linear map r·min(x, 1−x) fully chaotic at r = 2.',
    },
    modelId: 'tent',
    r: 2.0,
  },
  {
    id: 'ex-bernoulli',
    icon: '🔀',
    category: 'math',
    title: { es: 'Mapa duplicador (Bernoulli)', en: 'Doubling map (Bernoulli)' },
    description: {
      es: 'x_{n+1} = (2x) mod 1: el ejemplo canónico de caos con entropía máxima.',
      en: 'x_{n+1} = (2x) mod 1: the canonical example of maximum-entropy chaos.',
    },
    modelId: 'bernoulli',
    r: 2.0,
  },
  {
    id: 'ex-ricker',
    icon: '🌱',
    category: 'math',
    title: { es: 'Cascada de Ricker', en: 'Ricker cascade' },
    description: {
      es: 'El modelo poblacional unimodal con duplicación de periodo hacia el caos.',
      en: 'The unimodal population model with period doubling into chaos.',
    },
    modelId: 'ricker',
    r: 22.0,
  },
  {
    id: 'ex-cubic',
    icon: '🧊',
    category: 'math',
    title: { es: 'Cúbico y pitchfork', en: 'Cubic and pitchfork' },
    description: {
      es: 'La familia cúbica simétrica: pitchfork, duplicación de periodo y ventanas de orden.',
      en: 'The symmetric cubic family: pitchfork, period doubling and order windows.',
    },
    modelId: 'cubic',
    r: 2.5,
  },
  {
    id: 'ex-sine',
    icon: '📐',
    category: 'math',
    title: { es: 'Universalidad en el seno', en: 'Universality in the sine map' },
    description: {
      es: 'El mapa trascendente r·sin(πx) comparte la misma ruta al caos que el logístico.',
      en: 'The transcendental map r·sin(πx) shares the same route to chaos as the logistic map.',
    },
    modelId: 'sine',
    r: 0.92,
  },

  // ---- Additional mathematical milestones ----
  {
    id: 'ex-superstable',
    icon: '⭐',
    category: 'math',
    title: { es: 'Punto Superestable (λ mínimo)', en: 'Superstable point (λ minimum)' },
    description: {
      es: 'El valor de r donde la órbita pasa exactamente por el punto crítico: el exponente de Lyapunov alcanza su mínimo absoluto.',
      en: 'The value of r where the orbit passes exactly through the critical point, minimising the Lyapunov exponent.',
    },
    modelId: 'logistic',
    r: Math.PI,
  },
  {
    id: 'ex-period5',
    icon: '🎵',
    category: 'math',
    title: { es: 'Ventana de periodo 5', en: 'Period-5 window' },
    description: {
      es: 'Dentro del caos, emerge una ventana estable de periodo 5: orden esporádico en medio del caos.',
      en: 'Inside chaos, a stable period-5 window emerges: sporadic order amid chaos.',
    },
    modelId: 'logistic',
    r: 3.9057,
  },
  {
    id: 'ex-cubic-period4',
    icon: '🧊',
    category: 'math',
    title: { es: 'Cúbico en periodo 4', en: 'Cubic at period 4' },
    description: {
      es: 'El mapa cúbico simétrico en un ciclo de periodo 4, mostrando duplicación de periodo.',
      en: 'The symmetric cubic map in a period-4 cycle showing period doubling.',
    },
    modelId: 'cubic',
    r: 1.75,
  },

  // ---- Engineering cases --------------------------------------------------
  {
    id: 'eng-electrical',
    icon: '⚡',
    category: 'engineering',
    title: { es: 'Convertidores DC–DC', en: 'DC–DC converters' },
    description: {
      es: 'Rizado caótico en la corriente del inductor al aumentar la ganancia del lazo de control.',
      en: 'Chaotic inductor-current ripple as the control-loop gain increases.',
    },
    modelId: 'logistic',
    r: 3.57,
  },
  {
    id: 'eng-process',
    icon: '🧪',
    category: 'engineering',
    title: { es: 'Reactores CSTR', en: 'CSTR reactors' },
    description: {
      es: 'Oscilaciones aperiódicas de concentración en reacciones autocatalíticas.',
      en: 'Aperiodic concentration oscillations in autocatalytic reactions.',
    },
    modelId: 'logistic',
    r: 3.82,
  },
  {
    id: 'eng-mechanical',
    icon: '⚙️',
    category: 'engineering',
    title: { es: 'Vibraciones (Duffing)', en: 'Vibrations (Duffing)' },
    description: {
      es: 'Amplitudes de desplazamiento caóticas en estructuras excitadas periódicamente.',
      en: 'Chaotic displacement amplitudes in periodically excited structures.',
    },
    modelId: 'quadratic',
    r: 1.4,
  },
  {
    id: 'eng-environmental',
    icon: '🌍',
    category: 'engineering',
    title: { es: 'Modelo de Ricker', en: 'Ricker population model' },
    description: {
      es: 'Riesgo de colapso ecológico por fluctuaciones extremas de población.',
      en: 'Ecological collapse risk from extreme population fluctuations.',
    },
    modelId: 'exponential',
    r: 8.5,
  },
  {
    id: 'eng-computer',
    icon: '💻',
    category: 'engineering',
    title: { es: 'Criptografía caótica', en: 'Chaotic cryptography' },
    description: {
      es: 'Generadores pseudoaleatorios de alta entropía para cifrado y gráficos procedurales.',
      en: 'High-entropy pseudorandom generators for encryption and procedural graphics.',
    },
    modelId: 'polynomial',
    r: 3.2,
  },
  {
    id: 'eng-telecom',
    icon: '📡',
    category: 'engineering',
    title: { es: 'Óptica no lineal', en: 'Nonlinear optics' },
    description: {
      es: 'Modulación no lineal de fase en enlaces de fibra óptica y jitter caótico.',
      en: 'Nonlinear phase modulation in optical fiber links and chaotic jitter.',
    },
    modelId: 'sine',
    r: 0.92,
  },

  // ═══════ Additional mathematical milestones ═════════════════════
  {
    id: 'ex-logistic-fixed',
    icon: '🔵',
    category: 'math',
    title: { es: 'Punto fijo estable (logístico)', en: 'Stable fixed point (logistic)' },
    description: {
      es: 'El mapa logístico converge suavemente a x* = (r−1)/r para r < 3. Sin bifurcaciones.',
      en: 'The logistic map converges smoothly to x* = (r−1)/r for r < 3. No bifurcations.',
    },
    modelId: 'logistic',
    r: 2.6,
  },
  {
    id: 'ex-logistic-period8',
    icon: '🔁',
    category: 'math',
    title: { es: 'Período 8 (logístico)', en: 'Period 8 (logistic)' },
    description: {
      es: 'Cascada de duplicación avanzada: la órbita alterna entre 8 valores estables en r ≈ 3.544.',
      en: 'Advanced period-doubling cascade: the orbit alternates between 8 stable values at r ≈ 3.544.',
    },
    modelId: 'logistic',
    r: 3.544,
  },
  {
    id: 'ex-logistic-chaos-edge',
    icon: '⚡',
    category: 'math',
    title: { es: 'Borde del caos (r ≈ 3.57)', en: 'Edge of chaos (r ≈ 3.57)' },
    description: {
      es: 'El punto de acumulación de Feigenbaum: la cascada llega a infinito y el caos nace.',
      en: 'The Feigenbaum accumulation point: the cascade reaches infinity and chaos is born.',
    },
    modelId: 'logistic',
    r: 3.5699,
  },
  {
    id: 'ex-tent-chaos',
    icon: '⛺',
    category: 'math',
    title: { es: 'Mapa tienda: caos en r=2', en: 'Tent map: chaos at r=2' },
    description: {
      es: 'Mapa lineal por tramos totalmente caótico con λ = ln(2) ≈ 0.693.',
      en: 'Piecewise-linear map fully chaotic with λ = ln(2) ≈ 0.693.',
    },
    modelId: 'tent',
    r: 2.0,
  },
  {
    id: 'ex-ricker-chaos',
    icon: '🌊',
    category: 'math',
    title: { es: 'Ricker: poblaciones caóticas', en: 'Ricker: chaotic populations' },
    description: {
      es: 'El mapa de Ricker con alta tasa de crecimiento muestra fluctuaciones extremas de población.',
      en: 'The Ricker map with high growth rate shows extreme population fluctuations.',
    },
    modelId: 'ricker',
    r: 22.0,
  },
  {
    id: 'ex-cubic-pitchfork',
    icon: '🧊',
    category: 'math',
    title: { es: 'Cúbico: pitchfork + duplicación', en: 'Cubic: pitchfork + doubling' },
    description: {
      es: 'r·x(1−x²) muestra pitchfork y duplicación de periodo en la región r ≈ 1.75.',
      en: 'r·x(1−x²) shows pitchfork and period doubling in the r ≈ 1.75 region.',
    },
    modelId: 'cubic',
    r: 1.75,
  },
  {
    id: 'ex-gauss-flip',
    icon: '📐',
    category: 'math',
    title: { es: 'Gauss: bifurcación de flip', en: 'Gauss: flip bifurcation' },
    description: {
      es: 'El mapa e^(−r·x²) muestra la ruta de bifurcación de flip hacia el caos.',
      en: 'The map e^(−r·x²) shows the flip bifurcation route to chaos.',
    },
    modelId: 'gauss',
    r: 7.0,
  },
  {
    id: 'ex-logistic-superstable',
    icon: '⭐',
    category: 'math',
    title: { es: 'Superestable (λ mínimo)', en: 'Superstable (λ minimum)' },
    description: {
      es: 'En r = π, la órbita logística pasa por x=0.5 y el Lyapunov alcanza su mínimo absoluto.',
      en: 'At r = π, the logistic orbit passes through x=0.5 and Lyapunov reaches its absolute minimum.',
    },
    modelId: 'logistic',
    r: 3.1416,
  },
  {
    id: 'ex-logistic-intermittency',
    icon: '〰️',
    category: 'math',
    title: { es: 'Intermitencia (r ≈ 3.828)', en: 'Intermittency (r ≈ 3.828)' },
    description: {
      es: 'Justo antes de la ventana de periodo 3: episodios periódicos alternados con estallidos caóticos.',
      en: 'Just before the period-3 window: periodic episodes alternating with chaotic bursts.',
    },
    modelId: 'logistic',
    r: 3.825,
  },
  {
    id: 'ex-sine-full',
    icon: '📐',
    category: 'math',
    title: { es: 'Seno: caos completo (r=1.0)', en: 'Sine: full chaos (r=1.0)' },
    description: {
      es: 'El mapa r·sin(πx) a r=1 muestra caos con λ positivo, confirmando la universalidad.',
      en: 'The map r·sin(πx) at r=1 shows chaos with positive λ, confirming universality.',
    },
    modelId: 'sine',
    r: 1.0,
  },

  // ═══════ Additional engineering cases ═══════════════════════════
  {
    id: 'eng-bernoulli-prng',
    icon: '🔐',
    category: 'engineering',
    title: { es: 'PRNG criptográfico (Bernoulli)', en: 'Cryptographic PRNG (Bernoulli)' },
    description: {
      es: 'El mapa de Bernoulli (2x mod 1) genera secuencias de alta entropía para criptografía y gráficos procedurales.',
      en: 'The Bernoulli map (2x mod 1) generates high-entropy sequences for cryptography and procedural graphics.',
    },
    modelId: 'bernoulli',
    r: 2.0,
  },
];
