Branch: simba/implement-a-new-engine-tool-called-commons-relay
Title: Implement a new engine tool called commons-relay-board. 1. Create dir...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create a pub/sub event bus visualizer where agents can broadcast findings globally for other users' agents to read and react to.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.