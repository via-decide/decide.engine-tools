Branch: simba/create-toolsengineupsc-mains-simulator-build-a-s
Title: Create tools/engine/upsc-mains-simulator/. Build a strict, timed text...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A high-pressure, exam-condition simulator for Mains answer writing practice.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.