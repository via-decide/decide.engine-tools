# Decide Engine — Unified Dashboard Interface

## Overview
Decide Engine is a browser-native decision and productivity platform by ViaDecide. The repository now includes a unified dashboard shell that routes users into core modules while preserving standalone tools.

## Requirements
This project requires Node.js version 14 or higher, npm, and Git. Ensure you have the necessary permissions to install dependencies and run the application.

## Materials
- [Orchade AI-powered game engine](https://github.com/orchade/ai-game-engine)
- [Asset management system for rendering pipeline](https://github.com/via-decide/asset-management)

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
Tool storage and management are handled by the shared/tool-storage.js file.