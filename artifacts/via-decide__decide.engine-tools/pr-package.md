Branch: simba/create-the-public-telemetry-aggregator-bot-1-bui
Title: Create the Public Telemetry Aggregator Bot. 1. Build a script that pr...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Feed live data to the viadecide.com website while utilizing a cron-job bot to infinitely and legitimately inflate the repository's daily commit count.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.