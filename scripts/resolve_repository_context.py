#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "resolved_contexts"; OUT.mkdir(exist_ok=True)
MODE = "ARCHITECTURE_MODE"
modes = ["ARCHITECTURE_MODE", "REPLAY_MODE", "PLUGIN_MODE", "AUTHORITY_MODE", "MULTIPLAYER_MODE", "SYNTHESIS_MODE"]
critical = ["core/world-continuity-manifest.md", "plugins/plugin-legality-contracts.md", "multiplayer/continuity-sync-spec.md", "authority/world-authority-profiles.md", "scripts/replay_world_state.py"]
resolved = {
  "mode": MODE,
  "supported_modes": modes,
  "token_budget": 2400,
  "selected_modules": critical,
  "replay_priority": [{"module": m, "weight": 1.0 - (i * 0.1)} for i, m in enumerate(critical)],
  "lineage_preserved": True,
  "hallucination_guard": "only_indexed_paths"
}
(OUT / "repository-context.json").write_text(json.dumps(resolved, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "repository-context.json"), "status": "ok"}, indent=2))
