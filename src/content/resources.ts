/**
 * Curated bibliography and resources for Aura Lab.
 * "Chaos: Making a New Science" by James Gleick is the foundational work.
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
    id: 'r-gleick',
    kind: 'book',
    primary: true,
    citation: {
      es: 'Gleick, J. (1987). Chaos: Making a New Science. Viking Press.',
      en: 'Gleick, J. (1987). Chaos: Making a New Science. Viking Press.',
    },
    note: {
      es: 'La obra que popularizó el estudio del caos y sigue siendo referencia para entender por qué sistemas simples producen comportamientos complejos. Cada capítulo presenta a uno de los pioneros del campo (May, Feigenbaum, Mandelbrot). Es la base conceptual de Aura Lab.',
      en: "The book that popularized chaos theory and remains the fundamental reference for understanding why simple systems produce complex behavior. Each chapter introduces one of the field's pioneers (Lorenz, May, Feigenbaum, Mandelbrot, Smale) and how they discovered the universality of chaos. It is the conceptual foundation of Aura Lab.",
    },
    url: 'https://en.wikipedia.org/wiki/Chaos:_Making_a_New_Science',
  },
  {
    id: 'r-strogatz',
    kind: 'book',
    citation: {
      es: 'Strogatz, S. H. (2015). Nonlinear Dynamics and Chaos. 2.ª ed., Westview Press.',
      en: 'Strogatz, S. H. (2015). Nonlinear Dynamics and Chaos. 2nd ed., Westview Press.',
    },
    note: {
      es: 'El textbook de referencia en universidades para dinámica no lineal. Riguroso, completo y con ejercicios resueltos que cubren todo desde mapas logísticos hasta atractores extraños.',
      en: 'The reference textbook in universities for nonlinear dynamics. Rigorous, complete, with solved exercises covering everything from logistic maps to strange attractors.',
    },
    url: 'https://global.oup.com/academic/product/nonlinear-dynamics-and-chaos-9781108865548',
  },
  {
    id: 'r-feigenbaum-orig',
    kind: 'paper',
    citation: {
      es: 'Feigenbaum, M. J. (1978). "Quantitative universality for a class of nonlinear transformations." J. Stat. Phys., 19(1), 25–52.',
      en: 'Feigenbaum, M. J. (1978). "Quantitative universality for a class of nonlinear transformations." J. Stat. Phys., 19(1), 25–52.',
    },
    note: {
      es: 'El artículo que estableció la universalidad de la constante δ ≈ 4.6692 y demostró que la duplicación de periodo sigue un patrón numérico idéntico para toda familia de mapas unimodales.',
      en: 'The paper that established the universality of the constant δ ≈ 4.6692 and showed period doubling follows an identical numerical pattern for all unimodal map families.',
    },
    url: 'https://doi.org/10.1007/BF01020332',
  },
  {
    id: 'r-li-yorke',
    kind: 'paper',
    citation: {
      es: 'Li, T.-Y. & Yorke, J. A. (1975). "Period Three Implies Chaos." Amer. Math. Monthly, 82(10), 985–992.',
      en: 'Li, T.-Y. & Yorke, J. A. (1975). "Period Three Implies Chaos." Amer. Math. Monthly, 82(10), 985–992.',
    },
    note: {
      es: 'El artículo que acuñó el término "caos" en matemáticas y demostró la conexión profunda entre la existencia de un ciclo de periodo 3 y la presencia de órbitas de todos los demás periodos.',
      en: 'The paper that coined the term "chaos" in mathematics and proved the deep connection between period-3 orbits and the existence of orbits of all other periods.',
    },
    url: 'https://doi.org/10.1080/00029890.1975.11993953',
  },
  {
    id: 'r-lorenz',
    kind: 'paper',
    citation: {
      es: 'Lorenz, E. N. (1963). "Deterministic Nonperiodic Flow." J. Atmos. Sci., 20(2), 130–141.',
      en: 'Lorenz, E. N. (1963). "Deterministic Nonperiodic Flow." J. Atmos. Sci., 20(2), 130–141.',
    },
    note: {
      es: 'El artículo que descubrió el atractor de Lorenz y el efecto mariposa: sensibilidad extrema a las condiciones iniciales en un sistema determinista.',
      en: 'The paper that discovered the Lorenz attractor and the butterfly effect: extreme sensitivity to initial conditions in a deterministic system.',
    },
    url: 'https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2',
  },
  {
    id: 'r-may',
    kind: 'paper',
    citation: {
      es: 'May, R. M. (1976). "Simple mathematical models with very complicated dynamics." Nature, 261, 459–467.',
      en: 'May, R. M. (1976). "Simple mathematical models with very complicated dynamics." Nature, 261, 459–467.',
    },
    note: {
      es: 'El artículo fundacional del mapa logístico como modelo de población que exhibe todo el espectro de dinámicas, desde puntos fijos hasta caos. La inspiración directa de Aura Lab.',
      en: 'The foundational paper of the logistic map as a population model exhibiting the full spectrum of dynamics, from fixed points to chaos. The direct inspiration for Aura Lab.',
    },
    url: 'https://doi.org/10.1038/261459a0',
  },
  {
    id: 'r-mandelbrot-orig',
    kind: 'paper',
    citation: {
      es: 'Mandelbrot, B. B. (1980). "Fractal aspects of the iteration of z → z² + c." Annals of the New York Academy of Sciences, 357, 75–94.',
      en: 'Mandelbrot, B. B. (1980). "Fractal aspects of the iteration of z → z² + c." Annals of the New York Academy of Sciences, 357, 75–94.',
    },
    note: {
      es: 'El artículo donde Mandelbrot presenta el conjunto que lleva su nombre y su relación con la dinámica cuadrática.',
      en: 'The paper where Mandelbrot presents the set bearing his name and its relationship with quadratic dynamics.',
    },
    url: 'https://doi.org/10.1111/j.1749-6632.1980.tb50782.x',
  },
  {
    id: 'r-ruelle',
    kind: 'paper',
    citation: {
      es: 'Ruelle, D. & Takens, F. (1971). "On the nature of turbulence." Comm. Math. Phys., 20, 167–192.',
      en: 'Ruelle, D. & Takens, F. (1971). "On the nature of turbulence." Comm. Math. Phys., 20, 167–192.',
    },
    note: {
      es: 'El primer artículo que propuso los atractores extraños como mecanismo fundamental de la turbulencia.',
      en: 'The first paper proposing strange attractors as the fundamental mechanism of turbulence.',
    },
    url: 'https://doi.org/10.1007/BF01645390',
  },
  {
    id: 'r-grassberger',
    kind: 'paper',
    citation: {
      es: 'Grassberger, P. & Procaccia, I. (1983). "Measuring the strangeness of strange attractors." Physica D, 9(1–2), 189–208.',
      en: 'Grassberger, P. & Procaccia, I. (1983). "Measuring the strangeness of strange attractors." Physica D, 9(1–2), 189–208.',
    },
    note: {
      es: 'Propone la dimensión de correlación y entropía de Kolmogorov-Sinai como medidas cuantitativas de la "extrañeza" de un atractor.',
      en: 'Proposes correlation dimension and Kolmogorov-Sinai entropy as quantitative measures of an attractor\'s "strangeness".',
    },
    url: 'https://doi.org/10.1016/0167-2789(83)90298-1',
  },
  {
    id: 'r-stewart',
    kind: 'book',
    citation: {
      es: 'Stewart, I. (1989). Does God Play Dice? The Mathematics of Chaos. Blackwell.',
      en: 'Stewart, I. (1989). Does God Play Dice? The Mathematics of Chaos. Blackwell.',
    },
    note: {
      es: 'Divulgación accesible del caos, con una narrativa clara sobre cómo matemáticos y físicos descubrieron la estructura oculta del caos.',
      en: 'Accessible popularization of chaos, with a clear narrative about how mathematicians and physicists discovered the hidden structure of chaos.',
    },
  },
  {
    id: 'r-shuster',
    kind: 'book',
    citation: {
      es: 'Schuster, H. G. (1988). Deterministic Chaos. VCH Verlag.',
      en: 'Schuster, H. G. (1988). Deterministic Chaos. VCH Verlag.',
    },
    note: {
      es: 'Enfoque físico y matemático del caos, con énfasis en aplicaciones en física y dinámica no lineal.',
      en: 'Physical and mathematical approach to chaos, with emphasis on applications in physics and nonlinear dynamics.',
    },
  },
  {
    id: 'r-kellert',
    kind: 'book',
    citation: {
      es: 'Kellert, S. H. (1993). In the Wake of Chaos. University of Chicago Press.',
      en: 'Kellert, S. H. (1993). In the Wake of Chaos. University of Chicago Press.',
    },
    note: {
      es: 'Filosofía del caos: ¿qué significa que un sistema sea caótico? Discusión sobre predictibilidad, determinismo y explicación científica.',
      en: 'Philosophy of chaos: what does it mean for a system to be chaotic? Discussion of predictability, determinism, and scientific explanation.',
    },
  },
  {
    id: 'r-lorenz-book',
    kind: 'book',
    citation: {
      es: 'Lorenz, E. N. (1993). The Essence of Chaos. University of Washington Press.',
      en: 'Lorenz, E. N. (1993). The Essence of Chaos. University of Washington Press.',
    },
    note: {
      es: 'La divulgación del propio Edward Lorenz, el descubridor del efecto mariposa, sobre sus investigaciones y el nacimiento del caos.',
      en: 'The popular account by Edward Lorenz himself, the discoverer of the butterfly effect, about his research and the birth of chaos.',
    },
  },
  {
    id: 'r-briggs',
    kind: 'book',
    citation: {
      es: 'Briggs, J. P. (1990). Turbulent Mirror: An Illustrated Guide to the Chaotic Dynamics of Feedback Systems. Harper.',
      en: 'Briggs, J. P. (1990). Turbulent Mirror: An Illustrated Guide to the Chaotic Dynamics of Feedback Systems. Harper.',
    },
    note: {
      es: 'Guía visual del caos con diagramas e ilustraciones que complementan perfectamente los diagramas de Aura Lab.',
      en: "Visual guide to chaos with diagrams and illustrations that complement Aura Lab's diagrams perfectly.",
    },
  },
  {
    id: 'r-peitgen',
    kind: 'book',
    citation: {
      es: 'Peitgen, H.-O., Jürgens, H. & Saupe, D. (2004). Chaos and Fractals: New Frontiers of Science. Springer.',
      en: 'Peitgen, H.-O., Jürgens, H. & Saupe, D. (2004). Chaos and Fractals: New Frontiers of Science. Springer.',
    },
    note: {
      es: 'El texto de referencia para fractales y conjuntos de Mandelbrot con visualizaciones espectaculares.',
      en: 'The reference text for fractals and Mandelbrot sets with spectacular visualizations.',
    },
  },
  {
    id: 'r-ott-book',
    kind: 'book',
    citation: {
      es: 'Ott, E. (2002). Chaos in Dynamical Systems. 2.ª ed., Cambridge University Press.',
      en: 'Ott, E. (2002). Chaos in Dynamical Systems. 2nd ed., Cambridge University Press.',
    },
    note: {
      es: 'Enfoque físico completo del caos: atractores extraños, control del caos y sincronización caótica.',
      en: 'Complete physical approach to chaos: strange attractors, chaos control and chaotic synchronization.',
    },
  },
  {
    id: 'r-online-mathworld',
    kind: 'online',
    citation: {
      es: 'Weisstein, E. W. "Chaos." MathWorld — A Wolfram Web Resource.',
      en: 'Weisstein, E. W. "Chaos." MathWorld — A Wolfram Web Resource.',
    },
    note: {
      es: 'Artículo enciclopédico con definiciones, referencias y demos matemáticas del caos.',
      en: 'Encyclopedic article with definitions, references and mathematical demos of chaos.',
    },
    url: 'https://mathworld.wolfram.com/Chaos.html',
  },
  {
    id: 'r-online-mit',
    kind: 'online',
    citation: {
      es: 'MIT OpenCourseWare. "Dynamical Systems and Chaos" (Strogatz).',
      en: 'MIT OpenCourseWare. "Dynamical Systems and Chaos" (Strogatz).',
    },
    note: {
      es: 'Las conferencias completas de Strogatz en MIT con ejercicios y notas.',
      en: 'Complete Strogatz lectures from MIT with exercises and notes.',
    },
    url: 'https://ocw.mit.edu/courses/18-385j-nonlinear-dynamics-and-chaos-fall-2024/',
  },
  {
    id: 'r-online-3b1b',
    kind: 'online',
    citation: {
      es: '3Blue1Brown (Grant Sanderson). "Chaos" series. YouTube.',
      en: '3Blue1Brown (Grant Sanderson). "Chaos" series. YouTube.',
    },
    note: {
      es: 'Visualizaciones matemáticas de alta calidad que ilustran las bifurcaciones, atractores y la constante de Feigenbaum.',
      en: 'High-quality mathematical visualizations illustrating bifurcations, attractors, and the Feigenbaum constant.',
    },
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
  },
  {
    id: 'r-online-numberphile',
    kind: 'online',
    citation: {
      es: 'Numberphile. "The Feigenbaum Constant." YouTube.',
      en: 'Numberphile. "The Feigenbaum Constant." YouTube.',
    },
    note: {
      es: 'Explicación accesible de la constante de Feigenbaum y su universaldad.',
      en: 'Accessible explanation of the Feigenbaum constant and its universality.',
    },
    url: 'https://www.youtube.com/watch?v=ovJcsLHvapk',
  },
  {
    id: 'r-online-veritasium',
    kind: 'online',
    citation: {
      es: 'Veritasium. "This Equation Will Change How You See the World." YouTube.',
      en: 'Veritasium. "This Equation Will Change How You See the World." YouTube.',
    },
    note: {
      es: 'El efecto mariposa, Lorenz y por qué el caos transformó la ciencia.',
      en: 'The butterfly effect, Lorenz, and why chaos transformed science.',
    },
    url: 'https://www.youtube.com/watch?v=ovrcN--kB2I',
  },
  {
    id: 'r-online-wikipedia',
    kind: 'online',
    citation: {
      es: 'Wikipedia. "Teoría del caos."',
      en: 'Wikipedia. "Chaos theory."',
    },
    note: {
      es: 'Buen panorama general con definiciones, historia, aplicaciones y referencias bibliográficas extensas.',
      en: 'Good general overview with definitions, history, applications and extensive bibliography.',
    },
    url: 'https://es.wikipedia.org/wiki/Teor%C3%ADa_del_caos',
  },
  {
    id: 'r-online-fractallab',
    kind: 'tool',
    citation: {
      es: 'Aura Lab — Laboratorio Virtual de la Proporción Áurea.',
      en: 'Aura Lab — Virtual Laboratory of the Golden Ratio.',
    },
    note: {
      es: 'Esta aplicación web interactiva (donde estás ahora). Explora los diagramas, escucha la sonificación y realiza los ejercicios.',
      en: 'This interactive web application (where you are now). Explore the diagrams, listen to the sonification, and complete the exercises.',
    },
    url: 'https://sebastianl1.github.io/Fractalab/',
  },
];

export function getPrimaryResource(): ResourceEntry | undefined {
  return RESOURCES.find((r) => r.primary);
}
