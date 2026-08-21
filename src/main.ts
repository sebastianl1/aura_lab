import { appState } from './core/AppState.js';
import { i18n, applyUIStrings } from './core/i18n.js';
import { parseHash, navigate } from './core/router.js';
import type { ViewId } from './core/router.js';
import { applyRouteToState, syncRouteFromState } from './core/urlState.js';
import { initOrrery } from './core/orrery.js';
import { SPIRAL_STYLES, PHI, fib, ratio } from './math/fibonacci.js';
import { renderLatex } from './math/latexHelper.js';
import { SequenceCanvas } from './components/SequenceCanvas.js';
import { PhyllotaxisShader } from './components/PhyllotaxisShader.js';
import { FibonacciSphere } from './components/FibonacciSphere.js';
import { GoldenInspector } from './components/GoldenInspector.js';
import { RatioConvergenceCanvas } from './components/RatioConvergenceCanvas.js';
import { PentagramCanvas } from './components/PentagramCanvas.js';
import { GoldenRectCanvas } from './components/GoldenRectCanvas.js';
import { Sonifier } from './components/Sonifier.js';
import type { MusicalMode } from './components/Sonifier.js';
import { TheoryModal } from './components/TheoryModal.js';
import { EngineeringCasePanel } from './components/EngineeringCasePanel.js';
import { GuidedExercisesPanel } from './components/GuidedExercisesPanel.js';
import { LearnView } from './components/LearnView.js';
import { ExamplesView } from './components/ExamplesView.js';
import { VideosView } from './components/VideosView.js';
import { ResourcesView } from './components/ResourcesView.js';
import { HeroPhi3D } from './components/HeroPhi3D.js';
import './styles/main.css';

function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

// Golden spiral (φ) hero 2D canvas (WebGL fallback).

