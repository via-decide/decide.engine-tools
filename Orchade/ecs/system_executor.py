"""Deterministic ECS phase scheduler and execution engine."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List


PHASE_BOOTSTRAP = "bootstrap"
PHASE_SIMULATION = "simulation"
PHASE_AI = "ai"
PHASE_NARRATIVE = "narrative"
PHASE_COMBAT = "combat"
PHASE_RENDER_SYNC = "render_sync"

DEFAULT_PHASE_ORDER = [
    PHASE_BOOTSTRAP,
    PHASE_SIMULATION,
    PHASE_AI,
    PHASE_NARRATIVE,
    PHASE_COMBAT,
    PHASE_RENDER_SYNC,
]

SystemFn = Callable[[Dict[str, object], float], None]
WorldSystemFn = Callable[[Any, float], None]


@dataclass
class SystemExecutor:
    """Registers and runs ECS systems in deterministic phase order."""

    phase_order: List[str] = field(default_factory=lambda: list(DEFAULT_PHASE_ORDER))
    _systems: Dict[str, List[SystemFn]] = field(default_factory=dict)
    _world_systems: Dict[str, List[WorldSystemFn]] = field(default_factory=dict)

    def register_system(self, phase: str, system_fn: SystemFn) -> None:
        if phase not in self.phase_order:
            self.phase_order.append(phase)
        self._systems.setdefault(phase, []).append(system_fn)

    def register_world_system(self, phase: str, system_fn: WorldSystemFn) -> None:
        if phase not in self.phase_order:
            self.phase_order.append(phase)
        self._world_systems.setdefault(phase, []).append(system_fn)

    def execute(self, world_state: Dict[str, object], delta_time: float) -> None:
        for phase in self.phase_order:
            for system_fn in self._systems.get(phase, []):
                system_fn(world_state, delta_time)

    def execute_world(self, world: Any, delta_time: float) -> None:
        for phase in self.phase_order:
            for system_fn in self._world_systems.get(phase, []):
                system_fn(world, delta_time)

    def snapshot(self) -> Dict[str, int]:
        return {
            "state_systems": sum(len(v) for v in self._systems.values()),
            "world_systems": sum(len(v) for v in self._world_systems.values()),
            "phases": len(self.phase_order),
        }
