(function (global) {
  'use strict';

  if (global.VDAgentLoaded) return;
  global.VDAgentLoaded = true;

  function ensureWidget() {
    var doc = global.document;
    if (!doc || doc.getElementById('vd-agent-launcher')) return;

    var launcher = doc.createElement('button');
    launcher.id = 'vd-agent-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'Open ViaDecide Agent');
    launcher.textContent = '✦';

    var panel = doc.createElement('div');
    panel.id = 'vd-agent-panel';
    panel.setAttribute('hidden', 'hidden');
    panel.innerHTML = '<strong>ViaDecide Agent</strong><p>Agent runtime loaded. Configure API key in local settings.</p>';

    var style = doc.createElement('style');
    style.textContent = [
      '#vd-agent-launcher{position:fixed;right:16px;bottom:16px;z-index:99999;width:48px;height:48px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:#22b4a0;color:#0b0e15;font-size:22px;cursor:pointer}',
      '#vd-agent-panel{position:fixed;right:16px;bottom:72px;z-index:99999;max-width:280px;padding:12px;border-radius:12px;background:#111827;color:#f4efe7;border:1px solid rgba(255,255,255,.15);box-shadow:0 10px 30px rgba(0,0,0,.35)}',
      '#vd-agent-panel p{margin:6px 0 0;font-size:12px;line-height:1.4;color:#d0d6e2}'
    ].join('');

    launcher.addEventListener('click', function () {
      var isHidden = panel.hasAttribute('hidden');
      if (isHidden) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', 'hidden');
    });

    doc.head.appendChild(style);
    doc.body.appendChild(panel);
    doc.body.appendChild(launcher);
  }

  if (global.document && global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', ensureWidget, { once: true });
  } else {
    ensureWidget();
  }
})(window);
