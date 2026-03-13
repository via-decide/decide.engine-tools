# Decide Engine Tools

Preservation-first browser-native tool mesh for ViaDecide.

## Current implementation scope

This repo now focuses on **Orchard Engine Wave 1 (Layer 1 — Farm)**.

Wave 1 includes ten standalone mini-tools under `tools/engine/`:

1. player-signup
2. orchard-profile-builder
3. starter-farm-generator
4. root-strength-calculator
5. trunk-growth-calculator
6. fruit-yield-engine
7. daily-quest-generator
8. weekly-harvest-engine
9. thirty-day-promotion-engine
10. fair-ranking-engine

## Preservation-first rules

- Existing standalone tools are preserved.
- Changes are additive.
- No unrelated folder is removed to fit architecture changes.

## Orchard metaphor map

- roots = fundamentals
- trunk = depth
- branches = specialization
- leaves = activity
- fruits = completed outputs
- seeds = reusable knowledge
- water = consistency / energy
- minerals = rare insight resources
- soil = environment quality
- sunlight = opportunity exposure

## Shared foundation

Shared helpers used by Wave 1:

- `shared/tool-registry.js`
- `shared/tool-storage.js`
- `shared/tool-bridge.js`
- `shared/shared.css`
- `shared/engine-utils.js`
- `shared/engine-models.js`

## What is deferred

- Layer 2 (Commons) implementation,
- Layer 3 (Market) implementation,
- category routing and advanced orchestration.

## Documentation

- `ORCHARD_ENGINE_DESIGN.md`
- `ARCHITECTURE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
