Branch: simba/build-a-new-micro-frontend-named-aireval-the-age
Title: Build a new micro-frontend named 'AIREval' (The Agent Performance Cru...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, automated testing arena to benchmark AI agents against synthetic datasets, ensuring they strictly follow instructions, maintain stable JSON outputs, and stay within compute budgets before being deployed to production routing.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.