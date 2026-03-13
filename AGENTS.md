# AGENTS.md — repository rules

Scope: entire repository.

## Mission

Treat this repo as a preservation-first staging mesh for many standalone tool repos.

## Non-destructive requirements

- Never delete unrelated files or folders.
- Never reduce existing tool capability to fit new architecture.
- Never replace real tools with placeholders.
- If migration is incomplete, wrap with metadata/adapters and preserve original code.

## Workflow requirements

1. Audit before editing.
2. Identify user-facing tools and preserve behavior.
3. Prefer additive changes in shared utilities and metadata.
4. Keep standalone HTML tools runnable with no build step when possible.
5. Prepare for future category routing without implementing final routing unless requested.

## Interop strategy

- Use lightweight registry and bridge utilities.
- Allow gradual adoption across legacy and imported tools.
- Preserve backward compatibility when modifying shared APIs.

## Output discipline for agents

- Return complete contents for every modified/created file when requested.
- Do not omit touched files.
- Do not cut unrelated code.
