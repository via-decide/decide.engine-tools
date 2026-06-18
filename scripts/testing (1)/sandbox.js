const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function runSandbox(toolPath) {
  const toolDir = path.resolve(__dirname, '../../', toolPath);
  const htmlPath = path.join(toolDir, 'index.html');
  const jsPath = path.join(toolDir, 'tool.js');
  const cssPath = path.join(__dirname, '../../shared/shared.css');

  if (!fs.existsSync(htmlPath)) throw new Error(`HTML missing at ${htmlPath}`);

  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Inject CSS
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = `<style>${fs.readFileSync(cssPath, 'utf8')}</style>`;
  }

  // Build Virtual DOM
  const dom = new JSDOM(htmlContent + cssContent, {
    runScripts: 'dangerously',
    url: 'file://' + htmlPath,
    beforeParse(window) {
      window.requestAnimationFrame = cb => setTimeout(cb, 16);
    }
  });

  const { window } = dom;
  const { document } = window;

  // Execute tool logic
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    const scriptEl = document.createElement('script');
    scriptEl.textContent = jsContent;
    document.body.appendChild(scriptEl);
  } else {
    console.warn(`Warning: tool.js missing for ${toolPath}`);
  }

  // Sandbox Utils
  const simulateClick = (selector) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`simulateClick: Element ${selector} not found`);
    el.click();
  };

  const assertDOMText = (selector, expectedText) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`assertDOMText: Element ${selector} not found`);
    if (!el.textContent.includes(expectedText)) {
      throw new Error(`assertDOMText: Expected '${expectedText}', found '${el.textContent}'`);
    }
    console.log(`✅ assertDOMText passed for ${selector}`);
  };

  return { dom, window, document, simulateClick, assertDOMText };
}

module.exports = { runSandbox };

// CLI Usage
if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node sandbox.js <tools/category/tool_name>');
    process.exit(1);
  }
  runSandbox(target).then(() => console.log(`Sandbox executed successfully for ${target}`))
    .catch(console.error);
}
