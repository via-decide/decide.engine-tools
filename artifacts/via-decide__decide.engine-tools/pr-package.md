Branch: simba/develop-the-high-speed-asset-search-indexer-via-
Title: Develop the High-Speed Asset Search & Indexer (via-asset-index). 1. B...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide an instant, Unreal Engine-style Content Browser experience, breaking the database and search logic down into a massive stream of modular commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.