import { createGridLayout } from '../components/grid-layout.js';
import { createSectionHeader } from '../components/section-header.js';
import { createToolCard } from '../components/tool-card.js';

const cards = [
  { id: 'student-research', chipLabel: 'Students', chipClass: 'c-education', icon: '📚', name: 'Student Research' },
  { id: 'multi-source-research-explained', chipLabel: 'Research', chipClass: 'c-researchers', icon: '🧩', name: 'Multi-Source Research' },
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
