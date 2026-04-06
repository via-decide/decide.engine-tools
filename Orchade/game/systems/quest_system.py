"""Quest system scaffold."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict


@dataclass
class QuestSystem:
    quests: Dict[str, Dict] = field(default_factory=dict)

    def add_quest(self, quest_id: str, quest_data: Dict) -> None:
        self.quests[quest_id] = quest_data

    def complete_quest(self, quest_id: str) -> Dict:
        quest = self.quests.get(quest_id, {})
        return {"quest_id": quest_id, "status": "completed", "rewards": quest.get("rewards", {})}
