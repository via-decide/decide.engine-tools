Branch: simba/develop-the-node-to-shader-transpiler-via-shader
Title: Develop the Node-to-Shader Transpiler (via-shader-compile). 1. Build ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Automate the translation of visual logic into blazing-fast GPU instructions, farming an enormous amount of high-value compiler logic commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.