Branch: simba/develop-the-multiplayer-network-schema-codegen-v
Title: Develop the Multiplayer Network Schema CodeGen (via-net-schema). 1. B...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Ensure the C++ game engine and the web website share 100% synchronized netcode, while flooding the commit graph with complex compiler-theory commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.