Branch: simba/in-toolsenginegrowth-milestone-enginetooljs-fix-
Title: in tools/engine/growth-milestone-engine/tool.js fix the animate3D fun...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: animate loop pauses on tab switch; event listeners never stack

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.