Branch: simba/scan-the-shared-and-toolsengine-folders-locate-t
Title: Scan the 'shared/' and 'tools/engine/' folders. Locate the 'terminal-...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Scan the 'shared/' and 'tools/engine/' folders. Locate the 'terminal-logger.js' and integrate it more deeply into the current 'swipe-crucible' tool to provide real-time terminal feedback for all swipe actions.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.