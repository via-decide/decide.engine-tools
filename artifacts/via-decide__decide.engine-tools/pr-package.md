Branch: simba/add-skills-gap-analyzer-tool-in-toolsengineskill
Title: Add skills-gap-analyzer tool in tools/engine/skills-gap-analyzer/ wit...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working skills-gap-analyzer tool that visualizes the delta between player stats and market needs

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.