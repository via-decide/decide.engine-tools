Branch: simba/automate-the-nightly-simulation-cicd-bot-via-nig
Title: Automate the Nightly Simulation CI/CD Bot (via-nightly-sim). 1. Write...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create a self-sustaining testing loop that not only ensures server stability but guarantees fresh, automated, high-value commits every single day, indefinitely.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.