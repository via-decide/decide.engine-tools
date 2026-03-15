Branch: simba/create-a-new-branch-featureagent-runtime-create-
Title: Create a new branch feature/agent-runtime. Create a file named shared...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A successfully opened Pull Request containing the execution brain that parses and runs the JSON-based agent workflows.
Branch: simba/create-a-new-branch-featureagent-tool-registry-c
Title: Create a new branch feature/agent-tool-registry. Create a new directo...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: A successfully opened Pull Request containing the global Tool Registry that defines the atomic actions available to AI agents.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.