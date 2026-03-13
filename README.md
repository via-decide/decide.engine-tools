# Decide Engine Tools

Preservation-first, browser-native tool mesh for ViaDecide.

## What this repository is

This repo hosts standalone decision and productivity tools that run directly in the browser with no build step.

The ecosystem is being prepared as an **import-friendly staging repo** so many solo tool repos can be absorbed over time without losing existing code.

## Preservation-first principles

- Never delete or simplify unrelated tools.
- Keep existing tool behavior intact.
- Prefer additive adapters, metadata, and shared helpers.
- Keep tools standalone HTML/CSS/JS whenever possible.

## Current structure

- `/shared` → lightweight interoperability layer (`tool-registry.js`, `tool-bridge.js`, `tool-storage.js`, `shared.css`)
- `/tools` → modular tools that already follow shared metadata conventions
- legacy standalone tool folders at root (for example: `prompt-alchemy`, `agent`, `founder`, `student-research`, etc.)

## Metadata model

Each tool can expose `config.json` with:

- `id`
- `name`
- `description`
- `category`
- `audience`
- `inputs`
- `outputs`
- `relatedTools`
- `entry`
- `tags`

This allows tool discovery without forcing destructive rewrites.

## Future category routing (not implemented yet)

Routing will later support folders and metadata for categories such as:

- creators
- gamers
- coders
- students
- researchers
- founders
- operators

This phase only prepares compatibility hooks and metadata for that routing.

## Open-source direction

The long-term goal is a browser-native tool network where tools can:

- open related tools,
- send context to other tools,
- receive context from other tools,
- return result context back into source workflows.

See also:

- `ARCHITECTURE.md`
- `CONTRIBUTING.md`
- `AGENTS.md`
