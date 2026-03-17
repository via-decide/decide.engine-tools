Branch: simba/implement-a-new-engine-tool-called-agent-memory-
Title: Implement a new engine tool called agent-memory-graph. 1. Create dire...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide developers with a real-time "social graph" visualization of the AI swarm. This tool makes it possible to visually debug complex, asynchronous data routing and monitor how state/memory is shared across the decentralized backend architecture.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.