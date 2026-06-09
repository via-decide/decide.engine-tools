export const FIXED_DT_MS = 1000 / 60;

export type FixedLoopStep = (dtMs: number, frame: number) => void;

export class FixedLoop {
  private accumulator = 0;
  private lastTime = 0;
  private running = false;
  private paused = false;
  private frame = 0;
  private maxCatchUpSteps = 8;

  constructor(private readonly step: FixedLoopStep, private readonly fixedDt = FIXED_DT_MS) {}

  start(startTimeMs = 0) {
    this.running = true;
    this.paused = false;
    this.lastTime = startTimeMs;
  }

  stop() {
    this.running = false;
    this.accumulator = 0;
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }

  tick(nowMs: number): number {
    if (!this.running || this.paused) {
      this.lastTime = nowMs;
      return 0;
    }

    const elapsed = Math.max(0, nowMs - this.lastTime);
    this.lastTime = nowMs;
    this.accumulator += elapsed;

    let steps = 0;
    while (this.accumulator >= this.fixedDt && steps < this.maxCatchUpSteps) {
      this.step(this.fixedDt, this.frame);
      this.frame += 1;
      this.accumulator -= this.fixedDt;
      steps += 1;
    }

    if (steps >= this.maxCatchUpSteps) this.accumulator = 0;
    return steps;
  }

  getFrame() { return this.frame; }
}
