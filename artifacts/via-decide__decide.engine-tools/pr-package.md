Branch: simba/build-the-ecs-prefab-compiler-codegen-via-prefab
Title: Build the ECS Prefab Compiler & CodeGen (via-prefab-gen). 1. Create a...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Automate the most tedious part of engine programming (ECS boilerplate) while farming dozens of granular commits through the code-generation logic.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.