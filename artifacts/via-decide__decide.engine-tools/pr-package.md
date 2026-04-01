Branch: simba/build-daxiniharvester-the-autonomous-data-scrapi
Title: Build 'DaxiniHarvester'-the autonomous data scraping and ingestion en...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create an infinite stream of high-quality, unique data to hit the 24,000-PR world record before the April 1st deadline ends.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.