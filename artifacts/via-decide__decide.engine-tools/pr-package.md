Branch: simba/create-a-new-branch-featureui-drag-drop-refactor
Title: > Create a new branch feature/ui-drag-drop. Refactor the agent-builde...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: > A tactile, intuitive way for users to reorganize their AI agent's execution sequence without deleting and recreating steps. /end_task

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.