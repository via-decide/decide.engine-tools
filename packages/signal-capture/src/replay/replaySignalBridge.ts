import { InputRecorder } from '../../../replay-engine/src/recorder/inputRecorder';
import { ReplayPlayer } from '../../../replay-engine/src/playback/replayPlayer';
import type { InputFrame } from '../input/inputSampler';

export class ReplaySignalBridge {
  private recorder = new InputRecorder();
  private player = new ReplayPlayer();

  begin(frameProvider: () => number) {
    this.recorder.begin(frameProvider);
  }

  recordFrame(frame: InputFrame) {
    this.recorder.recordEvent('mouse', frame);
  }

  exportReplay() {
    return this.recorder.exportReplay(1000 / 120);
  }

  loadReplay(replay: ReturnType<InputRecorder['exportReplay']>) {
    this.player.load(replay);
  }

  eventsAt(frame: number) {
    return this.player.eventsForFrame(frame);
  }
}
