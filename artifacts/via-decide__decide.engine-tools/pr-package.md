Branch: simba/implement-the-local-matchmaking-mock-server-via-
Title: Implement the Local Matchmaking Mock Server (via-matchmaker-local). 1...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Allow developers to stress-test the game's lobby system entirely offline, using the mocking logic to organically inflate the tools repository commit count.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.