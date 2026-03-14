Branch: simba/add-daily-streak-tracker-tool-in-toolsenginedail
Title: Add daily-streak-tracker tool in tools/engine/daily-streak-tracker/ w...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working daily-streak-tracker tool that calculates and displays consistency rewards

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.