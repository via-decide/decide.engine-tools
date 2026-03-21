Branch: simba/create-the-animation-track-compiler-web-exporter
Title: Create the Animation Track Compiler & Web Exporter (via-anim-pack). 1...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Ensure the engine and web player can load complex cinematic UI animations with zero overhead, utilizing the automated CI loop to sustain permanent daily commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.