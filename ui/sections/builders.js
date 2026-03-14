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
export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="builders">
    <div class="w">
      <div class="sh">
        <h2>💻 For Builders</h2>
        <p>Spec, code, review, and ship. Tools for developers, product managers, and anyone building something.</p>
      </div>
      <div class="grid">
        <a class="card" href="./tools/spec-builder/index.html">
          <div class="card-top"><span class="chip c-operators">Product</span><span class="card-icon">📋</span></div>
          <h3>Spec Builder</h3>
          <p>Turn a vague feature idea into a proper product spec with goals, constraints, and acceptance criteria.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/task-splitter/index.html">
          <div class="card-top"><span class="chip c-coders">Planning</span><span class="card-icon">🗂️</span></div>
          <h3>Task Splitter</h3>
          <p>Break a big goal into ordered subtasks with owners, dependencies, and done criteria. Hand to any agent or dev.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/repo-improvement-brief/index.html">
          <div class="card-top"><span class="chip c-coders">Dev</span><span class="card-icon">🔧</span></div>
          <h3>Repo Improvement Brief</h3>
          <p>Turn a gut feeling about a codebase into a focused implementation brief ready for Codex or Claude.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/code-generator/index.html">
          <div class="card-top"><span class="chip c-coders">Code</span><span class="card-icon">⚡</span></div>
          <h3>Code Generator</h3>
          <p>Describe what you need and get a working HTML tool skeleton with structure and basic logic.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/code-reviewer/index.html">
          <div class="card-top"><span class="chip c-coders">Review</span><span class="card-icon">🔍</span></div>
          <h3>Code Reviewer</h3>
          <p>Paste code and get structured feedback on quality, bugs, and improvements before you push.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./agent/index.html">
          <div class="card-top"><span class="chip c-coders">AI</span><span class="card-icon">🤖</span></div>
          <h3>Agent Builder</h3>
          <p>Design simple AI agents and workflows — define tasks, constraints, and output format.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./app-generator/index.html">
          <div class="card-top"><span class="chip c-coders">Generate</span><span class="card-icon">🏗️</span></div>
          <h3>App Generator</h3>
          <p>Describe your micro-app idea and get an implementation plan and feature list to start building.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/template-vault/index.html">
          <div class="card-top"><span class="chip c-operators">Templates</span><span class="card-icon">🗄️</span></div>
          <h3>Template Vault</h3>
          <p>Save and reuse your best prompts, specs, and briefs. Your personal reusable asset library.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/export-studio/index.html">
          <div class="card-top"><span class="chip c-operators">Export</span><span class="card-icon">📤</span></div>
          <h3>Export Studio</h3>
          <p>Package any output as plain text, Markdown, or JSON for handoff to a tool, agent, or teammate.</p>
          <span class="card-link">Open</span>
        </a>
      </div>
    </div>
  </section>`);
}
