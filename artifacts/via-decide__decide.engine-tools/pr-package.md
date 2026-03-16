Branch: simba/create-branch-featureseed-forge-system-create-fi
Title: > Create branch feature/seed-forge-system. Create file shared/seed-fo...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: > The core prestige mechanic that makes the 30-day grind infinitely replayable by granting permanent collectible rewards. /end_task

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.