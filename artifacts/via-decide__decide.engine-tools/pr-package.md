Branch: simba/implement-the-weapon-dps-simulator-balancer-via-
Title: Implement the Weapon DPS Simulator & Balancer (via-weapon-balance). 1...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give game designers a data-driven way to balance combat, while using the continuous simulation reports to permanently sustain the daily automated commit velocity.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.