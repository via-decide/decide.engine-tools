/* shared/ai_dispatcher.js — ViaDecide AI Dispatcher
 * Routes LLM calls to Claude or Gemini based on task type.
 * Exposes: window.VDDispatcher
 *
 * Config (set before loading this script):
 *   window.VD_CONFIG = { claudeApiKey: '...', geminiApiKey: '...' }
 * Fallback: window.__GN8R_CONFIG__ (tool-registry.js pattern)
 */
(function (global) {
  'use strict';

  // Tasks best suited for Claude (structured / logic-heavy)
  var CLAUDE_TASKS = ['json_schema', 'logic_tree', 'code_output', 'structured_spec', 'evaluation'];

  // Tasks best suited for Gemini (fast summarization / creative)
  var GEMINI_TASKS = ['summarization', 'rewrite', 'brainstorm', 'title_gen', 'translation'];

  var CLAUDE_ENDPOINT = 'https://api.anthropic.com/v1/messages';
  var GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  function getConfig() {
    return global.VD_CONFIG || global.__GN8R_CONFIG__ || {};
  }

  /* ── Retry with exponential backoff + jitter ─────────────────────────── */
  function _withRetry(fn, maxRetries) {
    var retries = maxRetries !== undefined ? maxRetries : 3;
    var baseDelay = 500;

    function attempt(n) {
      return fn().catch(function (err) {
        if (n >= retries) return Promise.reject(err);
        var delay = baseDelay * Math.pow(2, n) + Math.random() * 500;
        return new Promise(function (resolve) {
          setTimeout(function () { resolve(attempt(n + 1)); }, delay);
        });
      });
    }

    return attempt(0);
  }

  /* ── Claude call ─────────────────────────────────────────────────────── */
  function _claudeCall(payload) {
    var config = getConfig();
    var apiKey = config.claudeApiKey || config.claude_api_key || '';
    if (!apiKey) return Promise.reject(new Error('VDDispatcher: No Claude API key configured'));

    var body = {
      model: payload.model || 'claude-sonnet-4-6',
      max_tokens: payload.max_tokens || 1024,
      messages: payload.messages || [{ role: 'user', content: payload.prompt || '' }]
    };
    if (payload.system) body.system = payload.system;

    return fetch(CLAUDE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true'
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error('Claude error ' + res.status + ': ' + t); });
      return res.json();
    }).then(function (data) {
      return {
        provider: 'claude',
        text: (data.content && data.content[0] && data.content[0].text) || '',
        raw: data
      };
    });
  }

  /* ── Gemini call ─────────────────────────────────────────────────────── */
  function _geminiCall(payload) {
    var config = getConfig();
    var apiKey = config.geminiApiKey || config.gemini_api_key || '';
    if (!apiKey) return Promise.reject(new Error('VDDispatcher: No Gemini API key configured'));

    var url = GEMINI_ENDPOINT + '?key=' + encodeURIComponent(apiKey);
    var parts = [];
    if (payload.system) parts.push({ text: payload.system + '\n\n' });
    parts.push({ text: payload.prompt || (payload.messages && payload.messages[0] && payload.messages[0].content) || '' });

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: parts }] })
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error('Gemini error ' + res.status + ': ' + t); });
      return res.json();
    }).then(function (data) {
      var text = '';
      try { text = data.candidates[0].content.parts[0].text; } catch (e) {}
      return { provider: 'gemini', text: text, raw: data };
    });
  }

  /* ── Route selection ─────────────────────────────────────────────────── */
  function _selectProvider(taskType, mode) {
    if (mode === 'claude') return 'claude';
    if (mode === 'gemini') return 'gemini';
    if (CLAUDE_TASKS.indexOf(taskType) !== -1) return 'claude';
    if (GEMINI_TASKS.indexOf(taskType) !== -1) return 'gemini';
    // Default: Claude for unknown tasks
    return 'claude';
  }

  /* ── Public API ──────────────────────────────────────────────────────── */

  /**
   * query(payload, mode?)
   *   payload.task     — string task type (e.g. 'json_schema', 'summarization')
   *   payload.prompt   — string prompt text
   *   payload.system   — optional system prompt
   *   payload.messages — optional full messages array (overrides prompt)
   *   payload.model    — optional model override
   *   payload.max_tokens — optional token limit
   *   mode             — 'claude' | 'gemini' | 'auto' (default 'auto')
   *
   * Returns Promise<{ provider, text, raw }>
   */
  function query(payload, mode) {
    var provider = _selectProvider(payload.task || '', mode || 'auto');
    var callFn = provider === 'gemini' ? function () { return _geminiCall(payload); }
                                       : function () { return _claudeCall(payload); };
    return _withRetry(callFn, 3);
  }

  global.VDDispatcher = {
    query: query,
    CLAUDE_TASKS: CLAUDE_TASKS,
    GEMINI_TASKS: GEMINI_TASKS
  };

})(window);
