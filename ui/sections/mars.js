export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="mars">
    <div class="w">
      <div class="sh">
        <h2>🚀 Mars Decision Lab</h2>
        <p>A browser game where you pilot a rover across Mars — manage energy, scan terrain, survive dust storms, and make real decisions under pressure.</p>
      </div>
      <div class="mars-hero">
        <div class="mars-left">
          <div class="mars-badge">🎮 Live Game</div>
          <div class="mars-title">Mars Decision Lab</div>
          <div class="mars-desc">React-powered Mars rover simulation. Explore terrains, complete missions, manage resources, earn certifications. Built for strategic thinkers.</div>
          <div class="mars-pills">
            <span class="mpill">⚡ Energy Management</span>
            <span class="mpill">🌪️ Storm Survival</span>
            <span class="mpill">🗺️ Terrain Scanning</span>
            <span class="mpill">🎯 Mission Objectives</span>
          </div>
          <div class="btn-row" style="margin-top:18px">
            <a class="btn btn-mars" href="https://via-decide.github.io/mars-decision-lab/" target="_blank" rel="noopener">Launch Game →</a>
          </div>
        </div>
        <div class="mars-visual">
          <div class="mars-planet"></div>
        </div>
      </div>
    </div>
  </section>`);
}
