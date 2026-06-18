import type { InputFrame } from '../input/inputSampler';

export function buildHeatmap(frames: InputFrame[], cellSize = 20) {
  const cells: Record<string, number> = {};
  for (const f of frames) {
    const cx = Math.floor(f.mouse.x / cellSize);
    const cy = Math.floor(f.mouse.y / cellSize);
    const key = `${cx},${cy}`;
    cells[key] = (cells[key] || 0) + 1;
  }
  return cells;
}
