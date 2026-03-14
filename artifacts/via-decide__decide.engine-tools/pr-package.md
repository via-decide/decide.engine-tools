Branch: simba/in-toolsenginegrowth-milestone-enginetooljs-only
Title: in tools/engine/growth-milestone-engine/tool.js only - add a paused f...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: animate loop pauses when tab is hidden; event listeners never duplicate; zero shared file changes

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.