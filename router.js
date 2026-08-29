const express = require('express');
const path = require('path');

const app = express();

// Static file serving for tools
app.use('/tools', express.static(path.join(__dirname, 'tools')));

// Tool registration
const toolRegistry = require('./shared/tool-registry').importableToolDirs;

if (!Array.isArray(toolRegistry)) {
  throw new Error('toolRegistry must be an array');
}

toolRegistry.forEach(toolDir => {
  const toolId = path.basename(toolDir);
  if (typeof toolId !== 'string') {
    throw new Error(`Invalid toolId: ${toolId}`);
  }
  app.use(`/api/tools/${toolId}`, express.static(path.join(__dirname, toolDir)));
});

module.exports = app;