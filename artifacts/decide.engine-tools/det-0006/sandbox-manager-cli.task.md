# Conceptual Sandbox Manager CLI Tool — Task Specification

## Task Definition
Define a conceptual CLI governance contract for safely creating, isolating, diffing, and selectively promoting speculative lineage sandboxes (T17) into canonical continuity history with deterministic hash re-anchoring controls. This is specification-only and contains no executable implementation.

## Purpose
- Enable sovereign operators to explore alternate continuity futures without canonical DAG pollution.
- Provide deterministic topological diffing between canonical and sandbox lineages.
- Guarantee mathematically constrained promotion from sandbox to canonical via cryptographic re-anchoring.

## Scope
- Conceptual command schema for sandbox lifecycle operations.
- Isolation rules preventing speculative files from canonical indexing.
- Diffing boundary for structural divergence analysis.
- Commit-phase hash re-anchoring and signature refresh requirements.
- Telemetry schema for sandbox audit and promotion traceability.

## Non-Goals
- No executable CLI scripts.
- No branching implementation code.
- No runtime execution hooks.
- No AST or engine module integrations.

## Conceptual CLI Command Schema
Base namespace:
- `decide-tools sandbox`

Conceptual commands:
- `decide-tools sandbox init <name>`
- `decide-tools sandbox status <name>`
- `decide-tools sandbox diff <name>`
- `decide-tools sandbox commit <name>`
- `decide-tools sandbox discard <name>`

Arguments and flags:
- `--canonical-root <path>`: canonical continuity root.
- `--sandbox-root <path>`: isolated speculative namespace.
- `--head <hash>`: canonical anchor head used at init time.
- `--intent <what_if|recovery|policy_test|override_rehearsal>`: sandbox intent class.
- `--depth <n>`: divergence analysis depth bound.
- `--strict`: fail on unresolved lineage or policy ambiguity.
- `--dry-run`: required pre-commit promotion simulation.
- `--authority <profile>`: authority scope for commit eligibility.
- `--audit-digest <sha256>`: T15 digest lock before promotion.
- `--telemetry-out <path>`: deterministic sandbox telemetry output.

## Isolation and Instantiation Rules
Sandbox initialization must conceptually enforce:
1. Clone lineage metadata references, not canonical mutation rights.
2. Pin sandbox root to initialization head hash.
3. Mark sandbox namespace as non-canonical and non-indexable by default.
4. Apply explicit ignore boundaries so canonical replay scans skip speculative nodes.
5. Require sandbox-local signatures for newly created speculative nodes.

## Speculative Diffing Boundary
`diff` operation must calculate topological divergence without mutation.

Deterministic diff sequence:
1. Load canonical DAG frontier from current canonical head.
2. Load sandbox DAG frontier from sandbox head.
3. Compute node set deltas:
   - new speculative nodes
   - modified intent/rationale nodes
   - divergence fork roots
   - replay-critical dependency changes
4. Compute edge deltas:
   - added parent links
   - removed/replaced links
   - unresolved references
5. Produce human-readable summary and hash-indexed change ledger.

Diff output constraints:
- No write to canonical paths.
- No head pointer updates.
- Deterministic output for identical inputs.

## Hash Re-Anchoring Sequence (Commit Phase)
Promotion from sandbox to canonical must be cryptographically deterministic.

Ordered commit sequence:
1. Verify `--audit-digest` matches current canonical digest (T15).
2. Confirm authority scope permits promotion intent.
3. Identify sandbox root promotion node.
4. Rewrite sandbox root `parent_hash` to current canonical head hash.
5. Recompute downstream node hashes for affected subtree in deterministic order.
6. Re-sign all re-anchored nodes with sovereign signature envelope (T11 semantics).
7. Validate re-anchored subtree DAG integrity and replay admissibility.
8. Atomically append re-anchored subtree to canonical namespace.
9. Atomically update canonical head pointer to promoted frontier.
10. Emit immutable promotion receipt with old/new head hashes.

Abort rule:
- Any hash/signature/authority/replay validation failure aborts promotion and leaves canonical DAG unchanged.

## Governance and Safety Gates
Promotion requires all gates:
- `CANONICAL_DIGEST_LOCK_PASS`
- `SANDBOX_ISOLATION_PASS`
- `DIVERGENCE_VALIDATION_PASS`
- `HASH_REANCHOR_PASS`
- `SIGNATURE_REFRESH_PASS`
- `REPLAY_ADMISSIBILITY_PASS`
- `ATOMIC_HEAD_UPDATE_PASS`

Failure of any gate returns non-committable result.

## Expected Sandbox Telemetry Output Format
```json
{
  "run_id": "",
  "command": "decide-tools sandbox",
  "operation": "init|status|diff|commit|discard",
  "sandbox_name": "",
  "timestamp_epoch": "",
  "execution_mode": "DRY_RUN|COMMIT",
  "canonical": {
    "head_before": "",
    "head_after": "",
    "audit_digest_before": "",
    "audit_digest_after": ""
  },
  "sandbox": {
    "init_head": "",
    "current_head": "",
    "intent": ""
  },
  "divergence": {
    "new_nodes": 0,
    "modified_nodes": 0,
    "fork_roots": 0,
    "edge_changes": 0,
    "replay_risk": "NONE|LOW|MEDIUM|HIGH"
  },
  "validation": {
    "digest_lock": "PASS|FAIL",
    "authority_scope": "PASS|FAIL",
    "hash_reanchor": "PASS|FAIL",
    "signature_refresh": "PASS|FAIL",
    "dag_integrity": "PASS|FAIL",
    "replay_admissibility": "PASS|FAIL",
    "atomic_head_update": "PASS|FAIL"
  },
  "result": "INIT_OK|DIFF_OK|DRY_RUN_PASS|DRY_RUN_FAIL|COMMIT_SUCCESS|COMMIT_ABORTED|DISCARD_OK",
  "affected_hashes": [],
  "errors": [],
  "determinism": {
    "ordering": "lexical",
    "hash_algo": "sha256",
    "reanchor_mode": "canonical_frontier_binding"
  }
}
```

## Validation Gate for This Task Artifact
Success requires:
- Exactly one file exists at `artifacts/decide.engine-tools/det-0006/sandbox-manager-cli.task.md`.
- CLI initialization/diff/merge flows and cryptographic re-anchoring constraints are comprehensively documented.
- No executable snippets, branching code, runtime modules, or AST comparator references are included.

## Operational Safety Statement
This specification defines a conceptual multiverse-control interface for continuity sandbox governance, enabling safe speculative exploration and selective canonical collapse with strict cryptographic lineage guarantees.
