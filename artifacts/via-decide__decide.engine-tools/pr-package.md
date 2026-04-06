Branch: simba/create-corpus-document-reader-for-studyos-so-use
Title: Create corpus document reader for StudyOS so users can open text chun...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create corpus document reader for StudyOS so users can open text chunks from the Nex corpus.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.