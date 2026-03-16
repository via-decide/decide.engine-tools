import { createGridLayout } from '../components/grid-layout.js';
import { createSectionHeader } from '../components/section-header.js';
import { createToolCard } from '../components/tool-card.js';

const cards = [
  { id: 'decision-brief-guide', name: 'Decision Brief', description: 'Interactive decision brief workflow inside Student Research (with PDF export).', entry: 'student-research/index.html', category: 'business', chipLabel: 'Decisions', chipClass: 'c-business', icon: '⚖️' },
  { id: 'founder', name: 'Founder Narrative Builder', description: 'Build your origin story, positioning, and founder narrative assets for pitches and press.', entry: 'founder/index.html', category: 'business', chipLabel: 'Founders', chipClass: 'c-business', icon: '🚀' },
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
export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="business">
    <div class="w">
      <div class="sh">
        <h2>📊 For Business</h2>
        <p>Make better decisions, build your narrative, track sales, and package your thinking for stakeholders.</p>
      </div>
      <div class="grid">
        <a class="card" href="./student-research/index.html">
          <div class="card-top"><span class="chip c-business">Decisions</span><span class="card-icon">⚖️</span></div>
          <h3>Decision Brief</h3>
          <p>Turn messy analysis into a clean one-page decision brief you can share with any stakeholder.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./founder/index.html">
          <div class="card-top"><span class="chip c-business">Founders</span><span class="card-icon">🚀</span></div>
          <h3>Founder Narrative Builder</h3>
          <p>Build your origin story, positioning, and founder narrative assets for pitches and press.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./sales-dashboard/index.html">
          <div class="card-top"><span class="chip c-business">Sales</span><span class="card-icon">📈</span></div>
          <h3>Sales Dashboard</h3>
          <p>Track and review sales performance snapshots — input your metrics, get a structured summary.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/tool-search-discovery/index.html">
          <div class="card-top"><span class="chip c-system">Discovery</span><span class="card-icon">🔎</span></div>
          <h3>Tool Search</h3>
          <p>Search across all tools by category, keyword, or use case to find the right one fast.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/tool-router/index.html">
          <div class="card-top"><span class="chip c-system">Workflow</span><span class="card-icon">↗️</span></div>
          <h3>Tool Router</h3>
          <p>Describe what you need to do and get a suggested sequence of tools to use next.</p>
          <span class="card-link">Open</span>
        </a>
      </div>
    </div>
  </section>`);
}
