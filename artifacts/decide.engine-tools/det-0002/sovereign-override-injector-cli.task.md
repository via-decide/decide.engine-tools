# Conceptual Sovereign Override Injector CLI Tool — Task Specification

## Task Definition
Define a conceptual, governance-safe CLI wizard contract for generating, signing, validating, and inserting manual override markdown nodes into the Zayvora continuity DAG with mathematically deterministic packaging. This task is specification-only and must not include executable implementation.

## Purpose and Scope
- Provide a safe human-in-the-loop steering interface for continuity deadlock recovery.
- Prevent malformed override artifacts (hash mismatch, parent mismatch, missing signature, schema drift).
- Preserve replay admissibility and continuity chain integrity.
- Operate as an out-of-band tooling contract, not runtime mutation code.

## Non-Goals
- No executable CLI wizard code.
- No cryptographic library implementation.
- No direct runtime or simulator integration logic.
- No interactive framework bindings.

## Conceptual CLI Entry and Wizard Sequence
Primary command namespace:
- `decide-tools inject-override`

Conceptual arguments/flags:
- `--parent <hash>`: target canonical parent hash.
- `--authority <profile>`: authority identity/profile for override scope.
- `--intent <correction|rollback|quarantine|fork_resolution>`: override intent class.
- `--dry-run`: full validation and packaging without final insertion.
- `--output-dir <path>`: staging location for drafted node.
- `--commit-dir <path>`: canonical continuity directory for finalized node.
- `--strict`: hard-fail on any warning or inferred field.
- `--telemetry-out <path>`: write deterministic injection telemetry report.

Conceptual wizard flow (no implementation code):
1. Load and verify `--parent` exists in continuity index.
2. Collect override metadata (authority profile, intent, rationale, constraints).
3. Collect state payload body and continuity tags.
4. Canonicalize payload for deterministic hashing.
5. Compute node hash and bind parent hash references.
6. Apply sovereign signature envelope.
7. Run pre-flight lineage validator checks.
8. If all checks pass, write finalized markdown node.
9. Emit telemetry summary and insertion receipt.

## Automated Cryptographic Packaging Logic
The packaging boundary must enforce:
- Canonical serialization profile before hashing:
  - UTF-8 encoding
  - normalized LF newlines
  - deterministic frontmatter key order
  - explicit whitespace policy
- Hash computation:
  - `node_hash_sha256 = SHA256(canonical_node_payload)`
  - `parent_hash_sha256` must match the referenced parent node hash exactly
- Signature envelope:
  - sign `node_hash_sha256` + `parent_hash_sha256` + `authority_profile` + `epoch`
  - record algorithm identifier and signature metadata fields
  - reject missing/partial signature metadata under `--strict`
- Output contract:
  - frontmatter contains node id, hashes, authority, intent, epoch, signature metadata
  - body contains override rationale and continuity constraints

## Pre-Flight Validation Constraints (Before Write)
Mandatory checks:
1. Schema completeness: all required frontmatter fields present.
2. Parent existence: parent hash resolvable in local continuity set.
3. Hash integrity: recomputed node hash equals declared hash.
4. Signature integrity: signature envelope references current hash tuple.
5. DAG safety:
   - no cycle introduction
   - fork policy compliance for override intent
   - quarantine semantics valid for isolation intents
6. Authority policy:
   - authority profile allowed for selected intent
   - override scope does not exceed delegated domain
7. Replay admissibility:
   - node must not break deterministic replay ordering
   - continuity tags include replay classification marker
8. Write guard:
   - no write occurs if any mandatory check fails

## Read/Write Isolation Boundaries
- Read lineage artifacts in deterministic lexical path order.
- Perform drafting in isolated staging path first.
- Final insertion permitted only after pre-flight pass state.
- Never mutate existing parent artifacts.
- Never overwrite existing node ids/hashes.
- Never lock active runtime memory or invoke execution loops.

## Expected Injection Telemetry Output Format
```json
{
  "run_id": "",
  "command": "inject-override",
  "timestamp_epoch": "",
  "parent_hash": "",
  "node_hash": "",
  "authority_profile": "",
  "intent": "",
  "validation": {
    "schema": "PASS|FAIL",
    "parent_resolution": "PASS|FAIL",
    "hash_integrity": "PASS|FAIL",
    "signature_integrity": "PASS|FAIL",
    "dag_safety": "PASS|FAIL",
    "authority_policy": "PASS|FAIL",
    "replay_admissibility": "PASS|FAIL"
  },
  "result": "COMMITTED|REJECTED|DRY_RUN_PASS|DRY_RUN_FAIL",
  "output_node_path": "",
  "determinism": {
    "hash_algo": "sha256",
    "serialization": "canonical_frontmatter_utf8_lf",
    "path_order": "lexical"
  },
  "errors": []
}
```

## Governance Safety Rules
- Every injected override must be traceable to a sovereign authority profile.
- Every override must include a human-readable rationale.
- Every override must be replay-checkable without runtime hydration.
- Overrides that fail any validator gate are non-committable.

## Validation Gate for This Task Artifact
Success requires:
- exactly one markdown artifact at `artifacts/decide.engine-tools/det-0002/sovereign-override-injector-cli.task.md`
- comprehensive wizard flow + cryptographic packaging documentation
- explicit pre-flight validation constraints
- no executable snippets, terminal UI code, or runtime module references

## Operational Safety Statement
This specification defines a conceptual steering-column interface for sovereign override insertion that mathematically constrains human input, preserves continuity DAG integrity, and prevents replay-chain corruption.
