import { GUIDED_EXERCISES } from '../math/guidedExercises.js';

/** Guided student lab challenges modal with live parameter verification. */
export class GuidedExercisesPanel {
  private modal: HTMLElement;
  private backdrop: HTMLElement;
  private getCurrentR: () => number;
  private onSelectModelAndR: (modelId: string, targetR: number) => void;

  private currentExId = 'ex1';
  private titleEl: HTMLElement | null;
  private descEl: HTMLElement | null;
  private instructionEl: HTMLElement | null;
  private targetLabelEl: HTMLElement | null;
  private currentLabelEl: HTMLElement | null;
  private feedbackEl: HTMLElement | null;
  private questionEl: HTMLElement | null;
  private optionsContainer: HTMLElement | null;
  private btnVerify: HTMLButtonElement | null;
  private navBtns: NodeListOf<HTMLButtonElement>;

  constructor(
    modalElement: HTMLElement,
    backdropElement: HTMLElement,
    getCurrentR: () => number,
    onSelectModelAndR: (modelId: string, targetR: number) => void,
  ) {
    this.modal = modalElement;
    this.backdrop = backdropElement;
    this.getCurrentR = getCurrentR;
    this.onSelectModelAndR = onSelectModelAndR;

    this.titleEl = document.getElementById('ex-title');
    this.descEl = document.getElementById('ex-desc');
    this.instructionEl = document.getElementById('ex-instruction');
    this.targetLabelEl = document.getElementById('ex-target-label');
    this.currentLabelEl = document.getElementById('ex-current-label');
    this.feedbackEl = document.getElementById('ex-feedback');
    this.questionEl = document.getElementById('ex-question');
    this.optionsContainer = document.getElementById('ex-options-container');

    this.btnVerify = document.getElementById('btn-verify-r') as HTMLButtonElement | null;
    this.navBtns = this.modal.querySelectorAll('.ex-nav-btn');

    this.initEvents();
  }

  open(): void {
    this.modal.classList.add('active');
    this.backdrop.classList.add('active');
    this.selectExercise(this.currentExId);
  }

  close(): void {
    this.modal.classList.remove('active');
    this.backdrop.classList.remove('active');
  }

  private initEvents(): void {
    this.navBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const exId = target.dataset.ex;
        if (exId) this.selectExercise(exId);
      });
    });

    this.btnVerify?.addEventListener('click', () => this.verifyCurrentR());
  }

  private selectExercise(exId: string): void {
    this.currentExId = exId;
    const exData = GUIDED_EXERCISES.find((e) => e.id === exId) ?? GUIDED_EXERCISES[0]!;

    this.navBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.ex === exId);
    });

    if (this.titleEl) this.titleEl.textContent = exData.title;
    if (this.descEl) this.descEl.textContent = exData.description;
    if (this.instructionEl) this.instructionEl.textContent = exData.instruction;
    if (this.targetLabelEl) this.targetLabelEl.textContent = exData.targetR.toFixed(4);

    this.updateCurrentRDisplay();
    if (this.feedbackEl) {
      this.feedbackEl.textContent = '';
      this.feedbackEl.style.display = 'none';
    }

    if (this.questionEl) this.questionEl.textContent = `Pregunta de Evaluación: ${exData.question}`;
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      exData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'ex-option-btn';
        btn.textContent = `${idx + 1}. ${opt.text}`;
        btn.addEventListener('click', () => this.answerOption(btn, opt.correct));
        this.optionsContainer?.appendChild(btn);
      });
    }

    if (exData.modelId) {
      this.onSelectModelAndR(exData.modelId, exData.targetR);
    }
  }

  updateCurrentRDisplay(): void {
    const currentR = this.getCurrentR();
    if (this.currentLabelEl) this.currentLabelEl.textContent = currentR.toFixed(4);
  }

  private verifyCurrentR(): void {
    const exData = GUIDED_EXERCISES.find((e) => e.id === this.currentExId);
    if (!exData || !this.feedbackEl) return;

    const currentR = this.getCurrentR();
    const diff = Math.abs(currentR - exData.targetR);

    this.feedbackEl.style.display = 'block';
    if (diff <= exData.tolerance) {
      this.feedbackEl.textContent = `✅ ¡Excelente! r = ${currentR.toFixed(4)} está dentro del margen objetivo.`;
      this.feedbackEl.style.color = 'var(--accent-green)';
    } else {
      this.feedbackEl.textContent = `❌ r = ${currentR.toFixed(4)} todavía dista de ${exData.targetR.toFixed(4)}. Pista: ${exData.hint}`;
      this.feedbackEl.style.color = 'var(--accent-rose)';
    }
  }

  private answerOption(btn: HTMLButtonElement, isCorrect: boolean): void {
    if (isCorrect) {
      btn.classList.add('correct');
      btn.textContent += '  ✔ (¡Correcto!)';
    } else {
      btn.classList.add('incorrect');
      btn.textContent += '  ✖ (Inténtalo de nuevo)';
    }
  }
}
