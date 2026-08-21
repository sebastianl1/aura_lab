import type { BifurcationModel } from '../math/models/BaseModel.js';
import { LYAPUNOV_CONFIG } from '../math/lyapunovConfig.js';
import { BIFURCATION_MILESTONES } from '../math/feigenbaum.js';
import type { BifurcationMilestone } from '../math/feigenbaum.js';
import { viz } from '../core/theme.js';

/** Live mathematical inspector: state badge, metrics and Feigenbaum milestone. */
export class InspectorPanel {
  private container: HTMLElement;
  private model: BifurcationModel | null = null;

  constructor(panelElement: HTMLElement) {
    this.container = panelElement;
  }

  setModel(model: BifurcationModel): void {
    this.model = model;
  }

  update(r: number): void {
    if (!this.model) return;
    const c = this.model.rToC(r);
    const lyapunov = this.model.computeLyapunov(
      r,
      LYAPUNOV_CONFIG.iterations,
      LYAPUNOV_CONFIG.transient,
      LYAPUNOV_CONFIG.x0,
    );
    const period = this.model.detectPeriod(r);

    const colors = viz();
    let stateBadge: string;
    let stateColor: string;

    if (lyapunov > 0.05) {
      stateBadge = 'DETERMINISTIC CHAOS 🌀';
      stateColor = colors.rose;
    } else if (period > 0) {
      stateBadge = `ATRACTOR PERIODO ${period} 🎵`;
      stateColor = colors.cyan;
    } else {
      stateBadge = 'BIFURCACIÓN CRÍTICA ⚡';
      stateColor = colors.amber;
    }

    const closest = this.findClosestMilestone(r);

    const isoLabel =
      this.model.isomorphismKind === 'exact' ? 'exacto (conjugado)' : 'sección paramétrica';

    this.container.innerHTML = `
      <div class="inspector-card">
        <div class="state-header" style="border-left-color: ${stateColor}">
          <span class="state-title">${stateBadge}</span>
          <span class="state-r">r = ${r.toFixed(5)}</span>
        </div>

        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Parámetro Mandelbrot (c)</span>
            <span class="metric-value font-mono">${c.toFixed(5)}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Exponente de Lyapunov (λ)</span>
            <span
              class="metric-value font-mono"
              style="color: ${lyapunov > 0 ? colors.rose : colors.cyan}"
            >
              ${lyapunov.toFixed(4)}
            </span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Periodo de la órbita</span>
            <span class="metric-value font-mono">${period > 0 ? period : 'aperiódico / caos'}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Modelo Activo</span>
            <span class="metric-value font-mono text-xs">${this.model.name}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Isomorfismo</span>
            <span class="metric-value font-mono text-xs">${isoLabel}</span>
          </div>
        </div>

        <div class="milestone-box">
          <div class="milestone-title">📍 Hito de Feigenbaum / Estabilidad: <strong>${closest.name}</strong></div>
          <div class="milestone-desc">${closest.description}</div>
        </div>
      </div>
    `;
  }

  private findClosestMilestone(r: number): BifurcationMilestone {
    let closest = BIFURCATION_MILESTONES[0]!;
    let minDiff = Infinity;
    for (const milestone of BIFURCATION_MILESTONES) {
      const diff = Math.abs(milestone.r - r);
      if (diff < minDiff) {
        minDiff = diff;
        closest = milestone;
      }
    }
    return closest;
  }
}
