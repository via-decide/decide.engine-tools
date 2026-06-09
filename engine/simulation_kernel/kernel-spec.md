# Simulation Kernel Specification

Deterministic fixed-step kernel for continuity-native world execution.

## Core Semantics
- Fixed tick duration (`dt`) independent of wall-clock.
- Append-only world lineage events per tick.
- Canonical state transitions via ordered reducers.
- Branch-aware timeline checkpoints for rollback/replay.

## Deterministic Guarantees
- No hidden mutable state.
- Canonical ordering key: `tick -> lineage_parent -> authority_weight -> nonce`.
- Replay reconstructs identical frame/state hashes.
