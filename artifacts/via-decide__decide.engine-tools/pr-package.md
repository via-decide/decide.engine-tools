Branch: simba/create-abuse-detection-dashboard-tool-in-toolsen
Title: Create abuse-detection-dashboard tool in tools/engine/abuse-detection...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working abuse-detection-dashboard tool for monitoring and maintaining game integrity

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.