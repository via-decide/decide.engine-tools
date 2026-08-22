const toolPathMap = {
  '/agents': require('./tools/agents/tool'),
  '/calculator': require('./tools/calculator/tool'),
  '/note-taker': require('./tools/note-taker/tool'),
  '/puzzle-generator': require('./tools/puzzle-generator/tool'),
  '/swot-analyzer': require('./tools/swot-analyzer/tool')
};

toolPathMap['/flashcard-engine'] = require('./tools/flashcard-engine/tool');

module.exports = { toolPathMap };