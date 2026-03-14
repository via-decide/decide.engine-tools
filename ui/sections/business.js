import { createGridLayout } from '../components/grid-layout.js';
import { createSectionHeader } from '../components/section-header.js';
import { createToolCard } from '../components/tool-card.js';

const cards = [
  { id: 'decision-brief-guide', name: 'Decision Brief Guide', description: 'Turn messy analysis into a clean one-page decision brief you can share with any stakeholder.', entry: 'decision-brief-guide/index.html', category: 'business', chipLabel: 'Decisions', chipClass: 'c-business', icon: '⚖️' },
  { id: 'founder-narrative-builder', name: 'Founder Narrative Builder', description: 'Build your origin story, positioning, and founder narrative assets for pitches and press.', entry: 'founder/index.html', category: 'business', chipLabel: 'Founders', chipClass: 'c-business', icon: '🚀' },
  { id: 'sales-dashboard', name: 'Sales Dashboard', description: 'Track and review sales performance snapshots — input your metrics, get a structured summary.', entry: 'sales-dashboard/index.html', category: 'business', chipLabel: 'Sales', chipClass: 'c-business', icon: '📈' },
  { id: 'tool-search-discovery', chipLabel: 'Discovery', chipClass: 'c-system', icon: '🔎', name: 'Tool Search' },
  { id: 'tool-router', chipLabel: 'Workflow', chipClass: 'c-system', icon: '↗️', name: 'Tool Router' }
];

export function renderBusinessSection(toolsById) {
  const gridCards = cards.map((card) => createToolCard({ ...toolsById[card.id], ...card }));

  return `<div class="w">
    ${createSectionHeader({
      title: '📊 For Business',
      description: 'Make better decisions, build your narrative, track sales, and package your thinking for stakeholders.'
    })}
    ${createGridLayout(gridCards)}
  </div>`;
}
