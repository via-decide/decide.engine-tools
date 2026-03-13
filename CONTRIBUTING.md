# Contributing

## Core rule

Preserve existing tool behavior first. Add capability without destructive rewrites.

## Before editing

1. Audit the repo and identify tool entry points.
2. Confirm which files are legacy user-facing tools.
3. Prefer additive changes in `/shared` and metadata files.

## For new or imported tools

- Keep tool runnable as standalone HTML app.
- Avoid external dependencies unless already required.
- Add `config.json` using the metadata contract in `ARCHITECTURE.md`.
- Add copy/download/export paths when practical.

## Interoperability hooks

Use lightweight hooks only:

- `ToolRegistry` for discovery
- `ToolBridge` for context send/receive
- `ToolStorage` for local state

Do not require all tools to adopt hooks immediately.

## Prohibited changes

- Deleting unrelated tool folders.
- Replacing rich tools with placeholders.
- Removing existing fields/outputs from active tools.
- Refactoring legacy tools solely for architecture aesthetics.

## Pull request checklist

- [ ] Existing behavior preserved for touched tools.
- [ ] Metadata added or updated.
- [ ] No unrelated files removed.
- [ ] Changes are additive and import-friendly.
- [ ] Future category routing remains deferred unless explicitly requested.

## New standalone orchestration pages

When adding orchestration UX (for example graph/workflow pages), keep them outside existing tool folders unless the change is explicitly tool-specific. Prefer shared adapters under `/shared` and keep direct tool entrypoints untouched.
