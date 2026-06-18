# Improvement Plan

Mission: **Mega PR Consolidation**
Generated at: 2026-06-09T00:41:42.553Z

## User Review Required

> [!IMPORTANT]
> This plan proposes migrating the folder hierarchy from a flat layout to a structured monorepo structure. 
> To prevent breaking external URLs and deep-links, backward-compatible symlinks or routing fallbacks should be created in the main entrypoints.

## Executive Analysis

- **Repository Complexity:** High (1723 files detected across multiple layers)
- **Identified Technical Debt:**
  - TODO items: 0
  - Empty error catches: 14
  - Duplicate block patterns: 0
  - Unsafe evals: 16


## Tech Debt Remediation Tasks

### Task 1: Replace Unsafe Evals
- **Description:** Eliminate direct evals in the repository to prevent potential injection risks.
- **Impact:** High | **Complexity:** Medium
- **Recommendation:** Replace `eval()` references in the following files with secure JSON parsing or structured mapping:
  - `apps/cockpit/missions/planner.js` (Line: 88): `content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;`
  - `apps/cockpit/missions/scanner.js` (Line: 270): `report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;`
  - `apps/cockpit/missions/scanner.js` (Line: 274): `report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;`

### Task 2: Log Silent / Empty Catch Blocks
- **Description:** Ensure unexpected exceptions are not silently suppressed without observability.
- **Impact:** Medium | **Complexity:** Low
- **Recommendation:** Inject error logging metrics in catch handlers. Focus first on:
  - `apps/cockpit/missions/scanner.js` (Line: 109): `catch (e) { // Silent catch on read failure }`
  - `apps/cockpit/missions/scanner.js` (Line: 178): `catch (e) { // Silent catch on read failure }`
  - `apps/studyos/services/summary_engine.ts` (Line: 15): `catch (_) { // graceful fallback below }`

## Verification Protocol

1. **Compilation Check:** Run syntax validation on modified files.
2. **Unit Suite:** Run `npm run test:unit` to guarantee core calculators are unaffected.
3. **Smoke Check:** Run `npm run test:smoke` to verify web layout loads cleanly.
