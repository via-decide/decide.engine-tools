"""Evidence collection and validation."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, List


@dataclass
class Evidence:
    source: str
    claim: str
    weight: float
    valid: bool = True
    details: Dict[str, Any] | None = None


class EvidenceCollector:
    def collect(self, raw_items: Iterable[Dict[str, Any]]) -> List[Evidence]:
        items: List[Evidence] = []
        for item in raw_items:
            evidence = Evidence(
                source=str(item.get('source', 'unknown')),
                claim=str(item.get('claim', '')),
                weight=float(item.get('weight', 0.5)),
                details=item.get('details') or {},
            )
            evidence.valid = self.validate(evidence)
            items.append(evidence)
        return items

    def validate(self, evidence: Evidence) -> bool:
        return evidence.weight >= 0 and bool(evidence.claim.strip())

    def aggregate_weight(self, evidence_list: Iterable[Evidence]) -> float:
        return sum(e.weight for e in evidence_list if e.valid)


# Example usage:
# collector = EvidenceCollector()
# evidence = collector.collect([{'source': 'survey', 'claim': 'Market demand is high', 'weight': 0.8}])
