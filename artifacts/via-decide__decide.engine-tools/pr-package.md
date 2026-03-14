Branch: simba/add-a-progress-timeline-tool-in-toolsprogress-ti
Title: add a progress-timeline tool in tools/progress-timeline with config.j...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working standalone progress-timeline tool registered and routable

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.