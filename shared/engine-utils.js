(function (global) {
  function tryParse(value) {
    if (!value) return {};
    try {
      return JSON.parse(value);
    } catch (error) {
      return { raw: value };
    }
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function weightedScore(parts) {
    return Object.values(parts).reduce((sum, item) => sum + (item.value * item.weight), 0);
  }

  function band(score) {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'strong';
    if (score >= 50) return 'developing';
    return 'early';
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text || '');
    }
  }

  function downloadText(filename, text) {
    const blob = new Blob([text || ''], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  global.EngineUtils = {
    tryParse,
    clamp,
    toNumber,
    weightedScore,
    band,
    copyText,
    downloadText
  };
})(window);
