Branch: simba/refactor-tool-graphhtml-update-the-visualization
Title: Refactor tool-graph.html. Update the visualization logic to map the n...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A visual map showing the relationships and dependencies between saved Agents and the registered Tools they call.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.