# AI NPC Continuity Layer

## Deterministic NPC Lineage
- NPC memory snapshots chained by lineage hash.
- Behavior evolution uses deterministic decision tables.
- All AI mutations are replay-safe state transitions.

## Prohibitions
- No nondeterministic inference loops.
- No unstable runtime randomness.
- No hidden AI state mutation.
