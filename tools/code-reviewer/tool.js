const code = document.getElementById('code');
const focus = document.getElementById('focus');
const output = document.getElementById('output');

function toast(message, kind = 'ok') {
  let el = document.getElementById('tool-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'tool-toast';
    el.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;background:#111;color:#fff;padding:10px 12px;border-radius:10px;border:1px solid #333;font:12px system-ui;opacity:0;transition:.2s';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.borderColor = kind === 'error' ? '#c53030' : '#2f855a';
  el.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.style.opacity = '0'; }, 1400);
}

function findUnusedVars(source) {
  const vars = [...source.matchAll(/(?:const|let|var)\s+([a-zA-Z_$][\w$]*)/g)].map((m) => m[1]);
  return vars.filter((v) => (source.match(new RegExp(`\\b${v}\\b`, 'g')) || []).length === 1);
}

function findInvalidHtmlTags(source) {
  const known = new Set(['html','head','body','main','section','article','aside','header','footer','nav','div','span','p','h1','h2','h3','h4','h5','h6','a','button','input','label','textarea','select','option','ul','ol','li','table','thead','tbody','tr','th','td','img','canvas','svg','path','script','style','form','pre','code']);
  const tags = [...source.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9-]*)\b/g)].map((m) => m[1].toLowerCase());
  return [...new Set(tags.filter((t) => !known.has(t) && !t.includes('-')))];
}

function runReview() {
  const source = code.value;
  const lines = source.split('\n').length;
  const notes = [];

  if (!source.trim()) {
    output.textContent = 'Add code to review.';
    toast('No code to review', 'error');
    return;
  }

  const unused = findUnusedVars(source);
  if (unused.length) notes.push(`- Unused variables detected: ${unused.join(', ')}`);

  const invalidTags = findInvalidHtmlTags(source);
  if (invalidTags.length && (focus.value === 'quality' || focus.value === 'accessibility')) {
    notes.push(`- Possibly invalid HTML tags: ${invalidTags.join(', ')}`);
  }

  if (!/alt=/.test(source) && /<img\b/.test(source)) notes.push('- Accessibility: add alt attributes to <img> elements.');
  if (!/aria-/.test(source) && /(button|input|select|textarea)/.test(source) && focus.value === 'accessibility') notes.push('- Accessibility: add ARIA labels/roles for interactive controls where needed.');
  if (/var\s+/.test(source)) notes.push('- Prefer const/let over var for clearer scope control.');
  if (source.length > 1800) notes.push('- Large snippet detected; split into smaller functions/components.');

  output.textContent = [
    '# Code Review',
    '',
    `Focus: ${focus.value}`,
    `Line count: ${lines}`,
    '',
    '## Suggestions',
    ...(notes.length ? notes : ['- Looks clean; add tests or manual validation notes.'])
  ].join('\n');

  ToolStorage.write('code-reviewer.draft', { code: source, focus: focus.value, output: output.textContent });
  toast('Review generated');
}

document.getElementById('review').addEventListener('click', runReview);
document.getElementById('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(output.textContent || ''); toast('Copied to clipboard'); }
  catch (_e) { toast('Copy failed', 'error'); }
});
document.getElementById('download').addEventListener('click', () => {
  try {
    const blob = new Blob([output.textContent || ''], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'code-review.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
    toast('Download started');
  } catch (_e) { toast('Download failed', 'error'); }
});

const saved = ToolStorage.read('code-reviewer.draft', null);
if (saved) {
  code.value = saved.code || '';
  focus.value = saved.focus || 'quality';
  output.textContent = saved.output || '';
}
