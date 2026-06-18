# Workspace Architecture — StudyOS, Zayvora Toolkit, Orchade

## Ecosystem roles

- **StudyOS (`decide.engine-tools`)**: browser-first research operating system (UI, corpus search, knowledge graph).
- **Zayvora Toolkit**: Python reasoning layer that consumes StudyOS corpus/research signals.
- **Orchade**: simulation/game world where NPC behavior can be informed by Zayvora + StudyOS context.

## Polyglot model

StudyOS remains JavaScript/HTML/CSS and exposes compatible HTTP endpoints.
Python runtimes consume these endpoints via thin adapters packaged in `workspace/shared/`.

## Shared package layout

```
workspace/shared/
  studyos_core/      # HTTP bridge client
  research_tools/    # synthesis helpers
  ui_components/     # metadata mapping for reusable StudyOS UI components
  corpus_reader/     # document chunk reader helpers
```

Install from workspace root:

```bash
pip install -e workspace/shared
```

## Integration flow

1. NPC query/context is prepared in Orchade.
2. Orchade bridge (`ai/studyos_bridge`) enriches context using StudyOS corpus + summary APIs.
3. Zayvora bridge reasons over enriched payload.
4. NPC action is selected and applied to simulation state.

## Notes

- Browser-side StudyOS modules remain unchanged.
- Python-side bridges are intentionally defensive and include fallback behavior when StudyOS service is offline.
- This enables gradual migration to dedicated external repos once network-level cloning/pushing is available.
