import { appState } from './core/AppState.js';
import { i18n, applyUIStrings } from './core/i18n.js';
import { parseHash, navigate } from './core/router.js';
import type { ViewId } from './core/router.js';
import { applyRouteToState, syncRouteFromState } from './core/urlState.js';
import { initOrrery } from './core/orrery.js';
import { globalModelRegistry } from './math/models/ModelRegistry.js';
import { MandelbrotShader } from './components/MandelbrotShader.js';
import { BifurcationCanvas } from './components/BifurcationCanvas.js';
import { CobwebCanvas } from './components/CobwebCanvas.js';
import { ThreePhaseScene } from './components/ThreePhaseScene.js';
import { Sonifier } from './components/Sonifier.js';
import type { MusicalMode } from './components/Sonifier.js';
import { InspectorPanel } from './components/InspectorPanel.js';
import { TheoryModal } from './components/TheoryModal.js';
import { EngineeringCasePanel } from './components/EngineeringCasePanel.js';
import { GuidedExercisesPanel } from './components/GuidedExercisesPanel.js';
import { LearnView } from './components/LearnView.js';
import { ExamplesView } from './components/ExamplesView.js';
import { VideosView } from './components/VideosView.js';
import { ResourcesView } from './components/ResourcesView.js';
import { TimeSeriesCanvas } from './components/TimeSeriesCanvas.js';
import { HistogramCanvas } from './components/HistogramCanvas.js';
import { renderLatex } from './math/latexHelper.js';

function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

