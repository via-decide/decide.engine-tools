(function () {
  const playerStateEl = document.getElementById('playerState');
  const goalEl = document.getElementById('goal');
  const growthModeEl = document.getElementById('growthMode');
  const STORE_KEY = 'engine.ai-game-strategy-advisor.draft';

  // Tab switching
  document.querySelectorAll('.strategy-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.strategy-tabs button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    });
  });

  function getPlayerState() {
    const raw = playerStateEl.value.trim();
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through */ }
    }
    return {
      roots: 25, trunk: 15, fruits: 8, seeds: 12, water: 70,
      consistency: 75, quality: 60, depth: 55, peer: 40,
      spamDays: 1, daysActive: 22, weeklyScores: [45, 52, 48]
    };
  }

  // Scoring engines (mirrors engine-models.js formulas)
  function calcRankScore(s) {
    const improvement = s.weeklyScores && s.weeklyScores.length >= 2
      ? s.weeklyScores[s.weeklyScores.length - 1] - s.weeklyScores[0] : 0;
    return Math.round(
      s.roots * 0.20 + s.trunk * 0.20 + s.fruits * 1.5 +
      (s.quality || 50) * 0.25 + (s.consistency || 50) * 0.15 +
      Math.max(0, improvement) * 0.08 - (s.spamDays || 0) * 4
    );
  }

  function calcTrustScore(s) {
    return Math.round((s.peer || 45) * 0.4 + (s.consistency || 60) * 0.35 + (s.quality || 55) * 0.25);
  }

  function calcHireReadiness(s) {
    return Math.round((s.consistency || 60) * 0.25 + (s.quality || 55) * 0.3 + (s.depth || 50) * 0.25 + (s.peer || 45) * 0.2);
  }

  function calcWeeklyHarvest(s) {
    const modifier = growthModeEl.value === 'accelerated' ? 1.15 : growthModeEl.value === 'resilient' ? 1.05 : 1;
    return Math.round(((s.consistency || 60) * 0.35 + (s.quality || 55) * 0.35 + (s.depth || 50) * 0.3) * modifier);
  }

  function checkPromotionEligibility(s) {
    const avgWeekly = s.weeklyScores && s.weeklyScores.length
      ? s.weeklyScores.reduce((a, b) => a + b, 0) / s.weeklyScores.length : 40;
    const checks = {
      roots: { required: 18, current: s.roots, pass: s.roots >= 18 },
      trunk: { required: 10, current: s.trunk, pass: s.trunk >= 10 },
      fruits: { required: 6, current: s.fruits, pass: s.fruits >= 6 },
      weeklyAvg: { required: 40, current: Math.round(avgWeekly), pass: avgWeekly >= 40 },
      spamDays: { required: '<=3', current: s.spamDays || 0, pass: (s.spamDays || 0) <= 3 },
      consistency: { required: '>=50%', current: (s.consistency || 0) + '%', pass: (s.consistency || 0) >= 50 }
    };
    return { checks, eligible: Object.values(checks).every(c => c.pass) };
  }

  function generateInsights(state, goal) {
    const insights = [];
    const promo = checkPromotionEligibility(state);

    // Weakness detection
    if (state.roots < 18) insights.push({ type: 'warn', title: 'Weak Roots', text: `Roots at ${state.roots}/18 — strengthen fundamentals with daily study blocks.` });
    if (state.trunk < 10) insights.push({ type: 'warn', title: 'Shallow Trunk', text: `Trunk depth ${state.trunk}/10 — invest in deep-work research sessions.` });
    if (state.quality < 50) insights.push({ type: 'warn', title: 'Low Quality', text: `Quality score ${state.quality}% — focus on fewer, higher-quality outputs.` });
    if (state.peer < 40) insights.push({ type: 'warn', title: 'Low Peer Score', text: `Peer validation at ${state.peer}% — share seeds & participate in circles.` });
    if ((state.spamDays || 0) > 2) insights.push({ type: 'danger', title: 'Spam Risk', text: `${state.spamDays} spam days detected — each costs -4 rank points. Reduce volume, increase quality.` });
    if (state.consistency >= 80 && state.quality >= 70) insights.push({ type: 'good', title: 'Strong Foundation', text: 'Excellent consistency + quality combo — you\'re on track for promotion.' });
    if (state.water < 50) insights.push({ type: 'warn', title: 'Dehydrated', text: `Water/consistency at ${state.water}% — maintain daily engagement.` });

    // Goal-specific insights
    if (goal === 'promotion' && !promo.eligible) {
      const failing = Object.entries(promo.checks).filter(([, v]) => !v.pass);
      failing.forEach(([key, v]) => {
        insights.push({ type: 'danger', title: `Promotion Blocker: ${key}`, text: `Need ${v.required}, currently at ${v.current}.` });
      });
    }
    if (goal === 'ranking' && state.consistency < 70) insights.push({ type: 'warn', title: 'Ranking Bottleneck', text: 'Consistency below 70% limits ranking potential. Daily completion is key.' });
    if (goal === 'trust' && state.peer < 50) insights.push({ type: 'warn', title: 'Trust Gap', text: 'Peer score under 50% — join circles, validate peers, share knowledge seeds.' });

    if (insights.length === 0) insights.push({ type: 'good', title: 'Looking Good', text: 'No major issues detected. Keep maintaining your growth rhythm.' });
    return insights;
  }

  function generateActions(state, goal) {
    const actions = [];
    const addAction = (text, priority) => actions.push({ text, priority });

    // Universal actions
    if (state.roots < 18) addAction('Complete 3 focused study blocks daily to strengthen roots to 18+', 'critical');
    if (state.trunk < 10) addAction('Dedicate 1 deep-work session daily (45+ min) to grow trunk depth', 'high');
    if ((state.spamDays || 0) > 1) addAction('Stop volume-spamming — focus on 1-2 quality outputs per day', 'critical');

    // Goal-specific actions
    switch (goal) {
      case 'promotion':
        if (state.fruits < 6) addAction(`Ship ${6 - state.fruits} more quality fruits before promotion window`, 'critical');
        if (state.consistency < 50) addAction('Maintain 50%+ daily completion rate for remaining days', 'critical');
        addAction('Review promotion checklist daily — track roots, trunk, fruits, weekly avg', 'normal');
        break;
      case 'ranking':
        addAction('Maximize weekly harvest score — balance consistency (35%) + quality (35%) + depth (30%)', 'high');
        if (state.quality < 70) addAction('Raise quality above 70% — fewer outputs but higher standard', 'high');
        addAction('Track improvement trend — each week should score higher than last', 'normal');
        break;
      case 'trust':
        addAction('Share 2+ seeds per week in your circle for peer knowledge exchange', 'high');
        addAction('Validate 3+ peers weekly to build mutual trust scores', 'high');
        if (!state.circleJoined) addAction('Join or create a circle to unlock peer validation multipliers', 'critical');
        break;
      case 'hire-ready':
        addAction('Boost quality (30% weight) — curate your best 5 fruits for portfolio', 'high');
        addAction('Increase depth (25% weight) — add research artifacts to demonstrate expertise', 'high');
        addAction('Build peer endorsements (20% weight) — get circle members to validate your work', 'normal');
        break;
      case 'balanced':
        addAction('Maintain daily quest completion for steady water/consistency gains', 'normal');
        addAction('Ship 1 quality fruit per week minimum', 'normal');
        addAction('Participate in 1 seed exchange per week', 'normal');
        break;
    }
    return actions;
  }

  function generateRiskAnalysis(state) {
    const risks = [];
    const spamRatio = (state.spamDays || 0) / Math.max(1, state.daysActive || 1);
    risks.push({
      name: 'Spam Detection', level: spamRatio > 0.25 ? 'high' : spamRatio > 0.1 ? 'med' : 'low',
      detail: `${Math.round(spamRatio * 100)}% spam ratio (threshold: 25%)`
    });
    risks.push({
      name: 'Volume-over-Quality', level: (state.consistency || 0) > 80 && (state.quality || 0) < 30 ? 'high' : (state.quality || 0) < 50 ? 'med' : 'low',
      detail: `Consistency ${state.consistency || 0}% vs Quality ${state.quality || 0}%`
    });
    risks.push({
      name: 'No Fruit Output',
      level: (state.daysActive || 0) > 14 && (state.fruits || 0) < 2 ? 'high' : (state.fruits || 0) < 4 ? 'med' : 'low',
      detail: `${state.fruits || 0} fruits in ${state.daysActive || 0} days`
    });
    risks.push({
      name: 'Burnout Risk',
      level: (state.consistency || 0) > 95 ? 'med' : (state.water || 0) < 30 ? 'high' : 'low',
      detail: `Water ${state.water || 0}%, Consistency ${state.consistency || 0}%`
    });
    risks.push({
      name: 'Isolation Risk',
      level: (state.peer || 0) < 20 ? 'high' : (state.peer || 0) < 40 ? 'med' : 'low',
      detail: `Peer score ${state.peer || 0}% — social engagement level`
    });
    risks.push({
      name: 'Stagnation',
      level: state.weeklyScores && state.weeklyScores.length >= 2 && state.weeklyScores[state.weeklyScores.length - 1] <= state.weeklyScores[0] ? 'med' : 'low',
      detail: 'Weekly score trend analysis'
    });
    return risks;
  }

  function simulateWeek(state) {
    const sim = JSON.parse(JSON.stringify(state));
    const days = [];
    const modifier = growthModeEl.value === 'accelerated' ? 1.15 : growthModeEl.value === 'resilient' ? 1.05 : 1;

    for (let d = 1; d <= 7; d++) {
      const questCompleted = Math.random() < (sim.consistency || 60) / 100;
      const dailyQuality = questCompleted ? Math.round(30 + Math.random() * 50) : 0;
      if (questCompleted) {
        sim.roots += Math.round(((sim.consistency || 60) / 100 * 1.2) * modifier * 10) / 10;
        sim.trunk += Math.round((dailyQuality / 100 * 0.8) * modifier * 10) / 10;
        if (dailyQuality > 40) sim.fruits += Math.random() < 0.3 ? 1 : 0;
      }
      sim.water = Math.max(0, Math.min(100, sim.water + (questCompleted ? 3 : -5)));
      days.push({ day: d, completed: questCompleted, quality: dailyQuality, roots: +sim.roots.toFixed(1), trunk: +sim.trunk.toFixed(1), fruits: sim.fruits, water: sim.water });
    }
    return { projected: sim, days };
  }

  function renderOverview(state) {
    const rank = calcRankScore(state);
    const trust = calcTrustScore(state);
    const hire = calcHireReadiness(state);
    const harvest = calcWeeklyHarvest(state);
    const promo = checkPromotionEligibility(state);
    const insights = generateInsights(state, goalEl.value);

    const meters = [
      { label: 'Roots', val: state.roots, max: 50, color: '#8B4513' },
      { label: 'Trunk', val: state.trunk, max: 40, color: '#654321' },
      { label: 'Fruits', val: state.fruits, max: 20, color: var_accent2 },
      { label: 'Seeds', val: state.seeds || 0, max: 30, color: '#FFCA28' },
      { label: 'Water', val: state.water, max: 100, color: '#29B6F6' },
      { label: 'Quality', val: state.quality || 50, max: 100, color: '#a78bfa' },
      { label: 'Consistency', val: state.consistency || 50, max: 100, color: '#22c55e' },
      { label: 'Peer', val: state.peer || 40, max: 100, color: '#f97316' }
    ];

    let html = `<div class="score-big">${rank}</div><p style="text-align:center;color:var(--muted);margin:-6px 0 12px;font-size:0.82rem">Fair Rank Score</p>`;
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">';
    html += `<div style="text-align:center;padding:8px;background:var(--bg-alt);border-radius:8px"><div style="font-size:0.72rem;color:var(--muted)">Trust</div><div style="font-size:1.3rem;font-weight:700;color:var(--accent-2)">${trust}</div></div>`;
    html += `<div style="text-align:center;padding:8px;background:var(--bg-alt);border-radius:8px"><div style="font-size:0.72rem;color:var(--muted)">Harvest</div><div style="font-size:1.3rem;font-weight:700;color:var(--warn)">${harvest}</div></div>`;
    html += `<div style="text-align:center;padding:8px;background:var(--bg-alt);border-radius:8px"><div style="font-size:0.72rem;color:var(--muted)">Hire</div><div style="font-size:1.3rem;font-weight:700;color:#a78bfa">${hire}</div></div>`;
    html += '</div>';

    html += `<div style="text-align:center;margin-bottom:12px;padding:6px;border-radius:8px;background:${promo.eligible ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}"><span style="font-weight:700;color:${promo.eligible ? 'var(--accent-2)' : '#ef4444'}">${promo.eligible ? 'PROMOTION ELIGIBLE' : 'NOT YET ELIGIBLE'}</span></div>`;

    meters.forEach(m => {
      const pct = Math.min(100, Math.round(m.val / m.max * 100));
      html += `<div class="meter-row"><span class="meter-label">${m.label}</span><div class="meter-bar"><div class="meter-fill" style="width:${pct}%;background:${m.color}"></div></div><span class="meter-val">${m.val}</span></div>`;
    });

    html += '<div style="margin-top:14px">';
    insights.forEach(i => {
      const cls = i.type === 'danger' ? 'danger' : i.type === 'warn' ? 'warn' : '';
      html += `<div class="insight-card ${cls}"><h4>${i.title}</h4><p>${i.text}</p></div>`;
    });
    html += '</div>';
    return html;
  }

  const var_accent2 = '#22c55e';

  function renderActions(state) {
    const actions = generateActions(state, goalEl.value);
    let html = `<h3 style="margin:0 0 10px;font-size:0.95rem">Action Plan: ${goalEl.options[goalEl.selectedIndex].text}</h3>`;
    html += '<ul class="action-list">';
    actions.forEach(a => {
      html += `<li class="priority-${a.priority}">${a.text}</li>`;
    });
    html += '</ul>';
    return html;
  }

  function renderRisks(state) {
    const risks = generateRiskAnalysis(state);
    let html = '<h3 style="margin:0 0 10px;font-size:0.95rem">Risk Assessment</h3><div class="risk-grid">';
    risks.forEach(r => {
      html += `<div class="risk-item"><div class="risk-name">${r.name}</div><div class="risk-level risk-${r.level}">${r.level.toUpperCase()}</div><div style="font-size:0.72rem;color:var(--muted);margin-top:2px">${r.detail}</div></div>`;
    });
    html += '</div>';
    return html;
  }

  function renderTimeline(state) {
    const promo = checkPromotionEligibility(state);
    const daysLeft = Math.max(0, 30 - (state.daysActive || 0));
    const milestones = [];

    milestones.push({ day: 0, title: 'Current State', desc: `Day ${state.daysActive || 0} — Rank ${calcRankScore(state)}`, future: false });
    if (!promo.checks.roots.pass) milestones.push({ day: Math.ceil((18 - state.roots) / 1.2), title: 'Roots Target: 18', desc: `~${Math.ceil((18 - state.roots) / 1.2)} days at current rate`, future: true });
    if (!promo.checks.trunk.pass) milestones.push({ day: Math.ceil((10 - state.trunk) / 0.8), title: 'Trunk Target: 10', desc: `~${Math.ceil((10 - state.trunk) / 0.8)} days at current rate`, future: true });
    milestones.push({ day: 7, title: 'Next Weekly Harvest', desc: `Projected score: ${calcWeeklyHarvest(state)}`, future: true });
    if (daysLeft > 0 && daysLeft <= 15) milestones.push({ day: daysLeft, title: 'Promotion Window', desc: `${daysLeft} days remaining`, future: true });
    milestones.push({ day: 30, title: '30-Day Review', desc: promo.eligible ? 'On track for promotion' : 'Work needed — see blockers', future: true });

    milestones.sort((a, b) => a.day - b.day);
    let html = '<h3 style="margin:0 0 10px;font-size:0.95rem">Growth Timeline</h3><div class="timeline">';
    milestones.forEach(m => {
      html += `<div class="timeline-item ${m.future ? 'future' : ''}"><h5>${m.title}</h5><p>${m.desc}</p></div>`;
    });
    html += '</div>';
    return html;
  }

  function runAnalysis() {
    const state = getPlayerState();
    document.getElementById('tab-overview').innerHTML = renderOverview(state);
    document.getElementById('tab-actions').innerHTML = renderActions(state);
    document.getElementById('tab-risks').innerHTML = renderRisks(state);
    document.getElementById('tab-timeline').innerHTML = renderTimeline(state);

    ToolStorage.write(STORE_KEY, {
      state, goal: goalEl.value, mode: growthModeEl.value,
      rankScore: calcRankScore(state), trustScore: calcTrustScore(state),
      generatedAt: new Date().toISOString()
    });
  }

  document.getElementById('analyze').addEventListener('click', runAnalysis);

  document.getElementById('simulate').addEventListener('click', function () {
    const state = getPlayerState();
    const sim = simulateWeek(state);
    let html = '<h3 style="margin:0 0 10px;font-size:0.95rem">7-Day Simulation</h3>';
    html += '<table style="width:100%;font-size:0.78rem;border-collapse:collapse">';
    html += '<tr style="color:var(--muted)"><th style="text-align:left;padding:4px">Day</th><th>Done</th><th>Quality</th><th>Roots</th><th>Trunk</th><th>Fruits</th><th>Water</th></tr>';
    sim.days.forEach(d => {
      html += `<tr style="border-top:1px solid var(--line)"><td style="padding:4px">Day ${d.day}</td><td style="text-align:center">${d.completed ? '✓' : '✗'}</td><td style="text-align:center">${d.quality}</td><td style="text-align:center">${d.roots}</td><td style="text-align:center">${d.trunk}</td><td style="text-align:center">${d.fruits}</td><td style="text-align:center">${d.water}%</td></tr>`;
    });
    html += '</table>';
    html += `<div style="margin-top:10px;padding:10px;background:var(--bg-alt);border-radius:8px"><strong>Projected after 7 days:</strong> Roots ${sim.projected.roots.toFixed(1)} | Trunk ${sim.projected.trunk.toFixed(1)} | Fruits ${sim.projected.fruits} | Water ${sim.projected.water}%</div>`;
    document.getElementById('tab-overview').innerHTML = html;
    document.querySelectorAll('.strategy-tabs button').forEach(b => b.classList.remove('active'));
    document.querySelector('.strategy-tabs button[data-tab="overview"]').classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById('tab-overview').style.display = 'block';
  });

  document.getElementById('copy').addEventListener('click', function () {
    const state = getPlayerState();
    const report = {
      tool: 'ai-game-strategy-advisor',
      goal: goalEl.value,
      mode: growthModeEl.value,
      scores: { rank: calcRankScore(state), trust: calcTrustScore(state), hire: calcHireReadiness(state), harvest: calcWeeklyHarvest(state) },
      promotionEligible: checkPromotionEligibility(state).eligible,
      insights: generateInsights(state, goalEl.value),
      actions: generateActions(state, goalEl.value),
      risks: generateRiskAnalysis(state),
      generatedAt: new Date().toISOString()
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2)).then(() => {
      this.textContent = 'Copied!';
      setTimeout(() => this.textContent = 'Copy Report', 1500);
    });
  });

  // Auto-run on load
  runAnalysis();
})();
