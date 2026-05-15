# Canonical Fork Resolution Model

## Replay Fork Detection
- Detect conflicting child nodes sharing parent hash and overlapping lineage epochs.
- Mark fork root as replay-ambiguous until deterministic tie-break resolution.

## Conflict Handling
- Parent-hash conflicts are invalid unless explicitly reconciled under authority quorum rules.
- Lineage pruning only after canonical branch selection and replay admissibility verification.

## Deterministic Selection Rules
1. Prefer lineage with complete immutable ancestry.
2. Apply authority-weight tie-breakers.
3. Apply deterministic nonce ordering when authority weight ties.
4. Reject unstable timestamp-only ordering.

## Instability and Drift Modeling
- Timestamp instability is non-authoritative.
- Transport inconsistency is expected; canonical ordering must not depend on delivery timing.
- Replay ambiguity requires explicit resolution checkpoints.
- Semantic drift propagation requires branch confidence downgrades until reconciled.
