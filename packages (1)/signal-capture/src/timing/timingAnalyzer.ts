import type { InputFrame } from '../input/inputSampler';

export function analyzeTiming(frames: InputFrame[]) {
  const intervals: number[] = [];
  const pauses: Array<{ startFrame: number; durationMs: number }> = [];
  const cadence: string[] = [];

  for (let i = 1; i < frames.length; i++) {
    const dt = frames[i].timestamp - frames[i - 1].timestamp;
    intervals.push(dt);
    if (dt > 120) {
      pauses.push({ startFrame: frames[i - 1].frame, durationMs: dt });
      cadence.push('pause');
    } else if (dt < 20) {
      cadence.push('fast');
    } else {
      cadence.push('steady');
    }
  }

  return { intervals, pauses, cadence };
}
