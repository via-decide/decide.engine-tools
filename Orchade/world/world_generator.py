"""Procedural world generation using ViaLogic map and narrative entities."""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Any, Dict, List


BIOMES = ["plains", "forest", "desert", "mountains", "swamp", "coast"]


@dataclass
class WorldGenerator:
    seed: int = 42

    def build_world(self, vialogic_data: Dict[str, Any]) -> Dict[str, Any]:
        rng = random.Random(self.seed)
        map_nodes = vialogic_data.get("maps", [])

        locations = [self._map_to_location(node, rng) for node in map_nodes] or self._fallback_locations(rng)
        connections = self._connect_locations(locations)

        return {
            "seed": self.seed,
            "locations": locations,
            "connections": connections,
            "world_graph": {
                "location_count": len(locations),
                "connection_count": len(connections),
            },
        }

    def _map_to_location(self, node: Dict[str, Any], rng: random.Random) -> Dict[str, Any]:
        payload = node.get("payload", {})
        fields = payload.get("fields", {})
        name = fields.get("name", node.get("entity_id", "unknown_location"))

        return {
            "location_id": node.get("entity_id"),
            "name": name,
            "biome": fields.get("biome", rng.choice(BIOMES)),
            "danger_level": round(rng.uniform(0.1, 0.95), 2),
            "resource_richness": round(rng.uniform(0.2, 1.0), 2),
        }

    def _fallback_locations(self, rng: random.Random) -> List[Dict[str, Any]]:
        fallback = []
        for index in range(5):
            fallback.append(
                {
                    "location_id": f"generated_{index}",
                    "name": f"Generated Region {index}",
                    "biome": rng.choice(BIOMES),
                    "danger_level": round(rng.uniform(0.15, 0.8), 2),
                    "resource_richness": round(rng.uniform(0.3, 0.95), 2),
                }
            )
        return fallback

    def _connect_locations(self, locations: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        connections: List[Dict[str, str]] = []
        for idx in range(max(0, len(locations) - 1)):
            src = locations[idx]["location_id"]
            dst = locations[idx + 1]["location_id"]
            connections.append({"from": str(src), "to": str(dst), "type": "road"})
        return connections
