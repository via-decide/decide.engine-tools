import { renderBuildersSection } from './builders.js';
import { renderBusinessSection } from './business.js';
import { renderCreatorsSection } from './creators.js';
import { renderSection as renderGamesSection } from './games.js';
import { renderResearchSection } from './research.js';

export async function renderHomeSections() {
  if (!window.ToolRegistry?.loadAll) {
    return;
  }

  const tools = await window.ToolRegistry.loadAll();
  const toolsById = Object.fromEntries(tools.map((tool) => [tool.id, tool]));

  const sectionRenderers = {
    creators: () => renderCreatorsSection(toolsById),
    builders: () => renderBuildersSection(toolsById),
    researchers: () => renderResearchSection(toolsById),
    business: () => renderBusinessSection(toolsById),
    games: () => renderGamesSection()
  };

  Object.entries(sectionRenderers).forEach(([id, render]) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.innerHTML = render();
  });

  return tools;
}
