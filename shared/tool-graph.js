(function () {
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

  function getSvgPoint(svg, x, y) {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function buildLegend(container) {
    container.innerHTML = CATEGORY_ORDER.map((key) => `
      <div class="legend-item">
        <span class="swatch" style="background:${CATEGORY_COLORS[key]}"></span>
        ${CATEGORY_LABELS[key]}
      </div>
    `).join('');
  }

  function layoutNodes(tools) {
    const grouped = new Map(CATEGORY_ORDER.map((k) => [k, []]));
    tools.forEach((tool) => {
      const category = grouped.has(tool.category) ? tool.category : 'misc';
      grouped.get(category).push(tool);
    });

    const colGap = 250;
    const rowGap = 96;
    const startX = 170;
    const startY = 100;
    const nodes = [];

    CATEGORY_ORDER.forEach((category, colIdx) => {
      const bucket = grouped.get(category) || [];
      bucket.sort((a, b) => a.name.localeCompare(b.name));

      bucket.forEach((tool, rowIdx) => {
        nodes.push({
          ...tool,
          x: startX + colIdx * colGap,
          y: startY + rowIdx * rowGap + 32,
          category
        });
      });
    });

    const maxRows = Math.max(1, ...CATEGORY_ORDER.map((k) => (grouped.get(k) || []).length));
    return {
      nodes,
      width: startX * 2 + (CATEGORY_ORDER.length - 1) * colGap,
      height: 180 + maxRows * rowGap
    };
  }

  function renderGraph({ svg, graphRoot, edgesGroup, nodesGroup, labelsGroup, tools, tooltip }) {
    const byId = new Map(tools.map((tool) => [tool.id, tool]));
    const { nodes, width, height } = layoutNodes(tools);

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('aria-label', 'Tool graph explorer');

    labelsGroup.innerHTML = CATEGORY_ORDER.map((key, idx) => `
      <text x="${170 + idx * 250}" y="38" fill="#a8b2d3" font-size="13" text-anchor="middle">${CATEGORY_LABELS[key]}</text>
    `).join('');

    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const edges = [];
    nodes.forEach((node) => {
      (node.relatedTools || []).forEach((targetId) => {
        const target = nodeById.get(targetId) || byId.get(targetId);
        if (!target || !nodeById.get(target.id)) return;
        edges.push({ from: node.id, to: target.id });
      });
    });

    edgesGroup.innerHTML = edges.map((edge) => {
      const a = nodeById.get(edge.from);
      const b = nodeById.get(edge.to);
      return `<line class="edge" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
    }).join('');

    nodesGroup.innerHTML = nodes.map((node) => {
      const safeName = node.name.replace(/"/g, '&quot;');
      const short = node.name.length > 20 ? `${node.name.slice(0, 20)}…` : node.name;
      return `
        <g class="node" data-id="${node.id}" data-entry="${node.entry}" data-name="${safeName}" data-description="${(node.description || '').replace(/"/g, '&quot;')}" transform="translate(${node.x}, ${node.y})" tabindex="0" role="button" aria-label="Open ${safeName}">
          <circle r="24" fill="${CATEGORY_COLORS[node.category] || CATEGORY_COLORS.misc}"></circle>
          <text y="42">${short}</text>
        </g>
      `;
    }).join('');

    const showTip = (evt, nodeEl) => {
      const name = nodeEl.getAttribute('data-name') || '';
      const description = nodeEl.getAttribute('data-description') || 'No description available.';
      tooltip.innerHTML = `<strong>${name}</strong><br>${description}`;
      tooltip.style.left = `${evt.clientX + 12}px`;
      tooltip.style.top = `${evt.clientY + 12}px`;
      tooltip.classList.add('show');
    };

    const hideTip = () => tooltip.classList.remove('show');

    nodesGroup.querySelectorAll('.node').forEach((nodeEl) => {
      const open = () => {
        const entry = nodeEl.getAttribute('data-entry');
        if (entry) window.location.href = entry;
      };

      nodeEl.addEventListener('click', open);
      nodeEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
      nodeEl.addEventListener('mousemove', (evt) => showTip(evt, nodeEl));
      nodeEl.addEventListener('mouseenter', (evt) => showTip(evt, nodeEl));
      nodeEl.addEventListener('mouseleave', hideTip);
      nodeEl.addEventListener('blur', hideTip);
    });

    const state = { scale: 1, tx: 0, ty: 0 };
    const applyTransform = () => {
      graphRoot.setAttribute('transform', `translate(${state.tx}, ${state.ty}) scale(${state.scale})`);
    };

    let panning = false;
    let panStart = null;

    svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      const nextScale = Math.min(3.2, Math.max(0.45, state.scale * factor));
      const before = getSvgPoint(svg, e.clientX, e.clientY);
      state.scale = nextScale;
      const after = getSvgPoint(svg, e.clientX, e.clientY);
      state.tx += (after.x - before.x) * state.scale;
      state.ty += (after.y - before.y) * state.scale;
      applyTransform();
    }, { passive: false });

    svg.addEventListener('pointerdown', (e) => {
      panning = true;
      panStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
      svg.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', (e) => {
      if (!panning || !panStart) return;
      state.tx = panStart.tx + (e.clientX - panStart.x);
      state.ty = panStart.ty + (e.clientY - panStart.y);
      applyTransform();
    });

    const stopPan = (e) => {
      panning = false;
      panStart = null;
      if (typeof e.pointerId === 'number') svg.releasePointerCapture(e.pointerId);
    };

    svg.addEventListener('pointerup', stopPan);
    svg.addEventListener('pointercancel', stopPan);

    document.getElementById('reset-view').addEventListener('click', () => {
      state.scale = 1;
      state.tx = 0;
      state.ty = 0;
      applyTransform();
    });
  }

  async function init() {
    if (!window.ToolRegistry || typeof window.ToolRegistry.loadAll !== 'function') return;

    const tools = await window.ToolRegistry.loadAll();
    const legend = document.getElementById('legend');
    const svg = document.getElementById('graph');
    const graphRoot = document.getElementById('graph-root');
    const edgesGroup = document.getElementById('edges');
    const nodesGroup = document.getElementById('nodes');
    const labelsGroup = document.getElementById('category-labels');
    const tooltip = document.getElementById('tooltip');

    buildLegend(legend);
    renderGraph({ svg, graphRoot, edgesGroup, nodesGroup, labelsGroup, tools, tooltip });
  }

  init();
})();
