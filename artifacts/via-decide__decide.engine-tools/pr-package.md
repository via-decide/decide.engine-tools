Branch: simba/add-admin-moderation-panel-tool-in-toolsenginead
Title: Add admin-moderation-panel tool in tools/engine/admin-moderation-pane...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working admin-moderation-panel tool for manual oversight of game systems

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.