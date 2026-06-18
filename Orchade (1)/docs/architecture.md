# Orchade AAA Engine Architecture (ViaLogic-Driven)

## 1. System Overview
Orchade is the runtime and orchestration layer that converts **ViaLogic knowledge data** into a playable, continuously simulated game world. The engine treats ViaLogic as read-only canon and compiles that canon into runtime graphs:

- `people/` → NPC archetypes, social memory seeds, dialogue priors
- `characters/` → playable factions, leaders, progression trees
- `maps/` → world topology, regions, points of interest
- `narrative/` → conflict templates, plot arcs, quest constraints
- `assets/` → references for art/audio metadata binding

ASCII overview:

```text
ViaLogic Repo (read-only)
        |
        v
Lore Ingestion + Schema Validation
        |
        v
Canonical World Graph (entities, relations, timelines)
        |
  +-----+-----+------------------+
  |     |     |                  |
  v     v     v                  v
World  NPC   Quest            Simulation
Gen    Gen   Gen              (politics/trade/war)
  |     |     |                  |
  +-----+-----+------------------+
        |
        v
Runtime Gameplay Systems + Rendering
```

## 2. Module Architecture
Primary subsystems are layered for independent scaling and deterministic replay.

```text
[Data Layer]
  vialogic_ingestor -> schema_normalizer -> world_graph_store

[Generation Layer]
  world_generation_engine
  character_engine
  quest_engine
  level_engine

[Simulation Layer]
  civilization_simulator
  combat_balance_engine
  npc_cognition_engine

[Runtime Layer]
  gameplay_orchestrator
  event_bus
  rendering_pipeline
```

Module contracts:
- **World Generation**: seeded terrain, biome masks, settlement placement, ecological rules.
- **Character Engine**: faction assignment, personality vectors, skills, long-term goals.
- **NPC Cognition**: memory graph + utility planning + social reaction modeling.
- **Quest Engine**: conflict/event-driven quest chains with adaptive outcomes.
- **Combat Engine**: weapon/armor/skill balancing and AI combat intent.
- **Simulation Engine**: macro systems (trade, diplomacy, warfare, tech).
- **Rendering Pipeline**: scene graph assembly, LOD policy, streaming integration.

## 3. Data Pipeline
The pipeline is append-only and versioned per ingestion cycle.

```text
ViaLogic Git Snapshot
   -> parser (people, characters, maps, narrative, assets)
   -> canonical schema mapper
   -> validation + referential integrity checks
   -> graph materialization (nodes + edges)
   -> runtime projection:
        - NPC spawn tables
        - faction registries
        - world chunk descriptors
        - quest seed bank
        - simulation initial state
```

Data flow guarantees:
1. Read-only source ingestion (no upstream writes).
2. Entity IDs are stable and traceable to source files.
3. Every generated runtime object keeps provenance metadata (`source_repo`, `source_path`, `entity_id`, `snapshot_hash`).

## 4. Execution Graph
Runtime order is deterministic at bootstrap, then event-driven.

```text
(1) Load ViaLogic entities
          |
          v
(2) Build world graph + region adjacency
          |
          v
(3) Generate NPC population
          |
          v
(4) Generate factions + governance structures
          |
          v
(5) Generate quests/story arcs from conflicts
          |
          v
(6) Start world simulation loop
          |
          +--> render tick / AI tick / economy tick / combat tick
```

Tick schedule (example):
- 16ms render frame
- 200ms NPC cognition micro-tick
- 1s simulation macro-tick
- 5s narrative reconciliation tick

## 5. Component Responsibilities
- **`game/orchestration/game_dev_orchestrator.py`**: top-level coordinator, lifecycle state machine, load/generate/start phases.
- **`game/world/procedural_world_engine.py`**: terrain mesh rules, biome synthesis, continent generation.
- **`game/world/procedural_city_generator.py`**: city plans, district zoning, infrastructure graph.
- **`game/world/environment_simulator.py`**: weather, ecology, resource regeneration loops.
- **`game/characters/character_generator.py`**: persona vectors, faction links, skill trees, dialogue seeds.
- **`game/ai/npc_cognition_engine.py`**: memory store, utility planner, reactive behavior policy.
- **`game/narrative/procedural_quest_generator.py`**: event-derived quests and branching outcomes.
- **`game/simulation/civilization_simulator.py`**: geopolitics, trade routes, alliances, conflict escalation.
- **`game/combat/combat_balance_engine.py`**: balancing model and encounter strategy synthesis.
- **`game/levels/level_generator.py`**: dungeons, puzzle topology, traversal pacing.

## 6. File Structure
Target structure inside `decide.engine-tools`:

```text
game/
  orchestration/
    game_dev_orchestrator.py
  world/
    procedural_world_engine.py
    procedural_city_generator.py
    environment_simulator.py
  characters/
    character_generator.py
  ai/
    npc_cognition_engine.py
  narrative/
    procedural_quest_generator.py
  simulation/
    civilization_simulator.py
  combat/
    combat_balance_engine.py
  levels/
    level_generator.py
  rendering/
    runtime_render_pipeline.py
  assets/
    asset_binding_registry.py
```

## 7. Integration with ViaLogic repository
Integration contract:
- Source repository is cloned/fetched as an external data dependency.
- Ingestion reads only: `people/`, `characters/`, `maps/`, `narrative/`, `assets/`.
- Parser adapters map heterogeneous formats (JSON/Markdown/YAML) into normalized entity models.
- Graph linker resolves cross-folder references (e.g., character ↔ map node ↔ narrative event).

```text
ViaLogic Entity File
   -> typed parser
   -> normalized model
   -> graph linker
   -> runtime registries (npc/faction/location/quest)
```

## 8. Future extension points
- **Multiplayer replication**: plug world deltas into `engine/network` for shard sync.
- **LLM narrative director**: add high-level arc steering while preserving deterministic quest constraints.
- **Asset streaming**: bind external asset packs by biome/civilization tags.
- **Mod API**: allow custom faction or quest packs via validated schema extensions.
- **Analytics hooks**: emit telemetry for balance tuning and simulation health.
