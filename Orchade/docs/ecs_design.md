# ECS and Runtime Execution Architecture

## 1. System Overview
The ECS layer is the deterministic backbone that executes world, AI, quest, combat, and simulation systems produced from ViaLogic-derived data. ECS keeps the engine scalable by separating data (components) from behavior (systems).

```text
ViaLogic-derived runtime entities
           |
           v
 Entity Registry (ECS World)
           |
           v
Component Stores (Position, Faction, Memory, CombatStats, QuestState...)
           |
           v
Ordered Systems update by tick phase
```

## 2. Module Architecture
```text
engine/core/ecs.py
  |- EntityManager
  |- ComponentRegistry
  |- SystemScheduler
  |- WorldState

System Phases:
  [Bootstrap] -> [Simulation] -> [Narrative] -> [Combat] -> [Render Prep]
```

Phase ordering avoids race conditions by making writes explicit and batched.

## 3. Data Pipeline
```text
ViaLogic entities
  -> normalization
  -> world graph projection
  -> ECS entity creation
  -> component attachment
  -> phase scheduler registration
```

Key component families:
- Spatial: `Transform`, `RegionAnchor`, `NavigationState`
- Social: `FactionAffiliation`, `RelationshipMatrix`, `Reputation`
- Narrative: `QuestHooks`, `StoryFlags`, `DialogueState`
- Combat: `Stats`, `Equipment`, `AbilityCooldowns`
- Simulation: `ResourceInventory`, `TradeIntent`, `PolicyState`

## 4. Execution Graph
```text
Load Data
  -> Build ECS World
  -> Register Systems
  -> Start Main Loop
        |
        +--> Simulation systems
        +--> AI cognition systems
        +--> Narrative systems
        +--> Combat systems
        +--> Render extraction systems
```

Main loop pseudograph:

```text
for tick in runtime:
  pre_tick_events
  simulation_phase
  ai_phase
  narrative_phase
  combat_phase
  render_sync_phase
  post_tick_commit
```

## 5. Component Responsibilities
- **EntityManager**: stable IDs, lifecycle, pooling.
- **ComponentRegistry**: typed sparse stores and signature queries.
- **SystemScheduler**: deterministic ordering, phase barriers, timing budgets.
- **WorldState**: global clocks, seeds, and shared references.
- **EventBus adapter**: decouples cross-system triggers.

## 6. File Structure
```text
engine/core/
  ecs.py
  scheduler.py
  event_bus.py
  world_state.py

game/
  world/
  ai/
  narrative/
  combat/
  simulation/
  levels/
```

## 7. Integration with ViaLogic repository
ViaLogic parsing produces typed runtime records that are transformed into ECS entities at bootstrap.

```text
ViaLogic node -> canonical model -> entity factory -> ECS entity + components
```

Mapping examples:
- `people/person_X` -> NPC entity + `Memory`, `FactionAffiliation`, `DialogueState`
- `maps/location_Y` -> Location entity + `RegionAnchor`, `BiomeState`
- `narrative/arc_Z` -> Quest-template entity + `StoryFlags`, `QuestHooks`

## 8. Future extension points
- Parallel phase execution for non-conflicting systems.
- Snapshot/rollback for multiplayer reconciliation.
- Server-authoritative ECS shards for massive worlds.
- Deterministic replays for debugging and balancing.
