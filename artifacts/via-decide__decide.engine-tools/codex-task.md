You are working in repository via-decide/decide.engine-tools on branch main.

MISSION
Implement a high-performance, asynchronous routing engine called MtRouter to manage multiplexed traffic within the MT protocol. 1. Create a new directory src/core/mt/routing/. 2. Implement MtRouter.ts. This class must maintain a registry of "Tool Handlers" mapped to specific message types found in the MtEnvelope.oneof payload. 3. Create a Route method that takes an incoming MtEnvelope, extracts the tenant_id from the MtHeader, and dispatches the payload to the corresponding worker or handler. 4. Implement an internal "In-Flight Request Map" to track pending ToolRequests by their trace_id, ensuring that responses are correctly routed back through the same Tunnel stream. 5. Build a "Priority Queue" mechanism. If the MtHeader.Priority is CRITICAL, the router must move that message to the front of the execution stack, bypassing LOW priority tasks. 6. Implement a "Tenant Registry" that tracks the number of active streams per tenant_id to prevent any single tenant from hogging system resources.

CONSTRAINTS
The router must be strictly non-blocking. Use asynchronous event emitters or RXJS Observables to handle the stream flow. Maintain the case-sensitive repository name: decide.engine-tools.
Implement the MT (Multi-Tenant) Message Transport protocol using Protobuf to establish a multiplexed, high-performance communication backbone. 1. Create the directory proto/decide/v1/ and a foundational file mt_protocol.proto. 2. Define syntax = "proto3"; and package decide.v1;. 3. Implement MtHeader: include string tenant_id, string trace_id, and fixed64 timestamp. 4. Define enum Priority { LOW = 0; HIGH = 1; CRITICAL = 2; } within the header. 5. Create a polymorphic MtEnvelope message using a oneof payload block to encapsulate different message types (e.g., ToolRequest, ToolResponse, Heartbeat). 6. Define the MtTransportService with a bidirectional gRPC stream: rpc Tunnel(stream MtEnvelope) returns (stream MtEnvelope);. 7. Implement MtError schema for protocol-level rejections (e.g., TENANT_LIMIT_EXCEEDED, AUTH_FAILURE). 8. Configure a buf.yaml or protoc build script to generate TypeScript and Rust bindings into the /gen directory.

CONSTRAINTS
Maintain strict case sensitivity for the repository name: decide.engine-tools. The tenant_id must be mandatory in all MtHeader instances to ensure strict data isolation. Use fixed64 for timestamps to optimize byte alignment and minimize CPU overhead during serialization.

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