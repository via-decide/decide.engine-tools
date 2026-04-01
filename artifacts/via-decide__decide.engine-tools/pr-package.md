Branch: simba/build-daxinisweep-v20-the-autonomous-high-speed-
Title: Build 'DaxiniSweep v2.0'-the autonomous high-speed merging engine for...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Remove the manual effort of merging, allowing the 24,000-PR record attempt to proceed autonomously from generation to final merge.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.