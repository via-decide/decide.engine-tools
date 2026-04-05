Branch: simba/track-token-efficiency-across-distributed-reques
Title: Track token efficiency across distributed requests.

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: maintain token efficiency above 80%

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.