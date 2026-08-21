import { registerTool } from '../shared/tool-storage.js';

const agentConsole = {
  id: 'agent',
  name: 'Agent Console',
  description: 'Tool for managing and interacting with agents.',
  category: 'Tools',
  audience: ['operators', 'researchers'],
  inputs: [],
  outputs: [],
  tags: []
};

registerTool(agentConsole);