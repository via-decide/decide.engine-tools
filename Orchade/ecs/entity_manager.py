"""Entity lifecycle management for Orchade ECS."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Iterable, Set
from typing import Dict, Iterable, List, Set


@dataclass
class EntityManager:
    """Allocates stable entity IDs and tracks active entities."""

    _next_entity_id: int = 1
    _active_entities: Set[int] = field(default_factory=set)

    def create(self) -> int:
        entity_id = self._next_entity_id
        self._next_entity_id += 1
        self._active_entities.add(entity_id)
        return entity_id

    def create_many(self, count: int) -> Iterable[int]:
        for _ in range(max(0, count)):
            yield self.create()

    def destroy(self, entity_id: int) -> None:
        self._active_entities.discard(entity_id)

    def exists(self, entity_id: int) -> bool:
        return entity_id in self._active_entities

    def all_entities(self) -> List[int]:
        return sorted(self._active_entities)

    def snapshot(self) -> Dict[str, int]:
        return {
            "active_entities": len(self._active_entities),
            "next_entity_id": self._next_entity_id,
        }
