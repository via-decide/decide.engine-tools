# Automation Plan: decide.engine-tools

## Objective
Establish a centralized `/automation/` directory to host script utilities, tool-creation templates, automated cron runners, and workflow deploy configurations.

---

## Automation Consolidation Mapping

### 1. Tool Scaffolding & Generation
- **Current Location:** `scripts/scaffold/` template scripts.
- **Migration Target:** `automation/scaffolding/`
- **Utility:** Standardize the creation of new HTML tools. Run `npm run scaffold <tool-name>` to generate a standard directory containing `index.html`, `config.json`, and `tool.js` prepopulated with correct relative style paths and tool-bridge register templates.

### 2. Version and Metadata Utilities
- **Current Location:** `tests/scripts/bump-version.js` and manual `tools-manifest.json` updates.
- **Migration Target:** `automation/metadata/`
- **Utility:** Automatic extraction of category bindings from tool directories, regenerates `tools-manifest.json` on changes, and increments version metadata.

### 3. CI/CD Validation Actions
- **Current Location:** Playwright setup and Github pages workflows.
- **Migration Target:** `automation/workflows/`
- **Utility:** Integrate git hooks (`.husky` pre-commit setup) that execute:
  1. `node agents/antigravity-code/agent-loop.js --dry-run` to compile-check files.
  2. `npm run test:unit` to verify core functions.
  If validations fail, prevent commits to keep the main branch stable.

---

## Target Automation Directory

```
decide.engine-tools/automation/
├── scaffolding/                # Tool generators and directory templates
│   ├── scaffold-tool.js        # Node CLI generator
│   └── templates/              # HTML/CSS/JS baseline templates
├── metadata/                   # Manifest synchronizers
│   └── manifest-builder.js     # Registry mapping sync tool
├── cron/                       # Simulated periodic background crons
│   └── weekly-progression.js   # Automated quest and balance ticks
└── workflows/                  # Github action configurations
    └── deploy.yml              # Build-less page deploy action
```
