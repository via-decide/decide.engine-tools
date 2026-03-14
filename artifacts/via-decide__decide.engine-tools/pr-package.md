Branch: simba/add-a-new-standalone-tool-called-swot-analyzer-i
Title: Add a new standalone tool called swot-analyzer in tools/swot-analyzer...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Produce working swot-analyzer tool with config.json, index.html, tool.js, registered and routed.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.