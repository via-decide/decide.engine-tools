import type { Constraint, RuntimeState } from '../runtime/constraintRuntime';

export function monochromeConstraint(): Constraint {
  return {
    id: 'monochrome',
    enabled: true,
    apply(state: RuntimeState) {
      const pixels = (state.pixels as number[]) || [];
      return { ...state, pixels: pixels.map((v) => (v >= 127 ? 255 : 0)) };
    }
  };
}
