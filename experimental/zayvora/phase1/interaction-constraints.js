function timingOffset(baseMs, jitterSteps, frame) {
  if (!Number.isFinite(baseMs) || baseMs <= 0) return 0;
  const jitter = Array.isArray(jitterSteps) && jitterSteps.length ? jitterSteps : [0];
  return baseMs + jitter[frame % jitter.length];
}

function rotationalInputDelta(previousAngle, nextAngle) {
  let delta = nextAngle - previousAngle;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

function tileMovementStep(position, direction, speed = 1) {
  const map = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  };
  const [dx, dy] = map[direction] || [0, 0];
  return {
    x: position.x + dx * speed,
    y: position.y + dy * speed
  };
}

function rhythmGate(frame, pattern) {
  const beat = Array.isArray(pattern) && pattern.length ? pattern : [1];
  return Boolean(beat[frame % beat.length]);
}

module.exports = {
  timingOffset,
  rotationalInputDelta,
  tileMovementStep,
  rhythmGate
};
