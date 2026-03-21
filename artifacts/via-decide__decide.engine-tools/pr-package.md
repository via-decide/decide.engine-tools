Branch: simba/build-the-web-audio-compressor-soundbank-generat
Title: Build the Web Audio Compressor & Soundbank Generator (via-audio-crush...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Guarantee instant, high-fidelity audio playback on the viadecide.com web player, leveraging the compression pipeline to rack up high-value commits.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.