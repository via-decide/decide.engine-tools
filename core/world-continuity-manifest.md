# World Continuity Manifest

Canonical manifest for deterministic, replay-safe, portable world continuity.

## Manifest Schema
```json
{
  "world_id": "",
  "world_epoch": "",
  "lineage_parent": "",
  "simulation_constraints": [],
  "plugin_dependencies": [],
  "authority_profiles": [],
  "continuity_guarantees": [],
  "replay_boundaries": [],
  "world_mutations": [],
  "divergence_classes": []
}
```

## Continuity Goals
- Replayable world state from canonical lineage.
- Deterministic simulation lineage and fork history.
- Portable world migration across sovereign runtimes.
- Offline continuity recovery with reconciliation checkpoints.
- Explicit divergence classes for replay diagnostics.
