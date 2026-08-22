const ToolStorage = require('../../shared/tool-storage');

function createPlan() {
  const objective = document.getElementById('objective').value;
  const keyResults = [];
  // TODO: Implement logic to parse and store the plan in ToolStorage
  ToolStorage.set(`plan:${Date.now()}`, { objective, keyResults });
  alert('Plan Created!');
}