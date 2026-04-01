Branch: simba/build-daxinicortex-the-autonomous-synthesis-engi
Title: Build 'DaxiniCortex'-the autonomous synthesis engine for large-scale ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Eliminate the data bottleneck by providing an infinite stream of high-quality, structured personas for the 24,000-PR world record run.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.