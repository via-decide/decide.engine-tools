const payloadEl = document.getElementById('payload');
const modeEl = document.getElementById('mode');
const outputEl = document.getElementById('output');
const key = 'orchard.wave1.fair-ranking-engine';

function run() {
  const payload = EngineUtils.tryParse(payloadEl.value.trim());
  const mode = modeEl.value;
  const result = EngineModels.fairRankingEngine(payload, mode);
  outputEl.textContent = JSON.stringify(result, null, 2);
  ToolStorage.write(key, { payload: payloadEl.value, mode, output: outputEl.textContent });
}

document.getElementById('run').addEventListener('click', run);
document.getElementById('copy').addEventListener('click', () => EngineUtils.copyText(outputEl.textContent || ''));
document.getElementById('download').addEventListener('click', () => EngineUtils.downloadText('fair-ranking-engine-output.json', outputEl.textContent || ''));

const saved = ToolStorage.read(key, null);
if (saved) {
  payloadEl.value = saved.payload || '';
  modeEl.value = saved.mode || 'steady';
  outputEl.textContent = saved.output || '';
} else {
  payloadEl.value = JSON.stringify(EngineModels.defaults['fairRankingEngine'], null, 2);
}
