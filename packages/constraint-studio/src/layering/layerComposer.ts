import type { ConstraintConfig } from '../runtime/constraintRuntime';

export function composeLayers(base: ConstraintConfig, layers: ConstraintConfig[]) {
  return layers.reduce((acc, layer) => ({
    rendering: { ...(acc.rendering || {}), ...(layer.rendering || {}) },
    movement: { ...(acc.movement || {}), ...(layer.movement || {}) },
    audio: { ...(acc.audio || {}), ...(layer.audio || {}) }
  }), base);
}
