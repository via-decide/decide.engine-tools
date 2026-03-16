import { createGridLayout } from '../components/grid-layout.js';
import { createSectionHeader } from '../components/section-header.js';
import { createToolCard } from '../components/tool-card.js';

const cards = [
  { id: 'student-research', chipLabel: 'Students', chipClass: 'c-education', icon: '📚', name: 'Student Research' },
  { id: 'student-research', chipLabel: 'Research', chipClass: 'c-researchers', icon: '🧩', name: 'Multi-Source Research', description: 'Interactive multi-source synthesis powered by Wikimedia search sources.', entry: 'student-research/index.html' },
  { id: 'interview-prep', name: 'Interview Prep', description: 'Build structured answers for any interview question — behavioural, technical, or case-based.', entry: 'interview-prep/index.html', category: 'education', chipLabel: 'Career', chipClass: 'c-education', icon: '🎯' },
  { id: 'context-packager', chipLabel: 'Workflow', chipClass: 'c-system', icon: '📦' },
  { id: 'workflow-template-gallery', chipLabel: 'Templates', chipClass: 'c-system', icon: '🗂️' },
  { id: 'export-studio', chipLabel: 'Export', chipClass: 'c-system', icon: '📤' }
];

export function renderResearchSection(toolsById) {
  const gridCards = cards.map((card) => createToolCard({ ...toolsById[card.id], ...card }));

  return `<div class="w">
    ${createSectionHeader({
      title: '🔬 For Researchers &amp; Students',
      description: 'Structure your learning, synthesise sources, prep for interviews, and evaluate your outputs.'
    })}
    ${createGridLayout(gridCards)}
  </div>`;
}
export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="researchers">
    <div class="w">
      <div class="sh">
        <h2>🔬 For Researchers &amp; Students</h2>
        <p>Structure your learning, synthesise sources, prep for interviews, and evaluate your outputs.</p>
      </div>
      <div class="grid">
        <a class="card" href="./student-research/index.html">
          <div class="card-top"><span class="chip c-education">Students</span><span class="card-icon">📚</span></div>
          <h3>Student Research</h3>
          <p>Structure your research process — define your question, organise sources, and build your summary.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./student-research/index.html">
          <div class="card-top"><span class="chip c-researchers">Research</span><span class="card-icon">🧩</span></div>
          <h3>Multi-Source Research</h3>
          <p>Synthesise findings from multiple sources into one coherent, structured research output.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./interview-prep/index.html">
          <div class="card-top"><span class="chip c-education">Career</span><span class="card-icon">🎯</span></div>
          <h3>Interview Prep</h3>
          <p>Build structured answers for any interview question — behavioural, technical, or case-based.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/context-packager/index.html">
          <div class="card-top"><span class="chip c-system">Workflow</span><span class="card-icon">📦</span></div>
          <h3>Context Packager</h3>
          <p>Collect key context from your research and package it into a reusable handoff document.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/workflow-template-gallery/index.html">
          <div class="card-top"><span class="chip c-system">Templates</span><span class="card-icon">🗂️</span></div>
          <h3>Workflow Gallery</h3>
          <p>Browse reusable workflow templates and generate launch-ready sequence briefs for any project.</p>
          <span class="card-link">Open</span>
        </a>
      </div>
    </div>
  </section>`);
}
