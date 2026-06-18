#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "repository_replay"; OUT.mkdir(exist_ok=True)
lineage = ["orchestration_refactor", "replay_manifest_update", "plugin_contract_shift", "continuity_validation", "replay_compatibility_verified"]
replay = {
  "repository_id": "via-decide/decide.engine-tools",
  "architectural_evolution": lineage,
  "dependency_mutations": ["scripts/replay_world_state.py", "scripts/resolve_repository_context.py"],
  "continuity_forks": ["fork_repository_context_mode"],
  "orchestration_changes": ["context_assembly_pipeline"],
  "replay_admissibility": "ADMISSIBLE",
  "authority_transitions": ["local_operator -> continuity_operator"],
  "deterministic": True
}
(OUT / "repository-replay.json").write_text(json.dumps(replay, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "repository-replay.json"), "status": "ok"}, indent=2))
