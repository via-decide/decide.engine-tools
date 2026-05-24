# Changelog

All notable changes to ViaDecide Studio.
Format: [Semantic Versioning](https://semver.org)

---

## [Unreleased]

### Added
- Added `tools/engine/pea-runner.js` to execute tool tasks in partitioned isolated repositories under `cloned_repos/<repo>/<task_id>/`, enforce path safety, emit `execution_manifest.json`, and commit validated task output locally inside the isolated repo.
- Added `tools/engine/local-commit-executor.js` to safely detect the target repository, stage only task-scoped modified files, gate commits on validation, and emit structured `local_commit_result.json` output.
- Added `packages/constraint-studio` mutation-first constraint experiment infrastructure with live config layering, five identity presets, bounded mutation generation, variant tree engine, replay/signal comparison hooks, snapshot exports, living-archive bridge, and unit coverage.
- Added `packages/signal-capture` embodied interaction instrumentation with 120Hz input sampling, timing analysis, interaction fingerprint generation, visualization datasets, replay-engine bridge, feel-delta comparison, export helpers, living-archive integration, and unit coverage.
- Added `packages/living-archive` identity preservation infrastructure with experiment archiving, lineage graphing, timeline grouping, replay history integration, emotional notes formatting, search utilities, discovery resurfacing mode, and unit coverage.
- Added `packages/constraint-lab` creative experimentation infrastructure with constraint runtime/chaining, replay bridge integration, comparison controls, artifact + notes capture helpers, three starter experiments, presets, and unit coverage.
- Added `packages/replay-engine` deterministic replay foundation (fixed timestep loop, input recorder, replay player, stable state hashing, snapshot store, frame stepper, and GIF exporter scaffold) plus architecture tests and documentation.
- Added Zayvora Constraint Discovery Phase 1 foundations under `experimental/zayvora/phase1/` with JSON-backed experiment registry, deterministic replay recorder/verification, artifact directory bootstrap, and screenshot capture utilities plus unit coverage.
- Added Zayvora Phase 2–4 infrastructure modules for visual constraints (monochrome/dither/tile-grid/scanline), interaction timing/rotation/rhythm helpers, replay window divergence validation, and a reflection bridge with anti-scoring prompt sanitization plus unit tests.
- Added sovereign embedded continuity infrastructure with embedded manifest schema, deterministic hardware lineage/failure graph generators, firmware replay spec, mesh coordination spec, embedded sovereignty dataset generation, and offline `embedded_station.html`.
- Added repository context intelligence infrastructure with deterministic continuity index spec, cross-repo graphing, context resolution, repository replay lineage, sovereignty dataset generation, and offline `repository_station.html`.
- Added continuity-native game infrastructure layer with world continuity manifests, plugin legality contracts, deterministic lineage/replay scripts, multiplayer sync spec, authority profiles, and offline `world_station.html`.
- Added deterministic bootstrap recovery infrastructure: canonical `.codex/session.md` continuity anchor, bootstrap validation spec, recovery/diagnostic Python scripts, persisted recovery artifacts, and offline `bootstrap_station.html` continuity workstation.
- Added an isolated advisory DSA Decision Engine prototype under `experimental/dsa/` with pure-function APIs (`analyzeProblem`, `classifyConstraints`, `suggestAlgorithms`), explicit reasoning output, and a standalone sample runner for constraint/algorithm recommendation validation.
- Added deterministic task/agent lifecycle state management with `core/state-machine.js` and `core/state-registry.js`, enforcing strict CREATED→INITIALIZED→RUNNING→(COMPLETED|FAILED) transitions with invalid-transition rejection and in-memory per-entity state tracking.
- Integrated state-machine lifecycle transitions into runtime/agent execution flow and trace events so every lifecycle transition is recorded as a `state.transition` trace event.
- Added unit assertions validating agent lifecycle completion state and transition trace emission.

- Added an agent execution layer with `core/agent-manager.js`, `core/agent-context.js`, and `agents/example.agent.js`, integrating runtime scheduler execution and trace flow/span lifecycle instrumentation (`init`/`run`/`dispose`) with isolated per-agent state context APIs.
- Added unit coverage for agent manager lifecycle execution, isolation, and trace behavior in `tests/unit/agent-manager.test.js`.
- Added deterministic core trace observability foundations with in-memory `Flow`/`Span`/`Breakpoint` lifecycle APIs (`core/id.js`, `core/trace-store.js`, `core/trace-engine.js`) and DAG link support for full execution trace retrieval.
- Integrated trace flow/span instrumentation into runtime tick cycles, scheduler task execution, and plugin execution lifecycles so failures create flow-level breakpoints and traceable outcomes.
- Added unit coverage for trace engine lifecycle behavior and runtime/plugin trace integration assertions.
- Added an independent engine audit suite under `audit/` with a single-entry audit runner (`audit/engine-audit.js`), structured JSON reporter (`audit/reporter.js`), and deterministic lifecycle/isolation/global leak checks (`audit/tests/*.js`) for plugin/runtime system validation.
- Added deterministic runtime backbone modules (`core/runtime.js`, `core/scheduler.js`, `core/state-manager.js`) with fixed tick execution controls (`start/stop/step/getState`), queue-based per-tick scheduling, state snapshot management, and safe task failure isolation plus runtime unit coverage.
- Added core plugin runtime modules (`core/plugin-registry.js`, `core/plugin-system.js`) with deterministic register/load/execute/unload lifecycle, isolated sandbox contexts, plugin state tracking, and activity logging plus example plugin + unit coverage.
- Added DAX App Bundle Forge foundations under `/bundle-forge` with builder/validator/exporter modules that generate `app.dax`, validate manifest + runtime + script safety + bundle size, and unit coverage for bundle creation/export security checks.
- Added Milestone 1 AI world generator foundations: `/ai/world-generator` parser/selector/builder/registry modules, `/ai/world-pipeline.js`, reusable `/world-templates/voxel-world` terrain/entity/UI/config template assets, runtime world registration + launch plumbing via `createWorld(...)`, sample metadata at `/worlds/voxel-demo-world-index.json`, studio UI hook for voxel generation, and architecture docs at `docs/ai-world-generator.md`.
- Added simulation marketplace publishing pipeline with manifest builder, security validation gate, simulation packager, daxini marketplace client, publish/export orchestration, discovery registry scaffold, unit coverage, and docs for package/publish/launch workflows.
- Added AI Simulation Studio foundations with `/ai` generation pipeline modules, reusable `/templates` scaffolds (strategy/simulation/network/sandbox), dynamic runtime module registration in game loaders, launcher manifest support, public simulation APIs (`generateSimulation`, `launchSimulation`, `listSimulations`), studio UI at `games/ai-simulation-studio.html`, and architecture docs at `docs/ai-simulation-studio.md`.
- Refactored DECIDE Engine Studio into an AAA-style architecture with layered `engine/` domains (`core`, `runtime`, `systems`, `render`, `physics`, `simulation`, `ui`), ECS modules, asset loader/caching pipeline, modular game entries for Mars/Orchade/SkillHex, new editor surface (`/editor`), internal tool placeholders (`/tools/map-editor`, `/tools/simulation-debugger`, `/tools/ui-builder`), and architecture documentation (`docs/studio-architecture.md`, `docs/engine-design.md`, `docs/game-module-guide.md`).
- Added a unified Decide Engine Studio platform scaffold: shared `/engine` runtime (`engine-core`, `game-loader`, `simulation-runtime`, `ui-orchestrator`), modular `/games` environments for Mars/Orchade/SkillHex, dedicated runtime launch pages (`/games/mars`, `/games/orchade`, `/games/skillhex`), launcher UI at `/games/index.html`, architecture docs at `docs/engine-architecture.md`, and smoke coverage for the new launcher/runtime routes.
- Added a Python `decision_engine/` package implementing a complete decision intelligence workflow: context management, evidence collection, reasoning chains and hypotheses, multi-agent scoring, constraint solving, risk/confidence analysis, scenario simulation, strategy/resource planning, feedback loops, metrics, knowledge retrieval, autonomous execution, browser graph viewer, and a runnable `decision_engine/main.py` entrypoint.
- Added `tests/unit/test_decision_engine.py` to validate end-to-end execution of the new decision engine workflow.
- Added `game-engine/` browser-playable AAA prototype scaffold with multi-scale zoom (global/city/ground), mission-based region unlocks, minimap/UI overlays, and modular Canvas runtime files (`index.html`, `style.css`, `game.js`, `world.js`, `player.js`, `map.js`, and placeholder assets).
- Added central Orchade runtime orchestrator entrypoint at `Orchade/engine/orchade_runtime.py` to wire map engine state, world region/city generation, NPC spawn/behavior, gameplay mission triggers, simulation systems, and the unified game tick/game loop lifecycle.
- Implemented full Orchade modular runtime engine with ECS world orchestration, ViaLogic entity conversion, procedural world/character generation, NPC goal-memory-dialogue AI, quest/event/story systems, combat + level generators, simulation subsystems, and runtime game loop integration with expanded runtime tests.
- Implemented Orchade AAA runtime foundations with executable Python modules for ECS (`Orchade/ecs`), ViaLogic ingestion (`Orchade/integration/vialogic_loader.py`), procedural world generation (`Orchade/world/world_generator.py`), NPC cognition (`Orchade/ai/npc_ai_engine.py`), civilization simulation (`Orchade/simulation/world_simulation.py`), runtime orchestration (`Orchade/runtime/runtime_controller.py`), and top-level engine lifecycle (`Orchade/engine/orchade_engine.py`), plus integration coverage in `Orchade/tests/test_orchade_engine_runtime.py`.
- Added polyglot workspace interoperability scaffolding: `workspace/shared_modules` catalog, editable-install Python shared adapters under `workspace/shared/`, Orchade `ai/studyos_bridge` integration, and a Zayvora toolkit StudyOS bridge module for corpus/research access.
- Initialized `Orchade/` AI-native game engine prototype scaffold with modular engine/game/assets/tools/docs layout, ECS + core engine lifecycle, Zayvora bridge integration layer, procedural world generator, gameplay systems, YAML config, and runnable demo script.
- Upgraded StudyOS with a Nex-powered research workspace including semantic corpus search, source exploration, document viewing, AI summaries, markdown notes, and corpus analytics tabs wired into the main UI shell.
- Introduced a unified dashboard shell (`dashboard/index.html`) with reusable layout modules, global navigation, command palette, status states, and new workspace/session + tool catalog entry pages (`workspace/index.html`, `workspace/session.js`, `tools/index.html`).
- Added a cross-repository Zayvora pipeline scaffolder script (`scripts/scaffold/zayvora-pipeline.js`), unit tests, and `docs/system_pipeline.md` to generate the first Simulation → Sensor → Protocol → AI → Dashboard integration skeleton across target repositories.
- Enhanced Highway-V2I lab with microscopic per-vehicle physics (driver profiles, acceleration/braking, lane-following), real-time calibration controls + synthetic traffic stream generator, scenario experiment engine for rain/accident/sensor failure/festival/ambulance events, and research metrics artifacts (JSON/CSV targets under `/highway-v2i-lab/research/`) with new Traffic Physics, Scenario Lab timeline, and Experiment Metrics dashboard panels.
- Extended Highway-V2I with a self-evolving Protocol Evolution Lab: protocol/infrastructure genomes, 200-generation configurable GA default, reproducible seeded runs, and Protocol Lab experiment/report controls for JSON/CSV/technical summaries.
- Upgraded the Highway-V2I lab into an autonomous transport architecture discovery system with multi-network switching (DSRC/C-V2X/5G and experimental mesh modes), protocol + infrastructure genomes, swarm behavior modes, decision-graph-evaluated simulation metrics, invention mode, and large-scale architecture batch experiments integrated into the dashboard UI.
- Refactored the Highway-V2I dashboard into a DECIDE runtime wrapper with `DECIDE.simulation.run()` and Monte Carlo `DECIDE.simulation.optimize()`, plus embedded tool loading for decision-matrix, scenario-planner, output-evaluator, and analytics visualization.
- Added a research-grade Highway-V2I lab module (`highway-v2i-lab/`) with simulation engines, protocol/infrastructure genomes, protocol evolution loop (population 60, configurable generations default 200), experiment runner with JSON/CSV exports, research artifact store, and Protocol Lab UI panel integrated into the dashboard.
- Expanded the Highway-V2I simulator into a smart corridor digital twin laboratory with traffic intelligence analytics, infrastructure health monitoring, drainage/flood risk simulation, emergency mobility corridor logic, real-time digital twin layers, and a scenario experiment suite that exports structured JSON/CSV research outputs targeted for `/highway-v2i-lab/research/`.
- Added a Self-Evolving Infrastructure Engine integrated into Highway-V2I with infrastructure genome crossover/mutation/selection across heavy-traffic/rain/failure/emergency/accident scenarios, new Infrastructure Evolution Lab dashboard panel (leaderboard + genome tree + performance graph + playback), and research exports for optimized RSU placement, sensor layout recommendations, and traffic control strategies.

### Fixed
- Fixed unbounded `state-registry` growth by adding deterministic invocation cleanup in `core/agent-manager.js` (`finally` delete), TTL-based orphan cleanup, bounded max-entry eviction, and explicit registry APIs/metrics events in `core/state-registry.js` to keep concurrent invocation isolation without memory leaks.
- Fixed dashboard module launcher wiring so module cards now open workspace/tools/agent/settings and games reliably inside the dashboard workspace with loader status + fallback error UI.
- Fixed six critical StudyOS regressions in `StudyOS/index.html`: removed browser-incompatible TS/TSX script tags in favor of a safe research stub mount, repaired PhysicsController window listener cleanup, corrected onboarding layout-to-tab routing map, added explicit Kinetic DOWN-swipe skip flow with clamped progress math, enforced Tracker mock score validation (0–100), and switched Vault download wiring from inline onclick strings to data-attribute event listeners.
- Fixed StudyOS bootloader blank-screen regression by adding an auth-readiness fallback timer so the app still initializes when Firebase auth never reaches ready state.
- Fixed duplicate `SUPABASE_ANON_KEY` declarations and duplicate setup-render assignment in `tools/eco-engine-test/index.html` to prevent runtime script errors.
- Added missing `shared/config_env.js`, fixed broken script paths in Agent/SkillHex/Kutch Map pages, and restored a loadable `js/viadecide-agent.js` entrypoint for the Agent demo.
- Improved smoke test resilience by skipping only when Playwright browser executables are unavailable, while keeping real smoke regressions as hard failures.
- Added regression unit coverage for smoke bootstrap error classification.
- Repaired malformed root service worker logic and restored valid install/activate/fetch handlers with GitHub Pages-safe relative shell asset paths.
- Improved smoke test resilience by skipping only when Playwright browser executables are unavailable, while keeping real smoke regressions as hard failures.
- Added regression unit coverage for smoke bootstrap error classification.

---

## [1.0.0] — 2026-03-28

### Foundation
- 37 tools across games, productivity, engine simulations, and education
- Firebase Auth (Google Sign-In) across all tools
- Shared utilities: ToolStorage, ToolBridge, EngineUtils, EngineBalance
- Router with static path map covering all tools
- PWA manifest + service worker (Play Store TWA target)

### Games
- Snake Game, HexWars, FreeCell Classic, SkillHex Mission Control
- ViaLogic, Wings of Fire Quiz

### Productivity
- JSON Formatter, Regex Tester, Color Palette, Pomodoro
- Prompt Alchemy, Idea Remixer, Template Vault, Export Studio
- Revenue Forecaster, Scenario Planner, Task Splitter

### Engine Simulations
- Wave 1: Orchard Engine (player signup → farm generation → harvest)
- Growth Milestone Engine, Seed Quality Scorer, Leaderboard Analytics
- Trust Score Engine, Market Dynamics, Peer Validation Engine

### Infrastructure
- Tool Registry (44 tools, category mapping)
- Tool Bridge (postMessage + localStorage cross-tool state)
- Subscription gate (Firebase Firestore)
