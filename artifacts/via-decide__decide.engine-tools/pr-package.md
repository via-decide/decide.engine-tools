Branch: simba/add-achievement-badge-system-tool-in-toolsengine
Title: Add achievement-badge-system tool in tools/engine/achievement-badge-s...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working achievement-badge-system tool that tracks and visualizes earned milestones

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.