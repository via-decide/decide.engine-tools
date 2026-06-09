# SESSION CONTINUITY

session_id: bootstrap-recovery-001
workspace: via-decide/decide.engine-tools
authority: local_operator
bootstrap_epoch: 2026-05-15T00:00:00Z
continuity_mode: deterministic_recovery
active_protocols: [bootstrap_validation, lineage_preservation, replay_safety]
lineage_parent: none
runtime_constraints: [browser_only_static_stack, no_build_systems]

## SESSION STATE
- Active repository: via-decide/decide.engine-tools
- Execution mode: recovery-enabled deterministic bootstrap
- Continuity epoch: 2026-05-15
- Current authority: local_operator

## BOOTSTRAP STATUS
- Required files: AGENTS.md, .codex/instructions.md, .codex/session.md
- Validation state: BOOTSTRAP_READY
- Initialization lineage: recovered_from_missing_session_anchor

## EXECUTION DISCIPLINE
- Sequence: READ → ANALYZE → PLAN → MODIFY → VERIFY
- Anti-refresh rule: bootstrap is validated every fresh session start
- Deterministic order: validate files → classify state → recover only if missing/corrupt → verify

## CONTINUITY LOG
- 2026-05-15: Session anchor restored after BOOTSTRAP_MISSING detection.
- Recovery classification: deterministic_minimal_stub
- Replay admissibility: restored
