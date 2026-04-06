# CODEX AGENT RULES — via-decide/decide.engine-tools

Stack: Vanilla JS, HTML, CSS, Supabase CDN.
No build step. No npm. No bundler. No React.
Everything runs directly in the browser.
GitHub Pages host: https://via-decide.github.io/decide.engine-tools/

## Prime directive
Read every file you are about to change and make surgical edits only.

## Never modify
- tools/games/skillhex-mission-control/js/app.js
- tools/games/hex-wars/index.html QUESTIONS array
- shared/shared.css
- _redirects
- missions.json (skillhex)

## Script order and runtime safety
- Follow existing script order requirements in game/tool HTML files.
- Keep shared scripts as plain scripts (no ESM conversion).
- Guard optional globals with `typeof window.X !== 'undefined'` checks.

## Supabase and path safety
- Never hardcode anon keys.
- Use snake_case schema fields.
- Keep GitHub Pages-relative paths (`./` / `../`) and avoid absolute root links.

## Mandatory pre-commit checks
1. `grep -n "const canonicalRoute" router.js`
2. `grep -n "const navLinks\|const sections" router.js`
3. `node --check router.js 2>&1`
4. `python3 -c "import json; json.load(open('tools-manifest.json'))"`
5. `grep -n "bar.href" shared/vd-nav-fix.js`
6. `grep -n "example.supabase.co\|replace-with-anon-key" tools/eco-engine-test/index.html`
7. `grep -n "!important" tools/games/*/index.html | grep -i "transform\|opacity"`

## Output format
After tasks, include changed files, skipped files, and any failed checks.
