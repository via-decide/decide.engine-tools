Branch: simba/create-the-headless-server-docker-packager-via-s
Title: Create the Headless Server Docker Packager (via-server-deploy). 1. Bu...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Automate the deployment of multiplayer game servers to the cloud, bridging the native engine tools with web infrastructure while keeping the commit velocity high.

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.