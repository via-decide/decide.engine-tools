Branch: simba/create-repository-safety-audit-for-script-order-
Title: Create repository safety audit for script order and browser compatibi...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create repository safety audit for script order and browser compatibility.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.