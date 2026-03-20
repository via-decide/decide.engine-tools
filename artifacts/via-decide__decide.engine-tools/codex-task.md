You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Implement a gRPC-compliant SecurityInterceptor to validate tenant identity and prevent unauthorized cross-tenant data access. 1. Create a new directory src/core/mt/security/. 2. Implement SecurityInterceptor.ts as a gRPC Server Interceptor (Middleware). 3. Create an AuthValidator that extracts the Bearer JWT from the gRPC metadata. 4. Implement "Tenant Verification" logic: Decrypt the JWT and strictly compare the tenant_id claim in the token with the tenant_id found in the MtHeader of the incoming protobuf message. 5. Build a "Rejection Handler" that immediately terminates the Tunnel stream with a PermissionDenied (Status Code 7) error if there is a tenant mismatch or the token is expired. 6. Implement "Rate Limiting Checks": Before passing the envelope to the router, check the tenant_id against a Redis-backed window to ensure they haven't exceeded their MT_MAX_TPS (Transactions Per Second). 7. Integrate an "Audit Logger" that records every security rejection with the associated trace_id for forensic analysis.

CONSTRAINTS
Security is the highest priority. If a message contains a tenant_id that does not match the authenticated session, the entire connection MUST be severed instantly. Use high-speed cryptographic libraries (like jose or jsonwebtoken with native bindings) to minimize interceptor latency.

PROCESS (MANDATORY)
1. Read README.md and AGENTS.md before editing.
2. Audit architecture before coding. Summarize current behavior.
3. Preserve unrelated working code. Prefer additive modular changes.
4. Implement the smallest safe change set for the stated goal.
5. Run validation commands and fix discovered issues.
6. Self-review for regressions, missing env wiring, and docs drift.
7. Return complete final file contents for every modified or created file.

REPO AUDIT CONTEXT
- Description: 
- Primary language: HTML
- README snippet:
# Decide Engine Tools + Orchard Engine Foundation This repository is a preservation-first browser-native tool mesh by **ViaDecide**. It hosts standalone decision and productivity tools that run directly in the browser with no build step, plus the **Orchard Engine** — a merit-based farming-career g

- AGENTS snippet:
Rules for coding agents in this repository: 1. Never delete tool folders. 2. Never remove working code from tools. 3. Never replace a tool with a placeholder. 4. Prefer additive changes. 5. Tools must remain standalone HTML apps. 6. Routing must never break existing tools. 7. If reorganizing tools,
ENGINE-TOOLS ARCHITECTURE (mandatory compliance)
Tool directory: tools/<tool>/
Required files: config.json, index.html, tool.js
Shared dependencies to import: shared/tool-storage.js, shared/shared.css
config.json must include: id, name, description, category, audience, inputs, outputs, tags
Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js
Do NOT modify any existing tool folder or shared utility file.
Do NOT use external frameworks, CDN packages, or bundlers.

SOP: PRE-MODIFICATION PROTOCOL (MANDATORY)
1. Adherence to Instructions: No deviations without explicit user approval.
2. Mandatory Clarification: Immediately ask if instructions are ambiguous or incomplete.
3. Proposal First: Always propose optimizations or fixes before implementing them.
4. Scope Discipline: Do not add unrequested features or modify unrelated code.
5. Vulnerability Check: Immediately flag and explain security risks.

OUTPUT REQUIREMENTS
- Include: implementation summary, checks run, risks, rollback notes.
- Generate branch + PR package.
- Keep prompts deterministic and preservation-first.