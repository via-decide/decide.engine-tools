(function () {
  'use strict';

  const CATEGORY_ORDER = ['creators', 'coders', 'researchers', 'business', 'education', 'games', 'simulations', 'system', 'misc'];
  const CATEGORY_LABELS = {
    creators: 'Creators',
    coders: 'Coders',
    researchers: 'Researchers',
    business: 'Business',
    education: 'Education',
    games: 'Games',
    simulations: 'Simulations',
    system: 'System',
    misc: 'Misc'
  };

  const CATEGORY_COLORS = {
    creators: '#f59e0b',
    coders: '#60a5fa',
    researchers: '#34d399',
    business: '#f472b6',
    education: '#a78bfa',
    games: '#fb7185',
    simulations: '#22d3ee',
    system: '#94a3b8',
    misc: '#cbd5e1'
  };

  /* ── Helpers ── */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Convert screen coordinates to SVG user-space coordinates.
   * Returns null if the SVG has no screen CTM (not laid out).
   */
  function screenToSvg(svg, clientX, clientY) {
    var ctm = svg.getScreenCTM();
    if (!ctm) return null;
    var pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(ctm.inverse());
  }

  /* ── Legend ── */

  function buildLegend(container) {
    container.innerHTML = CATEGORY_ORDER.map(function (key) {
      return '<div class="legend-item">' +
        '<span class="swatch" style="background:' + CATEGORY_COLORS[key] + '"></span>' +
        CATEGORY_LABELS[key] +
        '</div>';
    }).join('');
  }

  /* ── Layout ── */

  function layoutNodes(tools) {
    var grouped = new Map(CATEGORY_ORDER.map(function (k) { return [k, []]; }));
    tools.forEach(function (tool) {
      var category = grouped.has(tool.category) ? tool.category : 'misc';
      grouped.get(category).push(tool);
    });

    var colGap = 250;
    var rowGap = 96;
    var startX = 170;
    var startY = 100;
    var nodes = [];

    CATEGORY_ORDER.forEach(function (category, colIdx) {
      var bucket = grouped.get(category) || [];
      bucket.sort(function (a, b) { return a.name.localeCompare(b.name); });

      bucket.forEach(function (tool, rowIdx) {
        nodes.push({
          id: tool.id,
          name: tool.name || tool.id,
          description: tool.description || '',
          category: category,
          entry: tool.entry || '',
          relatedTools: tool.relatedTools || [],
          x: startX + colIdx * colGap,
          y: startY + rowIdx * rowGap + 32
        });
      });
    });

    var maxRows = Math.max(1, Math.max.apply(null, CATEGORY_ORDER.map(function (k) {
      return (grouped.get(k) || []).length;
    })));

    return {
      nodes: nodes,
      width: startX * 2 + (CATEGORY_ORDER.length - 1) * colGap,
      height: 180 + maxRows * rowGap
    };
  }

  /* ── Render ── */

  function renderGraph(opts) {
    var svg = opts.svg;
    var graphRoot = opts.graphRoot;
    var edgesGroup = opts.edgesGroup;
    var nodesGroup = opts.nodesGroup;
    var labelsGroup = opts.labelsGroup;
    var tools = opts.tools;
    var tooltip = opts.tooltip;

    var layout = layoutNodes(tools);
    var nodes = layout.nodes;
    var width = layout.width;
    var height = layout.height;

    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('aria-label', 'Tool graph explorer');

    /* Category column labels */
    labelsGroup.innerHTML = CATEGORY_ORDER.map(function (key, idx) {
      return '<text x="' + (170 + idx * 250) + '" y="38" fill="#a8b2d3" font-size="13" text-anchor="middle">' + CATEGORY_LABELS[key] + '</text>';
    }).join('');

    /* Build edge list from relatedTools, deduplicated */
    var nodeById = new Map(nodes.map(function (n) { return [n.id, n]; }));
    var edgeSet = new Set();
    var edges = [];

    nodes.forEach(function (node) {
      (node.relatedTools || []).forEach(function (targetId) {
        if (!nodeById.has(targetId)) return;
        var key = node.id < targetId ? node.id + '|' + targetId : targetId + '|' + node.id;
        if (edgeSet.has(key)) return;
        edgeSet.add(key);
        edges.push({ from: node.id, to: targetId });
      });
    });

    edgesGroup.innerHTML = edges.map(function (edge) {
      var a = nodeById.get(edge.from);
      var b = nodeById.get(edge.to);
      if (!a || !b) return '';
      return '<line class="edge" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" />';
    }).join('');

    /* Render nodes */
    nodesGroup.innerHTML = nodes.map(function (node) {
      var safeName = escapeHtml(node.name);
      var safeDesc = escapeHtml(node.description || 'No description available.');
      var short = node.name.length > 20 ? escapeHtml(node.name.slice(0, 20)) + '\u2026' : safeName;
      var color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.misc;
      return '<g class="node" data-id="' + escapeHtml(node.id) + '" data-entry="' + escapeHtml(node.entry) + '" data-name="' + safeName + '" data-description="' + safeDesc + '" transform="translate(' + node.x + ', ' + node.y + ')" tabindex="0" role="button" aria-label="Open ' + safeName + '">' +
        '<circle r="24" fill="' + color + '"></circle>' +
        '<text y="42">' + short + '</text>' +
        '</g>';
    }).join('');

    /* ── Tooltip ── */
    var viewport = svg.closest('.viewport') || svg.parentElement;

    function showTip(evt, nodeEl) {
      var name = nodeEl.getAttribute('data-name') || '';
      var description = nodeEl.getAttribute('data-description') || 'No description available.';
      tooltip.innerHTML = '<strong>' + name + '</strong><br>' + description;
      var rect = viewport.getBoundingClientRect();
      tooltip.style.left = (evt.clientX - rect.left + 14) + 'px';
      tooltip.style.top = (evt.clientY - rect.top + 14) + 'px';
      tooltip.classList.add('show');
    }

    function hideTip() {
      tooltip.classList.remove('show');
    }

    /* ── Node interaction ── */
    nodesGroup.querySelectorAll('.node').forEach(function (nodeEl) {
      function openTool() {
        var entry = nodeEl.getAttribute('data-entry');
        if (entry) window.location.href = entry;
      }

      nodeEl.addEventListener('click', openTool);
      nodeEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openTool();
        }
      });
      nodeEl.addEventListener('mousemove', function (evt) { showTip(evt, nodeEl); });
      nodeEl.addEventListener('mouseenter', function (evt) { showTip(evt, nodeEl); });
      nodeEl.addEventListener('mouseleave', hideTip);
      nodeEl.addEventListener('blur', hideTip);
    });

    /* ── Pan & zoom state ── */
    var state = { scale: 1, tx: 0, ty: 0 };

    function applyTransform() {
      graphRoot.setAttribute('transform', 'translate(' + state.tx + ', ' + state.ty + ') scale(' + state.scale + ')');
    }

    /* ── Zoom to cursor ── */
    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.08 : 0.92;
      var nextScale = Math.min(3.2, Math.max(0.45, state.scale * factor));

      /* Get mouse position in SVG coordinate space (accounts for viewBox) */
      var svgMouse = screenToSvg(svg, e.clientX, e.clientY);
      if (!svgMouse) return;

      /*
       * The graphRoot transform is: translate(tx, ty) scale(s)
       * A graph-space point (gx, gy) maps to SVG space as: (tx + gx*s, ty + gy*s)
       * The graph-space point currently under the mouse is:
       *   gx = (svgMouse.x - tx) / s
       *   gy = (svgMouse.y - ty) / s
       * After changing scale, we want the same graph point under the mouse:
       *   svgMouse.x = newTx + gx * newScale
       *   newTx = svgMouse.x - gx * newScale
       */
      var gx = (svgMouse.x - state.tx) / state.scale;
      var gy = (svgMouse.y - state.ty) / state.scale;

      state.scale = nextScale;
      state.tx = svgMouse.x - gx * state.scale;
      state.ty = svgMouse.y - gy * state.scale;

      applyTransform();
    }, { passive: false });

    /* ── Panning ── */
    var panning = false;
    var panStart = null;

    svg.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.node')) return;
      panning = true;
      panStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
      svg.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', function (e) {
      if (!panning || !panStart) return;
      /*
       * Pan delta is in screen pixels. Convert to SVG units by
       * dividing by the screen-to-SVG scale factor derived from the CTM.
       */
      var ctm = svg.getScreenCTM();
      var pixelScale = ctm ? ctm.a : 1;
      state.tx = panStart.tx + (e.clientX - panStart.x) / pixelScale;
      state.ty = panStart.ty + (e.clientY - panStart.y) / pixelScale;
      applyTransform();
    });

    function stopPan(e) {
      panning = false;
      panStart = null;
      try {
        if (typeof e.pointerId === 'number') svg.releasePointerCapture(e.pointerId);
      } catch (_) { /* pointer may already be released */ }
    }

    svg.addEventListener('pointerup', stopPan);
    svg.addEventListener('pointercancel', stopPan);

    document.getElementById('reset-view').addEventListener('click', function () {
      state.scale = 1;
      state.tx = 0;
      state.ty = 0;
      applyTransform();
    });
  }

  /* ── Init ── */

  async function init() {
    var svg = document.getElementById('graph');
    var viewport = svg ? (svg.closest('.viewport') || svg.parentElement) : null;

    if (!window.ToolRegistry || typeof window.ToolRegistry.loadAll !== 'function') {
      if (viewport) {
        viewport.innerHTML = '<div style="padding:40px;text-align:center;color:#fca5a5;">Tool registry failed to load. Ensure <code>shared/tool-registry.js</code> is accessible.</div>';
      }
      return;
    }

    var tools;
    try {
      tools = await window.ToolRegistry.loadAll();
    } catch (e) {
      if (viewport) {
        viewport.innerHTML = '<div style="padding:40px;text-align:center;color:#fca5a5;">Error loading tools: ' + escapeHtml(e.message || e) + '</div>';
      }
      return;
    }

    if (!tools || tools.length === 0) {
      if (viewport) {
        viewport.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8;">No tools found in registry.</div>';
      }
      return;
    }

    var legend = document.getElementById('legend');
    var graphRoot = document.getElementById('graph-root');
    var edgesGroup = document.getElementById('edges');
    var nodesGroup = document.getElementById('nodes');
    var labelsGroup = document.getElementById('category-labels');
    var tooltip = document.getElementById('tooltip');

    buildLegend(legend);
    renderGraph({
      svg: svg,
      graphRoot: graphRoot,
      edgesGroup: edgesGroup,
      nodesGroup: nodesGroup,
      labelsGroup: labelsGroup,
      tools: tools,
      tooltip: tooltip
    });
  }

  init();
})();
