Branch: simba/create-toolsengineharvest-race-view-build-a-play
Title: Create tools/engine/harvest-race-view/. Build a player-facing UI spec...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A dedicated, competitive UI dashboard showing the player's standing in the 24-hour fruit production race.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.