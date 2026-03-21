Branch: simba/create-the-shader-permutation-warm-up-cache-ci-b
Title: Create the Shader Permutation & Warm-up Cache CI Bot (via-shader-cach...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Solve the notorious "shader compilation stutter" problem before it starts, while permanently automating high-value daily commits via the caching bot.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.