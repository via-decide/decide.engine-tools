const ToolStorage = require('../../shared/tool-storage');

function LeanCanvasBuilder() {
  this.id = 'lean-canvas';
}

LeanCanvasBuilder.prototype.render = function () {
  const toolStorage = new ToolStorage();
  // TODO: Implement the actual canvas builder logic here.
};

module.exports = LeanCanvasBuilder;