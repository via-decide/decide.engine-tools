(function (global) {
  'use strict';

  let simulation = null;

  function initGraph(containerId, data, onNodeClick) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous graph
    container.innerHTML = '';

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Create Tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'graph-tooltip');

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const gph = svg.append('g');

    // Zoom setup
    svg.call(d3.zoom().on('zoom', (event) => {
      gph.attr('transform', event.transform);
    }));

    const nodes = data.nodes || [];
    const edges = data.edges || [];

    // Force Simulation
    simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.type === 'domain' ? 24 : 16));

    // Draw Links (edges)
    const link = gph.append('g')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', d => d.relation === 'session_next' ? 'rgba(255,255,255,0.06)' : 'rgba(6, 182, 212, 0.12)')
      .attr('stroke-width', d => d.relation === 'session_next' ? 1 : 1.5)
      .attr('stroke-dasharray', d => d.relation === 'session_next' ? '3,3' : '0');

    // Draw Node Groups
    const node = gph.append('g')
      .selectAll('.node-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .html(`<strong>${d.label}</strong><br/>Type: ${d.type}<br/>Weight: ${d.weight || 0}${d.weak ? '<br/><span style="color:#f43f5e">⚠️ Weak Concept</span>' : ''}`)
          .style('left', (event.offsetX + 15) + 'px')
          .style('top', (event.offsetY - 15) + 'px');
      })
      .on('mousemove', (event) => {
        tooltip.style('left', (event.offsetX + 15) + 'px')
          .style('top', (event.offsetY - 15) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      })
      .on('click', (event, d) => {
        if (typeof onNodeClick === 'function') {
          onNodeClick(d);
        }
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add Circles
    node.append('circle')
      .attr('r', d => d.type === 'domain' ? 18 : 8)
      .attr('fill', d => {
        if (d.type === 'domain') {
          if (d.label.includes('Physical')) return '#3b82f6';
          if (d.label.includes('Organic')) return '#a855f7';
          if (d.label.includes('Inorganic')) return '#06b6d4';
          if (d.label.includes('Coordination')) return '#f59e0b';
          return '#64748b';
        } else {
          // Concept node states
          if (d.weak) return '#f43f5e';
          if (d.correct) return '#10b981';
          return 'rgba(6, 182, 212, 0.4)';
        }
      })
      .attr('stroke', d => d.type === 'domain' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)')
      .attr('stroke-width', 1.5);

    // Add Labels for Domain nodes or key concepts
    node.append('text')
      .attr('dy', d => d.type === 'domain' ? 30 : 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f8fafc')
      .style('font-size', d => d.type === 'domain' ? '11px' : '9px')
      .style('font-weight', d => d.type === 'domain' ? '600' : '400')
      .style('pointer-events', 'none')
      .text(d => d.label);

    // Update positions on Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    // Drag event handlers
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  global.LoreLabsGraph = {
    init: initGraph
  };
})(window);
