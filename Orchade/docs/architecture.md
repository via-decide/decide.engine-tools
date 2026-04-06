# Orchade + Zayvora Architecture

Orchade is the simulation host (engine loop, ECS, world state), while Zayvora is the reasoning layer used to evaluate NPC context and return actions.

Data flow:
1. Engine tick updates world and AI manager.
2. AI manager packages NPC state/goals/awareness.
3. Zayvora bridge submits context to toolkit client and receives a decision.
4. Decision is transformed into game actions executed by systems.

The bridge is isolated in `ai/zayvora_bridge` so future Nex retrieval can be inserted without modifying core simulation modules.
