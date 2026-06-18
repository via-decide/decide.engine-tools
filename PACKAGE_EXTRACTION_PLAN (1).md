# Package Extraction Plan: decide.engine-tools

## Objective
Extract shared utilities, storage protocols, and visual primitives out of individual tools and centralize them into modular packages under the `/packages/` directory.

---

## Target Package Extractions

### 1. `packages/storage`
Centralizes database connections, browser LocalStorage, and Origin Private File System (OPFS) interfaces.

- **Current Location:** Bypassed storage calls inside `StudyOS/index.html`, `tools/engine/daily-quest-generator/tool.js`, `tools/games/hex-wars/index.html`, and `shared/tool-storage.js`.
- **Target Package:** `packages/storage`
- **Complexity:** Low (Straightforward wrapper integration)
- **Impact:** High (Enables single point of persistence transition to SQLite or IndexedDB)

---

### 2. `packages/exports`
Unifies data export drivers (CSV, JSON, PDF downloads).

- **Current Location:** Duplicate formatting scripts inside `decision-matrix.html`, `sales-dashboard/index.html`, and `tools/revenue-forecaster/index.html`.
- **Target Package:** `packages/exports`
- **Complexity:** Low
- **Impact:** Medium (Ensures standard Excel and data format outputs)

---

### 3. `packages/reasoning`
Wraps core LLM queries, multi-source orchestration, and API gateways.

- **Current Location:** Direct API fetch calls in `founder/`, `app-generator/index.html`, and `tools/engine/ai-coach-console/`.
- **Target Package:** `packages/reasoning`
- **Complexity:** High (Requires API boundary abstractions)
- **Impact:** High (Eliminates key leakage, centralizes rate-limiting, and simplifies prompt testing)

---

### 4. `packages/prompts`
Hosts system prompts, structural templates, and prompt alchemy mappings.

- **Current Location:** Embedded strings in `prompt-alchemy/index.html`, `idea-remixer/`, and `tools/engine/ai-game-strategy-advisor/`.
- **Target Package:** `packages/prompts`
- **Complexity:** Low
- **Impact:** Medium (Allows tweaking prompts dynamically without modifying front-end code)

---

### 5. `packages/analytics`
Calculates progression, fairness verifications, and player simulations.

- **Current Location:** Scanners in `shared/engine-balance.js`, `shared/engine-models.js`, and `shared/simulation-utils.js`.
- **Target Package:** `packages/analytics`
- **Complexity:** Medium
- **Impact:** High (Keeps gameplay loops isolated from balance calculations)

---

### 6. `packages/ui`
Common components (buttons, sliders, glassmorphic cards, alerts, modals) and design tokens.

- **Current Location:** Mixed styles in `shared/shared.css`, `_ux-patterns.css`, `_design-tokens.css`, and individual tool styles.
- **Target Package:** `packages/ui`
- **Complexity:** Medium
- **Impact:** High (Enforces naming consistencies, speeds up new tool generation, and ensures accessibility)

---

### 7. `packages/agents`
Core self-improving loop classes, scanners, planners, and writers.

- **Current Location:** Newly created files under `agents/antigravity-code/`.
- **Target Package:** `packages/agents`
- **Complexity:** Low
- **Impact:** High (Enables other developer and operator agents to inherit the scanning and fixing loop)

---

### 8. `packages/verification`
Centralizes compilation checkers, linters, and unit runners.

- **Current Location:** Scripts under `tests/` and `agents/antigravity-code/verification-engine.js`.
- **Target Package:** `packages/verification`
- **Complexity:** Medium
- **Impact:** High (Runs pre-commit health validations on the entire monorepo automatically)
