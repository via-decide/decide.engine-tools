Branch: simba/add-weather-system-tool-in-toolsengineweather-sy
Title: Add weather-system tool in tools/engine/weather-system/ with config.j...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working weather-system tool that injects randomized resource variables into the daily loop

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.