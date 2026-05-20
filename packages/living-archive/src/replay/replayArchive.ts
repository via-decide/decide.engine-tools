import fs from 'fs';
import path from 'path';
import { ReplayPlayer } from '../../../replay-engine/src/playback/replayPlayer';

export class ReplayArchive {
  constructor(private readonly archiveRoot: string) {}

  loadReplay(experimentId: string) {
    const file = path.join(this.archiveRoot, 'experiments', experimentId, 'replay.json');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  createPlayer(experimentId: string) {
    const player = new ReplayPlayer();
    player.load(this.loadReplay(experimentId));
    return player;
  }

  compareFrames(experimentA: string, experimentB: string, frame: number) {
    const a = this.createPlayer(experimentA).eventsForFrame(frame);
    const b = this.createPlayer(experimentB).eventsForFrame(frame);
    return { frame, a, b, same: JSON.stringify(a) === JSON.stringify(b) };
  }
}
