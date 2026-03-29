Branch: simba/build-the-meta-compressor-to-extract-only-functi
Title: Build the meta-compressor to extract only function signatures from th...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Instead of passing 10,000 tokens of shared files to Claude to give it context, I will pass this 500-token .via-metadata map. Claude will instantly know exactly how to call every backend function without reading how it works.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.