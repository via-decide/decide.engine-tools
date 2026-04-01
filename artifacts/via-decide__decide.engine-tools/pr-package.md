Branch: simba/build-daxiniorchestrator-the-master-execution-lo
Title: Build 'DaxiniOrchestrator'-the master execution loop that automates t...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Automate the end-to-end process of the world-record attempt, allowing for hands-free generation and merging of thousands of unique entities.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.