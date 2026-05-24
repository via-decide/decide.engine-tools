export type InputFrame = {
  frame: number;
  timestamp: number;
  mouse: { x: number; y: number; velocityX: number; velocityY: number };
  keyboard: { keys: string[] };
  wheel: { delta: number };
};

export class InputSampler {
  private frames: InputFrame[] = [];
  private prevMouse = { x: 0, y: 0, timestamp: 0 };
  private mouse = { x: 0, y: 0 };
  private wheelDelta = 0;
  private keys = new Set<string>();

  pushMouse(x: number, y: number, timestamp: number) {
    this.mouse = { x, y };
    this.prevMouse = { ...this.prevMouse, timestamp };
  }

  pushWheel(delta: number) { this.wheelDelta = delta; }
  pushKey(key: string, pressed: boolean) { pressed ? this.keys.add(key) : this.keys.delete(key); }

  sample(frame: number, timestamp: number): InputFrame {
    const dt = Math.max(1, timestamp - this.prevMouse.timestamp);
    const velocityX = (this.mouse.x - this.prevMouse.x) / dt;
    const velocityY = (this.mouse.y - this.prevMouse.y) / dt;
    const record: InputFrame = {
      frame,
      timestamp,
      mouse: { x: this.mouse.x, y: this.mouse.y, velocityX, velocityY },
      keyboard: { keys: Array.from(this.keys).sort() },
      wheel: { delta: this.wheelDelta }
    };
    this.frames.push(record);
    this.prevMouse = { x: this.mouse.x, y: this.mouse.y, timestamp };
    this.wheelDelta = 0;
    return record;
  }

  exportSession() { return { fixedHz: 120, frames: [...this.frames] }; }
}
