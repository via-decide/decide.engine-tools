Branch: simba/implement-the-live-material-preview-sphere-via-m
Title: Implement the Live Material Preview Sphere (via-mat-preview). 1. Crea...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give artists instant, real-time feedback on their complex materials without needing to launch the game, utilizing the WebGL boilerplate to drive commit volume.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.