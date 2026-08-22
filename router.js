const express = require('express');
const app = express();

app.use('/api/tools', (req, res) => {
  const tools = [
    'tools/agents',
    'tools/calculators',
    'tools/guides',
    'tools/scheduling'
  ];
  
  if (req.query.id === 'swot-analyzer') {
    tools.push('tools/swot-analyzer');
  }
  
  res.json({ tools });
});

module.exports = app;