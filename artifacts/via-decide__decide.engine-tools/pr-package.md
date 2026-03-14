Branch: simba/create-toolsengineupsc-master-os-take-the-provid
Title: Create tools/engine/upsc-master-os/. Take the provided monolithic "UP...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A fully functional, beautifully routed, standalone UPSC 2026 Master OS tool cleanly integrated into the engine repository.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.