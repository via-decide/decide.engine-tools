# Decide Engine — Unified Dashboard Interface

## Overview
Decide Engine is a browser-native decision and productivity platform by ViaDecide.
The repository now includes a unified dashboard shell that routes users into core modules while preserving standalone tools.

## Dashboard
Primary entry point:
- `dashboard/index.html`

Dashboard layout includes:
- Header
- Sidebar
- Workspace panel

Core sections exposed in the shell:
- Workspace
- StudyOS
- Tools
- Agent Console
- Settings

## Tools
Tool catalog entry point:
- `tools/index.html`

Catalog cards:
- Interview Practice
- LogicHub Builder
- Simulation Lab
- Prompt Studio

## Workspace
Workspace entry point:
- `workspace/index.html`

Session runtime:
- `workspace/session.js`

Workspace capabilities:
- Save progress to localStorage
- Restore last session
- Load and persist tool context
- Session key: `workspace.json`

## Agents
Agent entry point remains:
- `agent/index.html`

The dashboard and global navigation provide direct access to the Agent module for workflow execution.
