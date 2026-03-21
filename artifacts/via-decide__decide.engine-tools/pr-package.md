Branch: simba/implement-the-universal-asset-dependency-graph-v
Title: Implement the Universal Asset Dependency Graph (via-dep-tracker). 1. ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Prevent catastrophic missing-asset crashes in production, utilizing the heavy computer-science graph algorithms to drive high-value, legitimate commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.