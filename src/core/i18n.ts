export type Lang = 'es' | 'en';

type Dict = Record<string, string>;

const es: Dict = {
  // Pestañas
  'tab.lab': 'Laboratorio',
  'tab.aprende': 'Aprende',
  'tab.ejemplos': 'Ejemplos',
  'tab.videos': 'Videos',
  'tab.recursos': 'Recursos',

  // Cabecera
  'header.model': 'Modelo Matemático:',
  'header.degree': 'Grado k:',
  'header.audio': 'Sonificar',
  'header.audio.playing': 'Pausar Sonido',
  'header.exercises': 'Ejercicios',
  'header.theory': 'Teoría & Proporción Áurea',

  // Barra de control
  'ctrl.r': 'Parámetro r:',
  'ctrl.iso': 'Isomorfismo:',
  'ctrl.palette': 'Paleta de Color:',
  'ctrl.lyapunov': 'Convergencia (λ)',
  'ctrl.reset': 'Reiniciar Vistas',
  'ctrl.soundMode': 'Sonido:',
  'ctrl.mode.scale': 'Escala pentatónica',
  'ctrl.mode.glissando': 'Glissando continuo',
  'ctrl.tempo': 'Tempo:',
  'sound.mode': 'Modo:',
  'sound.mode.pentMinor': 'Pentatónica menor',
  'sound.mode.pentMajor': 'Pentatónica mayor',
  'sound.mode.minor': 'Menor natural',
  'sound.mode.lydian': 'Lidio',
  'sound.mode.dorian': 'Dórico',
  'sound.mode.blues': 'Blues',
  'sound.mode.chromatic': 'Cromática',
  'sound.mode.chords': 'Acordes piano',
  'sound.mode.glissando': 'Glissando continuo',
  'sound.preset': 'Estilo:',
  'sound.preset.melancholic': 'Melancólica (Einaudi)',
  'sound.preset.classic': 'Clásica (Beethoven)',
  'sound.preset.serenade': 'Serenata (Debussy)',

  // Banner teórico
  'banner.equation': 'Ecuación Activa:',
  'banner.derivative': "Derivada f'(x):",
  'banner.principles':
    '💡 Principios: 1. La proporción áurea emerge en toda órbita. | 2. La Espiral Áurea es un "atlas" de órbitas cuadráticas.',

  // Títulos de panel
  'panel.bifurcation': 'Árbol de Fibonacci HD (r vs x)',
  'panel.bifurcation.sub': 'Arrastra la línea vertical para explorar el parámetro r',
  'panel.mandelbrot': 'Espiral Áurea & Atlas φ (c ∈ [-2.0, 0.25])',
  'panel.mandelbrot.sub': 'Haz clic para seleccionar c o usa la rueda para Zoom',
  'panel.phasespace': 'Espacio de Fases Tridimensional 3D (xₙ, xₙ₊₁, xₙ₊₂)',
  'panel.phasespace.sub': 'Arrastra con el mouse para rotar en 3D',
  'panel.inspector': 'Inspector Matemático & Convergencia de la Órbita',
  'panel.cobweb': 'Diagrama de Telaraña (Cobweb Plot: xₙ₊₁ = f(xₙ))',
  'panel.cobweb.sub': 'Arrastra la condición inicial x₀ en la base',
  'panel.timeseries': 'Serie Temporal xₙ',
  'panel.timeseries.sub': 'Evolución de la órbita frente a n',
  'panel.histogram': 'Histograma de la Órbita',
  'panel.histogram.sub': 'Distribución de valores visitados por la órbita',

  // Ingeniería
  'eng.title': '🏭 Aplicaciones Reales en Ingeniería',
  'eng.subtitle': 'Casos prácticos de dinámicas no lineales en sistemas reales.',
  'eng.graph': 'Forma de Onda Temporal / Respuesta de Fases HD',
  'eng.tab.electrical': '⚡ Eléctrica',
  'eng.tab.process': '🧪 Procesos',
  'eng.tab.mechanical': '⚙️ Mecánica',
  'eng.tab.environmental': '🌱 Ambiental',
  'eng.tab.computer': '💻 Informática',
  'eng.tab.telecom': '📡 Telecom',

  // Idioma
  'lang.label': 'Idioma:',

  // Aprende
  'learn.title': 'Aprende la Proporción Áurea',
  'learn.subtitle':
    'Módulos guiados con teoría, ecuaciones y la espiral áurea como hilo conductor.',
  'learn.modules': 'Módulos',
  'learn.lessons': 'Lecciones',
  'learn.openLab': 'Abrir en Laboratorio',
  'learn.quiz': 'Autoevaluación',
  'learn.check': 'Verificar respuesta',
  'learn.correct': '¡Correcto!',
  'learn.incorrect': 'Inténtalo de nuevo.',
  'learn.glossary': 'Glosario',
  'learn.keyPoints': 'Ideas clave',
  'learn.takeaway': 'Idea Final',
  'learn.backToModules': '← Volver a módulos',

  // Videos
  'videos.title': 'Videolecciones',
  'videos.subtitle':
    'Próximamente: videolecciones guiadas paso a paso. Por ahora puedes explorar los módulos interactivos.',
  'videos.comingSoon': 'Videos en preparación',

  // Recursos
  'resources.title': 'Recursos y Bibliografía',
  'resources.subtitle':
    'Fuentes académicas y referencias para profundizar en Fibonacci, la proporción áurea y la dinámica de órbitas.',
};

