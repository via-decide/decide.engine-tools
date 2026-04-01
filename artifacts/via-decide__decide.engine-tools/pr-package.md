Branch: simba/build-the-daxinivisualforge-the-master-ui-genera
Title: Build the 'DaxiniVisualForge'-the master UI generation engine for the...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Centralize the design logic of the 24,000-PR mission into the engine-tools repo, allowing for rapid, consistent UI generation across the entire ecosystem.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.