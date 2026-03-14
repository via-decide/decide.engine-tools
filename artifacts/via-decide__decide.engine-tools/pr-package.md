Branch: simba/rewrite-toolsenginestarter-farm-generatortooljs-
Title: rewrite tools/engine/starter-farm-generator/tool.js to add hydrateSta...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: starter-farm-generator reads and writes orchard_engine_player_state, emits engine events, and blocks invalid actions

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.