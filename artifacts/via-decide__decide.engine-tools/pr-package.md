Branch: simba/add-candidate-comparison-view-tool-in-toolsengin
Title: Add candidate-comparison-view tool in tools/engine/candidate-comparis...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working candidate-comparison-view tool that helps market participants evaluate multiple players
Branch: simba/fix-sharedtool-registryjs---the-file-has-a-synta
Title: fix shared/tool-registry.js - the file has a syntax error caused by a...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: shared/tool-registry.js passes node --check and ToolRegistry.loadAll() works in browser
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