Branch: simba/build-a-new-micro-frontend-named-payloadpruner-t
Title: Build a new micro-frontend named 'PayloadPruner' (The JSON Token Opti...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, instant utility to strip redundant data from massive API responses, allowing developers to pass exact data schemas to LLMs while slashing token usage by up to 99%.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.