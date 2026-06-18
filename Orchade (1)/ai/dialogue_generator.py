"""Generates NPC dialogue lines from action intents and memory."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class DialogueGenerator:
    def generate(self, npc: Dict[str, Any], action: str, memories: List[Dict[str, Any]]) -> str:
        name = npc.get("name", "Unknown")
        faction = npc.get("faction", "independent")
        memory_hint = memories[-1]["event"] if memories else "quiet times"

        templates = {
            "seek_cover": f"{name}: Stay low. {faction} must endure.",
            "mediate": f"{name}: We can still negotiate a safer path.",
            "retaliate": f"{name}: They struck first. We answer.",
            "explore": f"{name}: I will scout ahead for opportunities.",
            "craft": f"{name}: Give me time, I'll build what we need.",
            "patrol": f"{name}: I'll keep watch while others recover.",
        }
        return templates.get(action, f"{name}: I remember {memory_hint}. We move carefully.")
