"""Minimal ECS architecture for Orchade."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Type


@dataclass(frozen=True)
class Entity:
    entity_id: int


class Component:
    """Base class for ECS components."""


class System:
    """Base class for ECS systems."""

    def update(self, world: "World", delta_time: float) -> None:
        raise NotImplementedError


@dataclass
class World:
    _next_id: int = 1
    entities: Dict[int, Entity] = field(default_factory=dict)
    components: Dict[Type[Component], Dict[int, Component]] = field(default_factory=dict)
    systems: List[System] = field(default_factory=list)

    def create_entity(self) -> Entity:
        entity = Entity(self._next_id)
        self.entities[entity.entity_id] = entity
        self._next_id += 1
        return entity

    def add_component(self, entity: Entity, component: Component) -> None:
        self.components.setdefault(type(component), {})[entity.entity_id] = component

    def get_component(self, entity: Entity, component_type: Type[Component]) -> Optional[Component]:
        return self.components.get(component_type, {}).get(entity.entity_id)

    def register_system(self, system: System) -> None:
        self.systems.append(system)

    def entities_with(self, *component_types: Type[Component]) -> List[Entity]:
        result: List[Entity] = []
        for entity in self.entities.values():
            if all(entity.entity_id in self.components.get(component_type, {}) for component_type in component_types):
                result.append(entity)
        return result

    def update(self, delta_time: float) -> None:
        for system in self.systems:
            system.update(self, delta_time)
