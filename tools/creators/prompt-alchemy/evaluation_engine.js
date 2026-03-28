/* tools/creators/prompt-alchemy/evaluation_engine.js
 * 3-stage prompt evaluation pipeline for PromptAlchemy
 * Exposes: window.VDEvalEngine
 */
(function (global) {
  'use strict';

  /* ── Schema validation ───────────────────────────────────────────────── */

  /**
   * validateSchema(output, schema)
   *   schema = { required: ['key1','key2'], types: { key1: 'string', key2: 'number' } }
   *   Returns { valid: bool, errors: string[], tokenEstimate: number }
   */
  function validateSchema(output, schema) {
    var errors = [];
    var parsed = null;

    // Token estimate: chars / 4
    var tokenEstimate = Math.ceil((String(output || '')).length / 4);

    // Attempt JSON parse if output looks like JSON
    var trimmed = String(output || '').trim();
    if (trimmed.charAt(0) === '{' || trimmed.charAt(0) === '[') {
      try {
        parsed = JSON.parse(trimmed);
      } catch (e) {
        errors.push('JSON parse failed: ' + e.message);
        return { valid: false, errors: errors, tokenEstimate: tokenEstimate };
      }
    }

    if (!schema) return { valid: true, errors: [], tokenEstimate: tokenEstimate };

    // Required keys check
    var required = schema.required || [];
    var obj = Array.isArray(parsed) ? parsed[0] : parsed;
    if (obj && typeof obj === 'object') {
      required.forEach(function (key) {
        if (obj[key] === undefined || obj[key] === null) {
          errors.push('Missing required key: "' + key + '"');
        }
      });

      // Type checks
      var types = schema.types || {};
      Object.keys(types).forEach(function (key) {
        if (obj[key] !== undefined && obj[key] !== null) {
          var expected = types[key];
          var actual = typeof obj[key];
          if (expected === 'array') {
            if (!Array.isArray(obj[key])) errors.push('Key "' + key + '" must be an array');
          } else if (actual !== expected) {
            errors.push('Key "' + key + '" must be ' + expected + ', got ' + actual);
          }
        }
      });
    } else if (required.length > 0) {
      errors.push('Output is not a JSON object — cannot validate required keys');
    }

    return { valid: errors.length === 0, errors: errors, tokenEstimate: tokenEstimate };
  }

  /* ── Punitive feedback prompt builder ───────────────────────────────── */

  function _buildFeedbackPrompt(originalPrompt, schema, validationErrors, attempt) {
    return 'Your previous response had validation errors (attempt ' + attempt + '):\n' +
      validationErrors.map(function (e) { return '- ' + e; }).join('\n') + '\n\n' +
      'Required schema: ' + JSON.stringify(schema, null, 2) + '\n\n' +
      'Original request:\n' + originalPrompt + '\n\n' +
      'Fix ALL errors and return ONLY valid JSON matching the schema. No explanations, no markdown, raw JSON only.';
  }

  /* ── 3-stage pipeline ────────────────────────────────────────────────── */

  /**
   * evaluateWithRetry(prompt, schema, apiCall, maxRetries?)
   *   prompt     — string prompt to send
   *   schema     — validation schema ({ required, types })
   *   apiCall    — async function(promptText) → string output
   *   maxRetries — default 3
   *
   * Stage 1: Initial call
   * Stage 2: Validation
   * Stage 3: Retry with punitive feedback if invalid
   *
   * Returns Promise<{ output, validation, attempts, stages }>
   */
  function evaluateWithRetry(prompt, schema, apiCall, maxRetries) {
    var retries = maxRetries !== undefined ? maxRetries : 3;
    var stages = [];

    function attempt(n, currentPrompt) {
      stages.push({ stage: n, prompt: currentPrompt });

      return Promise.resolve()
        .then(function () { return apiCall(currentPrompt); })
        .then(function (output) {
          stages[stages.length - 1].output = output;

          var validation = validateSchema(output, schema);
          stages[stages.length - 1].validation = validation;

          if (validation.valid || n >= retries) {
            return { output: output, validation: validation, attempts: n, stages: stages };
          }

          // Build punitive retry prompt
          var retryPrompt = _buildFeedbackPrompt(prompt, schema, validation.errors, n);
          stages[stages.length - 1].retrying = true;
          return attempt(n + 1, retryPrompt);
        });
    }

    return attempt(1, prompt);
  }

  /* ── Pipeline UI state ───────────────────────────────────────────────── */

  /**
   * renderPipelineUI(containerId)
   * Renders a 3-column pipeline status grid inside the given container.
   * Columns: Stage 1 (Generate) → Stage 2 (Validate) → Stage 3 (Refine)
   */
  function renderPipelineUI(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = [
      '<div class="vde-pipeline" aria-label="Evaluation pipeline">',
      '  <div class="vde-stage" id="vde-stage-1" data-status="idle">',
      '    <div class="vde-stage-icon">⚡</div>',
      '    <div class="vde-stage-label">Generate</div>',
      '    <div class="vde-stage-status">Waiting</div>',
      '  </div>',
      '  <div class="vde-stage-arrow">→</div>',
      '  <div class="vde-stage" id="vde-stage-2" data-status="idle">',
      '    <div class="vde-stage-icon">🔍</div>',
      '    <div class="vde-stage-label">Validate</div>',
      '    <div class="vde-stage-status">Waiting</div>',
      '  </div>',
      '  <div class="vde-stage-arrow">→</div>',
      '  <div class="vde-stage" id="vde-stage-3" data-status="idle">',
      '    <div class="vde-stage-icon">✨</div>',
      '    <div class="vde-stage-label">Refine</div>',
      '    <div class="vde-stage-status">Waiting</div>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  function _setStage(stageNum, status, message) {
    var el = document.getElementById('vde-stage-' + stageNum);
    if (!el) return;
    el.setAttribute('data-status', status);
    var statusEl = el.querySelector('.vde-stage-status');
    if (statusEl) statusEl.textContent = message || status;
  }

  /**
   * runPipeline(prompt, schema, apiCall, containerId, maxRetries?)
   * Combines renderPipelineUI + evaluateWithRetry with live status updates.
   * Returns Promise<{ output, validation, attempts, stages }>
   */
  function runPipeline(prompt, schema, apiCall, containerId, maxRetries) {
    renderPipelineUI(containerId);
    var retries = maxRetries !== undefined ? maxRetries : 3;

    _setStage(1, 'running', 'Generating...');

    var attempt = 0;

    var wrappedApiCall = function (p) {
      attempt++;
      if (attempt === 1) {
        _setStage(1, 'running', 'Generating...');
      } else {
        _setStage(3, 'running', 'Refining (attempt ' + attempt + ')...');
      }
      return apiCall(p).then(function (output) {
        if (attempt === 1) {
          _setStage(1, 'done', 'Done');
          _setStage(2, 'running', 'Validating...');
          setTimeout(function () {
            var v = validateSchema(output, schema);
            if (v.valid) {
              _setStage(2, 'done', 'Valid');
              _setStage(3, 'done', 'No refinement needed');
            } else {
              _setStage(2, 'error', v.errors.length + ' error(s)');
            }
          }, 0);
        }
        return output;
      });
    };

    return evaluateWithRetry(prompt, schema, wrappedApiCall, retries).then(function (result) {
      if (result.validation.valid) {
        _setStage(2, 'done', 'Valid');
        _setStage(3, 'done', result.attempts > 1 ? 'Refined in ' + result.attempts + ' passes' : 'No refinement needed');
      } else {
        _setStage(2, 'error', result.validation.errors.length + ' error(s)');
        _setStage(3, 'error', 'Max retries reached');
      }
      return result;
    });
  }

  /* ── CSS injection ───────────────────────────────────────────────────── */

  var PIPELINE_CSS = [
    '.vde-pipeline{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:8px;',
    'background:#0b0f17;border:1px solid #1e2433;border-radius:12px;padding:16px;margin:16px 0;}',
    '.vde-stage{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;',
    'border:1px solid #1e2433;border-radius:10px;text-align:center;transition:border-color .2s,background .2s;}',
    '.vde-stage[data-status="running"]{border-color:#ff671f;background:rgba(255,103,31,.07);}',
    '.vde-stage[data-status="done"]{border-color:#22c55e;background:rgba(34,197,94,.06);}',
    '.vde-stage[data-status="error"]{border-color:#ef4444;background:rgba(239,68,68,.06);}',
    '.vde-stage-icon{font-size:1.4rem;}',
    '.vde-stage-label{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;}',
    '.vde-stage-status{font-size:.78rem;color:#e5e7eb;min-height:1.2em;}',
    '.vde-stage-arrow{color:#4b5563;font-size:1.2rem;padding:0 4px;}',
    '@media(max-width:480px){.vde-pipeline{grid-template-columns:1fr;}.vde-stage-arrow{transform:rotate(90deg);}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('vde-pipeline-css')) return;
    var style = document.createElement('style');
    style.id = 'vde-pipeline-css';
    style.textContent = PIPELINE_CSS;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCSS);
  } else {
    injectCSS();
  }

  /* ── Public API ──────────────────────────────────────────────────────── */

  global.VDEvalEngine = {
    validateSchema: validateSchema,
    evaluateWithRetry: evaluateWithRetry,
    renderPipelineUI: renderPipelineUI,
    runPipeline: runPipeline
  };

})(window);
