# Conceptual Continuity Lifecycle Manager CLI Tool — Task Specification

## Task Definition
Define a conceptual, read-only-first CLI lifecycle contract for continuity compaction (T5), garbage collection (T12), and topology pruning (T22) on markdown DAG artifacts, with mathematically verifiable dry-run safety and transactional commit controls.

## Purpose
- Give sovereign operators a DAG-aware alternative to unsafe manual cleanup commands.
- Prevent cryptographic lineage breakage during archival, pruning, and reclamation.
- Ensure destructive intents are projected, audited, and committed only through validated lifecycle semantics.

## Scope
- Conceptual command model only.
- Semantic pruning/compaction/GC policy definition.
- Dry-run projection rules with deterministic impact previews.
- Transactional commit sequence with digest lock and canonical-head safety.
- Telemetry schema for lifecycle auditability.

## Non-Goals
- No executable CLI, scripting, or deletion code.
- No implementation-specific runtime modules.
- No direct file utility bindings.

## Conceptual CLI Command Schema
Base namespace:
- `decide-tools lifecycle`

Subcommands:
- `decide-tools lifecycle prune`
- `decide-tools lifecycle compact`
- `decide-tools lifecycle gc`
- `decide-tools lifecycle audit`

Arguments and safety flags:
- `--root <path>`: continuity DAG root location.
- `--mode <prune|compact|gc|audit>`: operation selector.
- `--depth <n>`: maximum traversal depth for pruning projections.
- `--target <resolved_forks|abandoned_sandboxes|stale_branches|quarantine>`: lifecycle scope.
- `--retain-heads <n>`: minimum canonical head count preserved.
- `--retain-epochs <csv>`: immutable epochs exempt from lifecycle transforms.
- `--gc-threshold <bytes|percent>`: compaction/GC trigger boundary.
- `--audit-digest <sha256>`: required T15 digest lock for commit.
- `--dry-run`: mandatory non-mutating projection mode.
- `--commit`: explicit operator acknowledgment for transactional execution.
- `--trash-buffer <path>`: temporary staging namespace for reversible commit phase.
- `--strict`: fail on warnings, unresolved dependencies, or policy drift.
- `--telemetry-out <path>`: write deterministic lifecycle audit report.

## Dry-Run Visualization Boundary
Dry-run must never mutate lineage artifacts and must project full structural impact.

Projection sequence:
1. Build immutable DAG snapshot in deterministic lexical order.
2. Resolve candidate node set by mode/target/depth/retention rules.
3. Simulate structural transforms (prune/compact/gc) in memory only.
4. Compute projected canonical head transitions.
5. Compute projected replay admissibility delta.
6. Emit hash-indexed impact summary.

Dry-run output requirements:
- Zero mutation to source artifacts.
- Zero canonical pointer updates.
- Deterministic output for identical inputs.
- Explicit affected-node classes:
  - `RETAINED`
  - `STAGE_TO_TRASH`
  - `PURGE_ELIGIBLE`
  - `HEAD_IMPACTED`

## Transactional Execution Sequence
Commit path is allowed only after a successful dry-run and explicit `--commit`.

Ordered transaction steps:
1. Recompute current audit digest and verify exact match with `--audit-digest` (T15 lock).
2. Rebuild DAG snapshot; fail if drift exists since dry-run projection.
3. Stage selected artifacts into temporary `.trash` buffer (reversible phase).
4. Validate retained graph integrity and hash-chain continuity.
5. Atomically update Canonical Head references (T21 semantics).
6. Re-run replay admissibility checks on post-update graph.
7. Finalize purge only when all validations pass.
8. Emit immutable lifecycle receipt with before/after digests.

Abort/rollback rule:
- Any failed gate immediately aborts commit and restores staged artifacts to pre-transaction state.

## Lifecycle Safety Constraints
### Compaction (T5)
- Compaction may collapse resolved segments but must preserve traceable lineage mapping.
- Compaction map must retain reversible provenance identifiers.

### Garbage Collection (T12)
- GC may target only unreachable nodes outside retention policies.
- Protected epochs and protected heads are never GC candidates.

### Topology Pruning (T22)
- Pruning may remove resolved forks and abandoned speculative sandboxes (T17) only when replay-critical ancestry remains intact.
- Nodes tagged replay-critical are non-prunable unless replaced by admissible canonical descendants.

## Integrity and Governance Gates
Mandatory pass conditions before commit:
- `DAG_INTEGRITY_PASS`
- `HASH_CHAIN_PASS`
- `AUDIT_DIGEST_LOCK_PASS`
- `AUTHORITY_SCOPE_PASS`
- `REPLAY_ADMISSIBILITY_PASS`
- `ATOMIC_POINTER_UPDATE_PASS`

If any gate fails, result is non-committable.

## Expected Lifecycle Telemetry Output Format
```json
{
  "run_id": "",
  "command": "decide-tools lifecycle",
  "mode": "prune|compact|gc|audit",
  "timestamp_epoch": "",
  "execution_mode": "DRY_RUN|COMMIT",
  "policy": {
    "target": "",
    "depth": 0,
    "retain_heads": 0,
    "retain_epochs": []
  },
  "digests": {
    "audit_before": "",
    "audit_after": ""
  },
  "projection": {
    "nodes_scanned": 0,
    "nodes_retained": 0,
    "nodes_stage_to_trash": 0,
    "nodes_purge_eligible": 0,
    "head_updates": 0,
    "replay_risk": "NONE|LOW|MEDIUM|HIGH"
  },
  "validation": {
    "dag_integrity": "PASS|FAIL",
    "hash_chain": "PASS|FAIL",
    "digest_lock": "PASS|FAIL",
    "authority_scope": "PASS|FAIL",
    "replay_admissibility": "PASS|FAIL",
    "atomic_pointer_update": "PASS|FAIL"
  },
  "result": "DRY_RUN_PASS|DRY_RUN_FAIL|COMMIT_SUCCESS|COMMIT_ABORTED",
  "affected_node_hashes": [],
  "errors": [],
  "determinism": {
    "ordering": "lexical",
    "hash_algo": "sha256",
    "projection_profile": "immutable"
  }
}
```

## Validation Gate for This Task Artifact
Success is achieved when:
- Exactly one file exists at `artifacts/decide.engine-tools/det-0004/continuity-lifecycle-manager-cli.task.md`.
- CLI schema, dry-run boundaries, transactional sequence, and telemetry model are comprehensively documented.
- No executable snippets or implementation module references are included.

## Operational Safety Statement
This specification defines a conceptual janitorial control plane for sovereign continuity footprint management, ensuring destructive lifecycle actions remain mathematically previewable, cryptographically guarded, and replay-safe.
