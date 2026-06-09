# Cross-Repo Communication Registry

## Purpose

`decide.engine-tools` needs a simple way to describe, discover, and coordinate with sibling `via-decide` repositories without turning this static browser site into a networked service. This registry documents which repositories can exchange planning context, what kinds of text data are safe to share, and how manual handoffs should be reviewed before any repo changes are made.

## Why this version is text/config-only

Version 1 is intentionally limited to source-controlled documentation, a static JSON registry, and a browser-safe helper. Text/config-only coordination keeps the system auditable in pull requests, avoids runtime permissions, avoids secrets, and preserves the repo's no-build static hosting model. Nothing in this version sends messages, calls GitHub, mutates another repository, or syncs with a backend.

## Supported communication modes

- **Manual handoff**: A human copies a reviewed text message from one repo into an issue, PR, task, or local planning note in another repo.
- **Shared manifest**: A repo may publish a text manifest that describes its identity, allowed data types, and safe coordination surfaces.
- **Static JSON registry**: `shared/repo-bridge.registry.json` lists known sibling repos and the text-only data types that may be discussed.
- **Future GitHub Actions handoff**: A later version may use reviewed workflow artifacts or issue templates, but this version does not add workflows or automation.
- **Future API/event bridge**: A later version may define a real event bridge after security review, but this version does not define live endpoints or make network calls.

## Explicit non-goals

- No secrets, credentials, tokens, private keys, or API keys.
- No live GitHub API calls, webhooks, or remote fetches.
- No backend sync, database writes, or server-side coordination.
- No generated binaries, archives, build artifacts, app packages, or media assets.
- No automatic mutation of this repo or any sibling repo.

## Repo identity format

Each repo entry should identify a repository with stable text fields:

```json
{
  "id": "game",
  "owner": "via-decide",
  "repo": "Game-",
  "role": "browser-game-prototype",
  "status": "planned-integration"
}
```

- `id` is the local registry identifier used by handoff messages.
- `owner` is the GitHub organization or account name.
- `repo` is the repository name only, not a credentialed URL.
- `role` describes the repo's coordination purpose.
- `status` describes whether integration is planned, active, paused, or deprecated.

## Message format

Handoff messages are plain JavaScript/JSON-compatible objects. They are created for human review and are not sent automatically.

```json
{
  "schemaVersion": 1,
  "fromRepo": "decide.engine-tools",
  "toRepo": "game",
  "type": "task",
  "title": "Describe score event shape",
  "body": "Document the text-only score event fields needed by Game-.",
  "createdAt": "2026-05-29T00:00:00.000Z",
  "safety": {
    "textOnly": true,
    "noSecrets": true,
    "noBinaries": true,
    "manualReviewRequired": true
  }
}
```

## Safety rules

- Treat every registry entry and handoff message as public source text.
- Review messages manually before copying them into another repo.
- Keep handoffs limited to allowed data types listed in the registry.
- Do not include credentials, tokens, private URLs, private customer data, binaries, or generated build artifacts.
- Do not assume a repo is writable just because it appears in the registry.
- Do not invent live endpoints; use `null` for unknown manifest or docs paths.

## How another repo should consume this registry

1. Read `shared/repo-bridge.registry.json` as static source text.
2. Validate that `schemaVersion` is supported and that `repos` is an array.
3. Match its repo identity by `owner` and `repo`, or by a documented local `id`.
4. Use only the listed `communicationModes` and `allowedDataTypes`.
5. Require manual review before converting any handoff into an issue, PR, commit, or task.

## How `decide.engine-tools` should consume another repo's manifest

1. Treat the sibling manifest as untrusted text until reviewed.
2. Confirm the sibling repo identity matches the expected `owner` and `repo`.
3. Compare allowed and disallowed data types before preparing a handoff.
4. Keep copied content text-only and source-reviewable.
5. Do not fetch the manifest at runtime unless a future reviewed task explicitly adds a safe transport layer.

## Example entry for `via-decide/Game-`

```json
{
  "id": "game",
  "owner": "via-decide",
  "repo": "Game-",
  "role": "browser-game-prototype",
  "status": "planned-integration",
  "communicationModes": ["manual-handoff", "static-manifest"],
  "allowedDataTypes": ["task", "roadmap", "score-event-spec", "asset-manifest"],
  "disallowedDataTypes": ["secret", "binary", "credential", "token", "build-artifact"],
  "entrypoints": {
    "repoUrl": "https://github.com/via-decide/Game-",
    "manifestPath": null,
    "docsPath": null
  },
  "notes": "Use text-only handoff tasks. Do not generate Play Store binaries or assets."
}
```

## Future task list

- Define a shared manifest filename for sibling repos.
- Add examples for future game, AI/agent, backend, and API repos.
- Add reviewed issue/PR templates for manual handoff workflows.
- Evaluate whether GitHub Actions artifacts can safely carry text-only handoffs.
- Design an API/event bridge only after security, privacy, and product review.
