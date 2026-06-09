import type { ConstraintConfig } from '../runtime/constraintRuntime';

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

export function generateMutation(base: ConstraintConfig, mode: 'random' | 'weighted' | 'curated' = 'random'): ConstraintConfig {
  const next: ConstraintConfig = JSON.parse(JSON.stringify(base || {}));
  const factor = mode === 'weighted' ? 0.15 : mode === 'curated' ? 0.08 : 0.25;
  const move = next.movement || {};
  move.inertia = clamp((move.inertia ?? 0.3) + (Math.random() - 0.5) * factor, 0, 2);
  move.acceleration = clamp((move.acceleration ?? 1) + (Math.random() - 0.5) * factor * 2, 0.1, 3);
  move.latencyMs = clamp((move.latencyMs ?? 20) + Math.round((Math.random() - 0.5) * 80 * factor), 0, 300);
  next.movement = move;
  next.rendering = { ...(next.rendering || {}), scanlines: Math.random() > 0.5 ? !(next.rendering?.scanlines) : next.rendering?.scanlines };
  return next;
}
