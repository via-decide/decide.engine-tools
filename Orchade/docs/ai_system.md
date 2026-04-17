# AI System Architecture Specification

## 1. System Overview
The AI stack turns ViaLogic narrative entities into autonomous NPC behavior at scale. It combines symbolic world state, memory graphs, and utility planning to run thousands of NPCs with coherent long-term motives.

```text
ViaLogic people/characters/narrative
              |
              v
      AI Entity Normalizer
              |
              v
  NPC Cognition Runtime (memory + goals)
              |
              v
  Action Intents -> Gameplay Systems
```

## 2. Module Architecture
```text
npc_cognition_engine
  |- memory_subsystem
  |- goal_planner
  |- social_reasoner
  |- reaction_policy
  |- action_dispatcher

quest_engine <----> npc_cognition_engine <----> simulation_engine
          \                                      /
           +------------ event_bus -------------+
```

Subsystem notes:
- **Memory subsystem**: episodic memory, relationship memory, rumor propagation.
- **Goal planner**: utility-scored action planning constrained by faction doctrine.
- **Social reasoner**: alliance/hostility inference from recent world events.
- **Reaction policy**: handles stimuli (combat, theft, dialogue outcomes, disasters).

## 3. Data Pipeline
```text
ViaLogic people + characters + narrative
   -> trait extraction (temperament, ideology, role)
   -> personality vector construction
   -> faction + social graph binding
   -> goal seed generation
   -> runtime NPC cognition state
```

Pipeline outputs:
- `npc_profile`
- `npc_memory_seed`
- `npc_goal_stack`
- `npc_dialogue_intent_model`

## 4. Execution Graph
```text
1) Load NPC templates from ViaLogic entities
2) Build per-region NPC spawn pools
3) Initialize memory + goal stacks
4) Run cognition micro-ticks
5) Emit action intents
6) Apply outcomes and update memory
```

Runtime loop:

```text
Sense -> Recall -> Plan -> Act -> Observe Outcome -> Learn
```

## 5. Component Responsibilities
- **`game/ai/npc_cognition_engine.py`**: orchestrates cognition cycle and intent emission.
- **Memory graph store**: tracks events, confidence, and decay windows.
- **Goal planner**: computes top actions from utility + constraints.
- **Social simulator bridge**: updates inter-NPC trust/fear/respect metrics.
- **Quest bridge**: converts unmet NPC goals into quest opportunities.

## 6. File Structure
```text
game/ai/
  npc_cognition_engine.py
  memory/
    episodic_store.py
    social_memory.py
  planning/
    utility_planner.py
    constraint_solver.py
  social/
    relationship_model.py
  policies/
    reaction_policy.py
```

## 7. Integration with ViaLogic repository
- `people/` supplies real-world-style personas, occupations, and relationships.
- `characters/` provides faction anchors and hero archetypes.
- `narrative/` provides motive vocabularies and conflict grammars.
- Entity IDs are preserved to keep AI decisions explainable back to source lore.

```text
ViaLogic person node -> NPC seed -> memory profile -> goal policy -> in-game behavior
```

## 8. Future extension points
- Hierarchical planners (daily routine planner + strategic planner).
- Group cognition (squads, guilds, councils) rather than individual-only logic.
- Emotional drift models tied to prolonged stress/trauma events.
- Online adaptation from player telemetry with safety constraints.