const en: Dict = {
  'tab.lab': 'Laboratory',
  'tab.aprende': 'Learn',
  'tab.ejemplos': 'Examples',
  'tab.videos': 'Videos',
  'tab.recursos': 'Resources',

  'header.model': 'Mathematical Model:',
  'header.degree': 'Degree k:',
  'header.audio': 'Sonify',
  'header.audio.playing': 'Pause Sound',
  'header.exercises': 'Exercises',
  'header.theory': 'Theory & Golden Ratio',

  'ctrl.r': 'Parameter r:',
  'ctrl.iso': 'Isomorphism:',
  'ctrl.palette': 'Color Palette:',
  'ctrl.lyapunov': 'Convergence (λ)',
  'ctrl.reset': 'Reset Views',
  'ctrl.soundMode': 'Sound:',
  'ctrl.mode.scale': 'Pentatonic scale',
  'ctrl.mode.glissando': 'Continuous glissando',
  'ctrl.tempo': 'Tempo:',
  'sound.mode': 'Scale:',
  'sound.mode.pentMinor': 'Minor pentatonic',
  'sound.mode.pentMajor': 'Major pentatonic',
  'sound.mode.minor': 'Natural minor',
  'sound.mode.lydian': 'Lydian',
  'sound.mode.dorian': 'Dorian',
  'sound.mode.blues': 'Blues',
  'sound.mode.chromatic': 'Chromatic',
  'sound.mode.chords': 'Piano chords',
  'sound.mode.glissando': 'Continuous glissando',
  'sound.preset': 'Style:',
  'sound.preset.melancholic': 'Melancholy (Einaudi)',
  'sound.preset.classic': 'Classical (Beethoven)',
  'sound.preset.serenade': 'Serenade (Debussy)',

  'banner.equation': 'Active Equation:',
  'banner.derivative': "Derivative f'(x):",
  'banner.principles':
    '💡 Principles: 1. The golden ratio emerges in every orbit. | 2. The Golden Spiral is an "atlas" of quadratic orbits.',

  'panel.bifurcation': 'HD Fibonacci Tree (r vs x)',
  'panel.bifurcation.sub': 'Drag the vertical line to explore parameter r',
  'panel.mandelbrot': 'Golden Spiral & φ Atlas (c ∈ [-2.0, 0.25])',
  'panel.mandelbrot.sub': 'Click to select c or use the wheel to Zoom',
  'panel.phasespace': '3D Phase Space (xₙ, xₙ₊₁, xₙ₊₂)',
  'panel.phasespace.sub': 'Drag with the mouse to rotate in 3D',
  'panel.inspector': 'Mathematical Inspector & Orbit Convergence',
  'panel.cobweb': 'Cobweb Plot (xₙ₊₁ = f(xₙ))',
  'panel.cobweb.sub': 'Drag the initial condition x₀ along the base',
  'panel.timeseries': 'Time Series xₙ',
  'panel.timeseries.sub': 'Orbit evolution vs n',
  'panel.histogram': 'Orbit Histogram',
  'panel.histogram.sub': 'Distribution of values visited by the orbit',

  'eng.title': '🏭 Real Engineering Applications',
  'eng.subtitle': 'Practical cases of nonlinear dynamics in real systems.',
  'eng.graph': 'Time Waveform / HD Phase Response',
  'eng.tab.electrical': '⚡ Electrical',
  'eng.tab.process': '🧪 Process',
  'eng.tab.mechanical': '⚙️ Mechanical',
  'eng.tab.environmental': '🌱 Environmental',
  'eng.tab.computer': '💻 Computer',
  'eng.tab.telecom': '📡 Telecom',

  'lang.label': 'Language:',

  'learn.title': 'Learn the Golden Ratio',
  'learn.subtitle':
    'Guided modules with theory, equations and the golden spiral as guiding thread.',
  'learn.modules': 'Modules',
  'learn.lessons': 'Lessons',
  'learn.openLab': 'Open in Laboratory',
  'learn.quiz': 'Self-assessment',
  'learn.check': 'Check answer',
  'learn.correct': 'Correct!',
  'learn.incorrect': 'Try again.',
  'learn.glossary': 'Glossary',
  'learn.keyPoints': 'Key ideas',
  'learn.takeaway': 'Key Takeaway',
  'learn.backToModules': '← Back to modules',

  'videos.title': 'Video Lessons',
  'videos.subtitle':
    'Coming soon: guided step-by-step video lessons. For now, explore the interactive modules.',
  'videos.comingSoon': 'Videos in preparation',

  'resources.title': 'Resources & Bibliography',
  'resources.subtitle':
    'Academic sources and references about Fibonacci, the golden ratio and orbit dynamics.',
};

class I18n {
  private _lang: Lang;
  private listeners: Array<(lang: Lang) => void> = [];

  constructor() {
    this._lang = 'es';
    document.documentElement.lang = 'es';
  }

  get lang(): Lang {
    return this._lang;
  }

  setLang(lang: Lang): void {
    if (this._lang === lang) return;
    this._lang = lang;
    document.documentElement.lang = lang;
    this.listeners.forEach((fn) => fn(lang));
  }

  toggle(): Lang {
    this.setLang(this._lang === 'es' ? 'en' : 'es');
    return this._lang;
  }

  onLangChange(fn: (lang: Lang) => void): void {
    this.listeners.push(fn);
  }

  t(key: string): string {
    const dict: Dict = this._lang === 'es' ? es : en;
    return dict[key] ?? es[key] ?? key;
  }
}

export const i18n = new I18n();

/** Apply the active language to every element annotated with `data-i18n`. */
export function applyUIStrings(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = i18n.t(key);
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.placeholder = i18n.t(key);
  });
}
