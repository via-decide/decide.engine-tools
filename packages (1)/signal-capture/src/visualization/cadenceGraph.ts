import type { InputFrame } from '../input/inputSampler';

export function buildCadenceGraph(frames: InputFrame[]) {
  const points = [] as Array<{ frame: number; deltaMs: number }>;
  for (let i = 1; i < frames.length; i++) {
    points.push({ frame: frames[i].frame, deltaMs: frames[i].timestamp - frames[i - 1].timestamp });
  }
  return points;
}
