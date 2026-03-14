Branch: simba/create-toolsengineserver-boss-engine-build-a-hea
Title: Create tools/engine/server-boss-engine/. Build a headless Vanilla JS ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A background system that aggregates local player actions into a simulated collective global boss health/progress pool.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.