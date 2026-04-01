Branch: simba/build-a-new-micro-frontend-named-airtrace-the-sw
Title: Build a new micro-frontend named 'AIRTrace' (The Swarm Observability ...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Provide a local, browser-based observability platform that unpacks the "black box" of multi-agent workflows, allowing the user to precisely audit token spend, identify prompt hallucinations, and optimize swarm latency.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.