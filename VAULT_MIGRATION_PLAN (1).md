# Vault Migration Plan: decide.engine-tools

## Objective
Establish a centralized, immutable repository-level storage directory `/vault/` to archive execution logs, security audits, AI planner artifacts, and local database mock snapshots.

---

## Target Vault Folder Hierarchy

```
decide.engine-tools/vault/
├── traces/                     # Dynamic execution logs (trace-YYYY-MM-DD.json)
├── reports/                    # Generated files (ARCHITECTURE_REPORT, TECH_DEBT_REPORT)
├── outputs/                    # Local mocks (synthetic-players, balance-runs)
└── audits/                     # Security scans and dependency health checks
```

---

## Consolidation Mapping

### 1. Traces (`vault/traces/`)
- **Current Location:** Random logs and terminal capture records.
- **Migration Strategy:** Target directory for `trace-writer.js`. All autonomous self-fixing agent runs must dump a complete, detailed execution JSON trace here.
- **Data Model:** Logs should contain timestamp, input tokens, output tokens, credits saved, execution times, diff details, and verification outcomes.

### 2. Reports (`vault/reports/`)
- **Current Location:** `ARCHITECTURE_REPORT.md` and `TECH_DEBT_REPORT.md` written in the repository root.
- **Migration Strategy:** Relocate all periodic analyzer reports into `/vault/reports/` to keep the root clean. Add symbolic link hooks or cockpit routing links so the operator can view them easily.

### 3. Outputs (`vault/outputs/`)
- **Current Location:** `_rh` (run history) in local storage, synthetic player JSON dumps, and local simulation artifacts.
- **Migration Strategy:** Centralize these logs on disk in `/vault/outputs/` (e.g. `synthetic-players.json`, `simulation-history.json`). This allows tools like `balance-dashboard` to run calculations against file-system databases rather than relying solely on browser `localStorage` limits.

### 4. Audits (`vault/audits/`)
- **Current Location:** Ad-hoc manual spreadsheets and check files.
- **Migration Strategy:** Automate security script runs (e.g. searching for secret tokens or credentials) and output logs to `/vault/audits/security-scan.json` on every commit.
