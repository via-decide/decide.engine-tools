"""Runtime orchestration controller for Orchade AAA simulation pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from ai.npc_ai_engine import NPCAIEngine
from ecs.component_store import ComponentStore
from ecs.entity_manager import EntityManager
from ecs.system_executor import (
    PHASE_AI,
    PHASE_NARRATIVE,
    PHASE_SIMULATION,
    SystemExecutor,
)
from gameplay.gameplay_loop import GameplayLoop
from integration.vialogic_loader import ViaLogicLoader
from simulation.world_simulation import WorldSimulation
from world.world_generator import WorldGenerator


@dataclass
class RuntimeController:
    """Coordinates load -> generate -> simulate lifecycle."""

    seed: int = 42
    loader: ViaLogicLoader = field(default_factory=ViaLogicLoader)
    entity_manager: EntityManager = field(default_factory=EntityManager)
    components: ComponentStore = field(default_factory=ComponentStore)
    systems: SystemExecutor = field(default_factory=SystemExecutor)
    world_generator: WorldGenerator = field(init=False)
    npc_ai: NPCAIEngine = field(init=False)
    simulation: WorldSimulation = field(init=False)
    gameplay: GameplayLoop = field(default_factory=GameplayLoop)
    _state: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.world_generator = WorldGenerator(seed=self.seed)
        self.npc_ai = NPCAIEngine(seed=self.seed)
        self.simulation = WorldSimulation(seed=self.seed)
        self._register_default_systems()

    def bootstrap(self, vialogic_path: str) -> Dict[str, Any]:
        snapshot = self.loader.load(vialogic_path).as_dict()
        world = self.world_generator.build_world(snapshot)

        faction_ids = [entry.get("entity_id", "independent") for entry in snapshot.get("characters", [])]
        npcs = self.npc_ai.generate_npcs(snapshot.get("people", []), [str(f) for f in faction_ids])
        self.simulation.initialize(snapshot.get("characters", []))

        self._state = {
            "vialogic": snapshot,
            "world": world,
            "npc_actions": [],
            "quest_log": [],
            "simulation": self.simulation.snapshot(),
            "global_threat": 0.2,
        }

        for location in world.get("locations", []):
            entity_id = self.entity_manager.create()
            self.components.set_component(entity_id, "Location", location)

        for npc in npcs:
            entity_id = self.entity_manager.create()
            self.components.set_component(
                entity_id,
                "NPC",
                {
                    "npc_id": npc.npc_id,
                    "name": npc.name,
                    "faction": npc.faction,
                    "last_action": npc.last_action,
                },
            )

        self._state["ecs"] = {
            "entities": self.entity_manager.snapshot(),
            "components": self.components.snapshot(),
        }
        return self._state

    def tick(self, delta_time: float = 1.0) -> Dict[str, Any]:
        self.systems.execute(self._state, delta_time)
        self._state["ecs"] = {
            "entities": self.entity_manager.snapshot(),
            "components": self.components.snapshot(),
        }
        return self._state

    def _register_default_systems(self) -> None:
        self.systems.register_system(PHASE_AI, self._ai_phase)
        self.systems.register_system(PHASE_SIMULATION, self._simulation_phase)
        self.systems.register_system(PHASE_NARRATIVE, self._narrative_phase)

    def _ai_phase(self, world_state: Dict[str, Any], delta_time: float) -> None:
        _ = delta_time
        npc_actions = self.npc_ai.tick(world_state)
        world_state["npc_actions"] = npc_actions
        world_state["global_threat"] = 0.8 if any(a["action"] == "seek_cover" for a in npc_actions) else 0.2

    def _simulation_phase(self, world_state: Dict[str, Any], delta_time: float) -> None:
        _ = delta_time
        world_state["simulation"] = self.simulation.tick(world_state.get("npc_actions", []))

    def _narrative_phase(self, world_state: Dict[str, Any], delta_time: float) -> None:
        _ = delta_time
        quests = self.gameplay.generate_quests(
            world_state.get("vialogic", {}).get("narrative", []),
            world_state.get("npc_actions", []),
        )
        world_state["quest_log"] = quests
