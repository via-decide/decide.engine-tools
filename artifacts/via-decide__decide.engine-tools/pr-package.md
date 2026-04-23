Branch: simba/add-asset-management-system-for-loading-caching-
Title: Add asset management system for loading, caching, and providing textu...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add asset management system for loading, caching, and providing textures, meshes, and materials to the rendering pipeline.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.