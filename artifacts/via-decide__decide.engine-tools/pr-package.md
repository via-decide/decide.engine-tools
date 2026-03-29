Branch: simba/build-the-meta-compressor-to-extract-only-functi
Title: Build the meta-compressor to extract only function signatures from th...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Instead of passing 10,000 tokens of shared files to Claude to give it context, I will pass this 500-token .via-metadata map. Claude will instantly know exactly how to call every backend function without reading how it works.
Branch: simba/build-the-via-scaffold-cli-utility-to-eliminate-
Title: Build the via-scaffold CLI utility to eliminate boilerplate token gen...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: When I ask Claude to build a tool, I will run the scaffolder first. Claude will only need to write the 50 lines of unique logic inside tool.js, saving thousands of output tokens per feature.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.