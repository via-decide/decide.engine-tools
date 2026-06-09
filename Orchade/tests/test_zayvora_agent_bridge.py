"""Regression tests for Orchade Zayvora bridge interoperability."""

from __future__ import annotations

import unittest

from ai.zayvora_bridge.zayvora_agent import ZayvoraAgentBridge


class ZayvoraAgentBridgeTests(unittest.TestCase):
    def test_fallback_decision_contains_action_and_studyos_flag(self) -> None:
        bridge = ZayvoraAgentBridge()
        result = bridge.decide_action({"energy": 0.9, "threat": 0.1, "goal": "patrol perimeter"})

        self.assertIn("action", result)
        self.assertIn("confidence", result)
        self.assertIn("studyos_enriched", result)


if __name__ == "__main__":
    unittest.main()
