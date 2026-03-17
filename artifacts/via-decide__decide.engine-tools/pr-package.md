Branch: simba/implement-a-new-engine-tool-called-inter-agent-p
Title: Implement a new engine tool called inter-agent-protocol. 1. Create di...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a network-inspector style tool for developers/users to debug why their agent swarms are failing to communicate with each other.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.