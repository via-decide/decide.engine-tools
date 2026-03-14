export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="home" class="hero">
    <div class="w">
      <div class="eyebrow">Free · No Login · Open Source</div>
      <h1>Tools that help you<br>think, build, <em>decide.</em></h1>
      <p class="sub">Practical browser tools for creators, students, researchers, and business builders. Open any tool and start in seconds.</p>
      <div class="hero-stats">
        <div class="hstat"><div class="hstat-n">44</div><div class="hstat-l">Live Tools</div></div>
        <div class="hstat"><div class="hstat-n">0</div><div class="hstat-l">Login Required</div></div>
        <div class="hstat"><div class="hstat-n">Free</div><div class="hstat-l">Forever</div></div>
      </div>
    </div>
  </section>`);
}
