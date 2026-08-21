/** Guided student exercises / lab challenges (golden ratio theme). */

export interface GuidedExerciseOption {
  text: string;
  correct: boolean;
}

export interface GuidedExercise {
  id: string;
  title: string;
  description: string;
  instruction: string;
  styleId: string;
  targetN: number;
  tolerance: number;
  question: string;
  options: GuidedExerciseOption[];
  hint: string;
}

export const GUIDED_EXERCISES: GuidedExercise[] = [
  {
    id: 'ex1',
    title: '🎯 Reto 1: Convergencia de la Razón',
    description:
      'Aumenta los términos n hasta que F(n)/F(n−1) se aproxime a φ = 1.61803 con error < 10⁻⁶.',
    instruction:
      'Sube el slider de términos (n) hasta el valor objetivo y observa la asíntota roja.',
    styleId: 'sunflower',
    targetN: 32,
    tolerance: 1,
    question: '¿Cuál es el error de la razón F(32)/F(31) respecto a φ?',
    options: [
      { text: '≈ 10⁻⁶ (la convergencia es muy rápida)', correct: true },
      { text: '≈ 0.1 (todavía lejos)', correct: false },
      { text: 'φ exactamente (error 0)', correct: false },
      { text: '≈ 10⁻²', correct: false },
    ],
    hint: 'Con n ≈ 32 el error ya es del orden de 10⁻⁶. El Inspector Áureo muestra |error − φ| en vivo.',
  },
  {
    id: 'ex2',
    title: '⚡ Reto 2: Binet',
    description:
      'Calcula F(n) mediante la fórmula cerrada de Binet y compárala con la recurrencia en el Inspector.',
    instruction: 'Ajusta n = 20 y verifica que F(20) = 6765 con la fórmula de Binet del Inspector.',
    styleId: 'sunflower',
    targetN: 20,
    tolerance: 0,
    question: '¿Qué valor exacto tiene F(20)?',
    options: [
      { text: '6765', correct: true },
      { text: '10946', correct: false },
      { text: '4181', correct: false },
      { text: '17711', correct: false },
    ],
    hint: 'F(20) es el vigésimo número de la sucesión: 0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181,6765 → F(20)=6765.',
  },
  {
    id: 'ex3',
    title: '🌀 Reto 3: Ángulo Áureo',
    description: 'Descubre por qué el ángulo áureo 137.508° produce las espirales del girasol.',
    instruction:
      'Cambia el estilo de espiral a "Girasol 137.5°" y usa n = 100; observa las espirales coalescentes.',
    styleId: 'sunflower',
    targetN: 233,
    tolerance: 10,
    question: 'El ángulo áureo en grados es:',
    options: [
      { text: '360/φ² = 137.50776°', correct: true },
      { text: '360/φ = 222.49°', correct: false },
      { text: '90°', correct: false },
      { text: '180°', correct: false },
    ],
    hint: 'El ángulo áureo es la fracción complementaria del giro: 360°·(1/φ) no, es 360°/φ² ≈ 137.508°.',
  },
  {
    id: 'ex4',
    title: '🔗 Reto 4: Zeckendorf',
    description: 'Representa un número como suma de términos de Fibonacci no consecutivos.',
    instruction: 'Ajusta n = 55 y lee en el Inspector la descomposición de Zeckendorf.',
    styleId: 'sunflower',
    targetN: 55,
    tolerance: 0,
    question: '¿Cuál es la representación de Zeckendorf de F(10) = 55?',
    options: [
      { text: '55 (F(10) es ya un término de Fibonacci)', correct: true },
      { text: '34 + 21', correct: false },
      { text: '21 + 13 + 8 + 5 + 3 + 2 + 1', correct: false },
      { text: '34 + 13 + 8', correct: false },
    ],
    hint: 'Si el número es ya un término de Fibonacci, Zeckendorf lo deja intacto (suma de un solo término).',
  },
  {
    id: 'ex5',
    title: '🌻 Reto 5: Filotaxis',
    description: 'Compara el patrón del girasol con una espiral de ángulo "incorrecto".',
    instruction:
      'Cambia entre "Girasol 137.5°" y "Retrocruzada 90°" con n = 200 y observa la diferencia.',
    styleId: 'sunflower',
    targetN: 200,
    tolerance: 5,
    question: 'El ángulo áureo empaqueta las semillas de forma óptima porque:',
    options: [
      {
        text: 'Es el ángulo que nunca alinea dos semillas en la misma dirección (irracionalidad de φ)',
        correct: true,
      },
      { text: 'Es el más grande posible', correct: false },
      { text: 'Coincide con 1370°', correct: false },
      { text: 'Es un ángulo exactamente de 90°', correct: false },
    ],
    hint: 'φ es irracional: su múltiplo nunca coincide exactamente con un número entero de vueltas, evitando semillas alineadas.',
  },
];
