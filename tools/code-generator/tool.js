const toolName = document.getElementById('toolName');
const description = document.getElementById('description');
const inputs = document.getElementById('inputs');
const output = document.getElementById('output');

function sanitizeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-tool';
}

function generate() {
  const name = toolName.value.trim() || 'New Tool';
  const desc = description.value.trim() || 'Describe this tool.';
  const fields = inputs.value.split(',').map((f) => f.trim()).filter(Boolean);
  const toolId = sanitizeId(name);

  const fieldMarkup = fields.map((f) => `      <label>${f}</label>\n      <input placeholder="${f}" />`).join('\n');

  output.textContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name}</title>
</head>
<body>
  <main>
    <h1>${name}</h1>
    <p>${desc}</p>
${fieldMarkup}
    <button>Generate</button>
    <pre id="output"></pre>
  </main>
  <script>
    // TODO: Add tool behavior
  </script>
</body>
</html>

// Suggested id: ${toolId}`;

  ToolStorage.write('code-generator.draft', {
    name,
    desc,
    fields: inputs.value,
    output: output.textContent
  });
}

document.getElementById('generate').addEventListener('click', generate);
document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'generated-tool-skeleton.html';
  link.click();
});

const saved = ToolStorage.read('code-generator.draft', null);
if (saved) {
  toolName.value = saved.name || '';
  description.value = saved.desc || '';
  inputs.value = saved.fields || '';
  output.textContent = saved.output || '';
}
