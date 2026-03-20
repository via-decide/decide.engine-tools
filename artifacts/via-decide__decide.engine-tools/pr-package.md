Branch: simba/implement-a-high-performance-asynchronous-routin
Title: Implement a high-performance, asynchronous routing engine called MtRo...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Turn the protocol into an active network. By implementing a central router, the engine can efficiently juggle thousands of independent tool executions from different users without cross-contaminating data or blocking the main event loop.
Branch: simba/implement-the-mt-multi-tenant-message-transport-
Title: Implement the MT (Multi-Tenant) Message Transport protocol using Prot...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Establish a high-speed, multi-tenant communication layer. By using a multiplexed bidirectional stream, the engine can manage thousands of concurrent tool executions across different tenants over a single persistent TCP connection.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.