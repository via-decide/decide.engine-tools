"""Integration tests for new Orchade runtime architecture modules."""
"""Integration tests for Orchade runtime architecture modules."""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from engine.orchade_engine import OrchadeEngine


class OrchadeEngineRuntimeTests(unittest.TestCase):
    def _make_vialogic_fixture(self) -> str:
        tmpdir = tempfile.TemporaryDirectory()
        root = Path(tmpdir.name)
        for folder in ["people", "characters", "maps", "narrative", "assets"]:
            (root / folder).mkdir(parents=True, exist_ok=True)

        (root / "people" / "alice.json").write_text(json.dumps({"name": "Alice"}), encoding="utf-8")
        (root / "characters" / "faction-alpha.md").write_text("name: Alpha\n", encoding="utf-8")
        (root / "maps" / "northgate.md").write_text("name: Northgate\nbiome: forest\n", encoding="utf-8")
        (root / "narrative" / "arc-1.md").write_text("title: Rising Tension\n", encoding="utf-8")
        (root / "people" / "alice.json").write_text(json.dumps({"name": "Alice", "role": "scout"}), encoding="utf-8")
        (root / "people" / "bram.md").write_text("name: Bram\nrole: diplomat\n", encoding="utf-8")
        (root / "characters" / "faction-alpha.md").write_text("name: Alpha\ndoctrine: stability\n", encoding="utf-8")
        (root / "characters" / "faction-bravo.md").write_text("name: Bravo\ndoctrine: expansion\n", encoding="utf-8")
        (root / "maps" / "northgate.md").write_text("name: Northgate\nbiome: forest\n", encoding="utf-8")
        (root / "maps" / "sunreach.md").write_text("name: Sunreach\n", encoding="utf-8")
        (root / "narrative" / "arc-1.md").write_text("title: Rising Tension\n", encoding="utf-8")
        (root / "narrative" / "arc-2.md").write_text("title: Treaty or War\n", encoding="utf-8")
        (root / "assets" / "pack.json").write_text(json.dumps({"pack": "base"}), encoding="utf-8")

        self.addCleanup(tmpdir.cleanup)
        return str(root)

    def test_engine_bootstrap_and_tick_generates_world_and_quests(self) -> None:
    def test_engine_bootstrap_creates_world_and_ecs_entities(self) -> None:
        repo_path = self._make_vialogic_fixture()
        engine = OrchadeEngine(seed=7)

        state = engine.start(repo_path)
        self.assertIn("world", state)
        self.assertGreaterEqual(state["world"]["world_graph"]["location_count"], 1)
        self.assertIn("ecs", state)

        snapshots = engine.run_ticks(tick_count=2, delta_time=1.0)
        self.assertEqual(len(snapshots), 2)
        self.assertIn("simulation", snapshots[-1])
        self.assertIn("quest_log", snapshots[-1])
        self.assertGreaterEqual(len(snapshots[-1]["quest_log"]), 1)

        self.assertIn("world", state)
        self.assertGreaterEqual(state["world"]["world_graph"]["location_count"], 2)
        self.assertGreaterEqual(state["world"]["world_graph"]["city_count"], 1)
        self.assertIn("ecs", state)
        self.assertGreaterEqual(state["ecs"]["entities"]["active_entities"], 4)

    def test_tick_generates_ai_simulation_quests_and_dungeons(self) -> None:
        repo_path = self._make_vialogic_fixture()
        engine = OrchadeEngine(seed=11)
        engine.start(repo_path)

        snapshots = engine.run_ticks(tick_count=3, delta_time=1.0)
        latest = snapshots[-1]

        self.assertIn("npc_actions", latest)
        self.assertGreaterEqual(len(latest["npc_actions"]), 1)
        self.assertIn("simulation", latest)
        self.assertIn("war", latest["simulation"])
        self.assertIn("quest_log", latest)
        self.assertGreaterEqual(len(latest["quest_log"]), 1)
        self.assertIn("dungeons", latest)
        self.assertGreaterEqual(len(latest["dungeons"]), 1)

        engine.shutdown()


if __name__ == "__main__":
    unittest.main()
