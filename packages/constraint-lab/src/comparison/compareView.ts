export class CompareView {
  private frame = 0;
  private paused = true;
  private swapped = false;

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  step() { this.frame += 1; return this.frame; }
  reset() { this.frame = 0; }
  syncReplay() { this.reset(); this.resume(); }
  swap() { this.swapped = !this.swapped; return this.swapped; }

  getState() {
    return { frame: this.frame, paused: this.paused, swapped: this.swapped };
  }
}
