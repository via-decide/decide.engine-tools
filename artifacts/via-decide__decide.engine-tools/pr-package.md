Branch: simba/create-the-daily-game-health-automator-bot-via-h
Title: Create the Daily "Game Health" Automator Bot (via-health-report). 1. ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Establish a permanent, automated heartbeat for the repository that tracks the game's success while guaranteeing an unbroken, daily commit streak forever.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.