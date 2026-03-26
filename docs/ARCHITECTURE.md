# Architecture (docs mirror)

For the canonical architecture document, see `/ARCHITECTURE.md`.

This repository is being prepared as a preservation-first, import-friendly browser tool mesh with lightweight shared adapters and deferred category routing.
# Architecture

## Overview

The ecosystem follows a **modular standalone-app architecture**:

- Every tool is an independent HTML app.
- Shared assets are lightweight and optional.
- Tools communicate indirectly through exported artifacts and shared conventions.

## Folder Model

- `/tools/<id>/index.html`: standalone UI shell.
- `/tools/<id>/tool.js`: behavior and transformations.
- `/tools/<id>/config.json`: machine-readable metadata.
- `/shared`: common CSS, registry, and storage helpers.
- `/docs`: ecosystem and architecture docs.

## Config Metadata Contract

Each `config.json` follows this shape:

```json
{
  "id": "tool-id",
  "name": "Human Name",
  "description": "Purpose",
  "inputs": ["input_a"],
  "outputs": ["output_a"],
  "relatedTools": ["other-tool-id"]
}
```

This metadata will later support discovery, routing, and automation.

## Data Interop Pattern

Current interop is lightweight:

1. Tool output is generated in plain text/markdown/json form.
2. User copies or downloads output.
3. Output can be pasted into another tool.

Future routing layers can automate this transfer using config metadata.

## Importability Into Solo Repos

Because each tool is standalone and dependency-free, importing is simple:

1. Copy `/tools/<id>` and `/shared` into target repo.
2. Open `index.html` directly or serve statically.
3. Optional: trim shared files to only what that tool needs.

No package manager, bundler, or framework integration is required.

## Deferred Components

The following are intentionally not implemented in this phase:

- persona/category routing rules,
- dynamic tool orchestration,
- backend syncing for template and artifact sharing.
