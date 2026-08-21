let tools = [];

export function registerTool(tool) {
    if (!tool || typeof tool !== 'object') {
        throw new Error('Invalid input: tool must be an object');
    }
    tools.push(tool);
}

export function getTools() {
    return [...tools];
}