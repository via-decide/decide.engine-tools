# Effect Journaling Infrastructure

## Modeled Irreversible Effect Classes
- SMS sends
- Email delivery
- Payment commits
- Hardware mutations
- External API writes
- Physical device triggers

## Effect Journal Structure
```json
{
  "effect_id": "",
  "effect_class": "",
  "authority_signature": "",
  "lineage_parent": "",
  "pre_commit_hash": "",
  "provider_acknowledgment": "",
  "replay_policy": "",
  "rollback_classification": "",
  "finality_status": ""
}
```

## Effect Lifecycle States
- `EFFECT_PENDING`
- `EFFECT_PRECOMMITTED`
- `EFFECT_COMMITTED`
- `EFFECT_REPLAYABLE`
- `EFFECT_IRREVERSIBLE`
- `EFFECT_RECONCILED`
- `EFFECT_DIVERGED`
