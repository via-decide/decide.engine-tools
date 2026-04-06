# Zayvora Integration

`ai/zayvora_bridge/zayvora_agent.py` encapsulates toolkit access.

Integration behavior:
- Attempts `from zayvora_toolkit.reasoning import ReasoningClient`.
- If toolkit is unavailable, uses a deterministic local fallback for prototype continuity.
- `decide_action(npc_context)` returns an action payload consumed by `AIManager` and dialogue/game systems.

This keeps Orchade deployable before secondary repository wiring is complete.
