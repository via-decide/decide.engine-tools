(function (global) {
  'use strict';

  const NOTE_FILES = [
    'quantum_mechanics.md',
    'physics_foundations.md',
    'classical_mechanics.md'
  ];

  const graphState = {
    nodes: [],
    edges: []
  };

  function nodeColor(type) {
    const t = String(type || '').toLowerCase();
    if (t === 'physics') return '#34d399'; // green for Physics category
    if (t === 'topic') return '#29B6F6';   // blue for dependencies
    if (t === 'entity') return '#a78bfa';  // purple for links
    return '#fbbf24';                      // amber/default
  }

  function parseMarkdownNote(filename, content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    let title = filename.replace('.md', '').replace(/_/g, ' ');
    let category = 'Uncategorized';
    let dependencies = [];
    let body = content;

    if (match) {
      const yamlStr = match[1];
      body = match[2];
      
      const lines = yamlStr.split('\n');
      let currentKey = null;
      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          if (key === 'title') title = val.replace(/^["']|["']$/g, '');
          if (key === 'category') category = val.replace(/^["']|["']$/g, '');
          if (key === 'dependencies') {
            dependencies = [];
            currentKey = 'dependencies';
          }
        } else if (line.trim().startsWith('-') && currentKey === 'dependencies') {
          const depVal = line.trim().substring(1).trim().replace(/^["']|["']$/g, '');
          if (depVal) dependencies.push(depVal);
        } else {
          currentKey = null;
        }
      });
    }

    // Extract [[Concept]] wiki-links from the markdown body
    const linkRegex = /\[\[(.*?)\]\]/g;
    const links = [];
    let linkMatch;
    while ((linkMatch = linkRegex.exec(body)) !== null) {
      links.push(linkMatch[1].trim());
    }

    return {
      id: filename.replace('.md', ''),
      label: title,
      category,
      dependencies,
      links
    };
  }

  function renderGraph(root) {
    if (!root) return;
    if (!graphState.nodes.length) {
      root.innerHTML = '<div class="text-sm text-[var(--muted)]">Loading local concept graph...</div>';
      return;
    }

    const width = 300;
    const height = 220;

    const nodeMarkup = graphState.nodes.map((node, index) => {
      const angle = (index / Math.max(graphState.nodes.length, 1)) * Math.PI * 2;
      const x = Math.round(width / 2 + Math.cos(angle) * 90);
      const y = Math.round(height / 2 + Math.sin(angle) * 80);
      return `<g data-node-id="${node.id}" style="cursor:pointer" title="Click to view note">
                <circle cx="${x}" cy="${y}" r="11" fill="${nodeColor(node.type)}"></circle>
                <text x="${x + 14}" y="${y + 4}" fill="#f0e4d0" font-size="9" font-family="Space Grotesk, system-ui">${node.label.slice(0, 20)}</text>
              </g>`;
    }).join('');

    const edgeMarkup = graphState.edges.map((edge) => {
      const from = graphState.nodes.findIndex((n) => n.id === edge.from);
      const to = graphState.nodes.findIndex((n) => n.id === edge.to);
      if (from < 0 || to < 0) return '';
      const fromAngle = (from / Math.max(graphState.nodes.length, 1)) * Math.PI * 2;
      const toAngle = (to / Math.max(graphState.nodes.length, 1)) * Math.PI * 2;
      const x1 = Math.round(width / 2 + Math.cos(fromAngle) * 90);
      const y1 = Math.round(height / 2 + Math.sin(fromAngle) * 80);
      const x2 = Math.round(width / 2 + Math.cos(toAngle) * 90);
      const y2 = Math.round(height / 2 + Math.sin(toAngle) * 80);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3a2e28" stroke-width="1.2" opacity="0.6"></line>`;
    }).join('');

    root.innerHTML = `
      <div class="text-xs text-[var(--muted)] mb-2">Click a concept node to load it into the editor.</div>
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="220">
        ${edgeMarkup}
        ${nodeMarkup}
      </svg>
    `;

    root.querySelectorAll('[data-node-id]').forEach((nodeEl) => {
      nodeEl.addEventListener('click', () => {
        const id = nodeEl.getAttribute('data-node-id');
        const node = graphState.nodes.find((n) => n.id === id);
        if (node) {
          const notesTextarea = document.getElementById('research-notes-text');
          if (notesTextarea) {
            const filename = id + '.md';
            fetch('./notes/' + filename)
              .then(res => {
                if (res.ok) return res.text();
                return `---\ntitle: ${node.label}\ncategory: Uncategorized\ndependencies: []\n---\n\n# ${node.label}\n\nStart writing notes for ${node.label}...`;
              })
              .then(content => {
                notesTextarea.value = content;
                if (global.NotesEditor && typeof global.NotesEditor.saveNote === 'function') {
                  global.NotesEditor.saveNote(content);
                }
              })
              .catch(err => {
                console.warn('Failed to load note content:', err);
              });
          }
        }
      });
    });
  }

  async function loadGraphFromNotes(root) {
    const nodes = [];
    const edges = [];
    const addedNodeIds = new Set();

    for (const filename of NOTE_FILES) {
      try {
        const res = await fetch('./notes/' + filename);
        if (!res.ok) continue;
        const text = await res.text();
        const parsed = parseMarkdownNote(filename, text);

        if (!addedNodeIds.has(parsed.id)) {
          nodes.push({ id: parsed.id, label: parsed.label, type: parsed.category });
          addedNodeIds.add(parsed.id);
        }

        if (parsed.dependencies) {
          parsed.dependencies.forEach(dep => {
            const depId = dep.toLowerCase().replace(/\s+/g, '_');
            if (!addedNodeIds.has(depId)) {
              nodes.push({ id: depId, label: dep.replace(/_/g, ' '), type: 'topic' });
              addedNodeIds.add(depId);
            }
            edges.push({ from: parsed.id, to: depId });
          });
        }

        if (parsed.links) {
          parsed.links.forEach(link => {
            const linkId = link.toLowerCase().replace(/\s+/g, '_');
            if (!addedNodeIds.has(linkId)) {
              nodes.push({ id: linkId, label: link, type: 'entity' });
              addedNodeIds.add(linkId);
            }
            edges.push({ from: parsed.id, to: linkId });
          });
        }
      } catch (err) {
        console.error('Failed to load and parse note: ' + filename, err);
      }
    }

    graphState.nodes = nodes;
    graphState.edges = edges;
    renderGraph(root);
  }

  function mountKnowledgeGraph(root) {
    loadGraphFromNotes(root);
  }

  function updateFromResults(results) {
    // Legacy search update fallback, keeping interface backward compatible
    if (!graphState.nodes.length) {
      const safe = Array.isArray(results) ? results : [];
      const nodes = [];
      const edges = [];
      safe.slice(0, 6).forEach((item, index) => {
        const docId = item.document_id || `doc-${index}`;
        nodes.push({ id: docId, label: item.title || docId, type: 'topic' });
      });
      graphState.nodes = nodes;
      graphState.edges = edges;
    }
  }

  global.KnowledgeGraph = {
    mount: mountKnowledgeGraph,
    updateFromResults,
    renderGraph
  };
})(window);
