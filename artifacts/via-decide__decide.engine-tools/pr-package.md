Branch: simba/build-a-new-micro-frontend-named-daxinisweep-the
Title: Build a new micro-frontend named 'DaxiniSweep' (The Autonomous PR Jan...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide an automated "Closer" for the 6,000 PR mission, ensuring the user can finalize the world-record contribution count without manual intervention.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.