import { GUIDED_EXERCISES } from '../math/guidedExercises.js';

/** Guided student lab challenges modal with live parameter verification. */
export class GuidedExercisesPanel {
  private modal: HTMLElement;
  private backdrop: HTMLElement;
  private getCurrentN: () => number;
  private onSelectStyleAndN: (styleId: string, targetN: number) => void;

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
    getCurrentN: () => number,
    onSelectStyleAndN: (styleId: string, targetN: number) => void,
  ) {
    this.modal = modalElement;
    this.backdrop = backdropElement;
    this.getCurrentN = getCurrentN;
    this.onSelectStyleAndN = onSelectStyleAndN;

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
        const exId = btn.dataset.ex ?? target.dataset.ex;
        if (exId) this.selectExercise(exId);
      });
    });

    this.btnVerify?.addEventListener('click', () => this.verifyCurrentN());
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
    if (this.targetLabelEl) this.targetLabelEl.textContent = String(exData.targetN);

    this.updateCurrentNDisplay();
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

    this.onSelectStyleAndN(exData.styleId, exData.targetN);
  }

  updateCurrentNDisplay(): void {
    if (this.currentLabelEl) this.currentLabelEl.textContent = String(this.getCurrentN());
  }

  private verifyCurrentN(): void {
    const exData = GUIDED_EXERCISES.find((e) => e.id === this.currentExId);
    if (!exData || !this.feedbackEl) return;

    const currentN = this.getCurrentN();
    const diff = Math.abs(currentN - exData.targetN);

    this.feedbackEl.style.display = 'block';
    if (diff <= exData.tolerance) {
      this.feedbackEl.textContent = `✅ ¡Excelente! n = ${currentN} está dentro del margen objetivo.`;
      this.feedbackEl.style.color = 'var(--accent-green)';
    } else {
      this.feedbackEl.textContent = `❌ n = ${currentN} todavía dista de ${exData.targetN}. Pista: ${exData.hint}`;
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
