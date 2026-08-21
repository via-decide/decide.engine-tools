# AGENTS.md — ViaDecide Studio

## Rules for all AI coding agents working in this repository ---


### Tool Directory Structure
Tool directory: tools/<tool>/
Required files:
- config.json
- index.html
- tool.js

Shared dependencies to import:
- shared/tool-storage.js, shared/shared.css

config.json must include:
- id
- name
- description
- category
- audience
- inputs
- outputs
- tags

Registration: append "tools/<tool>" to importableToolDirs[] in shared/tool-registry.js

Router: add tool ID → entry path to static map in router.js