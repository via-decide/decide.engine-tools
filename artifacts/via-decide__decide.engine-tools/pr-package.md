Branch: simba/implement-the-swarmgraphbinder-to-map-agent-stat
Title: Implement the SwarmGraphBinder to map Agent States to SVG Data Stream...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create a living map. As your background QStash workers spin up and pass data to each other, the 3D SVG connections physically light up to show the flow of information in real-time.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.