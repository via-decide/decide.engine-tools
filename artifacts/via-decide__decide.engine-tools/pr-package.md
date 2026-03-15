Branch: simba/create-a-new-branch-featureagent-platform-routin
Title: > Create a new branch feature/agent-platform-routing. Update index.ht...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: > Wire all the new standalone HTML files into the centralized OS dashboard for a unified user experience. /end_task

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.