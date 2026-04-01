Branch: simba/build-daxiniassets-a-procedural-svg-generation-e
Title: Build 'DaxiniAssets'-a procedural SVG generation engine for the 24,00...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Ensure the 24,000-PR repository remains lightweight and fast (under 500MB total) while providing a unique, high-end visual identity for every entity.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.