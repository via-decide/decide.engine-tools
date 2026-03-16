export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="all">
    <div class="w">
      <div class="sh">
        <h2>🧰 All Tools</h2>
        <p>Every live tool in one place — filter by category.</p>
      </div>
      <div class="tabs" id="tab-row">
        <button class="tab on" data-c="all">All</button>
        <button class="tab" data-c="creators">Creators</button>
        <button class="tab" data-c="coders">Builders</button>
        <button class="tab" data-c="researchers">Research</button>
        <button class="tab" data-c="operators">Business</button>
        <button class="tab" data-c="education">Students</button>
        <button class="tab" data-c="system">System</button>
      </div>
      <div class="grid" id="all-grid">
        <div class="empty">Loading tools…</div>
      </div>
    </div>
  </section>`);
}
