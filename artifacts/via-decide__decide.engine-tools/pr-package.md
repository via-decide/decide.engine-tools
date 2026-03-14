Branch: simba/create-toolsengineserver-tournament-engine-build
Title: Create tools/engine/server-tournament-engine/. Build a headless Vanil...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A background system that manages active tournaments and calculates mock leaderboard rankings based on local player data.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.