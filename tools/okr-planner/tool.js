const ToolStorage = require('../shared/tool-storage');

function createPlan(plan) {
    try {
        const parsedPlan = JSON.parse(plan);
        ToolStorage.store('plan', parsedPlan);
        return { success: true, message: 'Plan stored successfully' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    createPlan
};