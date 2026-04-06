# Orchade

AI-native game engine prototype scaffold.

## Purpose
Orchade is structured to separate world simulation from reasoning:
- `engine/` runs simulation, ECS, loop, and systems.
- `ai/zayvora_bridge/` integrates Zayvora Toolkit decisioning.
- `game/` contains domain systems (combat/quest/dialogue/inventory).
- `tools/` contains offline worldgen + asset pipeline tooling.

Run the demo:

```bash
python scripts/run_game.py
```