document.addEventListener('DOMContentLoaded', () => {
  const selectModel = $<HTMLSelectElement>('select-model');
  const polyKContainer = $<HTMLElement>('poly-k-container');
  const selectPolyK = $<HTMLSelectElement>('select-poly-k');
  const sliderR = $<HTMLInputElement>('slider-r');
  const labelRVal = $<HTMLElement>('label-r-val');
  const selectPalette = $<HTMLSelectElement>('select-palette');
  const checkLyapunov = $<HTMLInputElement>('check-lyapunov');
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
  const connectorRText = $<HTMLElement>('connector-r-text');
  const connectorCText = $<HTMLElement>('connector-c-text');
  const connectorLatex = $<HTMLElement>('connector-latex');
  const btnLang = $<HTMLButtonElement>('btn-lang');
  const learnContainer = $<HTMLElement>('learn-view');
  const examplesContainer = $<HTMLElement>('examples-view');
  const videosContainer = $<HTMLElement>('videos-view');
  const resourcesContainer = $<HTMLElement>('resources-view');
  const selectSoundMode = $<HTMLSelectElement>('select-sound-mode');
  const selectPreset = $<HTMLSelectElement>('select-preset');
  const labelNote = $<HTMLElement>('label-note');

  const inspector = new InspectorPanel(inspectorContainer);
  const sonifier = new Sonifier();
  const theoryModal = new TheoryModal(modalTheory, modalBackdrop);

  const mandelbrot = new MandelbrotShader(
    $<HTMLCanvasElement>('canvas-mandelbrot'),
    (selectedC) => {
      const r = appState.model.cToR(selectedC);
      appState.r = r;
    },
  );

  const bifurcation = new BifurcationCanvas(
    $<HTMLCanvasElement>('canvas-bifurcation'),
    (selectedR) => {
      appState.r = selectedR;
    },
  );

  const cobweb = new CobwebCanvas($<HTMLCanvasElement>('canvas-cobweb'));
  const timeSeries = new TimeSeriesCanvas($<HTMLCanvasElement>('canvas-timeseries'));
  const histogram = new HistogramCanvas($<HTMLCanvasElement>('canvas-histogram'));
  const phaseSpace = new ThreePhaseScene($<HTMLCanvasElement>('canvas-3d-phase'));

  new EngineeringCasePanel((modelId, targetR) => {
    appState.modelId = modelId;
    appState.r = targetR;
  });

  const exercisesPanel = new GuidedExercisesPanel(
    modalExercises,
    modalExBackdrop,
    () => appState.r,
    (modelId, targetR) => {
      appState.modelId = modelId;
      appState.r = targetR;
    },
  );

  const learnView = new LearnView(learnContainer, (modelId, r) => {
    appState.modelId = modelId;
    appState.r = r;
    navigate('lab');
    syncRouteFromState();
  });

  const examplesView = new ExamplesView(examplesContainer, (modelId, r) => {
    appState.modelId = modelId;
    appState.r = r;
    navigate('lab');
    syncRouteFromState();
  });

  const videosView = new VideosView(videosContainer);
  const resourcesView = new ResourcesView(resourcesContainer);

  // Populate the model selector dynamically from the registry.
  const modelOptions = globalModelRegistry.list();
  selectModel.innerHTML = '';
  for (const m of modelOptions) {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.name}: ${m.asciiFormula}`;
    selectModel.appendChild(opt);
  }

  function syncUI(): void {
    const model = appState.model;
    const r = appState.r;
    const c = appState.c;

    selectModel.value = model.id;
    polyKContainer.style.display = model.id === 'polynomial' ? 'inline-flex' : 'none';

    sliderR.min = String(model.rRange.min);
    sliderR.max = String(model.rRange.max);
    sliderR.step = String((model.rRange.max - model.rRange.min) / 10000);
    sliderR.value = String(r);

    labelRVal.textContent = r.toFixed(4);
    connectorRText.textContent = `r = ${r.toFixed(4)}`;
    connectorCText.textContent = `c = ${c.toFixed(4)}`;
    renderLatex(connectorLatex, `${model.isomorphismLatex} = ${c.toFixed(4)}`);

    renderLatex(activeEquationDisplay, model.equationLatex);
    renderLatex(activeDerivativeDisplay, model.derivativeLatex);

    bifurcation.setModel(model);
    bifurcation.setSelectedR(r);
    cobweb.setModel(model);
    cobweb.setR(r);
    timeSeries.setModel(model);
    timeSeries.setR(r);
    histogram.setModel(model);
    histogram.setR(r);
    phaseSpace.setModel(model);
    phaseSpace.setR(r);
    inspector.setModel(model);
    inspector.update(r);
    sonifier.setModel(model);
    mandelbrot.setModel(model);
    mandelbrot.setSelectedR(r);

    if (sonifier.isPlaying) sonifier.setR(r);
    exercisesPanel.updateCurrentRDisplay();
  }

  // Coalesce multiple state changes in the same frame into a single sync.
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

  selectModel.addEventListener('change', (e) => {
    appState.modelId = (e.target as HTMLSelectElement).value;
  });

  selectPolyK.addEventListener('change', (e) => {
    appState.setPolynomialK(parseInt((e.target as HTMLSelectElement).value, 10));
  });

  sliderR.addEventListener('input', (e) => {
    appState.r = parseFloat((e.target as HTMLInputElement).value);
  });

  selectPalette.addEventListener('change', (e) => {
    const palette = parseInt((e.target as HTMLSelectElement).value, 10);
    appState.palette = palette;
    mandelbrot.setPalette(palette);
  });

  checkLyapunov.addEventListener('change', (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    appState.lyapunovEnabled = checked;
    bifurcation.toggleLyapunov(checked);
  });

  btnReset.addEventListener('click', () => {
    mandelbrot.resetView();
    bifurcation.resetZoom();
    appState.r = appState.model.defaultR;
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
    // Reset preset to custom when manually changing mode
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
    mandelbrot.resize();
    bifurcation.resize();
    cobweb.resize();
    timeSeries.resize();
    histogram.resize();
    phaseSpace.resize();
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
        if (canvasId === 'canvas-mandelbrot') mandelbrot.resize();
        else if (canvasId === 'canvas-bifurcation') bifurcation.resize();
        else if (canvasId === 'canvas-cobweb') cobweb.resize();
        else if (canvasId === 'canvas-timeseries') timeSeries.resize();
        else if (canvasId === 'canvas-histogram') histogram.resize();
        else if (canvasId === 'canvas-3d-phase') phaseSpace.resize();
      }, 50);
    });
  });

  // Export any panel canvas to PNG.
  document.querySelectorAll<HTMLElement>('.btn-export').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.canvas-panel');
      const canvas = panel?.querySelector<HTMLCanvasElement>('canvas');
      if (!canvas || !panel) return;
      const title = panel.querySelector('.panel-title')?.textContent?.trim() ?? 'fractalab';
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

  // Reflect state back into the URL (lab view only), debounced.
  let routeRafId: number | null = null;
  const scheduleRouteSync = (): void => {
    if (routeRafId !== null) return;
    routeRafId = requestAnimationFrame(() => {
      routeRafId = null;
      syncRouteFromState();
    });
  };

  appState.on('modelChange', () => scheduleSyncUI());
  appState.on('rChange', () => scheduleSyncUI());
  appState.on('rChange', () => scheduleRouteSync());
  appState.on('modelChange', () => scheduleRouteSync());
  appState.on('paletteChange', () => scheduleRouteSync());

  window.addEventListener('hashchange', handleRouteChange);

  // Apply URL params and current language before the first paint.
  applyRouteToState();
  applyUIStrings();
  btnLang.textContent = i18n.lang.toUpperCase();
  handleRouteChange();
  initOrrery();
  initHeroSpiral();

  syncUI();
  setTimeout(handleResize, 100);
});

// Golden spiral (φ) hero · auto-drawn logarithmic spiral in gold → red.
const PHI = (1 + Math.sqrt(5)) / 2;

function initHeroSpiral(): void {
  const canvas = document.getElementById('hero-spiral') as HTMLCanvasElement | null;
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const cv = canvas;
  const ctx = context;

  let t = 0;
  const dpr = window.devicePixelRatio || 1;

  function resize(): void {
    const rect = cv.parentElement!.getBoundingClientRect();
    cv.width = Math.max(1, Math.round(rect.width * dpr));
    cv.height = Math.max(1, Math.round(rect.height * dpr));
    cv.style.width = rect.width + 'px';
    cv.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.scale(dpr, dpr);
  }

  function draw(): void {
    const W = cv.width / dpr;
    const H = cv.height / dpr;
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
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}
