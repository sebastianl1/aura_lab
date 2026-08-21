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
  'header.model': 'Estilo de Espiral:',
  'header.audio': 'Sonificar',
  'header.audio.playing': 'Pausar Sonido',
  'header.exercises': 'Ejercicios',
  'header.theory': 'Teoría & Proporción Áurea',

  // Barra de control
  'ctrl.n': 'Términos (n):',
  'ctrl.iso': 'Fibonacci ↔ φ:',
  'ctrl.palette': 'Paleta de Color:',
  'ctrl.phi': 'Mostrar φ',
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
  'banner.equation': 'Término Activo:',
  'banner.derivative': 'Razón F(n)/F(n−1):',
  'banner.principles':
    '💡 Principios: 1. La naturaleza dispone sus primordios con el ángulo áureo (137.5°). | 2. Cada par consecutivo de Fibonacci se acerca un paso a φ.',

  // Títulos de panel
  'panel.sequence': 'Sucesión de Fibonacci (F(n) en escala log)',
  'panel.sequence.sub': 'Cada término crece con la razón φ',
  'panel.phyllotaxis': 'Filotaxis — Ángulo Áureo 137.508°',
  'panel.phyllotaxis.sub': 'Haz clic para desplazar las semillas o usa la rueda para Zoom',
  'panel.sphere': 'Esfera de Fibonacci 3D (distribución φ)',
  'panel.sphere.sub': 'Arrastra con el mouse para rotar en 3D',
  'panel.inspector': 'Inspector Áureo & Métricas de Convergencia',
  'panel.ratio': 'Convergencia de la Razón → φ (F(n)/F(n−1))',
  'panel.ratio.sub': 'La línea roja marca la asíntota φ = 1.618…',
  'panel.pentagram': 'Pentágono & Pentagrama — Triángulo Áureo 36° / 72°',
  'panel.pentagram.sub': 'Arrastra para rotar la estrella y observar la proporción',
  'panel.goldenrect': 'Rectángulo Áureo & Teselación 1 : φ',
  'panel.goldenrect.sub': 'Muévete por la recursión del rectángulo áureo',

  // Ingeniería
  'eng.title': '🏭 Aplicaciones Reales de la Proporción Áurea',
  'eng.subtitle': 'Casos prácticos de φ en arquitectura, biología, finanzas, música y tecnología.',
  'eng.graph': 'Forma de Onda / Representación φ HD',
  'eng.tab.architecture': '🏛️ Arquitectura',
  'eng.tab.biology': '🌻 Biología',
  'eng.tab.nature': '🐚 Naturaleza',
  'eng.tab.markets': '📈 Mercados',
  'eng.tab.music': '🎼 Música',
  'eng.tab.telecom': '📡 Telecom & Diseño',

  // Idioma
  'lang.label': 'Idioma:',

  // Aprende
  'learn.title': 'Aprende la Sucesión Áurea',
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
    'Videos curados sobre Fibonacci, φ y filotaxis. Explorables también con los módulos interactivos.',
  'videos.comingSoon': 'Videos en preparación',

  // Recursos
  'resources.title': 'Recursos y Bibliografía',
  'resources.subtitle':
    'Fuentes académicas y referencias para profundizar en Fibonacci, la proporción áurea y la filotaxis.',
};

const en: Dict = {
  'tab.lab': 'Laboratory',
  'tab.aprende': 'Learn',
  'tab.ejemplos': 'Examples',
  'tab.videos': 'Videos',
  'tab.recursos': 'Resources',

  'header.model': 'Spiral Style:',
  'header.audio': 'Sonify',
  'header.audio.playing': 'Pause Sound',
  'header.exercises': 'Exercises',
  'header.theory': 'Theory & Golden Ratio',

  'ctrl.n': 'Terms (n):',
  'ctrl.iso': 'Fibonacci ↔ φ:',
  'ctrl.palette': 'Color Palette:',
  'ctrl.phi': 'Show φ',
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

  'banner.equation': 'Active Term:',
  'banner.derivative': 'Ratio F(n)/F(n−1):',
  'banner.principles':
    '💡 Principles: 1. Nature arranges its primordia with the golden angle (137.5°). | 2. Every consecutive Fibonacci pair steps closer to φ.',

  'panel.sequence': 'Fibonacci Sequence (F(n), log scale)',
  'panel.sequence.sub': 'Each term grows with the ratio φ',
  'panel.phyllotaxis': 'Phyllotaxis — Golden Angle 137.508°',
  'panel.phyllotaxis.sub': 'Click to pan the seeds or use the wheel to Zoom',
  'panel.sphere': '3D Fibonacci Sphere (φ distribution)',
  'panel.sphere.sub': 'Drag with the mouse to rotate in 3D',
  'panel.inspector': 'Golden Inspector & Convergence Metrics',
  'panel.ratio': 'Ratio Convergence → φ (F(n)/F(n−1))',
  'panel.ratio.sub': 'The red line marks the φ = 1.618… asymptote',
  'panel.pentagram': 'Pentagon & Pentagram — Golden Triangle 36° / 72°',
  'panel.pentagram.sub': 'Drag to rotate the star and observe the proportion',
  'panel.goldenrect': 'Golden Rectangle & 1 : φ Tiling',
  'panel.goldenrect.sub': 'Move through the golden rectangle recursion',

  'eng.title': '🏭 Real Applications of the Golden Ratio',
  'eng.subtitle': 'Practical cases of φ in architecture, biology, finance, music and technology.',
  'eng.graph': 'Waveform / HD φ Representation',
  'eng.tab.architecture': '🏛️ Architecture',
  'eng.tab.biology': '🌻 Biology',
  'eng.tab.nature': '🐚 Nature',
  'eng.tab.markets': '📈 Markets',
  'eng.tab.music': '🎼 Music',
  'eng.tab.telecom': '📡 Telecom & Design',

  'lang.label': 'Language:',

  'learn.title': 'Learn the Golden Sequence',
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
    'Curated videos about Fibonacci, φ and phyllotaxis. Also explorable with the interactive modules.',
  'videos.comingSoon': 'Videos in preparation',

  'resources.title': 'Resources & Bibliography',
  'resources.subtitle':
    'Academic sources and references to go deeper into Fibonacci, the golden ratio and phyllotaxis.',
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
