const crypto = require('crypto');

function hashFrame(frameState) {
  return crypto.createHash('sha256').update(JSON.stringify(frameState || {})).digest('hex');
}

class ReplayRecorder {
  constructor({ seed, fixedDeltaTime = 16.6667 }) {
    this.seed = seed;
    this.fixedDeltaTime = fixedDeltaTime;
    this.frames = [];
  }

  recordFrame({ frame, timestamp, inputs, state }) {
    const payload = {
      frame,
      timestamp,
      inputs,
      seed: this.seed,
      deltaTime: this.fixedDeltaTime,
      frameHash: hashFrame(state)
    };
    this.frames.push(payload);
    return payload;
  }

  export() {
    return {
      seed: this.seed,
      fixedDeltaTime: this.fixedDeltaTime,
      frames: this.frames
    };
  }
}

function verifyReplay(reference, candidate) {
  const length = Math.min(reference.frames.length, candidate.frames.length);
  for (let i = 0; i < length; i++) {
    const a = reference.frames[i];
    const b = candidate.frames[i];
    if (a.frameHash !== b.frameHash) {
      return { ok: false, divergenceFrame: a.frame, expectedHash: a.frameHash, actualHash: b.frameHash };
    }
  }
  if (reference.frames.length !== candidate.frames.length) {
    return { ok: false, divergenceFrame: length, reason: 'FRAME_COUNT_MISMATCH' };
  }
  return { ok: true };
}

module.exports = { ReplayRecorder, verifyReplay, hashFrame };
