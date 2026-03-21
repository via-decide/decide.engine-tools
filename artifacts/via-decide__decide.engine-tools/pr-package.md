Branch: simba/create-the-playtest-analytics-dashboard-generato
Title: Create the Playtest Analytics Dashboard Generator (via-playtest-repor...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Bridge local engine testing with web-based visualization on viadecide.com, breaking the data processing down into high-frequency, atomic commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.