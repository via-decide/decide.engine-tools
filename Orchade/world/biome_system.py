"""Biome assignment logic based on terrain signals."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class BiomeSystem:
    def assign(self, terrain_tiles: List[Dict[str, float]]) -> List[Dict[str, str]]:
        assignments: List[Dict[str, str]] = []
        for tile in terrain_tiles:
            moisture = float(tile.get("moisture", 0.5))
            elevation = float(tile.get("elevation", 0.5))
            temperature = float(tile.get("temperature", 15.0))
            hint = str(tile.get("hint_biome", "unknown")).lower()

            if hint != "unknown":
                biome = hint
            elif temperature < 0:
                biome = "tundra"
            elif elevation > 0.75 and moisture < 0.4:
                biome = "mountains"
            elif moisture > 0.75:
                biome = "swamp"
            elif moisture > 0.55:
                biome = "forest"
            elif temperature > 24 and moisture < 0.35:
                biome = "desert"
            else:
                biome = "plains"

            assignments.append({"location_id": str(tile["location_id"]), "biome": biome})
        return assignments
