const fs = require('fs');
const path = require('../shared/tool-storage');

module.exports = {
  registerTool: async (toolId, entryPath) => {
    const toolsDir = path.join(__dirname, '../tools');
    if (!fs.existsSync(toolsDir)) {
      fs.mkdirSync(toolsDir);
    }
    await fs.promises.writeFile(path.join(toolsDir, `${toolId}.js`), `module.exports = require('./${entryPath}');`);
  },
};