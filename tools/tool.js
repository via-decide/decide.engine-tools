import { registerTool } from '../shared/tool-storage.js';

const tool = {
    id: 'example',
    name: 'Example Tool',
    description: 'This is an example tool.',
    category: 'Tools',
    audience: 'All users',
    inputs: [],
    outputs: [],
    tags: ['example', 'tool']
};

registerTool(tool);