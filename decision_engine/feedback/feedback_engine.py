"""Feedback loop integration."""
from __future__ import annotations

from typing import Dict


class FeedbackEngine:
    def summarize(self, execution_result: Dict[str, str], confidence: float) -> Dict[str, str | float]:
        status = execution_result.get('status', 'unknown')
        return {
            'status': status,
            'action': execution_result.get('action', ''),
            'feedback': 'Reinforce current policy' if status == 'executed' and confidence > 0.7 else 'Review decision assumptions',
            'confidence': confidence,
        }


# Example usage:
# feedback = FeedbackEngine().summarize({'status': 'executed', 'action': 'Expand'}, 0.8)
