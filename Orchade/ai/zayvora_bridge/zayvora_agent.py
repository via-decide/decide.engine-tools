"""Bridge that routes Orchade NPC context through Zayvora reasoning."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class ZayvoraAgentBridge:
    """Connects NPC state context to a Zayvora reasoning client."""

    model_name: str = "zayvora-default"

    def __post_init__(self) -> None:
        self._client = self._resolve_toolkit_client()

    def _resolve_toolkit_client(self):
        """Resolve toolkit client if installed; otherwise use local heuristic stub."""
        try:
            from zayvora_toolkit.reasoning import ReasoningClient  # type: ignore
            return ReasoningClient(model=self.model_name)
        except Exception:
            return None

    def decide_action(self, npc_context: Dict[str, Any]) -> Dict[str, Any]:
        if self._client is not None:
            return self._client.decide(npc_context)

        energy = float(npc_context.get("energy", 0.5))
        threat = float(npc_context.get("threat", 0.0))
        if threat > 0.7:
            action = "seek_cover"
        elif energy < 0.3:
            action = "rest"
        else:
            action = "patrol"
        return {"action": action, "confidence": 0.62, "source": "fallback-heuristic"}
