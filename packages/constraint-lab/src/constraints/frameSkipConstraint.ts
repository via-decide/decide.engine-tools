import type { Constraint, RuntimeState } from '../runtime/constraintRuntime';

export function frameSkipConstraint(skipEvery = 2): Constraint {
  return {
    id: 'frame-skip',
    enabled: true,
    apply(state: RuntimeState) {
      const frame = Number(state.frame || 0);
      const shouldSkip = skipEvery > 0 && frame % skipEvery === 0;
      return { ...state, skipSimulation: shouldSkip };
    }
  };
}
