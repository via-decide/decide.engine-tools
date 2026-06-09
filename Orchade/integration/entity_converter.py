"""Converts ViaLogic canonical entities to runtime engine records."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class EntityConverter:
    def people_to_npcs(self, people_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        npcs: List[Dict[str, Any]] = []
        for idx, node in enumerate(people_nodes):
            fields = node.get("payload", {}).get("fields", {})
            npc_id = str(node.get("entity_id", f"npc_{idx}"))
            npcs.append(
                {
                    "npc_id": npc_id,
                    "name": fields.get("name", f"NPC {idx}"),
                    "role": fields.get("role", "citizen"),
                }
            )
        return npcs

    def characters_to_factions(self, character_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        factions: List[Dict[str, Any]] = []
        for idx, node in enumerate(character_nodes):
            fields = node.get("payload", {}).get("fields", {})
            faction_id = str(node.get("entity_id", f"faction_{idx}"))
            factions.append(
                {
                    "faction_id": faction_id,
                    "name": fields.get("name", faction_id.replace("-", " ").title()),
                }
            )
        return factions

    def concept_nodes_to_quests(self, concept_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [
            {
                "quest_seed_id": str(node.get("entity_id", f"concept_{idx}")),
                "theme": node.get("payload", {}).get("fields", {}).get("title", "emergent_conflict"),
            }
            for idx, node in enumerate(concept_nodes)
        ]

    def map_nodes_to_locations(self, map_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [
            {
                "location_id": str(node.get("entity_id", f"location_{idx}")),
                "name": node.get("payload", {}).get("fields", {}).get("name", f"Location {idx}"),
            }
            for idx, node in enumerate(map_nodes)
        ]
