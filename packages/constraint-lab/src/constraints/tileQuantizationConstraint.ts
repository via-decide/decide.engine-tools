import type { Constraint, RuntimeState } from '../runtime/constraintRuntime';

export function tileQuantizationConstraint(step = 8): Constraint {
  return {
    id: 'tile-quantization',
    enabled: true,
    apply(state: RuntimeState) {
      const position = (state.position as { x: number; y: number }) || { x: 0, y: 0 };
      return {
        ...state,
        position: {
          x: Math.round(position.x / step) * step,
          y: Math.round(position.y / step) * step
        }
      };
    }
  };
}
