#!/usr/bin/env node
/*
 * Seed engineering and research backlog items across zayvora repos
 * and add them to the "Prioritized backlog" project (Backlog status).
 *
 * Usage:
 *   GITHUB_TOKEN=... node scripts/seed-zayvora-backlog.js
 *   GITHUB_TOKEN=... node scripts/seed-zayvora-backlog.js --dry-run
 */

'use strict';

const ORG = 'zayvora';
const PROJECT_TITLE = 'Prioritized backlog';
const BACKLOG_OPTION = 'Backlog';
const DRY_RUN = process.argv.includes('--dry-run');

const LABELS = ['research', 'simulation', 'ai', 'protocol', 'llm', 'agent', 'infrastructure'];

const TASKS = [
  { repo: 'zayvora-highway-v2i', category: 'Infrastructure', title: 'Build interactive highway corridor visualization', labels: ['infrastructure', 'simulation'] },
  { repo: 'zayvora-highway-v2i', category: 'Infrastructure', title: 'Add RSU sensor placement model', labels: ['infrastructure', 'simulation'] },
  { repo: 'zayvora-highway-v2i', category: 'Infrastructure', title: 'Implement vehicle telemetry streaming', labels: ['infrastructure', 'ai'] },
  { repo: 'zayvora-highway-v2i', category: 'Infrastructure', title: 'Create dashboard data pipeline', labels: ['infrastructure', 'ai'] },

  { repo: 'zayvora-sim-lab', category: 'Simulation', title: 'Implement multi-lane traffic simulation', labels: ['simulation'] },
  { repo: 'zayvora-sim-lab', category: 'Simulation', title: 'Add vehicle acceleration physics model', labels: ['simulation'] },
  { repo: 'zayvora-sim-lab', category: 'Simulation', title: 'Generate synthetic traffic datasets', labels: ['simulation', 'research'] },
  { repo: 'zayvora-sim-lab', category: 'Simulation', title: 'Create scenario generator for congestion events', labels: ['simulation', 'ai'] },

  { repo: 'zayvora-sensor-net', category: 'Infrastructure', title: 'Build RSU node simulator', labels: ['infrastructure', 'simulation'] },
  { repo: 'zayvora-sensor-net', category: 'Infrastructure', title: 'Implement signal strength model', labels: ['infrastructure', 'simulation'] },
  { repo: 'zayvora-sensor-net', category: 'Infrastructure', title: 'Simulate IoT roadside sensors', labels: ['infrastructure', 'simulation'] },
  { repo: 'zayvora-sensor-net', category: 'Infrastructure', title: 'Add sensor calibration model', labels: ['infrastructure', 'research'] },

  { repo: 'zayvora-protocol-lab', category: 'LLM System', title: 'Design V2I message protocol', labels: ['protocol', 'research'] },
  { repo: 'zayvora-protocol-lab', category: 'LLM System', title: 'Implement message validation layer', labels: ['protocol'] },
  { repo: 'zayvora-protocol-lab', category: 'LLM System', title: 'Create latency simulation module', labels: ['protocol', 'simulation'] },
  { repo: 'zayvora-protocol-lab', category: 'LLM System', title: 'Add protocol stress testing', labels: ['protocol', 'simulation'] },

  { repo: 'zayvora-infrastructure-ai', category: 'AI Models', title: 'Implement traffic density analyzer', labels: ['ai', 'infrastructure'] },
  { repo: 'zayvora-infrastructure-ai', category: 'AI Models', title: 'Create congestion prediction model', labels: ['ai', 'infrastructure'] },
  { repo: 'zayvora-infrastructure-ai', category: 'AI Models', title: 'Build infrastructure optimization algorithm', labels: ['ai', 'infrastructure'] },
  { repo: 'zayvora-infrastructure-ai', category: 'AI Models', title: 'Simulate smart traffic control', labels: ['ai', 'simulation', 'infrastructure'] },

  { repo: 'zayvora-llm', category: 'LLM System', title: 'Build training dataset loader', labels: ['llm', 'ai'] },
  { repo: 'zayvora-llm', category: 'LLM System', title: 'Implement LoRA training pipeline', labels: ['llm', 'ai'] },
  { repo: 'zayvora-llm', category: 'LLM System', title: 'Add evaluation benchmarks', labels: ['llm', 'research'] },
  { repo: 'zayvora-llm', category: 'LLM System', title: 'Create inference API server', labels: ['llm', 'infrastructure'] },

  { repo: 'zayvora-agent', category: 'Agents', title: 'Implement repo scanning agent', labels: ['agent', 'ai'] },
  { repo: 'zayvora-agent', category: 'Agents', title: 'Add automated code generation agent', labels: ['agent', 'ai'] },
  { repo: 'zayvora-agent', category: 'Agents', title: 'Build research summarization agent', labels: ['agent', 'research'] },
  { repo: 'zayvora-agent', category: 'Agents', title: 'Create task orchestration workflow', labels: ['agent', 'infrastructure'] },

  { repo: 'zayvora-research', category: 'Research', title: 'Document smart highway architecture', labels: ['research', 'infrastructure'] },
  { repo: 'zayvora-research', category: 'Research', title: 'Write V2I protocol research notes', labels: ['research', 'protocol'] },
  { repo: 'zayvora-research', category: 'Research', title: 'Analyze intelligent transport systems', labels: ['research', 'ai'] },
  { repo: 'zayvora-research', category: 'Research', title: 'Prepare infrastructure AI whitepaper', labels: ['research', 'ai', 'infrastructure'] }
];

