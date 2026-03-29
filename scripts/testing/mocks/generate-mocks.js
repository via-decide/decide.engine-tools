const fs = require('fs');
const path = require('path');

const mockDataTemplate = {
  WalletState: {
    address: 'test_local_wallet',
    balance: { 
      'orchards': 1500,
      'water': 120,
      'seeds': 50
    },
    lastUpdated: new Date().toISOString()
  },
  PlantState: {
    id: 'plant_mock_001',
    stage: 'sprout',
    health: 98,
    yield: 0,
    fertilizerApplied: false,
    timestamp: new Date().toISOString()
  },
  AgentPlan: {
    agentId: 'mock_agent_002',
    tasks: [
      { id: 't1', status: 'pending', target: 'harvest' },
      { id: 't2', status: 'completed', target: 'irrigate' }
    ]
  }
};

const outputDir = path.join(__dirname, 'data');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const outputFile = path.join(outputDir, 'reference-data.json');
fs.writeFileSync(outputFile, JSON.stringify(mockDataTemplate, null, 2));

console.log(`Mock Data Synthesizer: reference-data.json generated at ${outputFile}`);
