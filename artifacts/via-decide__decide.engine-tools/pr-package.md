Branch: simba/wire-the-supabase-realtime-payload-to-the-css-cy
Title: Wire the Supabase Realtime payload to the CSS Cyber-Health Bar. 1. Op...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Bridge the cloud database directly to the CSS animation engine. When a clan member deals damage, the local UI instantly recalculates the math, shrinks the bar, and triggers the physical impact shake.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.