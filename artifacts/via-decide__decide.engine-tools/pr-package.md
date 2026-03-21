Branch: simba/develop-the-physics-convex-hull-generator-via-hu
Title: Develop the Physics Convex Hull Generator (via-hull-maker). 1. Build ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Guarantee high-performance collision detection in the game by pre-computing the physics shapes, utilizing the complex geometry math to drive high-value commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.