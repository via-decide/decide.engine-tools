"""High-level ECS world runtime for Orchade."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable, Dict, Iterable, List

from ecs.component_store import ComponentStore
from ecs.entity_manager import EntityManager
from ecs.system_executor import SystemExecutor


SystemFn = Callable[["ECSWorld", float], None]


@dataclass
class ECSWorld:
    """Container for entities, components, and deterministic system execution."""

    entity_manager: EntityManager = field(default_factory=EntityManager)
    component_store: ComponentStore = field(default_factory=ComponentStore)
    system_executor: SystemExecutor = field(default_factory=SystemExecutor)
    global_state: Dict[str, Any] = field(default_factory=dict)
    events: List[Dict[str, Any]] = field(default_factory=list)
    tick_count: int = 0

    def create_entity(self, components: Dict[str, Dict[str, Any]] | None = None) -> int:
        entity_id = self.entity_manager.create()
        for name, payload in (components or {}).items():
            self.component_store.set_component(entity_id, name, payload)
        return entity_id

    def destroy_entity(self, entity_id: int) -> None:
        self.entity_manager.destroy(entity_id)
        self.component_store.remove_entity(entity_id)

    def add_component(self, entity_id: int, name: str, payload: Dict[str, Any]) -> None:
        self.component_store.set_component(entity_id, name, payload)

    def get_component(self, entity_id: int, name: str) -> Dict[str, Any] | None:
        return self.component_store.get_component(entity_id, name)

    def entities_with(self, component_names: Iterable[str]) -> List[int]:
        return self.component_store.entities_with(component_names)

    def register_system(self, phase: str, system: SystemFn) -> None:
        self.system_executor.register_world_system(phase, system)

    def emit_event(self, event_type: str, payload: Dict[str, Any]) -> None:
        self.events.append({"type": event_type, "payload": dict(payload), "tick": self.tick_count})

    def run_tick(self, delta_time: float = 1.0) -> Dict[str, Any]:
        self.tick_count += 1
        self.system_executor.execute_world(self, delta_time)
        return self.snapshot()

    def snapshot(self) -> Dict[str, Any]:
        return {
            "tick": self.tick_count,
            "entities": self.entity_manager.snapshot(),
            "components": self.component_store.snapshot(),
            "event_count": len(self.events),
            "global_state": dict(self.global_state),
        }
