# Conceptual Lineage Inspector CLI Tool — Task Specification

## Task Definition
Define a read-only observability tool contract for inspecting markdown continuity artifacts as a deterministic DAG audit surface. The tool is conceptual only in this task and must not include executable code.

## Scope
- Parse markdown continuity artifacts and frontmatter metadata.
- Verify SHA-256 lineage hash references and parent-child link integrity.
- Detect topology anomalies (missing parent, cycle, orphan, unresolved fork, quarantine state references).
- Produce deterministic terminal-oriented text output schemas for human operators.

## Non-Goals
- No runtime hydration.
- No mutation of any repository artifact.
- No state lock acquisition.
- No integration with active replay execution loops.
- No external terminal framework coupling.

## Conceptual CLI Command Schema
Primary command namespace:
- `decide-tools inspect`

Conceptual arguments/flags:
- `--root <path>`: root directory containing continuity markdown artifacts.
- `--depth <n>`: bounded traversal depth from selected lineage roots.
- `--entry <hash-or-id>`: explicit lineage anchor for targeted traversal.
- `--mode <audit|graph|summary|quarantine|forks>`: output lens.
- `--format <ascii|json|md-report>`: deterministic output representation.
- `--strict`: fail when any hash/link verification mismatch appears.
- `--include-quarantine`: include T9 states in reports.
- `--include-forks`: include T4 unresolved fork branches in reports.
- `--max-nodes <n>`: deterministic safety bound for large lineage forests.
- `--telemetry-out <path>`: write structured inspector telemetry report.
- `--no-telemetry-write`: print-only mode; no artifact write.

## Parsing and Validation Semantics
The conceptual parser must:
1. Discover candidate `.md` files under `--root` via deterministic lexical path order.
2. Extract frontmatter metadata fields required for lineage verification:
   - `node_id`
   - `node_hash_sha256`
   - `parent_hashes`
   - `state_class` (including T4/T9)
   - `epoch`
   - `continuity_tags`
3. Canonicalize metadata before hashing (UTF-8, normalized newlines, trimmed trailing whitespace policy).
4. Recompute SHA-256 and compare to declared hash.
5. Build adjacency maps and verify DAG constraints:
   - no cycles
   - parent references resolvable unless explicitly marked external
   - fork declarations consistent with multi-parent topology
   - quarantine references tagged and isolated in output

## Read-Only Isolation Constraints
Mandatory safety boundaries:
- Open files in read-only mode only.
- Never request file lock primitives.
- Never write, rename, truncate, or touch inspected markdown files.
- Never open sockets, IPC channels, or engine runtime memory handles.
- Never trigger replay simulation state hydration.
- Never call mutation pathways or plugin execution pathways.
- Any optional output (`--telemetry-out`) must target a dedicated observer path and never overlap source lineage files.

## Topology Visualization Formatting Rules
ASCII graph mode (`--format ascii`) must:
- Render deterministic root ordering by lexical `node_id`.
- Use stable indentation and connectors (`├─`, `└─`, `│`).
- Annotate node badges inline:
  - `[OK]` hash verified
  - `[HASH_MISMATCH]`
  - `[T4_FORK]`
  - `[T9_QUARANTINE]`
  - `[ORPHAN]`
- Include replay relevance marker when continuity tags contain replay-critical semantics.

Example conceptual topology block:
- `root:abcd [OK]`
  - `├─ child:ef01 [T4_FORK] [OK]`
  - `└─ child:ef02 [T9_QUARANTINE] [OK]`

## Expected Inspector Telemetry Output Format
Telemetry payload (conceptual, deterministic key ordering):

```json
{
  "run_id": "",
  "root_path": "",
  "scan_epoch": "",
  "mode": "",
  "format": "",
  "totals": {
    "files_scanned": 0,
    "nodes_valid": 0,
    "hash_mismatches": 0,
    "orphans": 0,
    "cycles": 0,
    "forks_t4": 0,
    "quarantine_t9": 0
  },
  "dag_health": "PASS|WARN|FAIL",
  "replay_admissibility": "ADMISSIBLE|DEGRADED|BLOCKED",
  "findings": [],
  "determinism": {
    "path_order": "lexical",
    "hash_algo": "sha256",
    "normalization": "utf8_lf_trim_policy"
  }
}
```

## Quarantine and Fork Audit Views
- `--mode quarantine`: emit only T9 lineage segments and inbound/outbound references.
- `--mode forks`: emit unresolved T4 branches, divergence depth, and unresolved parent sets.
- Both views must preserve read-only boundaries and deterministic ordering.

## Validation Gate for This Definition
Success conditions for this task artifact:
- Exactly one markdown artifact defined for inspector CLI specification.
- Read-only parser boundaries explicitly documented.
- DAG topology verification and visualization rules fully documented.
- No executable CLI/runtime code included.

## Operational Safety Statement
This specification defines an out-of-band observer tool contract intended for sovereign continuity auditing and must remain logically isolated from active engine execution, replay hydration, and mutation surfaces.
