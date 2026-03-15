Branch: simba/create-a-new-branch-featureupdate-tool-graph-ref
Title: > Create a new branch feature/update-tool-graph. Refactor the existin...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: > A visual map showing the macro architecture of which automated Agents are calling which underlying Tools. /end_task

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.