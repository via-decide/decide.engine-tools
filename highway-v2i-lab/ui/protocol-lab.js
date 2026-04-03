(function (global) {
  'use strict';

  function drawEvolutionChart(canvas, history) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, width, height);

    if (!history || history.length === 0) return;

    const maxFitness = Math.max.apply(null, history.map((h) => h.bestFitness));
    const minFitness = Math.min.apply(null, history.map((h) => h.bestFitness));
    const range = Math.max(1, maxFitness - minFitness);

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((point, idx) => {
      const x = (idx / Math.max(1, history.length - 1)) * (width - 20) + 10;
      const y = height - (((point.bestFitness - minFitness) / range) * (height - 20) + 10);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function renderLeaderboard(container, best, baseline) {
    if (!container) return;
    const baselineLatency = baseline.latency;
    const baselineCongestion = baseline.congestion;
    const latencyGain = ((baselineLatency - best.metrics.latency) / baselineLatency) * 100;
    const congestionGain = ((baselineCongestion - best.metrics.congestion) / baselineCongestion) * 100;

    container.innerHTML = [
      '<table class="w-full text-xs">',
      '<thead><tr class="text-zinc-500"><th class="text-left">Metric</th><th class="text-right">Baseline</th><th class="text-right">Best</th><th class="text-right">Gain</th></tr></thead>',
      '<tbody>',
      `<tr><td>Latency</td><td class="text-right">${baselineLatency.toFixed(2)} ms</td><td class="text-right">${best.metrics.latency.toFixed(2)} ms</td><td class="text-right ${latencyGain >= 5 ? 'text-emerald-400' : 'text-amber-300'}">${latencyGain.toFixed(2)}%</td></tr>`,
      `<tr><td>Congestion</td><td class="text-right">${baselineCongestion.toFixed(2)}</td><td class="text-right">${best.metrics.congestion.toFixed(2)}</td><td class="text-right ${congestionGain >= 5 ? 'text-emerald-400' : 'text-amber-300'}">${congestionGain.toFixed(2)}%</td></tr>`,
      `<tr><td>Reliability</td><td class="text-right">${baseline.coverageReliability.toFixed(2)}%</td><td class="text-right">${best.metrics.coverageReliability.toFixed(2)}%</td><td class="text-right">${(best.metrics.coverageReliability - baseline.coverageReliability).toFixed(2)}%</td></tr>`,
      '</tbody>',
      '</table>'
    ].join('');
  }

  function drawInfrastructurePerformance(canvas, history) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, width, height);
    if (!history || !history.length) return;

    const maxScore = Math.max.apply(null, history.map((h) => h.bestFitness));
    const minScore = Math.min.apply(null, history.map((h) => h.bestFitness));
    const range = Math.max(1, maxScore - minScore);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((point, idx) => {
      const x = (idx / Math.max(1, history.length - 1)) * (width - 20) + 10;
      const y = height - (((point.bestFitness - minScore) / range) * (height - 20) + 10);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function renderGenomeTree(container, tree) {
    if (!container) return;
    const latest = tree && tree.length ? tree.slice(-1)[0] : null;
    if (!latest) {
      container.textContent = 'Run infrastructure evolution to view genome tree.';
      return;
    }
    container.innerHTML = [
      `<div class="text-[10px] text-zinc-500 mb-2">Generation ${latest.generation}</div>`,
      '<ul class="space-y-1 text-[11px]">',
      latest.nodes.map((node) => (
        `<li class="flex justify-between gap-2 border-b border-zinc-800 pb-1"><span>${node.id}</span><span class="text-amber-300">score ${node.score}</span></li>`
      )).join(''),
      '</ul>'
    ].join('');
  }

  global.HighwayProtocolLabUi = {
    drawEvolutionChart,
    renderLeaderboard,
    drawInfrastructurePerformance,
    renderGenomeTree
  };
})(window);
