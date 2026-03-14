Branch: simba/create-progress-timeline-viz-tool-in-toolsengine
Title: Create progress-timeline-viz tool in tools/engine/progress-timeline-v...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working progress-timeline-viz tool displaying historical player growth

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.