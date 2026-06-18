# Tool: Service Worker (`sw.js`)

## What Was Wrong
- Service worker file had malformed duplicated blocks and syntax errors.
- Error from `node --check sw.js` before fix: parser failure due to unmatched/duplicated statements.

## What I Fixed
- Rebuilt `sw.js` into one valid script with:
  - install cache warmup
  - activate cache cleanup
  - fetch handling (network-first navigation, cache-first assets)
- Updated cache shell asset paths to relative `./...` for GitHub Pages subpath compatibility.

## How To Test
```bash
node --check sw.js
```

## Result
```text
(no output)
```

---

# Tool: Agent Demo (`agent/index.html` + `js/viadecide-agent.js`)

## What Was Wrong
- Agent page referenced `/js/viadecide-agent.js` (absolute path), which fails on GitHub Pages subpath deployment.
- Referenced script file did not exist in repository.

## What I Fixed
- Added `js/viadecide-agent.js` runtime script.
- Updated `agent/index.html` to load `../js/viadecide-agent.js`.

## How To Test
```bash
python3 -m http.server 8080
# Open http://localhost:8080/agent/index.html
# Verify floating ✦ button appears and toggles panel.
```

## Result
```text
Agent script loads without 404 and widget mounts.
```

---

# Tool: Shared Env Loader (`shared/config_env.js`)

## What Was Wrong
- Multiple HTML tools referenced `shared/config_env.js` but file was missing, causing runtime 404.

## What I Fixed
- Added `shared/config_env.js`.
- Script now safely resolves `window.ECO_SUPABASE_ANON_KEY` from:
  1) existing global,
  2) meta tag (`eco-supabase-anon-key`),
  3) localStorage (`eco_supabase_anon_key`).

## How To Test
```bash
python3 -m http.server 8080
# Open /index.html and verify no 404 for /shared/config_env.js
```

## Result
```text
Shared env config script now loads and initializes key when available.
```

---

# Tool: SkillHex + Kutch Map HTML Script Paths

## What Was Wrong
- `tools/games/skillhex-mission-control/index.html` and `tools/business/kutch-map/index.html`
  used `../../../../shared/config_env.js`, which resolves outside repo and fails.

## What I Fixed
- Updated script path to `../../../shared/config_env.js` in both files.

## How To Test
```bash
python3 -m http.server 8080
# Open both pages and confirm config_env.js loads (no 404)
```

## Result
```text
Both pages now resolve shared config script correctly.
```


---

# Tool: Eco Engine Test (`tools/eco-engine-test/index.html`)

## What Was Wrong
- Duplicate constant declaration:
  - `const SUPABASE_ANON_KEY = ...` was declared twice in the same scope.
- Duplicate setup error screen assignment ran back-to-back.

## What I Fixed
- Removed duplicate `const SUPABASE_ANON_KEY` declaration.
- Removed duplicate `document.body.innerHTML = ...` setup-required block.

## How To Test
```bash
rg -n "const SUPABASE_ANON_KEY =" tools/eco-engine-test/index.html
```

## Result
```text
One declaration remains; no duplicate const syntax/runtime risk.
```
