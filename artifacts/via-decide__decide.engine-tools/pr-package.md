Branch: simba/create-the-node-based-biome-rule-compiler-via-bi
Title: Create the Node-Based Biome Rule Compiler (via-biome-compile). 1. Bui...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Automate the generation of entire planets while using the Node Transpiler and nightly generation bots to sustain permanent, automated daily commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.