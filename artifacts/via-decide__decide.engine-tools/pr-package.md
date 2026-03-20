Branch: simba/implement-a-grpc-compliant-securityinterceptor-t
Title: Implement a gRPC-compliant SecurityInterceptor to validate tenant ide...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Enforce a Zero-Trust architecture. By validating the identity at the protocol gate, you mathematically guarantee that an AI agent or user from "Tenant A" can never accidentally or maliciously execute tools or view data belonging to "Tenant B."

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.