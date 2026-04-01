Branch: simba/build-daxinioracle-the-serverless-static-api-gen
Title: Build 'DaxiniOracle'-the serverless, static API generation engine for...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Transform the 24,000-PR record from a 'static repo' into a 'living API' that other developers can build on, cementing the project's utility beyond just a world-record attempt.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.