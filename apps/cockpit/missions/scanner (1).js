const fs = require('fs');
const path = require('path');

class RepoScanner {
  constructor(repoPath) {
    this.repoPath = path.resolve(repoPath);
    this.excludeDirs = ['node_modules', '.git', '.vercel', 'artifacts', 'vault', 'backups', '.claude', '.codex', '.next', 'build'];
  }

  async scan() {
    console.log(`[Repo Scanner] Initializing recursive scan of: ${this.repoPath}`);
    const files = [];
    await this._walk(this.repoPath, files);

    const architecture = this._analyzeArchitecture(files);
    const techDebt = this._analyzeTechDebt(files);

    const archReport = this._generateArchitectureReport(architecture);
    const debtReport = this._generateTechDebtReport(techDebt);

    const archReportPath = path.join(this.repoPath, 'ARCHITECTURE_REPORT.md');
    const debtReportPath = path.join(this.repoPath, 'TECH_DEBT_REPORT.md');

    await fs.promises.writeFile(archReportPath, archReport);
    await fs.promises.writeFile(debtReportPath, debtReport);

    console.log(`[Repo Scanner] Architecture report written to: ${archReportPath}`);
    console.log(`[Repo Scanner] Tech debt report written to: ${debtReportPath}`);

    return {
      filesScanned: files.length,
      architecture,
      techDebt,
      archReportPath,
      debtReportPath
    };
  }

