# Shared Module Catalog (StudyOS extraction candidates)

Source repository: `decide.engine-tools`

## StudyOS core/tool systems
- `shared/tool-registry.js`: runtime tool discovery, categories, plugin registration, tool graph, and LLM router.
- `shared/tool-bridge.js`: cross-tool context transfer and handoff.
- `shared/engine-utils.js`: shared scoring/parser helpers.
- `StudyOS/tool-integration.js`: StudyOS tool browser + category filtering UI.

## UI components
- `StudyOS/components/CorpusSearchPanel.tsx`
- `StudyOS/components/DocumentViewer.tsx`
- `StudyOS/components/SourceExplorer.tsx`
- `StudyOS/components/KnowledgeGraph.tsx`

## Corpus document reader
- `StudyOS/api/nex_client.ts`: corpus search/document/sources/summary HTTP client.
- `StudyOS/components/DocumentViewer.tsx`: chunk rendering + incremental loading.

## Knowledge graph components
- `StudyOS/components/KnowledgeGraph.tsx`: lightweight node/edge graph rendering and document-node callbacks.

## Research utilities
- `StudyOS/services/summary_engine.ts`
- `StudyOS/services/zayvora_reasoning.ts`

## Reuse strategy
- Keep StudyOS browser-first modules unchanged.
- Expose Python-side adapters that call StudyOS-compatible HTTP endpoints.
- Keep adapters thin and non-invasive to avoid breaking existing JS tooling.
