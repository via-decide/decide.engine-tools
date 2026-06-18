export type RuntimeState = Record<string, unknown>;

export type Constraint = {
  id: string;
  enabled: boolean;
  apply: (state: RuntimeState) => RuntimeState;
};

export class ConstraintRuntime {
  private constraints: Constraint[] = [];

  register(constraint: Constraint) {
    this.constraints.push(constraint);
  }

  setEnabled(id: string, enabled: boolean) {
    const target = this.constraints.find((c) => c.id === id);
    if (target) target.enabled = enabled;
  }

  list() {
    return [...this.constraints];
  }

  apply(state: RuntimeState) {
    return this.constraints.reduce((next, constraint) => {
      if (!constraint.enabled) return next;
      return constraint.apply(next);
    }, state);
  }
}
