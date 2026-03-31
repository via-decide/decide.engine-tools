Branch: simba/build-a-new-micro-frontend-named-domscrubber-the
Title: Build a new micro-frontend named 'DOMScrubber' (The HTML & SVG Token ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local utility to instantly strip heavy SVGs, inline styles, and classes from raw web code, giving LLMs a pure semantic skeleton of a UI while saving massive token costs.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.