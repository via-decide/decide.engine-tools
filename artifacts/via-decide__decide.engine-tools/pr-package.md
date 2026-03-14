Branch: simba/create-toolsenginelive-event-scheduler-build-a-v
Title: Create tools/engine/live-event-scheduler/. Build a Vanilla JS admin d...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A functional admin interface to queue and manage the lifecycle of global server events.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.