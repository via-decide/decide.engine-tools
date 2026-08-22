const ToolStorage = require('../../shared/tool-storage');

function FormulaSheetBuilder() {
  this.state = { title: '', formulas: [], downloadLink: null };
}

FormulaSheetBuilder.prototype.render = function (container) {
  container.innerHTML = `
    <h2>Build your formula sheet</h2>
    <input type="text" id="titleInput" placeholder="Title" />
    <button onclick="addFormula()">Add Formula</button>
    <ul id="formulaList"></ul>
    <button onclick="buildSheet()">Build Sheet</button>
  `;
};

FormulaSheetBuilder.prototype.addFormula = function () {
  const formulaInput = document.getElementById('titleInput');
  this.state.formulas.push(formulaInput.value);
  formulaInput.value = '';
  this.renderFormulas();
};

FormulaSheetBuilder.prototype.renderFormulas = function () {
  const list = document.getElementById('formulaList');
  list.innerHTML = this.state.formulas.map((f) => `<li>${f}</li>`).join('');
};

FormulaSheetBuilder.prototype.buildSheet = async function () {
  try {
    const response = await fetch('/api/tool/latex', { method: 'POST', body: JSON.stringify(this.state) });
    if (response.ok) {
      this.state.downloadLink = await response.text();
      alert('Download link generated!');
    } else {
      throw new Error('Failed to build formula sheet');
    }
  } catch (error) {
    console.error(error);
    alert('Error building formula sheet: ' + error.message);
  }
};

FormulaSheetBuilder.prototype.getToolState = function () {
  return this.state;
};

FormulaSheetBuilder.prototype.setToolState = function (state) {
  this.state = state || { title: '', formulas: [], downloadLink: null };
};

module.exports = FormulaSheetBuilder;