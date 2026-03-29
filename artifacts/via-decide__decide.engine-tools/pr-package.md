Branch: simba/build-the-via-diagnostic-cli-tool-to-automatical
Title: Build the via-diagnostic CLI tool to automatically verify the integri...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Give the agent a 1-second sanity check. After applying a unified diff patch to 10 files, the agent runs the diagnostic to guarantee it didn't accidentally break routing or delete a config file.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.