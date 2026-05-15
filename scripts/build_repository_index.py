#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "repository_indexes"; OUT.mkdir(exist_ok=True)
files = sorted([str(p.relative_to(ROOT)) for p in ROOT.rglob("*.md") if ".git/" not in str(p)] + [str(p.relative_to(ROOT)) for p in ROOT.rglob("*.py") if ".git/" not in str(p)])
index = {
  "repository_id": "via-decide/decide.engine-tools",
  "continuity_epoch": "2026-05-15",
  "file_lineage": files[:120],
  "symbol_relationships": [{"from": "scripts/build_world_lineage.py", "to": "core/world-continuity-manifest.md", "type": "reads_manifest"}],
  "architectural_dependencies": [{"module": "scripts/replay_world_state.py", "depends_on": ["world_lineage/world-lineage.json"]}],
  "replay_relevance": ["core/world-continuity-manifest.md", "scripts/replay_world_state.py", "scripts/build_repository_replay.py"],
  "orchestration_connections": ["scripts/build_repository_index.py", "scripts/resolve_repository_context.py"],
  "plugin_mutation_scope": ["plugins/plugin-legality-contracts.md"],
  "continuity_tags": ["deterministic", "replay_safe", "lineage_aware", "orchestration_intelligence"]
}
(OUT / "repository-index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "repository-index.json"), "status": "ok"}, indent=2))
