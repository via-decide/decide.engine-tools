Branch: simba/build-daxinicontrol-the-real-time-telemetry-and-
Title: Build 'DaxiniControl'-the real-time telemetry and mission control das...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide full observability of the 24,000-PR run, ensuring the user can manage GitHub rate limits and verify merge progress in real-time.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.