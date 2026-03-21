Branch: simba/build-the-animation-state-machine-asm-compiler-v
Title: Build the Animation State Machine (ASM) Compiler (via-anim-compile). ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Bridge the gap between animator tools and the runtime engine while milking the complex math transitions for maximum, legitimate commit volume.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.