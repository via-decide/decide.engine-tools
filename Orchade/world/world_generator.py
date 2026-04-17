"""Procedural world generation using ViaLogic map and narrative entities."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict

from world.biome_system import BiomeSystem
from world.map_builder import MapBuilder
from world.terrain_generator import TerrainGenerator


@dataclass
class WorldGenerator:
    seed: int = 42
    terrain_generator: TerrainGenerator = field(init=False)
    biome_system: BiomeSystem = field(default_factory=BiomeSystem)
    map_builder: MapBuilder = field(default_factory=MapBuilder)

    def __post_init__(self) -> None:
        self.terrain_generator = TerrainGenerator(seed=self.seed)

    def build_world(self, vialogic_data: Dict[str, Any]) -> Dict[str, Any]:
        map_nodes = vialogic_data.get("maps", [])
        characters = vialogic_data.get("characters", [])
        people = vialogic_data.get("people", [])

        terrain = self.terrain_generator.generate(map_nodes)
        biomes = self.biome_system.assign(terrain)
        faction_ids = [str(entry.get("entity_id", "independent")) for entry in characters]

        built = self.map_builder.build(terrain, biomes, faction_ids, people_count=len(people))
        built["seed"] = self.seed
        built["terrain"] = terrain
        built["biomes"] = biomes
        return built
