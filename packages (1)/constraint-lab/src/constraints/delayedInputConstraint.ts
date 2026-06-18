import type { Constraint, RuntimeState } from '../runtime/constraintRuntime';

export function delayedInputConstraint(delayFrames = 2): Constraint {
  const queue: unknown[] = [];
  return {
    id: 'delayed-input',
    enabled: true,
    apply(state: RuntimeState) {
      queue.push(state.input);
      const delayed = queue.length > delayFrames ? queue.shift() : null;
      return { ...state, input: delayed };
    }
  };
}
