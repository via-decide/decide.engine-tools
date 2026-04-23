Branch: simba/add-idempotency-layer-to-prevent-duplicate-node-
Title: Add idempotency layer to prevent duplicate node execution and ensure ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add idempotency layer to prevent duplicate node execution and ensure consistent results for identical inputs.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.