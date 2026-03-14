Branch: simba/fix-sharedtool-graphjs---the-file-has-a-syntax-e
Title: fix shared/tool-graph.js - the file has a syntax error from a duplica...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: shared/tool-graph.js passes node --check and renders the tool graph correctly

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.