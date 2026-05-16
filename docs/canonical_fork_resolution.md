# Canonical Fork Resolution

## Problem Statement
Distributed nodes may diverge via asynchronous delays, partitions, byzantine faults, and timestamp instability.

## Resolution Algorithm
1. Detect divergence by comparing canonical heads across nodes.
2. Apply tie-breakers in strict order: majority agreement, longest lineage, lexicographic fallback.
3. Mark unreachable branches as orphaned (audit-preserved, non-canonical).
4. Replay from resolved canonical head for all future writes.

## Handled Failure Modes
- Partition + heal
- Byzantine invalid lineage broadcasts
- Timestamp inversion
- Orphaned branch dead-ends

## Guarantees
- Deterministic output for identical fork state
- Consistency after canonical head convergence
- Safety via read-only mode under unresolved conflict
