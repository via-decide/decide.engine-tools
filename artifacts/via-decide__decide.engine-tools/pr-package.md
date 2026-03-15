Branch: simba/create-a-new-branch-featureui-smart-visualizer-u
Title: > Create a new branch feature/ui-smart-visualizer. Update the executi...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: > Transform the execution console from a raw data dump into a polished, readable dashboard of AI decisions and outputs. /end_task

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.