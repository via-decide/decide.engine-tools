"""Demo simulation runner for Orchade + Zayvora bridge."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from engine.ai.npc_ai import AIManager, Agent
from engine.config import load_config
from engine.core.core_engine import Engine
from tools.worldgen.world_generator import WorldGenerator


def main() -> None:
    config = load_config(ROOT / "config/game.yaml")

    world_cfg = config.get("world", {})
    generator = WorldGenerator(
        seed=int(world_cfg.get("seed", 42)),
        width=int(world_cfg.get("width", 16)),
        height=int(world_cfg.get("height", 16)),
    )
    world = generator.generate()

    ai_manager = AIManager()
    npc_cfg = config.get("npc", {})
    agent = Agent(
        agent_id=str(npc_cfg.get("id", "npc_001")),
        state={"energy": float(npc_cfg.get("initial_energy", 0.5)), "dialogue_trigger": True},
        goals=[str(npc_cfg.get("initial_goal", "idle"))],
        awareness={"threat": 0.2, "nearest_biome": world["terrain"][0][0]["biome"]},
    )
    ai_manager.register_agent(agent)

    engine = Engine(target_fps=int(config.get("engine", {}).get("target_fps", 30)))
    engine.register_ai_updater(ai_manager.update)

    engine.start()
    for _ in range(3):
        engine.update(1.0 / max(1, engine.target_fps))
    engine.shutdown()

    print("Orchade demo complete")
    print({
        "npc_id": agent.agent_id,
        "last_action": agent.state.get("last_action"),
        "world_seed": world["seed"],
        "sample_biome": world["terrain"][0][0]["biome"],
    })


if __name__ == "__main__":
    main()
