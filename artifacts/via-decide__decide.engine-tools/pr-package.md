Branch: simba/build-a-new-micro-frontend-named-tracetrimmer-th
Title: Build a new micro-frontend named 'TraceTrimmer' (The Error Log Optimi...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local utility to instantly strip useless noise from massive stack traces before pasting them into LLMs, ensuring the AI focuses only on the actual bug while slashing token costs.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.