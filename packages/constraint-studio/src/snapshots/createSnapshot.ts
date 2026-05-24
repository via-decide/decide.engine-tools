import fs from 'fs';
import path from 'path';
import type { ConstraintConfig } from '../runtime/constraintRuntime';

export function createSnapshot(root: string, id: string, input: {
  config: ConstraintConfig;
  replay: unknown;
  interactionSignal: unknown;
  notes: string;
  screenshotPath?: string;
}) {
  const dir = path.join(root, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'config.json'), JSON.stringify(input.config, null, 2));
  fs.writeFileSync(path.join(dir, 'replay.json'), JSON.stringify(input.replay, null, 2));
  fs.writeFileSync(path.join(dir, 'interaction.signal'), JSON.stringify(input.interactionSignal, null, 2));
  fs.writeFileSync(path.join(dir, 'notes.md'), input.notes || '');
  if (input.screenshotPath) fs.writeFileSync(path.join(dir, 'screenshot.png'), input.screenshotPath);
  return dir;
}
