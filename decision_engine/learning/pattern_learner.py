"""Pattern learning from historical records."""
from __future__ import annotations

from collections import Counter
from typing import Dict

from decision_engine.history.decision_history import DecisionHistory


class PatternLearner:
    def learn(self, history: DecisionHistory) -> Dict[str, float]:
        records = history.list_records()
        if not records:
            return {'success_rate': 0.0}
        outcomes = Counter(r.outcome for r in records)
        success = outcomes.get('success', 0)
        return {'success_rate': success / len(records), 'most_common_outcome': outcomes.most_common(1)[0][0]}


# Example usage:
# patterns = PatternLearner().learn(history)
