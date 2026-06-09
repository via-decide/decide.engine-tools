"""Builds world map graph, cities, and population distribution."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class MapBuilder:
    def build(
        self,
        terrain: List[Dict[str, Any]],
        biomes: List[Dict[str, str]],
        faction_ids: List[str],
        people_count: int,
    ) -> Dict[str, Any]:
        biome_by_location = {entry["location_id"]: entry["biome"] for entry in biomes}
        locations: List[Dict[str, Any]] = []
        cities: List[Dict[str, Any]] = []

        for idx, tile in enumerate(terrain):
            location_id = str(tile["location_id"])
            biome = biome_by_location.get(location_id, "plains")
            danger_level = round(min(1.0, 0.2 + float(tile["elevation"]) * 0.6), 2)
            richness = round(min(1.0, 0.15 + float(tile["moisture"]) * 0.8), 2)

            location = {
                "location_id": location_id,
                "name": tile.get("name", f"Region {idx}"),
                "biome": biome,
                "danger_level": danger_level,
                "resource_richness": richness,
            }
            locations.append(location)

            if richness >= 0.5 or idx % 3 == 0:
                faction = faction_ids[idx % len(faction_ids)] if faction_ids else "independent"
                cities.append(
                    {
                        "city_id": f"city_{location_id}",
                        "name": f"{location['name']} City",
                        "location_id": location_id,
                        "faction": faction,
                        "population": max(80, int((people_count + 1) * (0.3 + richness))),
                    }
                )

        connections: List[Dict[str, str]] = []
        for idx in range(max(0, len(locations) - 1)):
            connections.append(
                {
                    "from": str(locations[idx]["location_id"]),
                    "to": str(locations[idx + 1]["location_id"]),
                    "type": "road" if idx % 2 == 0 else "trail",
                }
            )

        return {
            "locations": locations,
            "cities": cities,
            "connections": connections,
            "npc_population": max(people_count, len(cities) * 3),
            "world_graph": {
                "location_count": len(locations),
                "city_count": len(cities),
                "connection_count": len(connections),
            },
        }
