"""Persistence layer for decision outcomes."""
from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Dict, List


@dataclass
class DecisionRecord:
    decision_id: str
    recommendation: str
    confidence: float
    outcome: str


class DecisionHistory:
    def __init__(self) -> None:
        self._records: List[DecisionRecord] = []

    def add_record(self, record: DecisionRecord) -> None:
        self._records.append(record)

    def list_records(self) -> List[DecisionRecord]:
        return list(self._records)

    def as_dicts(self) -> List[Dict[str, str]]:
        return [asdict(r) for r in self._records]


# Example usage:
# history.add_record(DecisionRecord('D-1', 'Expand', 0.82, 'pending'))
