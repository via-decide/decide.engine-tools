# Sovereign Multiplayer Continuity Sync Spec

## Deterministic Sync Requirements
- Local-first state capture with canonical mutation logs.
- Offline replay sync using continuity manifests.
- Authority-aware world merge with profile-based arbitration.
- Deterministic event ordering (`event_tick`, `authority_epoch`, `tie_breaker_id`).
- Replay-safe conflict resolution with explicit reconciliation output.

## Reconciliation Flow
1. Capture local mutation lineage while offline.
2. Export continuity manifests + authority epochs.
3. Replay both branches deterministically.
4. Resolve conflicts by authority profile policy.
5. Emit merged lineage and restore canonical world continuity.

## Example
`player_A` offline 3h → local mutations logged → manifests generated → replay reconciliation run → canonical lineage restored.
