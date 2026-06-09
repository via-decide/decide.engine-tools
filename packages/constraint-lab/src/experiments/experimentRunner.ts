import { ConstraintRuntime } from '../runtime/constraintRuntime';
import { ReplayBridge } from '../replay/replayBridge';

export class ExperimentRunner {
  private runtime = new ConstraintRuntime();
  private replay = new ReplayBridge();
  private frame = 0;

  registerConstraint(constraint: Parameters<ConstraintRuntime['register']>[0]) {
    this.runtime.register(constraint);
  }

  start() {
    this.replay.startRecording(() => this.frame);
  }

  tick(state: Record<string, unknown>) {
    const next = this.runtime.apply({ ...state, frame: this.frame });
    this.frame += 1;
    return next;
  }

  recordInput(type: 'keydown' | 'keyup' | 'mouse', payload: unknown) {
    this.replay.record(type, payload);
  }

  exportReplay(fixedDtMs = 1000 / 60, seed?: number) {
    return this.replay.exportReplay(fixedDtMs, seed);
  }
}
