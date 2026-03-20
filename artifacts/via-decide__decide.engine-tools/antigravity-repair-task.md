Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement a gRPC-compliant SecurityInterceptor to validate tenant identity and prevent unauthorized cross-tenant data access. 1. Create a new directory src/core/mt/security/. 2. Implement SecurityInterceptor.ts as a gRPC Server Interceptor (Middleware). 3. Create an AuthValidator that extracts the Bearer JWT from the gRPC metadata. 4. Implement "Tenant Verification" logic: Decrypt the JWT and strictly compare the tenant_id claim in the token with the tenant_id found in the MtHeader of the incoming protobuf message. 5. Build a "Rejection Handler" that immediately terminates the Tunnel stream with a PermissionDenied (Status Code 7) error if there is a tenant mismatch or the token is expired. 6. Implement "Rate Limiting Checks": Before passing the envelope to the router, check the tenant_id against a Redis-backed window to ensure they haven't exceeded their MT_MAX_TPS (Transactions Per Second). 7. Integrate an "Audit Logger" that records every security rejection with the associated trace_id for forensic analysis.

RULES
1. Audit touched files first and identify regressions.
2. Preserve architecture and naming conventions.
3. Make minimal repairs only; do not expand scope.
4. Re-run checks and provide concise root-cause notes.
5. Return complete contents for changed files only.

SOP: REPAIR PROTOCOL (MANDATORY)
1. Strict Fix Only: Do not use repair mode to expand scope or add features.
2. Regression Check: Audit why previous attempt failed before proposing a fix.
3. Minimal Footprint: Only return contents for the actual repaired files.

REPO CONTEXT
- README snippet:
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g
- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
- package.json snippet:
not found