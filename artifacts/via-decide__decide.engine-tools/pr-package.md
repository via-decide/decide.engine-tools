Branch: simba/develop-the-engine-to-web-documentation-generato
Title: Develop the Engine-to-Web Documentation Generator (via-doc-gen). 1. B...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Automate viadecide.com's technical documentation directly from the engine source, using the tools repo to drive the commits.
Branch: simba/build-the-web-asset-optimizer-cli-via-web-export
Title: Build the Web Asset Optimizer CLI (via-web-export). 1. Create a comma...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a tool that ensures viadecide.com can load interactive engine scenes (like simulators or swipe-based apps) instantly, while flooding the tools repo with parser commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.