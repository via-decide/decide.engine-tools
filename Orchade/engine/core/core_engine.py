"""Core engine lifecycle for Orchade."""

from __future__ import annotations

from dataclasses import dataclass, field
from time import perf_counter
from typing import Callable, List


@dataclass
class Engine:
    """Coordinates system registration, frame updates, and shutdown flow."""

    target_fps: int = 30
    systems: List[Callable[[float], None]] = field(default_factory=list)
    ai_updaters: List[Callable[[float], None]] = field(default_factory=list)
    running: bool = False

    def register_system(self, update_fn: Callable[[float], None]) -> None:
        self.systems.append(update_fn)

    def register_ai_updater(self, update_fn: Callable[[float], None]) -> None:
        self.ai_updaters.append(update_fn)

    def start(self) -> None:
        self.running = True

    def update(self, delta_time: float) -> None:
        if not self.running:
            return
        for system in self.systems:
            system(delta_time)
        for ai_update in self.ai_updaters:
            ai_update(delta_time)

    def shutdown(self) -> None:
        self.running = False

    def run_for_frames(self, frame_count: int = 1) -> None:
        """Utility loop for prototypes and tests."""
        self.start()
        previous = perf_counter()
        for _ in range(max(0, frame_count)):
            now = perf_counter()
            delta = now - previous
            previous = now
            self.update(delta)
        self.shutdown()
