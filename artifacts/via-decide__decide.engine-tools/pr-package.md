Branch: simba/develop-the-high-frequency-telemetry-batcher-via
Title: Develop the High-Frequency Telemetry Batcher (via-telemetry-pipe). 1....

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Protect the viadecide.com database from being DDOS'd by its own game clients, utilizing the data-compression math to drive granular commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.