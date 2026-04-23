Branch: simba/add-per-node-resource-governance-time-and-memory
Title: Add per-node resource governance (time and memory limits) to prevent ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add per-node resource governance (time and memory limits) to prevent runaway executions and ensure predictable performance.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.