# Replay Engine

Deterministic creative experimentation runtime for record → replay → step → compare → export workflows.

## Systems
- Fixed timestep loop (`src/runtime/fixedLoop.ts`)
- Input recorder (`src/recorder/inputRecorder.ts`)
- Replay playback (`src/playback/replayPlayer.ts`)
- Stable serialization + hashing (`src/hashing/stateHash.ts`)
- Snapshot store (`src/snapshots/snapshotStore.ts`)
- Frame stepper (`src/stepping/frameStepper.ts`)
- GIF exporter stub (`src/exporters/gifExporter.ts`)

## Determinism rules
- Fixed timestep only
- Frame-indexed input dispatch
- Stable key-order serialization for hashing
- Per-frame hash comparison supported
