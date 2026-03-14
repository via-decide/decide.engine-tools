import { createGridLayout } from '../components/grid-layout.js';
import { createSectionHeader } from '../components/section-header.js';
import { createToolCard } from '../components/tool-card.js';

const cards = [
  { id: 'spec-builder', chipLabel: 'Product', chipClass: 'c-operators', icon: '📋' },
  { id: 'task-splitter', chipLabel: 'Planning', chipClass: 'c-coders', icon: '🗂️' },
  { id: 'repo-improvement-brief', chipLabel: 'Dev', chipClass: 'c-coders', icon: '🔧' },
  { id: 'code-generator', chipLabel: 'Code', chipClass: 'c-coders', icon: '⚡' },
  { id: 'code-reviewer', chipLabel: 'Review', chipClass: 'c-coders', icon: '🔍' },
  { id: 'agent-builder', name: 'Agent Builder', description: 'Design simple multi-agent workflows with role cards, prompts, and handoff sequencing.', entry: 'agent/index.html', category: 'coders', chipLabel: 'AI', chipClass: 'c-coders', icon: '🤖' }
];

export function renderBuildersSection(toolsById) {
  const gridCards = cards.map((card) => createToolCard({ ...toolsById[card.id], ...card }));

  return `<div class="w">
    ${createSectionHeader({
      title: '💻 For Builders',
      description: 'Spec, code, review, and ship. Tools for developers, product managers, and anyone building something.'
    })}
    ${createGridLayout(gridCards)}
  </div>`;
}
