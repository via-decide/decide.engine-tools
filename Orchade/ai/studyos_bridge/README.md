# ai/studyos_bridge

Bridge for Orchade NPC systems to pull corpus/search summaries from StudyOS-compatible services.

## Usage

1. Install shared package from workspace root:

```bash
pip install -e workspace/shared
```

2. In Orchade AI flows, use `OrchadeStudyOSBridge.enrich_context()` before Zayvora decisioning.
