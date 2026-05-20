import type { InputFrame } from '../input/inputSampler';

export function buildMomentumGraph(frames: InputFrame[]) {
  return frames.map((f) => ({ frame: f.frame, speed: Math.hypot(f.mouse.velocityX, f.mouse.velocityY) }));
}
