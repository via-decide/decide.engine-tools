Branch: simba/add-sandboxed-execution-wrapper-for-each-node-to
Title: Add sandboxed execution wrapper for each node to isolate side-effects...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add sandboxed execution wrapper for each node to isolate side-effects and prevent global state corruption.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.