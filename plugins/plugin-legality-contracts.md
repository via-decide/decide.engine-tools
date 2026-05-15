# Plugin Legality Contracts

Continuity-safe plugin contract required for all gameplay mutations.

## Required Contract
```json
{
  "plugin_id": "",
  "mutates": [],
  "deterministic": true,
  "replay_safe": true,
  "multiplayer_safe": false,
  "authority_required": "",
  "external_dependencies": [],
  "world_impact_scope": []
}
```

## Allowed Operations
- Mutate canonical game state declared in `mutates`.
- Emit deterministic events with replay-stable ordering.
- Register replay-safe orchestration hooks.
- Extend simulation systems within declared impact scope.

## Prohibited Operations
- Hidden external state mutation.
- Non-seeded random execution in canonical paths.
- Undeclared network mutation side effects.
- Bypass of continuity validation and authority checks.
