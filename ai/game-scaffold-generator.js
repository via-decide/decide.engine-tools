(function (global) {
  'use strict';

  const TEMPLATE_MAP = {
    simulation: 'simulation',
    'strategy game': 'strategy-game',
    strategy: 'strategy-game',
    network: 'network-game',
    sandbox: 'sandbox'
  };

  function selectTemplateFromPrompt(prompt) {
    const lowered = String(prompt || '').trim().toLowerCase();
    if (!lowered) return 'simulation';
    if (lowered.includes('strategy')) return 'strategy-game';
    if (lowered.includes('network')) return 'network-game';
    if (lowered.includes('sandbox')) return 'sandbox';
    return 'simulation';
  }

  function normalizeTemplate(template, prompt) {
    const raw = String(template || '').trim().toLowerCase();
    return TEMPLATE_MAP[raw] || selectTemplateFromPrompt(prompt);
  }

  function buildScaffoldRequest(name, template, prompt) {
    return {
      name: String(name || '').trim(),
      prompt: String(prompt || '').trim(),
      template: normalizeTemplate(template, prompt)
    };
  }

  global.GameScaffoldGenerator = {
    selectTemplateFromPrompt,
    normalizeTemplate,
    buildScaffoldRequest
  };
})(window);
