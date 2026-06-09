import fs from 'fs';
import path from 'path';

export type ArchivePayload = {
  id?: string;
  replay: unknown;
  screenshots?: Array<{ name: string; data: Buffer }>;
  notes: string;
  constraints: string[];
  metadata: Record<string, unknown>;
  parentId?: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export class ExperimentArchiver {
  constructor(private readonly archiveRoot: string) {}

  archiveExperiment(payload: ArchivePayload) {
    const timestamp = Date.now();
    const id = payload.id || `exp-${timestamp}-${slugify(String(payload.metadata.name || 'experiment'))}`;
    const expDir = path.join(this.archiveRoot, 'experiments', id);
    const shotsDir = path.join(expDir, 'screenshots');
    fs.mkdirSync(shotsDir, { recursive: true });

    fs.writeFileSync(path.join(expDir, 'replay.json'), JSON.stringify(payload.replay, null, 2));
    fs.writeFileSync(path.join(expDir, 'metadata.json'), JSON.stringify({
      ...payload.metadata,
      id,
      timestamp,
      constraints: payload.constraints,
      parentId: payload.parentId || null
    }, null, 2));
    fs.writeFileSync(path.join(expDir, 'notes.md'), payload.notes || '');
    fs.writeFileSync(path.join(expDir, 'lineage.json'), JSON.stringify({ id, parentId: payload.parentId || null }, null, 2));

    for (const shot of payload.screenshots || []) {
      fs.writeFileSync(path.join(shotsDir, shot.name), shot.data);
    }

    return { id, expDir, timestamp };
  }
}
