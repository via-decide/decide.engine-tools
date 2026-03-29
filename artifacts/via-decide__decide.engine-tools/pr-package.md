Branch: simba/build-the-mocksynthesizer-to-provide-determinist
Title: Build the MockSynthesizer to provide deterministic reference data for...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a static, 0-token-cost reference file so antigravity can inject perfect mock data into any new tool it builds, ensuring UI tests don't fail due to missing variables.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.