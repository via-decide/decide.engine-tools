"""Central Orchade runtime orchestrator wiring map, world, AI, gameplay, and simulation."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from ai.npc_ai_engine import NPCAIEngine
from gameplay.gameplay_loop import GameplayLoop
from integration.vialogic_loader import ViaLogicLoader
from simulation.world_simulation import WorldSimulation
from world.world_generator import WorldGenerator


@dataclass
class OrchadeRuntime:
    """Single entry-point runtime loop for Orchade subsystems."""

    seed: int = 42
    loader: ViaLogicLoader = field(default_factory=ViaLogicLoader)
    world_generator: WorldGenerator = field(init=False)
    npc_behavior_engine: NPCAIEngine = field(init=False)
    simulation_engine: WorldSimulation = field(init=False)
    gameplay_system: GameplayLoop = field(default_factory=GameplayLoop)
    state: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.world_generator = WorldGenerator(seed=self.seed)
        self.npc_behavior_engine = NPCAIEngine(seed=self.seed)
        self.simulation_engine = WorldSimulation(seed=self.seed)

    def initialize_runtime(self, vialogic_path: str) -> Dict[str, Any]:
        snapshot = self.loader.load(vialogic_path).as_dict()

        self.state = {
            "game_running": False,
            "game_tick": 0,
            "map_engine": {
                "zoom_state": 1.0,
                "map_camera": {"x": 0.0, "y": 0.0},
                "world_map_renderer": "active",
            },
            "world_systems": {
                "region_model": [],
                "location_node": [],
                "region_generator": self.world_generator,
                "city_generator": "world_generator",
            },
            "gameplay_systems": {
                "player_position": {"region": None, "location": None},
                "mission_trigger": [],
                "region_unlock": [],
                "building_interaction": [],
            },
            "ai_systems": {
                "npc_generator": self.npc_behavior_engine,
                "npc_behavior_engine": self.npc_behavior_engine,
                "npc_spawn_point": [],
            },
            "simulation_systems": {
                "economy_system": {},
                "faction_system": {},
                "guard_system": {},
            },
            "runtime_systems": {"game_tick": 0, "game_loop": "idle"},
            "vialogic": snapshot,
        }

        self.load_regions()
        self.generate_world()
        self.spawn_npcs()
        self.initialize_player_state()
        self.state["game_running"] = True
        self.state["runtime_systems"]["game_loop"] = "running"
        return self.state

    def load_regions(self) -> List[Dict[str, Any]]:
        world = self.world_generator.build_world(self.state.get("vialogic", {}))
        locations = world.get("locations", [])
        self.state["world"] = world
        self.state["world_systems"]["region_model"] = locations
        self.state["world_systems"]["location_node"] = locations
        self.state["world_systems"]["city_generator"] = "generated_from_locations"
        return locations

    def generate_world(self) -> Dict[str, Any]:
        locations = self.state.get("world", {}).get("locations", [])
        cities = [
            {
                "city_id": f"city_{idx}",
                "region": location.get("location_id"),
                "prosperity": round(location.get("resource_richness", 0.5), 2),
            }
            for idx, location in enumerate(locations)
        ]
        self.state["cities"] = cities
        return self.state.get("world", {})

    def spawn_npcs(self) -> List[Dict[str, Any]]:
        characters = self.state.get("vialogic", {}).get("characters", [])
        factions = [str(c.get("entity_id", "independent")) for c in characters]
        people = self.state.get("vialogic", {}).get("people", [])
        npcs = self.npc_behavior_engine.generate_npcs(people, factions)

        spawn_points = [loc.get("location_id") for loc in self.state.get("world", {}).get("locations", [])]
        self.state["npcs"] = npcs
        self.state["ai_systems"]["npc_spawn_point"] = spawn_points

        self.simulation_engine.initialize(characters)
        return [{"npc_id": npc.npc_id, "spawn_point": spawn_points[0] if spawn_points else None} for npc in npcs]

    def initialize_player_state(self) -> Dict[str, Any]:
        first_location = (self.state.get("world", {}).get("locations") or [{}])[0]
        player_state = {
            "region": first_location.get("location_id"),
            "location": first_location.get("name"),
        }
        self.state["gameplay_systems"]["player_position"] = player_state
        return player_state

    def update_game_tick(self, delta_time: float = 1.0) -> Dict[str, Any]:
        _ = delta_time
        self.state["game_tick"] += 1
        self.state["runtime_systems"]["game_tick"] = self.state["game_tick"]

        npc_actions = self.npc_behavior_engine.tick({"global_threat": self._global_threat()})
        self.state["npc_actions"] = npc_actions

        simulation_state = self.simulation_engine.tick(npc_actions)
        self.state["simulation_systems"]["economy_system"] = {
            fid: data.get("economy", 0.0) for fid, data in simulation_state.get("factions", {}).items()
        }
        self.state["simulation_systems"]["faction_system"] = simulation_state.get("factions", {})
        self.state["simulation_systems"]["guard_system"] = {
            "alert": any(action.get("action") == "seek_cover" for action in npc_actions),
            "active_guards": len(npc_actions),
        }

        quests = self.gameplay_system.generate_quests(
            self.state.get("vialogic", {}).get("narrative", []),
            npc_actions,
        )
        self.state["gameplay_systems"]["mission_trigger"] = quests
        self.state["gameplay_systems"]["region_unlock"] = [
            q["source"] for q in quests if q.get("difficulty") == "low"
        ]
        self.state["gameplay_systems"]["building_interaction"] = [
            {"city_id": city.get("city_id"), "interaction": "trade"} for city in self.state.get("cities", [])[:2]
        ]

        self.render_map()
        return self.state

    def render_map(self) -> Dict[str, Any]:
        world = self.state.get("world", {})
        rendered = {
            "visible_regions": len(world.get("locations", [])),
            "zoom": self.state.get("map_engine", {}).get("zoom_state", 1.0),
            "camera": self.state.get("map_engine", {}).get("map_camera", {}),
        }
        self.state["map_render"] = rendered
        return rendered

    def game_loop(self, ticks: int = 1, delta_time: float = 1.0) -> List[Dict[str, Any]]:
        frames: List[Dict[str, Any]] = []
        for _ in range(max(0, ticks)):
            if not self.state.get("game_running"):
                break
            frames.append(self.update_game_tick(delta_time))
        return frames

    def _global_threat(self) -> float:
        faction_state = self.state.get("simulation_systems", {}).get("faction_system", {})
        if not faction_state:
            return 0.2
        average_military = sum(v.get("military", 0.0) for v in faction_state.values()) / max(len(faction_state), 1)
        return 0.8 if average_military > 0.7 else 0.2
