"""Dialogue system scaffold with Zayvora-backed responses."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List

from ai.zayvora_bridge.zayvora_agent import ZayvoraAgentBridge


@dataclass
class DialogueSystem:
    bridge: ZayvoraAgentBridge = field(default_factory=ZayvoraAgentBridge)

    def get_response(self, npc_context: Dict, prompt: str) -> str:
        decision = self.bridge.decide_action({**npc_context, "prompt": prompt})
        action = decision.get("action", "respond_neutral")
        return f"[{action}] {npc_context.get('name', 'NPC')} acknowledges: {prompt}"

    def trigger_if_needed(self, npc_state: Dict) -> List[str]:
        if npc_state.get("dialogue_trigger"):
            return ["npc_dialogue_ready"]
        return []
