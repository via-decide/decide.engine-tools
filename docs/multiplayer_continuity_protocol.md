# Multiplayer Continuity Protocol

## Lockstep + Rollback Model
- Deterministic lockstep simulation with canonical tick authority.
- Rollback networking with bounded replay window.
- Latency compensation via delayed-input reconciliation.

## Desync and Divergence Handling
- Desync detection via per-tick state hash exchange.
- Orphaned simulation states quarantined until reconciliation.
- Distributed tick consensus uses authority weighting + lineage precedence.
- Canonical divergence resolution selects admissible replay branch.
