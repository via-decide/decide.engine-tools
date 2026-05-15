#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "cross_repo_graphs"; OUT.mkdir(exist_ok=True)
graph = {
  "root_repository": "via-decide/decide.engine-tools",
  "relationships": [
    {"from": "zayvora-cookbook", "to": "decide.engine-tools", "type": "continuity_contracts"},
    {"from": "decide.engine-tools", "to": "nex", "type": "context_synthesis_dependency"},
    {"from": "decide.engine-tools", "to": "daxini", "type": "orchestration_runtime_exchange"}
  ],
  "relationship_types": ["shared_orchestration_primitives", "continuity_manifests", "replay_semantics", "authority_propagation", "plugin_interoperability", "synchronization_contracts"],
  "deterministic": True
}
(OUT / "cross-repo-graph.json").write_text(json.dumps(graph, indent=2), encoding="utf-8")
print(json.dumps({"output": str(OUT / "cross-repo-graph.json"), "status": "ok"}, indent=2))
