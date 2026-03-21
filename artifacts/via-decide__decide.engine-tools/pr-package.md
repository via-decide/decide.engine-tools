Branch: simba/develop-the-ui-layout-compiler-binary-packer-via
Title: Develop the UI Layout Compiler & Binary Packer (via-ui-compile). 1. B...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Enable designers to build responsive game HUDs quickly while forcing the bot into an extreme micro-commit loop based on the sheer number of UI nodes it has to process.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.