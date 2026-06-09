# Cockpit Migration Plan: decide.engine-tools

## Objective
Consolidate all monitoring interfaces, game balance dashboards, administrative controls, and agent execution streams into a single `/cockpit/` directory to serve as the unified **Mission Control** of the ecosystem.

---

## Cockpit Candidates for Consolidation

The following four standalone interfaces will be merged into the unified cockpit architecture:

### 1. Unified Operator Dashboard
- **Current Location:** [shared/VIA-COCKPIT.html](file:///Users/dharamdaxini/Downloads/via/decide.engine-tools/shared/VIA-COCKPIT.html)
- **Role:** General development checklist, GitHub merge strategy console, and AntiGravity Code Agent live execution monitor.
- **Migration Strategy:** Move to `cockpit/index.html` and use it as the main entrance index page for cockpit operations.

### 2. Wave 1 Balance Dashboard
- **Current Location:** `tools/engine/balance-dashboard/`
- **Role:** Analyzes player progression and game metrics outputting balanced/rebalance verdicts.
- **Migration Strategy:** Migrate core telemetry widgets under `cockpit/balance/` and load player progression files using `packages/analytics`.

### 3. Orchard Game Command Center
- **Current Location:** `tools/engine/game-command-center/`
- **Role:** Real-time game state management, time-travel tick trigger, and leaderboard monitoring.
- **Migration Strategy:** Move under `cockpit/orchard-command/` to isolate game operator variables from standard user routes.

### 4. SkillHex Mission Control
- **Current Location:** `tools/games/skillhex-mission-control/`
- **Role:** Simulation operator panel for skill vectors.
- **Migration Strategy:** Refactor under `cockpit/skillhex/`.

---

## Cockpit Convergence Architecture

```
decide.engine-tools/cockpit/
├── index.html                  # Main Mission Control Portal (unified shell)
├── state/                      # Local JSON state store (cockpit-state.json)
├── styles/                     # Glassmorphic cyberpunk styling theme
├── components/                 # Reusable dashboard widgets
│   ├── agent-monitor.js        # Dynamic loop execution stream
│   ├── repo-health.js          # Technical debt metric chart
│   └── game-operator.js        # Tick triggers and balance controllers
└── sections/                   # Individual consoles
    ├── balance/                # Balance dashboard app
    ├── orchard/                # Game command center app
    └── skillhex/               # SkillHex operator console
```

### Convergence Steps
1. **Directory Setup:** Initialize `cockpit/` at the root of the target repository.
2. **Move VIA-COCKPIT:** Relocate `VIA-COCKPIT.html` to `cockpit/index.html` and resolve its path bindings.
3. **Embed Sub-Consoles:** Move the dashboards (`balance-dashboard`, `game-command-center`, `skillhex-mission-control`) into sub-folders under `cockpit/sections/`.
4. **Shared State Bus:** Bind all panels to a single client-side state bus (`ToolBridge` integration) so clicking an action in one sub-console updates state tags ecosystem-wide.
