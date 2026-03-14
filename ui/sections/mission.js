export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="mission">
    <div class="w">
      <div class="mission-wrap">
        <div class="mission-text">
          <div class="eyebrow">Open Source · Free Forever</div>
          <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3vw,2.4rem);font-weight:900;line-height:1.1;margin:12px 0">
            Think better.<br>Build faster.<br><em style="color:var(--leaf);font-style:normal">Decide with clarity.</em>
          </h2>
          <p style="color:var(--muted);max-width:480px;margin-bottom:24px">44 tools. Zero login. Free for students, creators, researchers, and founders. Everything runs in your browser — no install, no account, no cost.</p>
          <div class="btn-row">
            <a class="btn btn-green" href="https://github.com/via-decide/decide.engine-tools" target="_blank" rel="noopener">⭐ Star on GitHub</a>
            <a class="btn btn-ghost" href="#all">Browse All Tools</a>
          </div>
        </div>
        <div class="mission-stats">
          <div class="mstat"><div class="mstat-n">44</div><div class="mstat-l">Live Tools</div></div>
          <div class="mstat"><div class="mstat-n">0</div><div class="mstat-l">Login Required</div></div>
          <div class="mstat"><div class="mstat-n">∞</div><div class="mstat-l">Free Use</div></div>
          <div class="mstat"><div class="mstat-n">3</div><div class="mstat-l">Live Games</div></div>
        </div>
      </div>
    </div>
  </section>`);
}
