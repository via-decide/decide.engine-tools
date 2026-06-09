"""Tests for Orchade central runtime orchestrator wiring."""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from engine.orchade_runtime import OrchadeRuntime


class OrchadeRuntimeOrchestratorTests(unittest.TestCase):
    def _make_vialogic_fixture(self) -> str:
        tmpdir = tempfile.TemporaryDirectory()
        root = Path(tmpdir.name)
        for folder in ["people", "characters", "maps", "narrative", "assets"]:
            (root / folder).mkdir(parents=True, exist_ok=True)

        (root / "people" / "npc-1.md").write_text("name: Sentinel\n", encoding="utf-8")
        (root / "characters" / "faction-1.md").write_text("name: Wardens\n", encoding="utf-8")
        (root / "maps" / "region-1.md").write_text("name: Iron Vale\nbiome: mountains\n", encoding="utf-8")
        (root / "narrative" / "mission-1.md").write_text("title: Hold the Line\n", encoding="utf-8")
        (root / "assets" / "pack.json").write_text(json.dumps({"pack": "orchade"}), encoding="utf-8")

        self.addCleanup(tmpdir.cleanup)
        return str(root)

    def test_runtime_initializes_and_runs_game_loop(self) -> None:
        runtime = OrchadeRuntime(seed=9)
        state = runtime.initialize_runtime(self._make_vialogic_fixture())

        self.assertTrue(state["game_running"])
        self.assertIn("map_engine", state)
        self.assertIn("world_systems", state)
        self.assertIn("ai_systems", state)
        self.assertIn("simulation_systems", state)

        frames = runtime.game_loop(ticks=2, delta_time=1.0)
        self.assertEqual(len(frames), 2)
        self.assertGreaterEqual(frames[-1]["runtime_systems"]["game_tick"], 2)
        self.assertIn("map_render", frames[-1])
        self.assertIn("mission_trigger", frames[-1]["gameplay_systems"])


if __name__ == "__main__":
    unittest.main()
