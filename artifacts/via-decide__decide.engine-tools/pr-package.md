Branch: simba/add-daily-weather-replenisher-tool-in-toolsengin
Title: Add daily-weather-replenisher tool in tools/engine/daily-weather-repl...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: working daily-weather-replenisher tool to manage the daily energy economy

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.