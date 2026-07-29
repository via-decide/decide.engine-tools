# Synthesis Summary

## Dashboard Shell
- **Type**: HTML + JavaScript
- **Location**: dashboard/index.html, tools/shared/tool-storage.js
- **Description**: The primary entry point for users. It routes them into core modules (Workspace, StudyOS, Tools, Agent Console, Settings) while preserving standalone tools.

## Standalone Tool Pages
- **Tool Builder**
  - **Type**: HTML + JavaScript
  - **Location**: tools/agent-builder/index.html, tools/agent-builder/tool.js
  - **Description**: Allows users to build and manage agents.
  
- **World Station**
  - **Type**: HTML + JavaScript
  - **Location**: tools/world_station/index.html, tools/world_station/tool.js
  - **Description**: Provides a platform for world-building tasks.

- **Reality Check**
  - **Type**: HTML + JavaScript
  - **Location**: tools/reality-check/index.html, tools/reality-check/tool.js
  - **Description**: Allows users to verify and manage reality checks.

- **Opportunity Radar**
  - **Type**: HTML + JavaScript
  - **Location**: tools/opportunity-radar/index.html, tools/opportunity-radar/tool.js
  - **Description**: Helps users identify opportunities through data analysis.

- **Bootstrap Station**
  - **Type**: HTML + JavaScript
  - **Location**: tools/bootstrap_station/index.html, tools/bootstrap_station/tool.js
  - **Description**: Provides a platform for bootstrapping tasks.

## Directories
- **Mesh**
  - **Type**: Unknown (No index.html or tool.js found)
  - **Location**: mesh/
  - **Description**: Contains unknown files. No clear definition of its purpose.
  
- **Founder**
  - **Type**: Unknown (No index.html or tool.js found)
  - **Location**: founder/
  - **Description**: Contains unknown files. No clear definition of its purpose.
  
- **Continuity**
  - **Type**: Unknown (No index.html or tool.js found)
  - **Location**: continuity/
  - **Description**: Contains unknown files. No clear definition of its purpose.
  
- **Consensus**
  - **Type**: Unknown (No index.html or tool.js found)
  - **Location**: consensus/
  - **Description**: Contains unknown files. No clear definition of its purpose.
  
- **Experimental**
  - **Type**: HTML + JavaScript
  - **Location**: tools/experimental/index.html, tools/experimental/tool.js
  - **Description**: Tools that are still in development or experimental phase.

- **Resolved Contexts**
  - **Type**: Unknown (No index.html or tool.js found)
  - **Location**: resolved_contexts/
  - **Description**: Contains unknown files. No clear definition of its purpose.
  
- **Firmware**
  - **Type**: Unknown (No index.html or tool.js found)
  - **Location**: firmware/
  - **Description**: Contains unknown files. No clear definition of its purpose.

## Real Interdependencies
- The dashboard shell depends on the standalone tools through shared/tool-storage.js and router.js.