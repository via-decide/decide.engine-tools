Branch: simba/add-archetype-distribution-analyzer-tool-in-tool
Title: Add archetype-distribution-analyzer tool in tools/engine/archetype-di...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working archetype-distribution-analyzer tool that visualizes population specialization trends

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.