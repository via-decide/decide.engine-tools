Branch: simba/build-the-terminallogger-to-map-llm-json-outputs
Title: Build the TerminalLogger to map LLM JSON outputs into the CRT CSS UI....

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Transform boring, static AI JSON responses into a live, hacking-style data stream that interacts perfectly with the CRT and Glitch CSS tokens.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.