"""Runtime orchestration controller for Orchade AAA simulation pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from ai.npc_ai_engine import NPCAIEngine
from characters.character_generator import CharacterGenerator
from combat.combat_system import CombatSystem
from ecs.ecs_world import ECSWorld
from ecs.system_executor import PHASE_AI, PHASE_COMBAT, PHASE_NARRATIVE, PHASE_SIMULATION
from integration.entity_converter import EntityConverter
from integration.vialogic_loader import ViaLogicLoader
from levels.dungeon_generator import DungeonGenerator
from quest.quest_generator import QuestGenerator
from runtime.game_loop import GameLoop
from simulation.world_simulation import WorldSimulation
from world.world_generator import WorldGenerator


@dataclass
class RuntimeController:
    """Coordinates load -> generate -> simulate lifecycle."""

    seed: int = 42
    loader: ViaLogicLoader = field(default_factory=ViaLogicLoader)
    converter: EntityConverter = field(default_factory=EntityConverter)
    world_generator: WorldGenerator = field(init=False)
    character_generator: CharacterGenerator = field(init=False)
    npc_ai: NPCAIEngine = field(default_factory=NPCAIEngine)
    simulation: WorldSimulation = field(init=False)
    quest_generator: QuestGenerator = field(default_factory=QuestGenerator)
    combat_system: CombatSystem = field(default_factory=CombatSystem)
    dungeon_generator: DungeonGenerator = field(default_factory=DungeonGenerator)
    ecs_world: ECSWorld = field(default_factory=ECSWorld)
    game_loop: GameLoop = field(default_factory=GameLoop)
    _state: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.world_generator = WorldGenerator(seed=self.seed)
        self.character_generator = CharacterGenerator(seed=self.seed)
        self.simulation = WorldSimulation(seed=self.seed)
        self._register_systems()

    def bootstrap(self, vialogic_path: str) -> Dict[str, Any]:
        snapshot = self.loader.load(vialogic_path).as_dict()
        world = self.world_generator.build_world(snapshot)

        converted_npcs = self.converter.people_to_npcs(snapshot.get("people", []))
        converted_factions = self.converter.characters_to_factions(snapshot.get("characters", []))
        generated = self.character_generator.generate(snapshot.get("people", []), snapshot.get("characters", []))

        npcs: List[Dict[str, Any]] = []
        base_by_id = {entry["npc_id"]: entry for entry in converted_npcs}
        for generated_npc in generated["npcs"]:
            npc_id = generated_npc["npc_id"]
            merged = dict(base_by_id.get(npc_id, {}))
            merged.update(generated_npc)
            merged.setdefault("weapon", "unarmed")
            merged.setdefault("health", 100)
            npcs.append(merged)

        factions = generated["factions"] if generated["factions"] else converted_factions

        self.npc_ai.load_npcs(npcs)
        self.simulation.initialize(factions)

        self._state = {
            "vialogic": snapshot,
            "world": world,
            "npcs": npcs,
            "npc_actions": [],
            "simulation": self.simulation.snapshot(),
            "quest_log": [],
            "dungeons": [],
            "combat_log": [],
            "global_threat": 0.25,
        }

        self.ecs_world.global_state = self._state
        self._spawn_ecs_entities(world, npcs, factions)
        self._state["ecs"] = self.ecs_world.snapshot()
        return self._state

    def _spawn_ecs_entities(self, world: Dict[str, Any], npcs: List[Dict[str, Any]], factions: List[Dict[str, Any]]) -> None:
        for location in world.get("locations", []):
            self.ecs_world.create_entity(
                {
                    "Position": {"location_id": location["location_id"]},
                    "Location": location,
                }
            )

        for faction in factions:
            self.ecs_world.create_entity({"Faction": faction})

        for npc in npcs:
            self.ecs_world.create_entity(
                {
                    "Health": {"value": npc.get("health", 100)},
                    "Faction": {"faction_id": npc.get("faction", "independent")},
                    "SkillSet": npc.get("skills", {}),
                    "Inventory": {"items": []},
                    "NPC": npc,
                }
            )

    def tick(self, delta_time: float = 1.0) -> Dict[str, Any]:
        self.ecs_world.run_tick(delta_time)
        self._state["ecs"] = self.ecs_world.snapshot()
        return self._state

    def run(self, tick_count: int = 1, delta_time: float = 1.0) -> List[Dict[str, Any]]:
        return self.game_loop.run(self.tick, tick_count=tick_count, delta_time=delta_time)

    def _register_systems(self) -> None:
        self.ecs_world.register_system(PHASE_AI, self._ai_phase)
        self.ecs_world.register_system(PHASE_SIMULATION, self._simulation_phase)
        self.ecs_world.register_system(PHASE_NARRATIVE, self._narrative_phase)
        self.ecs_world.register_system(PHASE_COMBAT, self._combat_phase)

    def _ai_phase(self, world, _delta_time: float) -> None:
        state = world.global_state
        actions = self.npc_ai.tick(state)
        state["npc_actions"] = actions
        tension = float(state.get("simulation", {}).get("war", {}).get("global_tension", 0.0))
        state["global_threat"] = max(0.2, min(1.0, 0.2 + tension))

    def _simulation_phase(self, world, _delta_time: float) -> None:
        state = world.global_state
        state["simulation"] = self.simulation.tick(state.get("npc_actions", []))

    def _narrative_phase(self, world, _delta_time: float) -> None:
        state = world.global_state
        quests = self.quest_generator.generate(
            state.get("vialogic", {}).get("narrative", []),
            state.get("npc_actions", []),
            state.get("simulation", {}),
        )
        state["quest_log"] = quests
        state["dungeons"] = self.dungeon_generator.generate(state.get("world", {}), quests)

    def _combat_phase(self, world, _delta_time: float) -> None:
        state = world.global_state
        npc_registry = {entry["npc_id"]: entry for entry in state.get("npcs", [])}
        state["combat_log"] = self.combat_system.resolve(state.get("npc_actions", []), npc_registry)
