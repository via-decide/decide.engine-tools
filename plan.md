Diagnostic: Verified Codebase Alignment.
This repository contains a unified dashboard shell that routes users into core modules while preserving standalone tools. The primary entry point is `dashboard/index.html`.

### AGENTS.md Snippet
# AGENTS.md — ViaDecide Studio

## Rules for all AI coding agents working in this repository --- **<HARD-GATE>** This tool must be used to generate the first Original Engineering Candidate Product Revision R0.1 from an ENGINEERING_CANDIDATE_READY Lab transfer, establishing the canonical engineering product record, immutable revision, controlled artifacts, requirements, materials, process definition, research provenance, evidence references, known limitations and open claims.

### Tool Directory Structure
Tool directory: tools/<tool>/
Required files:
- config.json
- index.html
- tool.js

Shared dependencies to import:
- shared/tool-storage.js
- shared/shared.css

config.json must include:
- id
- name
- description
- category
- audience
- inputs
- outputs
- tags

Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js
Router: add tool ID → entry path to static map in router.js

### Implementation Plan
1. Read README.md and AGENTS.md.
2. Audit architecture before coding. Summarize current behavior.
3. Preserve unrelated working code. Prefer additive modular changes.
4. Implement the smallest safe change set for the stated goal.
5. Run validation commands and fix discovered issues.
6. Self-review for regressions, missing env wiring, and docs drift.

### Implementation
This tool will generate the first Original Engineering Candidate Product Revision R0.1 from an ENGINEERING_CANDIDATE_READY Lab transfer, establishing the canonical engineering product record, immutable revision, controlled artifacts, requirements, materials, process definition, research provenance, evidence references, known limitations and open claims.

**Task 1: Read README.md and AGENTS.md**
This task involves reading the existing README.md and AGENTS.md files to understand the project's structure and constraints.

**Task 2: Audit architecture before coding. Summarize current behavior**
This task involves auditing the existing codebase to understand its current behavior, ensuring that any changes made are additive and do not break existing functionality.

**Task 3: Preserve unrelated working code. Prefer additive modular changes**
This task involves preserving any unrelated working code while making only additive and modular changes to fulfill the stated goal.

**Task 4: Implement the smallest safe change set for the stated goal**
This task involves implementing the smallest safe change set for the stated goal, following the implementation plan provided above.

**Task 5: Run validation commands and fix discovered issues**
This task involves running validation commands and fixing any discovered issues to ensure that the codebase remains stable and functional.

**Task 6: Self-review for regressions, missing env wiring, and docs drift**
This task involves self-revising the codebase for regressions, missing environment wiring, and documentation drift before submitting the final implementation.