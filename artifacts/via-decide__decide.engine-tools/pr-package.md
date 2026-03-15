Branch: simba/create-a-new-branch-featureagent-builder-ui-refa
Title: > Create a new branch feature/agent-builder-ui. Refactor the existing...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: > A Zapier-style vertical step editor that outputs a clean, sequential JSON workflow for the AgentRuntime to follow. /end_task

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.