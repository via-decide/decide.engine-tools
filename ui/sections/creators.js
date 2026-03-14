export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="creators">
    <div class="w">
      <div class="sh">
        <h2>✏️ For Creators</h2>
        <p>Generate prompts, remix ideas, write scripts, and compare outputs. Built for content creators, writers, and marketers.</p>
      </div>
      <div class="featured-row">
        <div class="feat-card">
          <div class="chip c-creators">Most Used</div>
          <h3>PromptAlchemy</h3>
          <p>Turn a raw idea into a structured prompt pack ready for any AI tool. Works for social, video, writing, and product.</p>
          <div class="btn-row">
            <a class="btn btn-green" href="./prompt-alchemy/index.html">Open Tool</a>
            <a class="btn btn-ghost" href="./tools/promptalchemy/index.html">New Version</a>
          </div>
        </div>
        <div class="feat-card">
          <div class="chip c-creators">Popular</div>
          <h3>Idea Remixer</h3>
          <p>Paste one idea, get six angle variants — different audiences, formats, and positioning to test fast.</p>
          <div class="btn-row">
            <a class="btn btn-green" href="./tools/idea-remixer/index.html">Open Tool</a>
          </div>
        </div>
      </div>
      <div class="grid">
        <a class="card" href="./tools/script-generator/index.html">
          <div class="card-top"><span class="chip c-creators">Creators</span><span class="card-icon">🎬</span></div>
          <h3>Script Generator</h3>
          <p>Convert your structured prompt into a ready-to-record script for video, podcast, or reels.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/prompt-compare/index.html">
          <div class="card-top"><span class="chip c-researchers">Analysis</span><span class="card-icon">⚖️</span></div>
          <h3>Prompt Compare</h3>
          <p>Paste two or three prompts side-by-side and score them for clarity, specificity, and downstream utility.</p>
          <span class="card-link">Open</span>
        </a>
        <a class="card" href="./tools/output-evaluator/index.html">
          <div class="card-top"><span class="chip c-researchers">Quality</span><span class="card-icon">📊</span></div>
          <h3>Output Evaluator</h3>
          <p>Score any AI output for clarity, completeness, novelty, and actionability — with improvement suggestions.</p>
          <span class="card-link">Open</span>
        </a>
      </div>
    </div>
  </section>`);
}
