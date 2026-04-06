# AI System Design

`engine/ai/npc_ai.py` includes:
- `Agent` with state, goals, and world awareness.
- `BehaviorTree` that resolves final actions.
- `AIManager` that updates all agents each tick.

Each tick:
1. Agent context is sent to Zayvora bridge.
2. Reasoned decision is returned.
3. Behavior tree selects action fallback path.
4. Agent state stores `last_action` for downstream game systems.
