import { generateStateHash, stableSerialize } from '../hashing/stateHash';

export type Snapshot = {
  frame: number;
  stateHash: string;
  serializedState: Uint8Array;
};

function encodeUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export class SnapshotStore {
  private byFrame = new Map<number, Snapshot>();

  save(frame: number, state: unknown): Snapshot {
    const serialized = stableSerialize(state);
    const snap = {
      frame,
      stateHash: generateStateHash(state),
      serializedState: encodeUtf8(serialized)
    };
    this.byFrame.set(frame, snap);
    return snap;
  }

  get(frame: number): Snapshot | null {
    return this.byFrame.get(frame) ?? null;
  }

  getNearestAtOrBefore(frame: number): Snapshot | null {
    let best: Snapshot | null = null;
    for (const [f, snap] of this.byFrame.entries()) {
      if (f <= frame && (!best || f > best.frame)) best = snap;
    }
    return best;
  }
}
