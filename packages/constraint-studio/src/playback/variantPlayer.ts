import { ReplayPlayer } from '../../../replay-engine/src/playback/replayPlayer';
import { compareSignals } from '../../../signal-capture/src/comparison/compareSignals';

export class VariantPlayer {
  private players = new Map<string, ReplayPlayer>();

  loadVariantReplay(variantId: string, replay: Parameters<ReplayPlayer['load']>[0]) {
    const p = new ReplayPlayer();
    p.load(replay);
    this.players.set(variantId, p);
  }

  eventsAt(variantId: string, frame: number) {
    return this.players.get(variantId)?.eventsForFrame(frame) || [];
  }

  compareFeel(signalA: Parameters<typeof compareSignals>[0], signalB: Parameters<typeof compareSignals>[1]) {
    return compareSignals(signalA, signalB);
  }
}
