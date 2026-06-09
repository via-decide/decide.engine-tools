# StudyOS Integration

Orchade now includes `ai/studyos_bridge/` to enrich NPC context with StudyOS corpus data.

## Runtime contract

- Install shared adapters: `pip install -e workspace/shared`
- Optional StudyOS-compatible service endpoint: `http://localhost:8000`
- `ZayvoraAgentBridge` enriches context with StudyOS data before delegating to toolkit reasoning.

This keeps the decision chain aligned with the ecosystem flow:

NPC query -> Zayvora reasoning -> StudyOS corpus tools -> decision result
