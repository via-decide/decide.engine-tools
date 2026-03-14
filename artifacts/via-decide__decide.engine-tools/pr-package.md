Branch: simba/add-progress-timeline-visualization-tool-in-tool
Title: Add progress-timeline-visualization tool in tools/engine/progress-tim...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working progress-timeline-visualization tool that charts player historical data

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.