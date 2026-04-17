"""Typed component storage and ECS signature queries."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List


@dataclass
class ComponentStore:
    """Stores components by name and entity id."""

    _components: Dict[str, Dict[int, Dict[str, Any]]] = field(default_factory=dict)

    def set_component(self, entity_id: int, component_name: str, payload: Dict[str, Any]) -> None:
        self._components.setdefault(component_name, {})[entity_id] = dict(payload)

    def get_component(self, entity_id: int, component_name: str) -> Dict[str, Any] | None:
        return self._components.get(component_name, {}).get(entity_id)

    def remove_entity(self, entity_id: int) -> None:
        for component_map in self._components.values():
            component_map.pop(entity_id, None)

    def entities_with(self, component_names: Iterable[str]) -> List[int]:
        component_names = list(component_names)
        if not component_names:
            return []

        pools = [set(self._components.get(name, {}).keys()) for name in component_names]
        if not pools:
            return []

        shared = set.intersection(*pools) if pools else set()
        return sorted(shared)

    def snapshot(self) -> Dict[str, int]:
        return {name: len(entity_map) for name, entity_map in self._components.items()}
