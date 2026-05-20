function frameWindowHashes(replay, windowSize = 10) {
  const windows = [];
  for (let i = 0; i < replay.frames.length; i += windowSize) {
    const chunk = replay.frames.slice(i, i + windowSize);
    const hash = chunk.map((f) => f.frameHash).join(':');
    windows.push({ startFrame: chunk[0]?.frame ?? i, hash, size: chunk.length });
  }
  return windows;
}

function compareReplayWindows(reference, candidate, windowSize = 10) {
  const ref = frameWindowHashes(reference, windowSize);
  const cand = frameWindowHashes(candidate, windowSize);
  const length = Math.max(ref.length, cand.length);

  for (let i = 0; i < length; i++) {
    const a = ref[i];
    const b = cand[i];
    if (!a || !b) {
      return { ok: false, divergenceWindow: i, reason: 'WINDOW_COUNT_MISMATCH' };
    }
    if (a.hash !== b.hash) {
      return { ok: false, divergenceWindow: i, startFrame: a.startFrame };
    }
  }
  return { ok: true };
}

module.exports = {
  frameWindowHashes,
  compareReplayWindows
};
