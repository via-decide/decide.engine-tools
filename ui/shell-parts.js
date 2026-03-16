export const headerMarkup = String.raw`<nav class="nav">
  <div class="w nav-i">
    <a class="brand" href="#home">Via<em>Decide</em></a>
    <div class="nav-links">
      <a class="nl on" href="#home"        data-s="home">Home</a>
      <a class="nl"    href="#creators"    data-s="creators">Creators</a>
      <a class="nl"    href="#builders"    data-s="builders">Builders</a>
      <a class="nl"    href="#researchers" data-s="researchers">Research</a>
      <a class="nl"    href="#business"    data-s="business">Business</a>
      <a class="nl"    href="#orchard"     data-s="orchard">🌳 Orchard Game</a>
      <a class="nl"    href="#games"       data-s="games">🎮 Games</a>
      <a class="nl"    href="#mars"        data-s="mars">🚀 Mars</a>
      <a class="nl"    href="#mission"     data-s="mission">Mission</a>
      <a class="nl"    href="#all"         data-s="all">All Tools</a>
    </div>
    <a class="nav-cta" href="./tools/eco-engine-test/index.html">🌿 Play Game</a>
  </div>
</nav>`;


export const orbMarkup = `
<button id="orb-btn" aria-label="Search (Ctrl+K)"
  style="position:fixed;bottom:24px;right:24px;z-index:200;width:56px;height:56px;
         border-radius:50%;border:none;cursor:pointer;
         background:linear-gradient(135deg,#52B756,#29B6F6);
         color:#000;font-size:24px;
         box-shadow:0 8px 24px rgba(82,183,86,.35);
         display:flex;align-items:center;justify-content:center;
         transition:transform .2s;-webkit-tap-highlight-color:transparent;">✨</button>
<div id="search-overlay"
  style="display:none;position:fixed;inset:0;z-index:300;
         background:rgba(0,0,0,.78);backdrop-filter:blur(12px);
         -webkit-backdrop-filter:blur(12px);
         align-items:flex-start;justify-content:center;padding-top:12vh;">
  <div style="width:100%;max-width:600px;margin:0 16px;
              background:#1a1614;border:1px solid #3a2e28;border-radius:16px;
              overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,.6);">
export const orbMarkup = String.raw`
<button id="orb-btn" aria-label="Search tools" title="Search (Ctrl+K)"
  style="position:fixed;bottom:24px;right:24px;z-index:200;
         width:56px;height:56px;border-radius:50%;border:none;
         background:linear-gradient(135deg,#52B756,#29B6F6);
         color:#000;font-size:24px;cursor:pointer;
         box-shadow:0 8px 24px rgba(82,183,86,.35);
         display:flex;align-items:center;justify-content:center;
         transition:transform .2s;-webkit-tap-highlight-color:transparent;">
  ✨
</button>
<div id="search-overlay" role="dialog" aria-modal="true" aria-label="Search"
  style="display:none;position:fixed;inset:0;z-index:300;
         background:rgba(0,0,0,.75);backdrop-filter:blur(12px);
         -webkit-backdrop-filter:blur(12px);
         align-items:flex-start;justify-content:center;padding-top:12vh;">
  <div style="width:100%;max-width:600px;margin:0 16px;
              background:#1a1614;border:1px solid #3a2e28;
              border-radius:16px;overflow:hidden;
              box-shadow:0 24px 48px rgba(0,0,0,.6);">
    <div style="display:flex;align-items:center;padding:14px 20px;
                border-bottom:1px solid #3a2e28;background:#231e1b;">
      <span style="font-size:1.3rem;margin-right:12px;color:#52B756;">✨</span>
      <input id="search-input" type="text" placeholder="Search tools..."
        autocomplete="off"
        style="flex:1;background:transparent;border:none;outline:none;
               font-size:1.1rem;color:#f0e4d0;font-family:inherit;"/>
      <button id="search-close"
        style="background:transparent;border:1px solid #3a2e28;color:#f0e4d0;
               border-radius:6px;padding:4px 10px;cursor:pointer;font-size:13px;
               -webkit-tap-highlight-color:transparent;">ESC</button>
    </div>
    <div id="search-results"
      style="max-height:55vh;overflow-y:auto;padding:10px;
             scrollbar-width:thin;scrollbar-color:#3a2e28 transparent;"></div>
               border-radius:6px;padding:4px 10px;cursor:pointer;font-size:13px;">
        ESC
      </button>
    </div>
    <div id="search-results"
      style="max-height:55vh;overflow-y:auto;padding:10px;"></div>
  </div>
</div>`;

export const footerMarkup = String.raw`<footer>
  <div class="w" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
    <span>© 2026 ViaDecide · Free browser tools for practical thinkers</span>
    <div style="display:flex;gap:14px">
      <a href="https://github.com/via-decide/decide.engine-tools">GitHub</a>
      <a href="./tool-graph.html">Tool Graph</a>
    </div>
  </div>
</footer>`;
