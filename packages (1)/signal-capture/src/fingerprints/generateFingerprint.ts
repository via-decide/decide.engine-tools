import type { InputFrame } from '../input/inputSampler';

export function generateFingerprint(frames: InputFrame[]) {
  const speeds = frames.map((f) => Math.hypot(f.mouse.velocityX, f.mouse.velocityY));
  const avgSpeed = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
  const hesitationMoments = frames.filter((f) => Math.abs(f.mouse.velocityX) < 0.01 && Math.abs(f.mouse.velocityY) < 0.01).map((f) => f.frame);
  const wheelBursts = frames.filter((f) => Math.abs(f.wheel.delta) > 0).map((f) => f.frame);
  return {
    avgSpeed,
    hesitationMoments,
    wheelBursts,
    cadenceDensity: {
      high: speeds.filter((s) => s > avgSpeed).length,
      low: speeds.filter((s) => s <= avgSpeed).length
    }
  };
}
