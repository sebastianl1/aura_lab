import { PHI, GOLDEN_ANGLE_DEG } from './fibonacci.js';

export interface EngineeringCase {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  equation: string;
  /** Spirals / terms used to open the laboratory for this case. */
  styleId: string;
  n: number;
}

export const ENGINEERING_CASES: EngineeringCase[] = [
  {
    id: 'architecture',
    title: '🏛️ Arquitectura Clásica',
    subtitle: 'El Partenón y la proporción del frontón (φ)',
    explanation:
      'La fachada del Partenón (Atenas, s. V a.C.) inscribe su frontón en un rectángulo cuya altura y anchura están en razón áurea (φ ≈ 1.618). Al superponer el rectángulo áureo sobre la fachada, las columnas y el entablamento encajan en las divisiones 1:φ. Abre el laboratorio con una teselación del rectángulo áureo para verificarlo.',
    equation: '\\frac{W}{H} = \\varphi = \\frac{1+\\sqrt{5}}{2} \\approx 1.6180339887',
    styleId: 'sunflower',
    n: 233,
  },
  {
    id: 'biology',
    title: '🌻 Biología',
    subtitle: 'Filotaxis del girasol con el ángulo áureo 137.5°',
    explanation:
      'Las semillas del girasol (Helianthus annuus) se disponen siguiendo el ángulo áureo 137.508°. Este ángulo óptimo maximiza la luz que recibe cada primordio. Las espirales que ves (34/55, 55/89…) son pares de números de Fibonacci consecutivos. Abre la filotaxis del laboratorio con 377 semillas.',
    equation: 'a = 360°/\\varphi^2 = 137.50776°',
    styleId: 'sunflower',
    n: 377,
  },
  {
    id: 'nature',
    title: '🐚 Naturaleza',
    subtitle: 'La concha del Nautilus y la espira mirabilis',
    explanation:
      'La concha del nautilus crece en una espiral logarítmica (espira mirabilis): cada vuelta es una versión φ-grotesca de la anterior, sin cambiar de forma. La envolvente de sus cámaras se aproxima a una espiral áurea. En el laboratorio el estilo "Concha Nautilus" genera esa espiral.',
    equation: 'r(\\theta) = a \\cdot \\varphi^{(\\theta / \\pi)}',
    styleId: 'nautilus',
    n: 233,
  },
  {
    id: 'markets',
    title: '📈 Mercados',
    subtitle: 'Fibonacci retracement en análisis técnico',
    explanation:
      'Los traders usan niveles de retroceso de Fibonacci (0.236, 0.382, 0.618 = 1/φ, 0.786) para hallar soportes y resistencias. Aunque no hay mecanismo causal demostrado, la razón 0.618 (1/φ) estructura los retrocesos más observados del precio tras un impulso.',
    equation: '\\text{Retracement} = 1 - 1/\\varphi = \\varphi - 1 \\approx 0.618',
    styleId: 'leaves',
    n: 144,
  },
  {
    id: 'music',
    title: '🎼 Música',
    subtitle: 'La proporción áurea en la estructura sonora',
    explanation:
      'Compositores como Bartók y Debussy organizaron secciones, ataques y silencios en puntos φ de la pieza. La sonificación de Aura Lab hace audible la convergencia de la razón F(n)/F(n−1): conforme n crece, la nota se estabiliza en un único tono: el sonido de la proporción áurea.',
    equation: '\\text{cent} = 1200 \\cdot \\log_2(\\varphi) \\approx 833.09',
    styleId: 'sunflower',
    n: 233,
  },
  {
    id: 'telecom',
    title: '📡 Telecom & Diseño',
    subtitle: 'Antenas log-periódicas y composición 1:φ',
    explanation:
      'Las antenas log-periódicas (como las de TV) escalan sus elementos en razón constante cercana a φ, logrando una gran banda de frecuencia. En diseño gráfico y UI, la rejilla áurea 1:φ organiza jerarquías visuales estables. El rectángulo áureo del laboratorio es el mismo de los proyectos de diseño.',
    equation: 'f_{n+1} \\approx \\varphi \\cdot f_n',
    styleId: 'paloverde',
    n: 144,
  },
];

/** Synthetic waveform per case, normalized to [0, 1]. */
export function generateGoldenSignal(id: string, count: number, n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    let v: number;
    switch (id) {
      case 'architecture': {
        // Parthenon: nested rect dividers 1:φ
        v = 0.5 + 0.32 * Math.sin(Math.PI * 2 * (1 / PHI) * (t * 3 + 0.25));
        break;
      }
      case 'biology': {
        // radial phyllotaxis density
        v = 0.5 + 0.4 * Math.cos(t * 2 * Math.PI * 3 + GOLDEN_ANGLE_DEG * 0.01);
        break;
      }
      case 'nature': {
        // log spiral projection
        const r = Math.pow(PHI, t * 6);
        v = 0.5 + 0.36 * Math.sin(r);
        break;
      }
      case 'markets': {
        // converging zigzag (retracements)
        v = 0.5 + 0.42 * Math.sin(t * 9 * Math.PI) * (1 - t * 0.4);
        break;
      }
      case 'music': {
        v = 0.5 + 0.4 * Math.sin(t * n * 0.05 * Math.PI) * (0.4 + 0.6 * Math.exp(-t * 4));
        break;
      }
      case 'telecom': {
        v = 0.5 + 0.4 * Math.sin(2 * Math.PI * (t * 20 + t * t * 8));
        break;
      }
      default:
        v = 0.5 + 0.3 * Math.sin(t * 6 * Math.PI);
    }
    out.push(Math.max(0, Math.min(1, v)));
  }
  return out;
}

export { GOLDEN_ANGLE_DEG, PHI };
