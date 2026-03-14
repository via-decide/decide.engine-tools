(function () {
  'use strict';

  var CATEGORY_ORDER = ['creators', 'coders', 'researchers', 'business', 'education', 'games', 'simulations', 'system', 'misc'];

  var CATEGORY_LABELS = {
    creators: 'Creators', coders: 'Coders', researchers: 'Researchers',
    business: 'Business', education: 'Education', games: 'Games',
    simulations: 'Simulations', system: 'System', misc: 'Misc'
  };

  var CATEGORY_COLORS = {
    creators: '#f59e0b', coders: '#60a5fa', researchers: '#34d399',
    business: '#f472b6', education: '#a78bfa', games: '#fb7185',
    simulations: '#22d3ee', system: '#94a3b8', misc: '#cbd5e1'
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildLegend(container) {
    if (!container) return;
    container.innerHTML = CATEGORY_ORDER.map(function (key) {
      return '<div class="legend-item">' +
        '<span class="swatch" style="background:' + CATEGORY_COLORS[key] + '"></span>' +
        CATEGORY_LABELS[key] + '</div>';
    }).join('');
  }

  function layoutNodes(tools, width, height) {
    var grouped = new Map(CATEGORY_ORDER.map(function (k) { return [k, []]; }));
    tools.forEach(function (tool) {
      var key = grouped.has(tool.category) ? tool.category : 'misc';
      grouped.get(key).push(tool);
    });

    var cols = CATEGORY_ORDER.filter(function (k) { return grouped.get(k).length > 0; }).length;
    var colW = cols > 0 ? width / cols : width;
    var nodes = [];
    var colIdx = 0;

    CATEGORY_ORDER.forEach(function (cat) {
      var group = grouped.get(cat) || [];
      if (!group.length) return;
      var cx = colW * colIdx + colW / 2;
      group.forEach(function (tool, row) {
        var rowH = height / (group.length + 1);
        nodes.push({ tool: tool, x: cx, y: rowH * (row + 1), category: cat });
      });
      colIdx++;
    });

    return nodes;
  }

  function renderGraph(opts) {
    var svg = opts.svg;
    var graphRoot = opts.graphRoot;
    var edgesGroup = opts.edgesGroup;
    var nodesGroup = opts.nodesGroup;
    var labelsGroup = opts.labelsGroup;
    var tools = opts.tools;
    var tooltip = opts.tooltip;

    var W = svg.clientWidth || 900;
    var H = svg.clientHeight || 600;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    var nodes = layoutNodes(tools, W, H);
    var byId = new Map(tools.map(function (t) { return [t.id, t]; }));

    // Draw edges
    edgesGroup.innerHTML = '';
    nodes.forEach(function (node) {
      var relatedTools = node.tool.relatedTools || [];
      relatedTools.forEach(function (relId) {
        var target = nodes.find(function (n) { return n.tool.id === relId; });
        if (!target) return;
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x); line.setAttribute('y1', node.y);
        line.setAttribute('x2', target.x); line.setAttribute('y2', target.y);
        line.setAttribute('stroke', '#334155'); line.setAttribute('stroke-width', '1');
        edgesGroup.appendChild(line);
      });
    });

    // Draw nodes
    nodesGroup.innerHTML = '';
    nodes.forEach(function (node) {
      var color = CATEGORY_COLORS[node.category] || '#cbd5e1';
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node');
      g.setAttribute('transform', 'translate(' + node.x + ',' + node.y + ')');
      g.setAttribute('tabindex', '0');
      g.setAttribute('aria-label', node.tool.name);

      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '10');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#1e293b');
      circle.setAttribute('stroke-width', '2');

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('y', '22');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '9');
      text.setAttribute('fill', '#94a3b8');
      text.textContent = node.tool.name.slice(0, 18);

      g.appendChild(circle);
      g.appendChild(text);

      g.addEventListener('mouseenter', function (e) {
        if (!tooltip) return;
        tooltip.innerHTML = '<strong>' + escapeHtml(node.tool.name) + '</strong>' +
          '<br>' + escapeHtml(node.tool.description || '') +
          '<br><span style="color:#64748b;font-size:0.8em">' + escapeHtml(node.tool.entry || '') + '</span>';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 12) + 'px';
        tooltip.style.top = (e.clientY - 8) + 'px';
      });

      g.addEventListener('mouseleave', function () {
        if (tooltip) tooltip.style.display = 'none';
      });

      g.addEventListener('click', function () {
        if (node.tool.entry) window.location.href = node.tool.entry;
      });

      nodesGroup.appendChild(g);
    });

    // Category labels
    labelsGroup.innerHTML = '';
    var usedCols = new Map();
    nodes.forEach(function (node) {
      if (!usedCols.has(node.category)) usedCols.set(node.category, node.x);
    });
    usedCols.forEach(function (cx, cat) {
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', cx);
      label.setAttribute('y', '18');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-weight', '700');
      label.setAttribute('fill', CATEGORY_COLORS[cat] || '#94a3b8');
      label.textContent = CATEGORY_LABELS[cat] || cat;
      labelsGroup.appendChild(label);
    });

    // Pan and zoom
    var state = { scale: 1, tx: 0, ty: 0 };

    function applyTransform() {
      graphRoot.setAttribute('transform',
        'translate(' + state.tx + ',' + state.ty + ') scale(' + state.scale + ')'
      );
    }

    var panning = false;
    var panStart = null;

    svg.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('.node')) return;
      panning = true;
      panStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
      svg.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', function (e) {
      if (!panning || !panStart) return;
      state.tx = panStart.tx + (e.clientX - panStart.x);
      state.ty = panStart.ty + (e.clientY - panStart.y);
      applyTransform();
    });

    function stopPan(e) {
      panning = false;
      panStart = null;
      try { if (typeof e.pointerId === 'number') svg.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    svg.addEventListener('pointerup', stopPan);
    svg.addEventListener('pointercancel', stopPan);

    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? 0.9 : 1.1;
      state.scale = Math.min(4, Math.max(0.2, state.scale * delta));
      applyTransform();
    }, { passive: false });

    var resetBtn = document.getElementById('reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.scale = 1; state.tx = 0; state.ty = 0;
        applyTransform();
      });
    }
  }

  async function init() {
    var svg = document.getElementById('graph');
    var viewport = svg ? (svg.closest('.viewport') || svg.parentElement) : null;

    if (!window.ToolRegistry || typeof window.ToolRegistry.loadAll !== 'function') {
      if (viewport) viewport.innerHTML = '<div style="padding:40px;text-align:center;color:#fca5a5;">Tool registry failed to load.</div>';
      return;
    }

    var tools;
    try {
      tools = await window.ToolRegistry.loadAll();
    } catch (e) {
      if (viewport) viewport.innerHTML = '<div style="padding:40px;text-align:center;color:#fca5a5;">Error: ' + escapeHtml(e.message) + '</div>';
      return;
    }

    if (!tools || !tools.length) {
      if (viewport) viewport.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8;">No tools found.</div>';
      return;
    }

    var legend    = document.getElementById('legend');
    var graphRoot = document.getElementById('graph-root');
    var edgesGroup = document.getElementById('edges');
    var nodesGroup = document.getElementById('nodes');
    var labelsGroup = document.getElementById('category-labels');
    var tooltip   = document.getElementById('tooltip');

    buildLegend(legend);
    renderGraph({ svg, graphRoot, edgesGroup, nodesGroup, labelsGroup, tools, tooltip });
  }

  init();
})();
