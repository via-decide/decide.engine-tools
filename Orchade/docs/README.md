# Orchade Architecture Documentation Index

## 1. System Overview
This documentation set defines how `decide.engine-tools` evolves into an AI-powered AAA game engine driven by ViaLogic data. The docs specify a modular pipeline that ingests lore entities and transforms them into a live world containing NPCs, factions, quests, simulation loops, and playable systems.

```text
ViaLogic Data -> Canonical Graph -> Generation Pipelines -> Runtime Simulation -> Playable World
```

## 2. Module Architecture
Documentation coverage map:

```text
architecture.md          : end-to-end engine architecture
ecs_design.md            : runtime ECS + scheduling model
ai_system.md             : NPC cognition and AI runtime
zayvora_integration.md   : reasoning bridge and context contracts
```

Subsystems documented across these files:
- World generation
- Character engine
- NPC cognition
- Quest generation
- Combat and simulation orchestration
- Rendering/runtime sync

## 3. Data Pipeline
```text
ViaLogic repo
  -> entity parsers
  -> schema normalization
  -> graph linker
  -> subsystem-specific projections
  -> runtime world state
```

## 4. Execution Graph
```text
Load ViaLogic entities
      -> build world graph
      -> generate NPCs and factions
      -> generate quests
      -> start simulation and gameplay loops
```

## 5. Component Responsibilities
- **Architecture docs** define boundaries, interfaces, and lifecycle stages.
- **Runtime docs** define deterministic tick order and fault domains.
- **AI docs** define cognition/reasoning contracts and validation.
- **Integration docs** define source-of-truth and provenance guarantees.

## 6. File Structure
```text
Orchade/docs/
  README.md
  architecture.md
  ecs_design.md
  ai_system.md
  zayvora_integration.md
```

## 7. Integration with ViaLogic repository
All docs assume a read-only external dependency on ViaLogic:
- `people/`
- `characters/`
- `maps/`
- `narrative/`
- `assets/`

Integration contracts require deterministic parsing, stable IDs, and provenance metadata.

## 8. Future extension points
- Add dedicated `world_generation.md`, `combat_design.md`, and `rendering_pipeline.md` specs.
- Add performance SLO and scalability targets (NPC count, world size, tick budgets).
- Add schema version matrix for ViaLogic compatibility over time.
