const toolStorage = require('../shared/tool-storage');

module.exports = {
    id: 'agent-console',
    name: 'Agent Console',
    description: 'The interface for managing and interacting with agents.',
    category: 'Development',
    audience: 'Developers',
    inputs: [],
    outputs: [],
    tags: ['agents', 'management'],
    config: toolStorage.getToolConfig('agent-console'),
    run: (context) => {
        try {
            console.log('Running Agent Console Tool');
            // Add agent console-specific logic here
        } catch (error) {
            console.error('Error running Agent Console Tool:', error);
        }
    }
};