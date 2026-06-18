"""NPC AI runtime built for Orchade and Zayvora integration."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from ai.zayvora_bridge.zayvora_agent import ZayvoraAgentBridge


@dataclass
class BehaviorTree:
    """Simple behavior tree wrapper around goal-prioritized decisions."""

    fallback_action: str = "idle"

    def evaluate(self, state: Dict[str, Any], decision: Optional[Dict[str, Any]]) -> str:
        if decision and "action" in decision:
            return str(decision["action"])
        if state.get("goal"):
            return f"pursue:{state['goal']}"
        return self.fallback_action


@dataclass
class Agent:
    agent_id: str
    state: Dict[str, Any] = field(default_factory=dict)
    goals: List[str] = field(default_factory=list)
    awareness: Dict[str, Any] = field(default_factory=dict)

    def context(self) -> Dict[str, Any]:
        return {
            "agent_id": self.agent_id,
            "goal": self.goals[0] if self.goals else None,
            "energy": self.state.get("energy", 0.5),
            "threat": self.awareness.get("threat", 0.0),
            "world": self.awareness,
            "dialogue_trigger": self.state.get("dialogue_trigger", False),
        }


@dataclass
class AIManager:
    bridge: ZayvoraAgentBridge = field(default_factory=ZayvoraAgentBridge)
    behavior_tree: BehaviorTree = field(default_factory=BehaviorTree)
    agents: Dict[str, Agent] = field(default_factory=dict)

    def register_agent(self, agent: Agent) -> None:
        self.agents[agent.agent_id] = agent

    def update(self, delta_time: float) -> None:
        for agent in self.agents.values():
            decision = self.bridge.decide_action(agent.context())
            action = self.behavior_tree.evaluate(agent.state, decision)
            agent.state["last_action"] = action
            agent.state["last_confidence"] = decision.get("confidence") if decision else None
