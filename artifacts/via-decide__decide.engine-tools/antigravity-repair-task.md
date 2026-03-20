Repair mode for repository via-decide/decide.engine-tools.

TARGET
Validate and repair only the files touched by the previous implementation.

TASK
Implement a high-performance, asynchronous routing engine called MtRouter to manage multiplexed traffic within the MT protocol. 1. Create a new directory src/core/mt/routing/. 2. Implement MtRouter.ts. This class must maintain a registry of "Tool Handlers" mapped to specific message types found in the MtEnvelope.oneof payload. 3. Create a Route method that takes an incoming MtEnvelope, extracts the tenant_id from the MtHeader, and dispatches the payload to the corresponding worker or handler. 4. Implement an internal "In-Flight Request Map" to track pending ToolRequests by their trace_id, ensuring that responses are correctly routed back through the same Tunnel stream. 5. Build a "Priority Queue" mechanism. If the MtHeader.Priority is CRITICAL, the router must move that message to the front of the execution stack, bypassing LOW priority tasks. 6. Implement a "Tenant Registry" that tracks the number of active streams per tenant_id to prevent any single tenant from hogging system resources.
Implement the MT (Multi-Tenant) Message Transport protocol using Protobuf to establish a multiplexed, high-performance communication backbone. 1. Create the directory proto/decide/v1/ and a foundational file mt_protocol.proto. 2. Define syntax = "proto3"; and package decide.v1;. 3. Implement MtHeader: include string tenant_id, string trace_id, and fixed64 timestamp. 4. Define enum Priority { LOW = 0; HIGH = 1; CRITICAL = 2; } within the header. 5. Create a polymorphic MtEnvelope message using a oneof payload block to encapsulate different message types (e.g., ToolRequest, ToolResponse, Heartbeat). 6. Define the MtTransportService with a bidirectional gRPC stream: rpc Tunnel(stream MtEnvelope) returns (stream MtEnvelope);. 7. Implement MtError schema for protocol-level rejections (e.g., TENANT_LIMIT_EXCEEDED, AUTH_FAILURE). 8. Configure a buf.yaml or protoc build script to generate TypeScript and Rust bindings into the /gen directory.

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