export function initHeroSpiral(): void {
  const canvas = document.getElementById('hero-spiral') as HTMLCanvasElement | null;
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const cv = canvas;
  const ctx = context;

  let t = 0;
  const dpr = window.devicePixelRatio || 1;

  function resize(): void {
    const rect = cv.parentElement?.getBoundingClientRect();
    const w = rect?.width ?? 360;
    const h = rect?.height ?? 360;
    cv.width = Math.max(1, Math.round(w * dpr));
    cv.height = Math.max(1, Math.round(h * dpr));
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.scale(dpr, dpr);
  }

  function draw(): void {
    requestAnimationFrame(draw);
    const W = cv.width / dpr;
    const H = cv.height / dpr;
    if (cv.hidden || W === 0 || H === 0) return;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H / 2;
    const scale = Math.min(W, H) * 0.16;
    const turns = 6 + Math.sin(t * 0.001) * 0.5;
    const steps = 900;

    let started = false;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const a = p * turns * Math.PI * 2 + t * 0.004;
      const r = Math.pow(PHI, a / (Math.PI * 0.5)) * scale * 0.06;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const hue = 45 + p * 20;
      const alpha = 0.35 + 0.55 * (1 - p);
      ctx.strokeStyle = `hsla(${hue}, 95%, 60%, ${alpha})`;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
      if (i % 24 === 0) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
    ctx.stroke();
    t += 16;
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

function initHero3D(): void {
  const container = document.getElementById('hero-phi3d') as HTMLElement | null;
  const fallback = document.getElementById('hero-spiral') as HTMLCanvasElement | null;
  if (!container) {
    if (fallback) fallback.hidden = false;
    return;
  }
  if (fallback) {
    // Keep the 2D spiral running as a decorative underlay.
    initHeroSpiral();
    fallback.hidden = true;
  }
  new HeroPhi3D(container, fallback ?? document.createElement('canvas'));
}

document.addEventListener('DOMContentLoaded', () => {
  const selectStyle = $<HTMLSelectElement>('select-style');
  const sliderN = $<HTMLInputElement>('slider-n');
  const labelNVal = $<HTMLElement>('label-n-val');
  const selectPalette = $<HTMLSelectElement>('select-palette');
  const checkPhi = $<HTMLInputElement>('check-phi');
  const btnReset = $<HTMLButtonElement>('btn-reset');
  const btnAudio = $<HTMLButtonElement>('btn-audio');
  const audioText = $<HTMLElement>('audio-text');
  const audioIcon = $<HTMLElement>('audio-icon');
  const btnTheory = $<HTMLButtonElement>('btn-theory');
  const modalBackdrop = $<HTMLElement>('modal-backdrop');
  const modalTheory = $<HTMLElement>('modal-theory');
  const modalCloseBtn = $<HTMLButtonElement>('modal-close-btn');
  const modalUnderstandBtn = $<HTMLButtonElement>('modal-understand-btn');
  const btnExercises = $<HTMLButtonElement>('btn-exercises');
  const modalExBackdrop = $<HTMLElement>('modal-exercises-backdrop');
  const modalExercises = $<HTMLElement>('modal-exercises');
  const modalExCloseBtn = $<HTMLButtonElement>('modal-ex-close-btn');
  const modalExCloseFooter = $<HTMLButtonElement>('modal-ex-close-footer');
  const inspectorContainer = $<HTMLElement>('inspector-container');
  const activeEquationDisplay = $<HTMLElement>('latex-equation');
  const activeDerivativeDisplay = $<HTMLElement>('latex-derivative');
  const connectorNText = $<HTMLElement>('connector-n-text');
  const connectorPhiText = $<HTMLElement>('connector-phi-text');
  const connectorLatex = $<HTMLElement>('connector-latex');
  const btnLang = $<HTMLButtonElement>('btn-lang');
  const learnContainer = $<HTMLElement>('learn-view');
  const examplesContainer = $<HTMLElement>('examples-view');
  const videosContainer = $<HTMLElement>('videos-view');
  const resourcesContainer = $<HTMLElement>('resources-view');
  const selectSoundMode = $<HTMLSelectElement>('select-sound-mode');
  const selectPreset = $<HTMLSelectElement>('select-preset');
  const labelNote = $<HTMLElement>('label-note');

  const inspector = new GoldenInspector(inspectorContainer);
  const sonifier = new Sonifier();
  const theoryModal = new TheoryModal(modalTheory, modalBackdrop);

  const phyllotaxis = new PhyllotaxisShader($<HTMLCanvasElement>('canvas-phyllotaxis'));
  const sequence = new SequenceCanvas($<HTMLCanvasElement>('canvas-sequence'));
  const sphere = new FibonacciSphere($<HTMLCanvasElement>('canvas-sphere'));
  const ratioCanvas = new RatioConvergenceCanvas($<HTMLCanvasElement>('canvas-ratio'));
  const pentagram = new PentagramCanvas($<HTMLCanvasElement>('canvas-pentagram'));
  const goldenRect = new GoldenRectCanvas($<HTMLCanvasElement>('canvas-goldenrect'));

  new EngineeringCasePanel((styleId, n) => {
    appState.styleId = styleId;
    appState.n = n;
  });

  const exercisesPanel = new GuidedExercisesPanel(
    modalExercises,
    modalExBackdrop,
    () => appState.n,
    (styleId, n) => {
      appState.styleId = styleId;
      appState.n = n;
    },
  );

  const learnView = new LearnView(learnContainer, (styleId, n) => {
    appState.styleId = styleId;
    appState.n = n;
    navigate('lab');
    syncRouteFromState();
  });

  const examplesView = new ExamplesView(examplesContainer, (styleId, n) => {
    appState.styleId = styleId;
    appState.n = n;
    navigate('lab');
    syncRouteFromState();
  });

  const videosView = new VideosView(videosContainer);
  const resourcesView = new ResourcesView(resourcesContainer);

  // Populate the spiral-style selector.
  selectStyle.innerHTML = '';
  for (const s of SPIRAL_STYLES) {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.label;
    selectStyle.appendChild(opt);
  }

  function syncUI(): void {
    const n = appState.n;
    const fn = fib(n);
    const r = ratio(n);

    selectStyle.value = appState.styleId;
    sliderN.min = '3';
    sliderN.max = '1000';
    sliderN.step = '1';
    sliderN.value = String(n);
    labelNVal.textContent = String(n);

    connectorNText.textContent = `F(${n}) ≈ ${fn.toPrecision(6)}`;
    connectorPhiText.textContent = PHI.toFixed(10);
    renderLatex(
      connectorLatex,
      `F(${n}) = ${fn.toPrecision(4)} \\;,\\; \\frac{F(${n + 1})}{F(${n})} = ${ratio(n + 1).toFixed(6)}`,
    );
    renderLatex(activeEquationDisplay, `F(${n}) = ${fn.toPrecision(5)}`);
    renderLatex(
      activeDerivativeDisplay,
      `\\frac{F(${n + 1})}{F(${n})} = ${r.toFixed(6)} \\approx \\varphi`,
    );

    sequence.setN(n);
    ratioCanvas.setN(n);
    pentagram.setN(n);
    goldenRect.setN(n);
    phyllotaxis.setN(n);
    sphere.setN(n);
    inspector.update(n);
    sonifier.setN(n);
    ratioCanvas.setShowPhi(appState.showPhi);

    if (sonifier.isPlaying) sonifier.setN(n);
    exercisesPanel.updateCurrentNDisplay();
  }

  let syncRafId: number | null = null;
  function scheduleSyncUI(): void {
    if (syncRafId !== null) return;
    syncRafId = requestAnimationFrame(() => {
      syncRafId = null;
      syncUI();
    });
  }

  // ---- Tab routing -------------------------------------------------------
  function showView(view: ViewId): void {
    document.querySelectorAll<HTMLElement>('[data-view]').forEach((el) => {
      el.classList.toggle('active', el.dataset.view === view);
    });
    document.querySelectorAll<HTMLElement>('[data-view-link]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.viewLink === view);
    });
    if (view === 'lab') {
      setTimeout(handleResize, 60);
    } else if (view === 'aprende') {
      learnView.render(i18n.lang);
    } else if (view === 'ejemplos') {
      examplesView.render(i18n.lang);
    } else if (view === 'videos') {
      videosView.render(i18n.lang);
    } else if (view === 'recursos') {
      resourcesView.render(i18n.lang);
    }
  }

  function handleRouteChange(): void {
    const route = parseHash();
    showView(route.view);
    applyRouteToState();
  }

  document.querySelectorAll<HTMLElement>('[data-view-link]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.viewLink as ViewId | undefined;
      if (view) navigate(view);
    });
  });

  // ---- Language ----------------------------------------------------------
  btnLang.addEventListener('click', () => i18n.toggle());

  i18n.onLangChange(() => {
    applyUIStrings();
    btnLang.textContent = i18n.lang.toUpperCase();
    if (sonifier.isPlaying) audioText.textContent = i18n.t('header.audio.playing');
    learnView.setLang(i18n.lang);
    examplesView.render(i18n.lang);
    videosView.render(i18n.lang);
    resourcesView.render(i18n.lang);
  });

  selectStyle.addEventListener('change', (e) => {
    appState.styleId = (e.target as HTMLSelectElement).value;
  });

  sliderN.addEventListener('input', (e) => {
    appState.n = parseInt((e.target as HTMLInputElement).value, 10);
  });

  selectPalette.addEventListener('change', (e) => {
    const palette = parseInt((e.target as HTMLSelectElement).value, 10);
    appState.palette = palette;
    phyllotaxis.setPalette(palette);
    sequence.setPalette(palette);
    sphere.setPalette(palette);
    ratioCanvas.setPalette(palette);
    pentagram.setPalette(palette);
    goldenRect.setPalette(palette);
    inspector.setPalette(palette);
  });

  checkPhi.addEventListener('change', (e) => {
    appState.showPhi = (e.target as HTMLInputElement).checked;
    ratioCanvas.setShowPhi(appState.showPhi);
  });

  btnReset.addEventListener('click', () => {
    phyllotaxis.resetView();
    appState.n = 233;
  });

  btnAudio.addEventListener('click', () => {
    const isPlaying = sonifier.togglePlay();
    audioText.textContent = isPlaying ? 'Pausar Sonido' : 'Sonificar Órbita';
    audioIcon.textContent = isPlaying ? '⏸️' : '🔊';
    btnAudio.classList.toggle('btn-primary', isPlaying);
  });

  sonifier.onNotePlayed = (note) => {
    labelNote.textContent = note;
  };

  selectSoundMode.addEventListener('change', (e) => {
    sonifier.musicalMode = (e.target as HTMLSelectElement).value as MusicalMode;
    selectPreset.value = '';
  });

  selectPreset.addEventListener('change', (e) => {
    const presetId = (e.target as HTMLSelectElement).value;
    if (presetId) sonifier.applyPreset(presetId);
  });

  btnTheory.addEventListener('click', () => theoryModal.open());
  modalCloseBtn.addEventListener('click', () => theoryModal.close());
  modalUnderstandBtn.addEventListener('click', () => theoryModal.close());
  modalBackdrop.addEventListener('click', () => theoryModal.close());

  btnExercises.addEventListener('click', () => exercisesPanel.open());
  modalExCloseBtn.addEventListener('click', () => exercisesPanel.close());
  modalExCloseFooter.addEventListener('click', () => exercisesPanel.close());
  modalExBackdrop.addEventListener('click', () => exercisesPanel.close());

  function handleResize(): void {
    sequence.resize();
    phyllotaxis.resize();
    sphere.resize();
    ratioCanvas.resize();
    pentagram.resize();
    goldenRect.resize();
  }

  window.addEventListener('resize', handleResize);

  document.querySelectorAll('.btn-fullscreen').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      const canvasId = target.dataset.fullscreen;
      const panel = target.closest('.canvas-panel');
      if (!panel || !canvasId) return;
      panel.classList.toggle('maximized');
      target.textContent = panel.classList.contains('maximized') ? '✕' : '⛶';
      setTimeout(() => {
        if (canvasId === 'canvas-phyllotaxis') phyllotaxis.resize();
        else if (canvasId === 'canvas-sequence') sequence.resize();
        else if (canvasId === 'canvas-sphere') sphere.resize();
        else if (canvasId === 'canvas-ratio') ratioCanvas.resize();
        else if (canvasId === 'canvas-pentagram') pentagram.resize();
        else if (canvasId === 'canvas-goldenrect') goldenRect.resize();
      }, 50);
    });
  });

  // Export any panel canvas to PNG.
  document.querySelectorAll<HTMLElement>('.btn-export').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.canvas-panel');
      const canvas = panel?.querySelector<HTMLCanvasElement>('canvas');
      if (!canvas || !panel) return;
      const title = panel.querySelector('.panel-title')?.textContent?.trim() ?? 'aura-lab';
      const a = document.createElement('a');
      a.download = `${title.replace(/[^\w-]+/g, '-').toLowerCase()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.canvas-panel.maximized').forEach((p) => {
        p.classList.remove('maximized');
        const btn = p.querySelector('.btn-fullscreen');
        if (btn) btn.textContent = '⛶';
        setTimeout(handleResize, 50);
      });
    }
  });

  let routeRafId: number | null = null;
  const scheduleRouteSync = (): void => {
    if (routeRafId !== null) return;
    routeRafId = requestAnimationFrame(() => {
      routeRafId = null;
      syncRouteFromState();
    });
  };

  appState.on('nChange', () => scheduleSyncUI());
  appState.on('nChange', () => scheduleRouteSync());
  appState.on('styleChange', () => scheduleSyncUI());
  appState.on('styleChange', () => scheduleRouteSync());
  appState.on('showPhiChange', () => scheduleSyncUI());
  appState.on('showPhiChange', () => scheduleRouteSync());
  appState.on('paletteChange', () => scheduleRouteSync());

  window.addEventListener('hashchange', handleRouteChange);

  // Apply URL params and current language before the first paint.
  applyRouteToState();
  applyUIStrings();
  btnLang.textContent = i18n.lang.toUpperCase();
  handleRouteChange();
  initOrrery();
  initHero3D();

  syncUI();
  setTimeout(handleResize, 100);
});
