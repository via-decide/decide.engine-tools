export type ReplayEvent = {
  frame: number;
  type: 'keydown' | 'keyup' | 'mouse';
  payload: unknown;
  index: number;
};

export type ReplayData = {
  version: 'v1';
  fixedDtMs: number;
  seed?: number;
  events: ReplayEvent[];
};

export class InputRecorder {
  private events: ReplayEvent[] = [];
  private frameProvider: (() => number) | null = null;
  private eventIndex = 0;

  begin(frameProvider: () => number) {
    this.frameProvider = frameProvider;
  }

  recordEvent(type: ReplayEvent['type'], payload: unknown) {
    if (!this.frameProvider) throw new Error('InputRecorder not started');
    this.events.push({ frame: this.frameProvider(), type, payload, index: this.eventIndex++ });
  }

  exportReplay(fixedDtMs: number, seed?: number): ReplayData {
    return { version: 'v1', fixedDtMs, seed, events: [...this.events] };
  }
}