  async _walk(dir, fileList) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const res = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (this.excludeDirs.includes(entry.name)) continue;
        await this._walk(res, fileList);
      } else {
        fileList.push(res);
      }
    }
  }

  _analyzeArchitecture(files) {
    const extCounts = {};
    const categories = {
      shared: [],
      tools: [],
      engine: [],
      games: [],
      root: []
    };
    const dependencies = {};

    for (const file of files) {
      const relPath = path.relative(this.repoPath, file);
      const ext = path.extname(file).toLowerCase();
      extCounts[ext] = (extCounts[ext] || 0) + 1;

      // Classify into architecture layers
      if (relPath.startsWith('shared/')) {
        categories.shared.push(relPath);
      } else if (relPath.startsWith('tools/engine/')) {
        categories.engine.push(relPath);
      } else if (relPath.startsWith('tools/games/')) {
        categories.games.push(relPath);
      } else if (relPath.startsWith('tools/')) {
        categories.tools.push(relPath);
      } else if (!relPath.includes('/')) {
        categories.root.push(relPath);
      }

      // Check JS and HTML dependencies
      if (ext === '.js' || ext === '.html') {
        try {
          const content = fs.readFileSync(file, 'utf8');
          const fileDeps = [];

          // Regex matching script src imports in HTML
          if (ext === '.html') {
            const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
            let match;
            while ((match = scriptRegex.exec(content)) !== null) {
              fileDeps.push(match[1]);
            }
          }
          // Regex matching ES6/CommonJS imports in JS
          if (ext === '.js') {
            const importRegex = /(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/gi;
            const staticImportRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/gi;
            const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/gi;
            let match;
            while ((match = importRegex.exec(content)) !== null) fileDeps.push(match[1]);
            while ((match = staticImportRegex.exec(content)) !== null) fileDeps.push(match[1]);
            while ((match = requireRegex.exec(content)) !== null) fileDeps.push(match[1]);
          }

          if (fileDeps.length > 0) {
            dependencies[relPath] = [...new Set(fileDeps)];
          }
        } catch (e) {
          // Silent catch on read failure
        }
      }
    }

    return {
      extCounts,
      categories,
      dependencies,
      totalFiles: files.length
    };
  }

  _analyzeTechDebt(files) {
    const todoList = [];
    const evalList = [];
    const emptyCatches = [];
    const lineMap = {};
    const duplicateBlocks = [];

    const todoRegex = /(\/\/|\/\*)\s*(TODO|FIXME|XXX)\b/i;
    const evalRegex = /\beval\s*\(/;
    const emptyCatchRegex = /catch\s*\([^)]*\)\s*\{\s*(?:\/\/.*|\/\*[\s\S]*?\*\/)?\s*\}/;

    for (const file of files) {
      const relPath = path.relative(this.repoPath, file);
      const ext = path.extname(file).toLowerCase();
      if (!['.js', '.ts', '.html', '.css'].includes(ext)) continue;

      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');

        // Check line-by-line
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = i + 1;

          // Check TODO/FIXME
          if (todoRegex.test(line)) {
            todoList.push({ file: relPath, line: lineNum, text: line.trim() });
          }

          // Check eval
          if (evalRegex.test(line)) {
            evalList.push({ file: relPath, line: lineNum, text: line.trim() });
          }

          // Simple line matching for code duplication (minimum 5 non-trivial lines matching)
          const trimmed = line.trim();
          if (trimmed.length > 15 && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
            if (!lineMap[trimmed]) {
              lineMap[trimmed] = [];
            }
            lineMap[trimmed].push({ file: relPath, line: lineNum });
          }
        }

        // Check for empty/silent catch blocks using a sliding window or global regex match
        let catchMatch;
        const catchGlobalRegex = /catch\s*\([^)]*\)\s*\{\s*(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/|\s)*\}/g;
        while ((catchMatch = catchGlobalRegex.exec(content)) !== null) {
          const lineNum = content.substring(0, catchMatch.index).split('\n').length;
          // Verify if it is really empty or just silently logs (like console.warn)
          const matchedText = catchMatch[0];
          emptyCatches.push({ file: relPath, line: lineNum, text: matchedText.replace(/\s+/g, ' ') });
        }

      } catch (e) {
        // Silent catch on read failure
      }
    }

    // Process duplicate blocks from lineMap
    const duplicates = {};
    for (const [lineText, occurrences] of Object.entries(lineMap)) {
      if (occurrences.length > 1) {
        const key = occurrences.map(o => `${o.file}:${o.line}`).join(' | ');
        duplicates[key] = (duplicates[key] || 0) + 1;
      }
    }

    for (const [locations, count] of Object.entries(duplicates)) {
      if (count >= 3) { // 3 or more repeating long lines indicates a block match
        duplicateBlocks.push({ locations: locations.split(' | '), lineCount: count });
      }
    }

    return {
      todoList,
      evalList,
      emptyCatches,
      duplicateBlocks
    };
  }

  _generateArchitectureReport(architecture) {
    let report = `# Architecture Report\n\n`;
    report += `Generated at: ${new Date().toISOString()}\n\n`;
    report += `## Repository Overview\n\n`;
    report += `- **Total Files Checked:** ${architecture.totalFiles}\n`;
    report += `- **Layer Breakdown:**\n`;
    report += `  - Shared Utilities: ${architecture.categories.shared.length} files\n`;
    report += `  - Games: ${architecture.categories.games.length} files\n`;
    report += `  - Orchard Engine Layer: ${architecture.categories.engine.length} files\n`;
    report += `  - Modular Tools: ${architecture.categories.tools.length} files\n`;
    report += `  - Root-Level Hub/Router: ${architecture.categories.root.length} files\n\n`;

    report += `## File Types Distribution\n\n`;
    report += `| Extension | Count |\n|---|---|\n`;
    for (const [ext, count] of Object.entries(architecture.extCounts)) {
      report += `| \`${ext || '(no ext)'}\` | ${count} |\n`;
    }
    report += `\n`;

    report += `## Modular Naming Conventions & Boundaries\n\n`;
    const violationList = [];

    // Naming checks
    for (const relPath of [...architecture.categories.tools, ...architecture.categories.engine]) {
      const filename = path.basename(relPath);
      if (filename.endsWith('.html') && filename !== 'index.html') {
        violationList.push(`- Non-standard file structure: HTML entry points in tools should be named \`index.html\` (Found: \`${relPath}\`)`);
      }
    }

    if (violationList.length > 0) {
      report += `⚠️ **Boundary & naming alerts detected:**\n\n${violationList.join('\n')}\n\n`;
    } else {
      report += `✅ All tools satisfy naming boundary standards (clean standalone layouts).\n\n`;
    }

    report += `## Dependency Graph Map\n\n`;
    report += `\`\`\`mermaid\ngraph TD\n`;
    for (const [file, deps] of Object.entries(architecture.dependencies)) {
      const baseFile = path.basename(file);
      for (const dep of deps) {
        if (dep.startsWith('.') || dep.startsWith('shared/')) {
          const baseDep = path.basename(dep);
          report += `    "${baseFile}" --> "${baseDep}"\n`;
        }
      }
    }
    report += `\`\`\`\n`;

    return report;
  }

  _generateTechDebtReport(techDebt) {
    let report = `# Technical Debt Report\n\n`;
    report += `Generated at: ${new Date().toISOString()}\n\n`;

    const debtScore = techDebt.todoList.length * 1 +
                      techDebt.emptyCatches.length * 3 +
                      techDebt.evalList.length * 10 +
                      techDebt.duplicateBlocks.length * 5;

    report += `## Summary Dashboard\n\n`;
    report += `- **Debt Health Score:** ${debtScore} (Lower is better)\n`;
    report += `- **TODO / FIXME Flags:** ${techDebt.todoList.length}\n`;
    report += `- **Unsafe \`eval()\` Statements:** ${techDebt.evalList.length}\n`;
    report += `- **Silent/Empty Catch Blocks:** ${techDebt.emptyCatches.length}\n`;
    report += `- **Duplicate Code Patterns:** ${techDebt.duplicateBlocks.length}\n\n`;

    report += `## Unsafe Evals (\`eval()\`) Detail\n\n`;
    if (techDebt.evalList.length === 0) {
      report += `✅ No eval() statements found.\n\n`;
    } else {
      report += `| File | Line | Snippet |\n|---|---|---|\n`;
      for (const item of techDebt.evalList) {
        report += `| \`${item.file}\` | ${item.line} | \`${item.text}\` |\n`;
      }
      report += `\n`;
    }

    report += `## Silent Catch Blocks Detail\n\n`;
    if (techDebt.emptyCatches.length === 0) {
      report += `✅ No empty catch blocks found.\n\n`;
    } else {
      report += `| File | Line | Block Context |\n|---|---|---|\n`;
      for (const item of techDebt.emptyCatches) {
        report += `| \`${item.file}\` | ${item.line} | \`${item.text}\` |\n`;
      }
      report += `\n`;
    }

    report += `## Duplicate Code Block Sequences\n\n`;
    if (techDebt.duplicateBlocks.length === 0) {
      report += `✅ No matching duplicate blocks found.\n\n`;
    } else {
      for (let i = 0; i < techDebt.duplicateBlocks.length; i++) {
        const block = techDebt.duplicateBlocks[i];
        report += `### Duplicate Group #${i + 1} (${block.lineCount} matching lines)\n`;
        for (const loc of block.locations) {
          report += `- \`${loc}\`\n`;
        }
        report += `\n`;
      }
    }

    report += `## TODO / FIXME Backlog\n\n`;
    if (techDebt.todoList.length === 0) {
      report += `✅ Clean backlog. No TODOs found.\n\n`;
    } else {
      report += `| File | Line | Task Description |\n|---|---|---|\n`;
      for (const item of techDebt.todoList) {
        report += `| \`${item.file}\` | ${item.line} | ${item.text.replace(/^(\/\/|\/\*)\s*/, '')} |\n`;
      }
      report += `\n`;
    }

    return report;
  }
}

module.exports = RepoScanner;
