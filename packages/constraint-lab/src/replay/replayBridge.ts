import { InputRecorder } from '../../../replay-engine/src/recorder/inputRecorder';
import { ReplayPlayer } from '../../../replay-engine/src/playback/replayPlayer';

export class ReplayBridge {
  readonly recorder = new InputRecorder();
  readonly player = new ReplayPlayer();

  startRecording(frameProvider: () => number) {
    this.recorder.begin(frameProvider);
  }

  record(type: 'keydown' | 'keyup' | 'mouse', payload: unknown) {
    this.recorder.recordEvent(type, payload);
  }

  exportReplay(fixedDtMs: number, seed?: number) {
    return this.recorder.exportReplay(fixedDtMs, seed);
  }

  loadReplay(replay: ReturnType<InputRecorder['exportReplay']>) {
    this.player.load(replay);
  }

  frameEvents(frame: number) {
    return this.player.eventsForFrame(frame);
  }
}
