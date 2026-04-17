"""Faction generation and relationship seeding."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class FactionSystem:
    def generate_factions(self, character_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not character_nodes:
            return [
                {
                    "faction_id": "independent",
                    "name": "Independent Coalition",
                    "doctrine": "balance",
                    "relations": {},
                }
            ]

        factions: List[Dict[str, Any]] = []
        for idx, node in enumerate(character_nodes):
            fields = node.get("payload", {}).get("fields", {})
            faction_id = str(node.get("entity_id", f"faction_{idx}"))
            factions.append(
                {
                    "faction_id": faction_id,
                    "name": fields.get("name", faction_id.replace("-", " ").title()),
                    "doctrine": fields.get("doctrine", "expansion" if idx % 2 == 0 else "stability"),
                    "relations": {},
                }
            )

        for idx, faction in enumerate(factions):
            for jdx, other in enumerate(factions):
                if idx == jdx:
                    continue
                faction["relations"][other["faction_id"]] = "ally" if (idx + jdx) % 3 == 0 else "neutral"
        return factions
