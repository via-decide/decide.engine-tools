Branch: simba/create-toolsengineevent-notification-hub-build-a
Title: Create tools/engine/event-notification-hub/. Build a player-facing UI...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A unified UI dashboard where players can track all ongoing, future, and past server events and claim rewards.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.