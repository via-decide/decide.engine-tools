# Entity Continuity System (ECS)

## Continuity Model
- Entities have immutable ancestry identifiers.
- Component updates are deterministic, ordered, and replay-safe.
- Every mutation emits lineage event with `entity_id`, `epoch`, `parent_hash`.
- Rollback checkpoints preserve snapshot hashes.

## Reconstruction Targets
- Entity ancestry
- State epochs
- Mutation lineage
- Rollback checkpoints
