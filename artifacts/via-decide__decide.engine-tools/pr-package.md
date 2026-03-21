Branch: simba/implement-the-live-ops-ab-testing-configurator-v
Title: Implement the Live-Ops A/B Testing Configurator (via-live-tune). 1. C...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give designers the power to rebalance the game and run live events on the fly, breaking the deployment pipeline into dozens of micro-commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.