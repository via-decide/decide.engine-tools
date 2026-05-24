import type { ReplayData, ReplayEvent } from '../recorder/inputRecorder';

export class ReplayPlayer {
  private replay: ReplayData | null = null;

  load(replay: ReplayData) {
    this.replay = replay;
  }

  eventsForFrame(frame: number): ReplayEvent[] {
    if (!this.replay) return [];
    return this.replay.events
      .filter((e) => e.frame === frame)
      .sort((a, b) => a.index - b.index);
  }

  isDone(frame: number): boolean {
    if (!this.replay || this.replay.events.length === 0) return true;
    const lastFrame = this.replay.events[this.replay.events.length - 1].frame;
    return frame > lastFrame;
  }
}
