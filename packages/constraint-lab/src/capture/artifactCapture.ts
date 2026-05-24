import fs from 'fs';
import path from 'path';

export class ArtifactCapture {
  constructor(private rootDir: string) {}

  private dir(experimentId: string) {
    const dir = path.join(this.rootDir, experimentId);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  }

  saveReplay(experimentId: string, replay: unknown) {
    const file = path.join(this.dir(experimentId), 'replay.json');
    fs.writeFileSync(file, JSON.stringify(replay, null, 2));
    return file;
  }

  saveMetadata(experimentId: string, metadata: Record<string, unknown>) {
    const file = path.join(this.dir(experimentId), 'metadata.json');
    fs.writeFileSync(file, JSON.stringify(metadata, null, 2));
    return file;
  }

  saveNotes(experimentId: string, notes: string) {
    const file = path.join(this.dir(experimentId), 'notes.md');
    fs.writeFileSync(file, notes);
    return file;
  }
}
