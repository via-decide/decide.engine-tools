"""Quest generation from ViaLogic concept nodes and runtime triggers."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from quest.event_trigger_system import EventTriggerSystem
from quest.story_arc_builder import StoryArcBuilder


@dataclass
class QuestGenerator:
    trigger_system: EventTriggerSystem = field(default_factory=EventTriggerSystem)
    arc_builder: StoryArcBuilder = field(default_factory=StoryArcBuilder)
    _counter: int = 0

    def generate(self, concept_nodes: List[Dict[str, Any]], npc_actions: List[Dict[str, Any]], simulation_state: Dict[str, Any]) -> List[Dict[str, Any]]:
        triggers = self.trigger_system.collect(npc_actions, simulation_state)
        arcs = self.arc_builder.build(concept_nodes, triggers)

        quests: List[Dict[str, Any]] = []
        for arc in arcs:
            self._counter += 1
            difficulty = "high" if arc["theme"] in {"war_escalation", "retaliate"} else "medium"
            quests.append(
                {
                    "quest_id": f"quest_{self._counter}",
                    "arc_id": arc["arc_id"],
                    "objective": f"Resolve {arc['theme']} in {arc['source']}",
                    "difficulty": difficulty,
                    "status": "active",
                }
            )
        return quests
