Here is the improved code:

// tools/formula-sheet/config.json
{
  "id": "formula-sheet",
  "name": "Formula Sheet Builder",
  "description": "Build and export LaTeX/plain formula sheets for students and teachers.",
  "category": "education",
  "audience": ["students", "teachers"],
  "inputs": [
    {
      "name": "equation",
      "type": "text",
      "required": true
    }
  ],
  "outputs": [
    {
      "name": "latex_sheet",
      "type": "file",
      "extension": ".tex"
    },
    {
      "name": "plain_sheet",
      "type": "file",
      "extension": ".txt"
    }
  ],
  "tags": ["math", "education"]
}

// tools/formula-sheet/index.html
<!DOCTYPE html>
<html>
<head>
  <title>Formula Sheet Builder</title>
  <link rel="stylesheet" href="../shared/shared.css">
</head>
<body>
  <h1>Formula Sheet Builder</h1>
  <form id="formula-sheet-form">
    <label for="equation">Enter equation:</label>
    <input type="text" id="equation" name="equation"><br><br>
    <button id="build-sheet-btn">Build Formula Sheet</button>
  </form>
  <div id="sheet-output"></div>

  <script src="../shared/tool-storage.js"></script>
  <script src="tool.js"></script>
</body>
</html>

// tools/formula-sheet/tool.js
const ToolStorage = require('../shared/tool-storage');

class FormulaSheetBuilder {
  constructor() {
    this.equation = '';
    this.latex_sheet = '';
    this.plain_sheet = '';
  }

  async buildFormulaSheet(equation) {
    // implement formula sheet building logic here
    const latex_code = `\\documentclass{article}
\\begin{document}
\\title{${equation}}
\\maketitle
${equation}
\\end{document}`;
    this.latex_sheet = latex_code;
    this.plain_sheet = equation;

    return { latex_sheet, plain_sheet };
  }

  async saveFormulaSheet() {
    const toolStorage = new ToolStorage();
    await toolStorage.saveToolData(this.id, this.equation, this.latex_sheet, this.plain_sheet);
  }
}

const formulaSheetBuilder = new FormulaSheetBuilder();

document.getElementById('build-sheet-btn').addEventListener('click', () => {
  const equationInput = document.getElementById('equation');
  const equation = equationInput.value;
  formulaSheetBuilder.buildFormulaSheet(equation).then((result) => {
    const latex_sheet_output = document.getElementById('sheet-output');
    latex_sheet_output.innerHTML = `LaTeX Sheet: ${result.latex_sheet}`;
    const plain_sheet_output = document.getElementById('sheet-output');
    plain_sheet_output.innerHTML += `<br>Plain Sheet: ${result.plain_sheet}`;

    formulaSheetBuilder.saveFormulaSheet();
  });
});

// shared/tool-registry.js
const toolRegistry = {};

toolRegistry.importableToolDirs = [..., 'tools/formula-sheet'];

module.exports = toolRegistry;

// router.js
const express = require('express');
const app = express();

app.use('/tools', express.static('tools'));

app.get('/tools/:toolPath*', (req, res) => {
  const toolPath = req.params.toolPath;
  if (toolPath === 'formula-sheet') {
    res.sendFile(__dirname + '/tools/formula-sheet/index.html');
  } else {
    res.status(404).send('Tool not found');
  }
});

module.exports = app;