"""Procedural terrain synthesis for Orchade world generation."""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class TerrainGenerator:
    seed: int = 42

    def generate(self, map_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        rng = random.Random(self.seed)
        terrains: List[Dict[str, Any]] = []
        for idx, node in enumerate(map_nodes or []):
            fields = node.get("payload", {}).get("fields", {})
            terrains.append(
                {
                    "location_id": str(node.get("entity_id", f"location_{idx}")),
                    "elevation": round(rng.uniform(0.0, 1.0), 3),
                    "moisture": round(rng.uniform(0.0, 1.0), 3),
                    "temperature": round(rng.uniform(-10.0, 35.0), 2),
                    "hint_biome": fields.get("biome", "unknown"),
                    "name": fields.get("name", f"Region {idx}"),
                }
            )

        if terrains:
            return terrains

        for idx in range(8):
            terrains.append(
                {
                    "location_id": f"generated_{idx}",
                    "elevation": round(rng.uniform(0.0, 1.0), 3),
                    "moisture": round(rng.uniform(0.0, 1.0), 3),
                    "temperature": round(rng.uniform(-8.0, 32.0), 2),
                    "hint_biome": "unknown",
                    "name": f"Generated Region {idx}",
                }
            )
        return terrains
