Branch: simba/implement-the-live-scene-inspector-bridge-via-sc
Title: Implement the Live Scene Inspector Bridge (via-scene-bridge). 1. Crea...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Allow developers to debug live native gameplay directly through the viadecide.com website, racking up massive commit volume during the network protocol construction.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.