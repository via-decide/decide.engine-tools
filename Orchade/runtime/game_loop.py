"""Main game loop controller for Orchade runtime."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class GameLoop:
    max_ticks: int = 0
    snapshots: List[Dict[str, Any]] = field(default_factory=list)

    def run(self, tick_fn, tick_count: int, delta_time: float = 1.0) -> List[Dict[str, Any]]:
        self.max_ticks += max(0, tick_count)
        generated: List[Dict[str, Any]] = []
        for _ in range(max(0, tick_count)):
            snapshot = tick_fn(delta_time)
            generated.append(snapshot)
            self.snapshots.append(snapshot)
        return generated
