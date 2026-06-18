"""Context management for decision workflows."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict


@dataclass
class DecisionContext:
    decision_id: str
    objective: str
    constraints: Dict[str, float] = field(default_factory=dict)
    environment: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)


class ContextManager:
    def __init__(self) -> None:
        self._contexts: Dict[str, DecisionContext] = {}

    def create_context(self, decision_id: str, objective: str, constraints: Dict[str, float] | None = None, environment: Dict[str, Any] | None = None, metadata: Dict[str, Any] | None = None) -> DecisionContext:
        context = DecisionContext(
            decision_id=decision_id,
            objective=objective,
            constraints=constraints or {},
            environment=environment or {},
            metadata=metadata or {},
        )
        self._contexts[decision_id] = context
        return context

    def update_environment(self, decision_id: str, updates: Dict[str, Any]) -> DecisionContext:
        context = self._contexts[decision_id]
        context.environment.update(updates)
        return context

    def get_context(self, decision_id: str) -> DecisionContext:
        return self._contexts[decision_id]


# Example usage:
# manager = ContextManager()
# ctx = manager.create_context('D-1', 'Select product launch market', {'budget': 100000}, {'region': 'NA'})
