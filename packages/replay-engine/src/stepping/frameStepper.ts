export class FrameStepper {
  private frame = 0;
  private paused = true;

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  isPaused() { return this.paused; }

  stepForward() {
    this.frame += 1;
    return this.frame;
  }

  stepBackward() {
    this.frame = Math.max(0, this.frame - 1);
    return this.frame;
  }

  seek(frame: number) {
    this.frame = Math.max(0, frame);
    return this.frame;
  }

  getFrame() { return this.frame; }
}
