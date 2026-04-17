"""Builds lightweight narrative arcs around quest triggers."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class StoryArcBuilder:
    def build(self, concept_nodes: List[Dict[str, Any]], triggers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        arcs: List[Dict[str, Any]] = []
        for idx, trigger in enumerate(triggers):
            source = concept_nodes[idx % len(concept_nodes)].get("entity_id", "concept_seed") if concept_nodes else "concept_seed"
            arcs.append(
                {
                    "arc_id": f"arc_{idx + 1}",
                    "source": source,
                    "theme": trigger.get("trigger_type", "emergent_event"),
                    "stages": ["introduction", "complication", "resolution"],
                }
            )
        return arcs
