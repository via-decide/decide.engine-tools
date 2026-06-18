import fs from 'fs';
import path from 'path';

export function exportSignalSession(root: string, sessionId: string, payload: Record<string, unknown>) {
  const dir = path.join(root, sessionId);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'signal-session.json');
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  return file;
}
