# Architecture Map: decide.engine-tools

## Executive Classification
- **Current Architecture Score:** 4/10
- **Ecosystem Classification:** Transitioning from a **Collection of Independent Tools (Level 1)** to a **Reusable Engineering Platform (Level 2)**. It currently lacks the workspace boundaries and workspace isolation of an **Autonomous Ecosystem (Level 3)**.

---

## Current Folder Map & Boundaries

```
decide.engine-tools/
├── StudyOS/                       ← Standalone OS client app (flat, root-level)
├── agent/                         ← Builder config and template html
├── api/                           ← Experimental server-side endpoints
├── app-generator/                 ← Browser app wizard
├── context-packager/              ← Context bundler files
├── docs/                          ← Technical manuals and ADRs
├── founder/                       ← Standalone founder tool
├── interview-prep/                ← Standard question explorer
├── js/                            ← Router support scripts
├── shared/                        ← Code base utilities (Storage, Bridge, Models)
├── src/                           ← Storage TS files (OPFS wrappers)
├── student-research/              ← Research notebook page
├── tests/                         ← Validation suites (Unit, Smoke)
├── tools/                         ← Standalone HTML/CSS/JS tool sets
│   └── engine/                    ← Orchard Engine Layer 1 game files
│   └── games/                     ← Standard interactive logic
├── ui/                            ← Hub components and styling
└── vault/                         ← Execution traces (Traces directory)
```

### Module Boundaries
- **Weak Isolation:** Tools access core utilities (`shared/tool-storage.js`, `shared/tool-bridge.js`) via relative path imports (e.g. `../../shared/tool-storage.js`).
- **No Workspace Boundaries:** Moving a tool directory physically breaks all its import references. There is no package alias resolution (like `#shared/*` or `@packages/*`) because the repository runs browser-native without a bundler.
- **Data Boundaries:** Shared storage is virtually partitioned in `localStorage` using namespaces, but there is no hardware or sandbox enforcement preventing one tool from corrupting another tool's data.

### Application Boundaries
- **StudyOS:** Large client app that functions as a workspace but lives as a flat folder in the root directory.
- **Ecosystem Index (`index.html`):** The primary router page that acts as the entry catalog and deep-links tools.
- **Cockpit (`shared/VIA-COCKPIT.html`):** Administrator workspace showing deployment logs and merge checklists.

---

## Architectural Issues

1. **Relative Import Coupling:** Direct reliance on paths like `../../shared/...` makes directory migrations extremely high-risk.
2. **Missing Workspace Boundary:** Sub-tools are placed at the root level (`StudyOS`, `app-generator`, `founder`), inside `tools/`, and inside `tools/engine/` arbitrarily.
3. **No Dependency Enforcement:** Tools can directly import modules from other tools, creating spaghetti boundaries.
4. **Dual Storage Implementations:** Mixing direct browser `localStorage` calls with `shared/tool-storage.js` wrapper utility.
