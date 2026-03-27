Branch: simba/add-vialogic-as-a-single-file-tool-at-toolsgames
Title: Add ViaLogic as a single-file tool at tools/games/vialogic/index.html...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Add ViaLogic as a single-file tool at tools/games/vialogic/index.html. ViaLogic is a "Cartography of Minds" - a pan/zoom exploration map where each mathematician is a living node that grows via tree-root logic (Orchade

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.