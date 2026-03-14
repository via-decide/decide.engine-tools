Branch: simba/add-seasonal-events-engine-tool-in-toolsenginese
Title: Add seasonal-events-engine tool in tools/engine/seasonal-events-engin...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working seasonal-events-engine tool that applies temporary global modifiers to game variables

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.