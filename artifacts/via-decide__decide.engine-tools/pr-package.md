Branch: simba/create-execution-consolehtml-build-a-developer-s
Title: Create execution-console.html. Build a developer-style dashboard that...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A real-time monitoring console that visualizes exactly what an agent is thinking and doing at every step.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.