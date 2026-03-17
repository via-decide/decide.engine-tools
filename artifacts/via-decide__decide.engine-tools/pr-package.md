Branch: simba/implement-a-new-engine-tool-called-agent-swarm-c
Title: Implement a new engine tool called agent-swarm-coordinator. 1. Create...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Allow users to chain multiple single-purpose agents together into a unified, autonomous pipeline where they pass context to one another.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.