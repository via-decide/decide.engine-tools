(function (global) {
  'use strict';

  function toModuleName(name) {
    return String(name || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function buildEnvironmentTemplate(name, template, requestMeta = {}) {
    const moduleName = toModuleName(name) || `sim-${Date.now()}`;
    const title = String(name || 'Untitled Simulation').trim() || 'Untitled Simulation';
    const templateType = String(template || 'simulation').trim().toLowerCase() || 'simulation';

    return {
      name: moduleName,
      config: {
        name: moduleName,
        title,
        status: 'Generated',
        type: templateType,
        creator: requestMeta.creator || 'zayvora',
        launchUrl: `./${moduleName}/index.html`,
        prompt: requestMeta.prompt || ''
      },
      definition: {
        scripts: [],
        gameFactory() {
          return {
            createInitialState() {
              return {
                tick: 0,
                energy: 100,
                network: 50,
                resources: 75,
                title,
                templateType
              };
            },
            update(state) {
              const nextTick = (state.tick || 0) + 1;
              const drift = ((nextTick % 5) - 2) * 0.6;
              return {
                ...state,
                tick: nextTick,
                energy: Math.max(0, Math.min(100, state.energy - 0.2 + drift)),
                network: Math.max(0, Math.min(100, state.network + 0.25 - drift)),
                resources: Math.max(0, Math.min(100, state.resources + ((nextTick % 3) - 1) * 0.4))
              };
            }
          };
        },
        uiFactory() {
          return {
            mount(host) {
              host.innerHTML = `
                <section>
                  <h2>${title}</h2>
                  <p>AI-generated ${templateType} environment running in DECIDE runtime.</p>
                  <div id="dynamic-sim-metrics"></div>
                </section>
              `;
            },
            render(state) {
              const panel = document.getElementById('dynamic-sim-metrics');
              if (!panel) return;
              panel.innerHTML = `
                <p><strong>Tick:</strong> ${state.tick}</p>
                <p><strong>Energy:</strong> ${state.energy.toFixed(1)}</p>
                <p><strong>Network:</strong> ${state.network.toFixed(1)}</p>
                <p><strong>Resources:</strong> ${state.resources.toFixed(1)}</p>
              `;
            }
          };
        }
      }
    };
  }

  global.EnvironmentBuilder = {
    toModuleName,
    buildEnvironmentTemplate
  };
})(window);
