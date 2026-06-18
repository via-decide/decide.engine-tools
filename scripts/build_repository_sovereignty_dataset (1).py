#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "resolved_contexts"; OUT.mkdir(exist_ok=True)
dataset = {
  "repository_problem": "continuity_native_repository_intelligence",
  "architectural_constraints": ["deterministic_processing", "offline_capable"],
  "dependency_constraints": ["no_build_systems", "native_python_and_static_html_only"],
  "replay_requirements": ["lineage_preservation", "replay_admissibility_checks"],
  "continuity_dependencies": ["core/world-continuity-manifest.md", "context/repository-continuity-index.md"],
  "plugin_relationships": ["plugins/plugin-legality-contracts.md"],
  "failure_modes": ["dependency_drift", "continuity_fragmentation", "replay_incompatibility"],
  "migration_constraints": ["portable_paths", "stable_manifest_contracts"],
  "context_resolution_rules": ["prioritize_replay_critical_modules", "avoid_non_indexed_dependencies", "respect_token_budget"]
}
(OUT / "repository-sovereignty-dataset.json").write_text(json.dumps(dataset, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "repository-sovereignty-dataset.json"), "status": "ok"}, indent=2))
