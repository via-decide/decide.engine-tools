/**
 * Agent Wrapper for ViaDecide Engine Tools
 * 
 * Provides a standardized API for tools to accept a one-line prompt,
 * execute their core logic, and return structured Markdown/HTML content
 * suitable for viadecide.com automatic rendering.
 */

class AgentWrapper {
  /**
   * Initialize the agent wrapper for a specific tool.
   * @param {string} toolId - The unique identifier of the tool.
   * @param {Function} executionHandler - The core logic of the tool: async (prompt) => { return data; }
   * @param {Function} formatHandler - The formatting logic: (data) => { return markdownString; }
   */
  constructor(toolId, executionHandler, formatHandler) {
    this.toolId = toolId;
    this.executionHandler = executionHandler;
    this.formatHandler = formatHandler;
  }

  /**
   * Execute the tool with a single prompt string.
   * @param {string} prompt - The one-line prompt from the user.
   * @returns {Promise<Object>} An object containing the raw data and the formatted post.
   */
  async runOneLineToPost(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error(`[${this.toolId}] Invalid prompt provided to agent wrapper.`);
    }

    try {
      console.log(`[${this.toolId}] Starting execution for prompt: "${prompt.substring(0, 50)}..."`);
      
      // Step 1: Execute tool logic to generate structured data
      const data = await this.executionHandler(prompt);
      
      // Step 2: Format the data into Markdown or HTML for viadecide.com
      const formattedPost = this.formatHandler(data);
      
      console.log(`[${this.toolId}] Execution complete. Formatted post ready.`);
      
      return {
        toolId: this.toolId,
        success: true,
        originalPrompt: prompt,
        rawData: data,
        formattedContent: formattedPost,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[${this.toolId}] Execution failed:`, error);
      return {
        toolId: this.toolId,
        success: false,
        originalPrompt: prompt,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = { AgentWrapper };
