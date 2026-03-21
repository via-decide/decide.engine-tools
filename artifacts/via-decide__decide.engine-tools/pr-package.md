Branch: simba/create-the-automated-cicd-memory-leak-detector-v
Title: Create the Automated CI/CD Memory Leak Detector (via-leak-check). 1. ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Ensure the engine remains 100% leak-free while utilizing the automated health reports to passively, permanently inflate your daily commit count.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.