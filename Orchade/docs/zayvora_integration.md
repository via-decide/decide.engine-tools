# Zayvora Integration

`ai/zayvora_bridge/zayvora_agent.py` encapsulates toolkit access.

Integration behavior:
- Attempts `from zayvora_toolkit.reasoning import ReasoningClient`.
- If toolkit is unavailable, uses a deterministic local fallback for prototype continuity.
- `decide_action(npc_context)` returns an action payload consumed by `AIManager` and dialogue/game systems.

This keeps Orchade deployable before secondary repository wiring is complete.


StudyOS enrichment:
- If available, `ai/studyos_bridge/` is used before toolkit reasoning to append corpus context and summary data to each NPC payload.
- This supports the ecosystem path: NPC query → Zayvora reasoning → StudyOS corpus tools → decision result.
