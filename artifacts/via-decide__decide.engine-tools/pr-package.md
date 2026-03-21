Branch: simba/develop-the-visual-scripting-node-translator-via
Title: Develop the Visual Scripting Node Translator (via-node-transpiler). 1...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Enable designers to build game logic visually while forcing the bot into an extreme micro-commit loop based on the sheer number of node types it has to process.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.