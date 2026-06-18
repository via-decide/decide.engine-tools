"""Inventory system scaffold."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class InventorySystem:
    inventory: Dict[str, List[Dict]] = field(default_factory=dict)

    def add_item(self, entity_id: str, item: Dict) -> None:
        self.inventory.setdefault(entity_id, []).append(item)

    def list_items(self, entity_id: str) -> List[Dict]:
        return self.inventory.get(entity_id, [])
