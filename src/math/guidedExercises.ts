/** Guided student exercises / lab challenges data. */

export interface GuidedExerciseOption {
  text: string;
  correct: boolean;
}

export interface GuidedExercise {
  id: string;
  title: string;
  description: string;
  instruction: string;
  modelId: string;
  targetR: number;
  tolerance: number;
  question: string;
  options: GuidedExerciseOption[];
  hint: string;
}

export const GUIDED_EXERCISES: GuidedExercise[] = [
  {
    id: 'ex1',
    title: '🎯 Reto 1: φ y la Primera Bifurcación (Periodo 1 ➔ 2)',
    description:
      'Encuentra el valor del parámetro r donde el punto fijo pierde estabilidad y se divide en 2 estados oscilatorios eternos.',
    instruction: 'Mueve el slider del parámetro r hasta el punto exacto de la primera bifurcación.',
    modelId: 'logistic',
    targetR: 3.0,
    tolerance: 0.05,
    question: '¿A qué parámetro c de la Espiral Áurea (atlas φ) corresponde r = 3.0?',
    options: [
      { text: 'c = 0.25 (Punto extremo superior)', correct: false },
      { text: 'c = -0.75 (Frontera entre cardioide principal y disco izquierdo)', correct: true },
      { text: 'c = -1.25 (Disco de periodo 4)', correct: false },
      { text: 'c = -2.0 (Límite caótico extremo)', correct: false },
    ],
    hint: 'Ajusta r exactamente en 3.0000. Observa cómo la línea azul del diagrama de bifurcación se divide en dos ramas.',
  },
  {
    id: 'ex2',
    title: '⚡ Reto 2: El Límite de Feigenbaum (Inicio del Caos)',
    description:
      'Localiza el punto acumulación de la cascada de duplicación de periodo donde la órbita se vuelve aperiódica.',
    instruction:
      'Ajusta r justo antes de que el exponente de Lyapunov λ pase de negativo a positivo.',
    modelId: 'logistic',
    targetR: 3.5699,
    tolerance: 0.02,
    question: '¿Qué valor tiene la constante universal de Feigenbaum δ que rige esta transición?',
    options: [
      { text: 'δ ≈ 3.1415 (Número Pi)', correct: false },
      { text: 'δ ≈ 4.6692 (Tasa límite entre intervalos de bifurcación)', correct: true },
      { text: 'δ ≈ 2.7182 (Número e)', correct: false },
      { text: 'δ ≈ 1.6180 (Número Áureo)', correct: false },
    ],
    hint: 'Ubica el parámetro r cerca de 3.57. Nota cómo el exponente de Lyapunov toca la línea de cero.',
  },
  {
    id: 'ex3',
    title: '🌀 Reto 3: Orden en el Caos (Ventana de Periodo 3)',
    description: 'Descubre la ventana periódica de periodo 3 sumergida dentro del mar caótico.',
    instruction:
      'Desplaza r dentro de la región caótica (r > 3.6) hasta hallar una franja clara con 3 valores estables.',
    modelId: 'logistic',
    targetR: 3.8284,
    tolerance: 0.03,
    question:
      'Según el Teorema de Li-Yorke (1975), ¿qué implica la presencia de una ventana de Periodo 3?',
    options: [
      { text: 'Que el sistema regresará a periodo 1', correct: false },
      { text: 'Que el sistema se apaga inmediatamente', correct: false },
      {
        text: 'Periodo 3 Implica Caos (existen órbitas de todos los demás periodos)',
        correct: true,
      },
      { text: 'Que la función deja de ser derivable', correct: false },
    ],
    hint: 'Prueba un valor cercano a r = 3.83. Verás 3 puntos discretos en lugar de una nube densa.',
  },
  {
    id: 'ex4',
    title: '🔗 Reto 4: Caos Universal en el Mapa Seno',
    description:
      'Verifica el principio pedagógico: El caos es universal y ocurre en funciones trascendentes.',
    instruction:
      'Cambia al Mapa Seno r·sin(πx) y encuentra el parámetro donde inicia la duplicación de periodo.',
    modelId: 'sine',
    targetR: 0.72,
    tolerance: 0.05,
    question:
      '¿Por qué el diagrama de bifurcación del Mapa Seno se parece tanto al del Mapa Logístico?',
    options: [
      { text: 'Es una coincidencia matemática sin importancia', correct: false },
      {
        text: 'Porque ambas son funciones cuadráticas unimodales con un único máximo suave',
        correct: true,
      },
      { text: 'Porque el seno es una recta en origen', correct: false },
      { text: 'Porque utilizan la misma paleta de colores', correct: false },
    ],
    hint: 'Cambia el modelo arriba a "Mapa Seno" y observa cómo comparte la misma estructura de cascada.',
  },
  {
    id: 'ex5',
    title: '🏭 Reto 5: Aplicaciones Reales en Ingeniería',
    description:
      'Explora un caso real de ingeniería donde la dinámica caótica tiene implicaciones prácticas.',
    instruction:
      'En la pestaña Laboratorio, abre la sección "Aplicaciones Reales en Ingeniería" y selecciona el caso "Informática". Observa cómo el mapa polinómico genera secuencias pseudoaleatorias.',
    modelId: 'logistic',
    targetR: 3.9,
    tolerance: 0.1,
    question: '¿Qué tipo de secuencia genera un sistema determinista en régimen caótico?',
    options: [
      {
        text: 'Secuencia periódica exacta con período fijo',
        correct: false,
      },
      {
        text: 'Secuencia pseudoaleatoria de alta entropía, determinista pero impredecible',
        correct: true,
      },
      {
        text: 'Secuencia constante sin variaciones',
        correct: false,
      },
      {
        text: 'Secuencia completamente aleatoria (estocástica)',
        correct: false,
      },
    ],
    hint: 'Ajusta r ≈ 3.9 en el mapa logístico. La diferencia clave con el azar: el sistema es determinista (misma x₀ → misma órbita), pero la sensibilidad a la condición inicial lo hace impredecible.',
  },

  // ═══════════════════════════════════════════════════════════════════
  // Additional exercises for expanded coverage
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'ex6',
    title: '🔵 Reto 6: El Mapa Tienda y la Caoticidad',
    description:
      'Explora el mapa tienda (Tent map) y su comportamiento en r = 2, donde es totalmente caótico.',
    instruction: 'Cambia al Mapa Tienda y ajusta r a 2.0. Observa el diagrama de bifurcación.',
    modelId: 'tent',
    targetR: 2.0,
    tolerance: 0.05,
    question: '¿Qué tiene de especial el mapa tienda en r = 2?',
    options: [
      { text: 'Es el valor donde la órbita converge a cero', correct: false },
      { text: 'Es totalmente caótico con λ = ln(2) ≈ 0.693', correct: true },
      { text: 'Tiene un punto fijo estable', correct: false },
      { text: 'Se comporta como el mapa logístico en r=1', correct: false },
    ],
    hint: 'Ajusta r a 2.0 y activa el exponente de Lyapunov. Observa que λ es positivo y constante en todo el rango.',
  },
  {
    id: 'ex7',
    title: '🌊 Reto 7: Mapa de Ricker — Poblaciones Extremas',
    description:
      'Observa cómo el mapa de Ricker muestra fluctuaciones extremas de población a alta tasa de crecimiento.',
    instruction: 'Cambia al Mapa de Ricker y ajusta r a 20.0.',
    modelId: 'ricker',
    targetR: 20.0,
    tolerance: 0.5,
    question: '¿Qué representa r en el mapa de Ricker?',
    options: [
      { text: 'La capacidad de carga del ecosistema', correct: false },
      { text: 'La tasa de crecimiento de la población', correct: true },
      { text: 'El número de depredadores', correct: false },
      { text: 'La temperatura del medio', correct: false },
    ],
    hint: 'En x_{n+1} = r·x·e^(-x), r es la tasa de crecimiento. Valores altos causan "sobrepoblación" que colapsa.',
  },
  {
    id: 'ex8',
    title: '📐 Reto 8: Universalidad en el Mapa Seno',
    description:
      'Verifica que el mapa seno muestra la misma estructura de cascada que el logístico.',
    instruction: 'Cambia al Mapa Seno y busca la primera bifurcación (r ≈ 0.72).',
    modelId: 'sine',
    targetR: 0.72,
    tolerance: 0.05,
    question: '¿Qué confirma el mapa seno sobre el caos?',
    options: [
      { text: 'El caos solo ocurre en mapas polinómicos', correct: false },
      { text: 'El caos es universal y ocurre en funciones trascendentes también', correct: true },
      { text: 'El seno no puede ser caótico', correct: false },
      { text: 'El mapa seno es siempre periódico', correct: false },
    ],
    hint: 'Compara la estructura del diagrama de bifurcación del seno con la del logístico. Son iguales.',
  },
  {
    id: 'ex9',
    title: '🧊 Reto 9: El Mapa Cúbico y el Pitchfork',
    description: 'Observa la bifurcación de pitchfork en el mapa cúbico r·x(1−x²).',
    instruction: 'Cambia al Mapa Cúbico y ajusta r a 1.0 para ver la bifurcación de pitchfork.',
    modelId: 'cubic',
    targetR: 1.0,
    tolerance: 0.1,
    question: '¿Qué es una bifurcación de pitchfork?',
    options: [
      { text: 'Un punto fijo se duplica en un ciclo de periodo 2', correct: false },
      {
        text: 'Un punto fijo estable se bifurca en dos nuevos puntos fijos estables',
        correct: true,
      },
      { text: 'La órbita se vuelve caótica instantáneamente', correct: false },
      { text: 'El sistema colapsa a cero', correct: false },
    ],
    hint: 'En r=1, el punto fijo x=0 pierde estabilidad y nacen dos nuevos puntos fijos simétricos.',
  },
  {
    id: 'ex10',
    title: '💻 Reto 10: Criptografía y el Mapa de Bernoulli',
    description:
      'El mapa de Bernoulli (2x mod 1) genera secuencias pseudoaleatorias para criptografía.',
    instruction: 'Cambia al Mapa de Bernoulli y observa la secuencia generada en r = 2.0.',
    modelId: 'bernoulli',
    targetR: 2.0,
    tolerance: 0.05,
    question: '¿Por qué el mapa de Bernoulli es útil para criptografía?',
    options: [
      { text: 'Porque es periódico y predecible', correct: false },
      {
        text: 'Porque genera secuencias de alta entropía, aperiódicas y deterministas',
        correct: true,
      },
      { text: 'Porque suena como música', correct: false },
      { text: 'Porque es fácil de calcular', correct: false },
    ],
    hint: 'La aperiodicidad + sensibilidad a C.I. + determinismo = secuencias pseudoaleatorias de alta entropía.',
  },
  {
    id: 'ex11',
    title: '⭐ Reto 11: Superestable (λ mínimo)',
    description:
      'Encuentra el punto superestable del mapa logístico donde la órbita pasa por el punto crítico x = 0.5.',
    instruction: 'Ajusta r ≈ π (3.1416) en el mapa logístico y observa el exponente de Lyapunov.',
    modelId: 'logistic',
    targetR: 3.1416,
    tolerance: 0.05,
    question: '¿Qué valor aproximado tiene λ en el punto superestable?',
    options: [
      { text: 'λ ≈ −3.4 (mínimo absoluto)', correct: true },
      { text: 'λ ≈ 0 (crítico)', correct: false },
      { text: 'λ ≈ +0.6 (caótico)', correct: false },
      { text: 'λ ≈ −1.5 (estable promedio)', correct: false },
    ],
    hint: "En r = π, la órbita pasa por x = 0.5 donde f'(0.5) = 0 → ln|0| = −∞. El Lyapunov alcanza su mínimo.",
  },
  {
    id: 'ex12',
    title: '🎵 Reto 12: Sonificación y Escalas',
    description: 'Explora cómo diferentes escalas musicales cambian el carácter del sonido.',
    instruction:
      'Activa la sonificación en el laboratorio. Cambia entre "Pentatónica menor" y "Cromática" con el mismo parámetro r.',
    modelId: 'logistic',
    targetR: 3.2,
    tolerance: 0.1,
    question:
      '¿Qué diferencia fundamental hay entre la pentatónica menor y la cromática al sonificar la misma órbita?',
    options: [
      {
        text: 'La pentatónica suena más suave y consonante; la cromática más densa y disonante',
        correct: true,
      },
      { text: 'No hay diferencia', correct: false },
      { text: 'La pentatónica es más rápida', correct: false },
      { text: 'La cromática suena a silencio', correct: false },
    ],
    hint: 'La pentatónica tiene 5 notas por octava (menos densa); la cromática tiene 12 (todas las notas, más densa y tensa).',
  },
  {
    id: 'ex13',
    title: '⚡ Reto 13: Intermitencia (r ≈ 3.825)',
    description: 'Justo antes de la ventana de periodo 3, el sistema muestra intermitencia.',
    instruction: 'Ajusta r a 3.825 en el mapa logístico y observa el comportamiento de la órbita.',
    modelId: 'logistic',
    targetR: 3.825,
    tolerance: 0.02,
    question: '¿Qué es la intermitencia?',
    options: [
      {
        text: 'El sistema alterna entre episodios periódicos y estallidos caóticos',
        correct: true,
      },
      { text: 'El sistema es siempre caótico', correct: false },
      { text: 'La órbita diverge a infinito', correct: false },
      { text: 'El sistema es estable con un punto fijo', correct: false },
    ],
    hint: 'Observa la serie temporal: verás "paquetes" de comportamiento periódico interrumpidos por explosiones caóticas.',
  },
  {
    id: 'ex14',
    title: '🔵 Reto 14: Mapa de Gauss y Bifurcación de Flip',
    description:
      'El mapa gaussiano e^(-r·x²) muestra una bifurcación de flip diferente al logístico.',
    instruction: 'Cambia al Mapa de Gauss y ajusta r a 6.0 para ver la transición.',
    modelId: 'gauss',
    targetR: 6.0,
    tolerance: 0.5,
    question: '¿Qué tipo de bifurcación muestra el mapa gaussiano?',
    options: [
      { text: 'Saddle-node', correct: false },
      {
        text: 'Flip (volteo): el punto fijo gana un ciclo de periodo 2 al volcarse',
        correct: true,
      },
      { text: 'Pitchfork', correct: false },
      { text: 'Hopf', correct: false },
    ],
    hint: 'El mapa gaussiano tiene derivada negativa → bifurcación de flip (el punto fijo "da un vuelco" y nace periodo 2).',
  },
  {
    id: 'ex15',
    title: '🔗 Reto 15: El Isomorfismo Exacto',
    description:
      'Verifica la transformación que conecta el logístico con la Espiral Áurea: c = (2r − r²)/4.',
    instruction:
      'Ajusta r = 3.0 en el mapa logístico. Observa el conector isomórfico en la barra de control.',
    modelId: 'logistic',
    targetR: 3.0,
    tolerance: 0.05,
    question: '¿Qué valor de c corresponde a r = 3.0 en el mapa logístico?',
    options: [
      { text: 'c = −0.75', correct: true },
      { text: 'c = −1.25', correct: false },
      { text: 'c = 0.25', correct: false },
      { text: 'c = −2.0', correct: false },
    ],
    hint: 'Usa la fórmula c = (2r − r²)/4 con r = 3.0: c = (6 − 9)/4 = −0.75.',
  },
];
