"""Top-level executable Orchade engine facade."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from runtime.runtime_controller import RuntimeController


@dataclass
class OrchadeEngine:
    """Coordinates runtime controller lifecycle for external callers."""

    seed: int = 42
    runtime: RuntimeController = field(init=False)
    started: bool = False

    def __post_init__(self) -> None:
        self.runtime = RuntimeController(seed=self.seed)

    def start(self, vialogic_path: str) -> Dict[str, Any]:
        self.started = True
        return self.runtime.bootstrap(vialogic_path)

    def run_ticks(self, tick_count: int = 1, delta_time: float = 1.0) -> List[Dict[str, Any]]:
        if not self.started:
            raise RuntimeError("Engine must be started before running ticks")
        return self.runtime.run(tick_count=tick_count, delta_time=delta_time)

    def shutdown(self) -> None:
        self.started = False
