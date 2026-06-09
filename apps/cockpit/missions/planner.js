const fs = require('fs');
const path = require('path');

class ImprovementPlanner {
  constructor(repoPath) {
    this.repoPath = path.resolve(repoPath);
  }

  async plan(scanResults, mission = "Make decide.engine-tools architecture world class") {
    console.log(`[Improvement Planner] Formulating improvement plan for mission: "${mission}"`);

    const planPath = path.join(this.repoPath, 'IMPROVEMENT_PLAN.md');
    const planContent = this._generatePlanContent(scanResults, mission);

    await fs.promises.writeFile(planPath, planContent);
    console.log(`[Improvement Planner] Improvement plan written to: ${planPath}`);

    return {
      planPath,
      proposedChangesCount: 11, // Restructuring targets
      estimatedComplexity: 'Medium',
      estimatedSavings: {
        tokens: '120k',
        time: '3-4 days',
        credits: 15.00
      }
    };
  }

  _generatePlanContent(scanResults, mission) {
    const isArchitectureMission = mission.toLowerCase().includes('architecture') || mission.toLowerCase().includes('world class');
    const debt = scanResults.techDebt;
    const arch = scanResults.architecture;

    let content = `# Improvement Plan\n\n`;
    content += `Mission: **${mission}**\n`;
    content += `Generated at: ${new Date().toISOString()}\n\n`;

    content += `## User Review Required\n\n`;
    content += `> [!IMPORTANT]\n`;
    content += `> This plan proposes migrating the folder hierarchy from a flat layout to a structured monorepo structure. \n`;
    content += `> To prevent breaking external URLs and deep-links, backward-compatible symlinks or routing fallbacks should be created in the main entrypoints.\n\n`;

    content += `## Executive Analysis\n\n`;
    content += `- **Repository Complexity:** High (${arch.totalFiles} files detected across multiple layers)\n`;
    content += `- **Identified Technical Debt:**\n`;
    content += `  - TODO items: ${debt.todoList.length}\n`;
    content += `  - Empty error catches: ${debt.emptyCatches.length}\n`;
    content += `  - Duplicate block patterns: ${debt.duplicateBlocks.length}\n`;
    content += `  - Unsafe evals: ${debt.evalList.length}\n\n`;

    if (isArchitectureMission) {
      content += `## Proposed Architecture Restructuring (World Class Target)\n\n`;
      content += `The target state converts the flat directory into a modern structure:\n\n`;
      content += `\`\`\`\n`;
      content += `decide.engine-tools/\n`;
      content += `├── apps/                   # Sub-applications\n`;
      content += `│   ├── studyos/            # StudyOS app components\n`;
      content += `│   └── cockpit-v2/         # Operator console web application\n`;
      content += `├── packages/               # Shared libraries and configuration\n`;
      content += `│   ├── shared-foundation/  # tool-registry, storage, tool-bridge\n`;
      content += `│   └── engine-core/        # calculation models and utilities\n`;
      content += `├── agents/                 # Autonomous code agents\n`;
      content += `│   └── antigravity-code/   # Self-improvement loops\n`;
      content += `├── prompts/                # Prompt templates and alchemy resources\n`;
      content += `├── docs/                   # ADRs, API specs, and walk-throughs\n`;
      content += `├── tests/                  # Unit and smoke test folders\n`;
      content += `├── architecture/           # Boundary configurations & diagrams\n`;
      content += `├── telemetry/              # Token, execution, and cost trackers\n`;
      content += `├── cockpit/                # Frontend control panel assets\n`;
      content += `├── vault/                  # AI execution traces\n`;
      content += `└── automation/             # Self-improving automated hooks & cron scripts\n`;
      content += `\`\`\`\n\n`;

      content += `### Recommended Migration Roadmap:\n\n`;
      content += `1. **[MODIFY] Create folders:** Initialize \`apps/\`, \`packages/\`, \`vault/traces/\`, \`telemetry/\`, \`prompts/\`, \`docs/\`.\n`;
      content += `2. **[MODIFY] Consolidate utilities:** Move files under \`shared/\` into \`packages/shared-foundation/\`.\n`;
      content += `3. **[MODIFY] Bundle engine models:** Move \`shared/engine-models.js\` and \`shared/engine-utils.js\` into \`packages/engine-core/\`.\n`;
      content += `4. **[MODIFY] Reposition StudyOS:** Move the standalone \`StudyOS\` directory under \`apps/studyos/\`.\n`;
      content += `5. **[MODIFY] Reposition Cockpit:** Move \`shared/VIA-COCKPIT.html\` and create corresponding integration code in \`cockpit/\`.\n`;
    }

    content += `\n## Tech Debt Remediation Tasks\n\n`;
    if (debt.evalList.length > 0) {
      content += `### Task 1: Replace Unsafe Evals\n`;
      content += `- **Description:** Eliminate direct evals in the repository to prevent potential injection risks.\n`;
      content += `- **Impact:** High | **Complexity:** Medium\n`;
      content += `- **Recommendation:** Replace \`eval()\` references in the following files with secure JSON parsing or structured mapping:\n`;
      for (const item of debt.evalList.slice(0, 3)) {
        content += `  - \`${item.file}\` (Line: ${item.line}): \`${item.text}\`\n`;
      }
      content += `\n`;
    }

    if (debt.emptyCatches.length > 0) {
      content += `### Task 2: Log Silent / Empty Catch Blocks\n`;
      content += `- **Description:** Ensure unexpected exceptions are not silently suppressed without observability.\n`;
      content += `- **Impact:** Medium | **Complexity:** Low\n`;
      content += `- **Recommendation:** Inject error logging metrics in catch handlers. Focus first on:\n`;
      for (const item of debt.emptyCatches.slice(0, 3)) {
        content += `  - \`${item.file}\` (Line: ${item.line}): \`${item.text}\`\n`;
      }
      content += `\n`;
    }

    if (debt.duplicateBlocks.length > 0) {
      content += `### Task 3: Extract Duplicate Sequences\n`;
      content += `- **Description:** Clean repeating long blocks to improve reuse and ease of updates.\n`;
      content += `- **Impact:** Medium | **Complexity:** Medium\n`;
      content += `- **Recommendation:** Consolidate matching snippets into utility methods. Focus on duplicate files:\n`;
      for (const block of debt.duplicateBlocks.slice(0, 2)) {
        content += `  - Duplicate block found across: ${block.locations.slice(0, 2).map(l => `\`${l}\``).join(' and ')}\n`;
      }
      content += `\n`;
    }

    content += `## Verification Protocol\n\n`;
    content += `1. **Compilation Check:** Run syntax validation on modified files.\n`;
    content += `2. **Unit Suite:** Run \`npm run test:unit\` to guarantee core calculators are unaffected.\n`;
    content += `3. **Smoke Check:** Run \`npm run test:smoke\` to verify web layout loads cleanly.\n`;

    return content;
  }
}

module.exports = ImprovementPlanner;
