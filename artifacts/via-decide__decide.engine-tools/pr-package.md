Branch: simba/build-daxinioverlord-the-centralized-monitoring-
Title: Build 'DaxiniOverlord'-the centralized monitoring and command-and-con...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give the "Boss of Git" a single, unified view of the entire 24,000-PR empire, enabling data-driven decisions to hit the world record before midnight.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.