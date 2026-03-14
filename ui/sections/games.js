export function renderSection(container) {
  container.insertAdjacentHTML('beforeend', String.raw`<section id="games">
    <div class="w">
      <div class="sh">
        <h2>🎮 Games</h2>
        <p>Browser games that are also learning tools. No install, no account — just play.</p>
      </div>
      <div class="featured-row">

        <div class="feat-card" style="border-color:rgba(139,92,246,.3);background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(26,22,20,.97))">
          <div class="chip" style="background:rgba(139,92,246,.15);color:#a78bfa">🎯 Strategy + Quiz</div>
          <h3>HexWars</h3>
          <p>Conquer hex territories with your knowledge. Answer timed quiz questions to claim tiles and dominate the battlefield. Strategy meets trivia.</p>
          <div class="btn-row">
            <a class="btn" style="background:#7c3aed;color:#fff;box-shadow:0 4px 0 #4c1d95" href="./tools/games/hex-wars/index.html">⬡ Play HexWars</a>
          </div>
        </div>

        <div class="feat-card" style="border-color:rgba(251,146,60,.3);background:linear-gradient(135deg,rgba(251,146,60,.1),rgba(26,22,20,.97))">
          <div class="chip" style="background:rgba(251,146,60,.15);color:#fb923c">🔥 Multiplayer Quiz</div>
          <h3>Wings of Fire Quiz</h3>
          <p>Multiplayer quiz on Dr. APJ Abdul Kalam's Wings of Fire. Test your knowledge, compete with friends, and learn from the life of India's Missile Man.</p>
          <div class="btn-row">
            <a class="btn" style="background:#ea580c;color:#fff;box-shadow:0 4px 0 #7c2d12" href="./tools/games/wings-of-fire-quiz/index.html">🔥 Play Quiz</a>
          </div>
        </div>

      </div>
    </div>
  </section>`);
}