function requiredEnv(name) {
  const value = process.env[name];
  if (!value && !DRY_RUN) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

const GITHUB_TOKEN = requiredEnv('GITHUB_TOKEN');

async function gql(query, variables = {}) {
  if (DRY_RUN) return {};
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  const payload = await response.json();
  if (!response.ok || payload.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(payload.errors || payload, null, 2)}`);
  }
  return payload.data;
}

async function rest(path, method = 'GET', body) {
  if (DRY_RUN) return {};
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 404) return null;

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`REST error ${response.status} on ${path}: ${JSON.stringify(payload)}`);
  }
  return payload;
}

function buildBody(task) {
  return [
    `## Category`,
    `${task.category}`,
    '',
    '## Objective',
    task.title,
    '',
    '## Acceptance Criteria',
    '- Problem statement documented',
    '- Implementation plan drafted',
    '- Initial validation or experiment result attached',
    '',
    '## Project Placement',
    `- Project: ${PROJECT_TITLE}`,
    `- Status: ${BACKLOG_OPTION}`
  ].join('\n');
}

async function getProjectAndBacklogField() {
  if (DRY_RUN) {
    return { projectId: 'DRY_RUN_PROJECT', statusFieldId: 'DRY_RUN_STATUS_FIELD', backlogOptionId: 'DRY_RUN_BACKLOG' };
  }

  const data = await gql(
    `query($org: String!, $first: Int!) {
      organization(login: $org) {
        projectsV2(first: $first) {
          nodes {
            id
            title
            fields(first: 30) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options { id name }
                }
              }
            }
          }
        }
      }
    }`,
    { org: ORG, first: 50 }
  );

  const project = data.organization.projectsV2.nodes.find((node) => node.title === PROJECT_TITLE);
  if (!project) throw new Error(`Project not found: ${PROJECT_TITLE}`);

  const statusField = project.fields.nodes.find((field) => field.name === 'Status');
  if (!statusField) throw new Error('Status field not found on target project');

  const backlogOption = statusField.options.find((option) => option.name === BACKLOG_OPTION);
  if (!backlogOption) throw new Error(`Backlog option not found in Status field`);

  return { projectId: project.id, statusFieldId: statusField.id, backlogOptionId: backlogOption.id };
}

async function ensureLabel(repo, label) {
  const existing = await rest(`/repos/${ORG}/${repo}/labels/${encodeURIComponent(label)}`);
  if (existing) return;

  if (DRY_RUN) return;

  await rest(`/repos/${ORG}/${repo}/labels`, 'POST', {
    name: label,
    color: '0e8a16',
    description: `Auto-created label: ${label}`
  });
}

async function addIssueToProject(projectId, issueNodeId, statusFieldId, backlogOptionId) {
  if (DRY_RUN) return { itemId: 'DRY_RUN_ITEM' };

  const addResult = await gql(
    `mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
        item { id }
      }
    }`,
    { projectId, contentId: issueNodeId }
  );

  const itemId = addResult.addProjectV2ItemById.item.id;

  await gql(
    `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId,
        itemId: $itemId,
        fieldId: $fieldId,
        value: {singleSelectOptionId: $optionId}
      }) {
        projectV2Item { id }
      }
    }`,
    { projectId, itemId, fieldId: statusFieldId, optionId: backlogOptionId }
  );

  return { itemId };
}

async function createIssue(repo, task) {
  if (DRY_RUN) {
    return {
      html_url: `https://github.com/${ORG}/${repo}/issues/DRY_RUN`,
      node_id: 'DRY_RUN_NODE',
      number: 0
    };
  }

  return rest(`/repos/${ORG}/${repo}/issues`, 'POST', {
    title: task.title,
    body: buildBody(task),
    labels: task.labels
  });
}

async function run() {
  const { projectId, statusFieldId, backlogOptionId } = await getProjectAndBacklogField();
  const summary = [];

  for (const repo of [...new Set(TASKS.map((task) => task.repo))]) {
    for (const label of LABELS) {
      await ensureLabel(repo, label);
    }
  }

  for (const task of TASKS) {
    const issue = await createIssue(task.repo, task);
    const projectItem = await addIssueToProject(projectId, issue.node_id, statusFieldId, backlogOptionId);

    summary.push({
      repository: task.repo,
      category: task.category,
      issue: issue.html_url,
      projectItemId: projectItem.itemId,
      labels: task.labels
    });

    console.log(`[${task.repo}] ${task.title} -> ${issue.html_url}`);
  }

  const grouped = summary.reduce((acc, entry) => {
    acc[entry.repository] = (acc[entry.repository] || 0) + 1;
    return acc;
  }, {});

  console.log('\n=== SUMMARY ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Items created: ${summary.length}`);
  console.log(`Repositories affected: ${Object.keys(grouped).length}`);
  for (const [repo, count] of Object.entries(grouped)) {
    console.log(`- ${repo}: ${count}`);
  }
  console.log(`Project board items added: ${summary.length}`);
}

run().catch((error) => {
  console.error('Failed to seed backlog:', error.message);
  process.exit(1);
});
