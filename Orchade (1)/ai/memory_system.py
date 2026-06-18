"""NPC episodic memory store with bounded retention."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class MemorySystem:
    capacity: int = 16
    _entries: Dict[str, List[Dict[str, Any]]] = field(default_factory=dict)

    def remember(self, npc_id: str, event: str, importance: float = 0.5, metadata: Dict[str, Any] | None = None) -> None:
        bucket = self._entries.setdefault(npc_id, [])
        bucket.append(
            {
                "event": event,
                "importance": round(max(0.0, min(1.0, importance)), 2),
                "metadata": dict(metadata or {}),
            }
        )
        if len(bucket) > self.capacity:
            del bucket[0 : len(bucket) - self.capacity]

    def recall(self, npc_id: str) -> List[Dict[str, Any]]:
        return [dict(entry) for entry in self._entries.get(npc_id, [])]
