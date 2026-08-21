/**
 * Engineering Cases Data & Signal Generator for Application Panel
 */

export interface EngineeringCase {
  id: string;
  title: string;
  subtitle: string;
  modelId: string;
  equation: string;
  explanation: string;
  targetR: number;
  signalType: string;
}

export const ENGINEERING_CASES: EngineeringCase[] = [
  {
    id: 'electrical',
    title: '⚡ Ingeniería Eléctrica',
    subtitle: 'Convertidores DC-DC Buck/Boost & Osciladores RLC No Lineales',
    modelId: 'logistic',
    equation: 'i_{n+1} = V_{in} \\cdot i_n (1 - i_n)',
    explanation:
      'En convertidores de potencia regulados por PWM o circuitos RLC con varactores, el aumento de la ganancia r causa una cascada de duplicación de periodo en la corriente del inductor. Esto genera rizado caótico (chaos ripple), ruido electromagnético y pérdida de eficiencia.',
    targetR: 3.57,
    signalType: 'pwm_ripple',
  },
  {
    id: 'process',
    title: '🧪 Ingeniería de Procesos',
    subtitle: 'Estabilidad de Reactores Químicos (Reacciones Autocatalíticas)',
    modelId: 'logistic',
    equation: 'C_{n+1} = r \\cdot C_n (1 - C_n)',
    explanation:
      'En reactores continuos de tanque agitado (CSTR) con reacciones autocatalíticas exotérmicas, una alta tasa de alimentación r induce bifurcaciones de Hopf. La concentración de reactivo oscila aperiódicamente, dificultando el control de temperatura.',
    targetR: 3.82,
    signalType: 'chemical_osc',
  },
  {
    id: 'mechanical',
    title: '⚙️ Ingeniería Mecánica',
    subtitle: 'Vibraciones Caóticas en Estructuras (Oscilador Duffing)',
    modelId: 'quadratic',
    equation: 'x_{n+1} = r - x_n^2',
    explanation:
      'Estructuras mecánicas o vigas metálicas sometidas a excitación periódica sufren bifurcaciones en su amplitud de desplazamiento x. En el régimen caótico, las oscilaciones son impredicibles y causan fatiga estructural prematura por resonancia.',
    targetR: 1.4,
    signalType: 'duffing_vibration',
  },
  {
    id: 'environmental',
    title: '🌱 Ingeniería Ambiental',
    subtitle: 'Modelos Poblacionales & Colapso Ecológico de Especies',
    modelId: 'exponential',
    equation: 'N_{n+1} = r \\cdot N_n \\cdot e^{-N_n}',
    explanation:
      'Representa la densidad de población N de especies con recursos limitados (Modelo de Ricker). Tasas de reproducción r > 3.5 provocan fluctuaciones extremas y riesgo de colapso ambiental e inestabilidad del ecosistema.',
    targetR: 8.5,
    signalType: 'population_crash',
  },
  {
    id: 'computer',
    title: '💻 Ingeniería Informática',
    subtitle: 'Criptografía Caótica, Compresión Fractal & Procedimental GPU',
    modelId: 'polynomial',
    equation: 'K_{n+1} = r \\cdot K_n (1 - K_n^k)',
    explanation:
      'Aprovecha la aperiodisidad y extrema sensibilidad a las condiciones iniciales para generar secuencias pseudoaleatorias de alta entropía (PRNG) para encriptación de datos y renderizado procedural de terreno por GPU.',
    targetR: 3.2,
    signalType: 'prng_stream',
  },
  {
    id: 'telecom',
    title: '📡 Telecomunicaciones',
    subtitle: 'Óptica No Lineal & Modulación de Fase en Láseres de Fibra',
    modelId: 'sine',
    equation: '\\phi_{n+1} = r \\cdot \\sin(\\phi_n)',
    explanation:
      'En enlaces de fibra óptica transoceánicos de alta velocidad, la modulación no lineal de fase r*sin(phi) dispersa la fase de los pulso de luz, introduciendo jitter caótico y dispersión cromática en las señales OFDM.',
    targetR: 0.92,
    signalType: 'laser_phase',
  },
];

/**
 * Generates synthetic simulation time series data for the engineering case mini-canvas.
 */
export function generateEngineeringSignal(caseId: string, length = 120, rVal = 3.0): Float64Array {
  const points = new Float64Array(length);

  switch (caseId) {
    case 'electrical': {
      let i = 0.4;
      for (let k = 0; k < length; k++) {
        i = Math.max(0, Math.min(1, rVal * i * (1 - i)));
        points[k] = i + 0.15 * Math.sin(k * 0.4);
      }
      break;
    }
    case 'process': {
      let c = 0.3;
      for (let k = 0; k < length; k++) {
        c = Math.max(0, Math.min(1, rVal * c * (1 - c)));
        points[k] = c * 0.8 + 0.1 * Math.cos(k * 0.25);
      }
      break;
    }
    case 'mechanical': {
      let x = 0.2;
      for (let k = 0; k < length; k++) {
        x = rVal - x * x;
        points[k] = Math.sin(k * 0.15) * 0.4 + (x / 2.0) * 0.6;
      }
      break;
    }
    case 'environmental': {
      let n = 1.0;
      for (let k = 0; k < length; k++) {
        n = Math.max(0.01, rVal * n * Math.exp(-n));
        points[k] = Math.min(1.0, n / 10.0);
      }
      break;
    }
    case 'computer': {
      let p = 0.5;
      for (let k = 0; k < length; k++) {
        p = rVal * p * (1 - p * p * p);
        points[k] = Math.abs(p) % 1.0;
      }
      break;
    }
    case 'telecom': {
      let phi = 0.5;
      for (let k = 0; k < length; k++) {
        phi = rVal * Math.sin(Math.PI * phi);
        points[k] = Math.abs(phi);
      }
      break;
    }
    default:
      for (let k = 0; k < length; k++) points[k] = 0.5;
  }

  return points;
}
