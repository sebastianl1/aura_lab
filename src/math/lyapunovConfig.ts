/**
 * Shared Lyapunov exponent computation parameters so every panel reports
 * the same value for the same (model, r).
 */
export const LYAPUNOV_CONFIG = {
  iterations: 600,
  transient: 200,
  x0: 0.5,
} as const;
