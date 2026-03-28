# 📋 Contribution & PR Workflow for decide.engine-tools

## Standard Workflow

### For New Features/Updates:

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/descriptive-name
   ```

2. **Make Changes**
   - Update files locally
   - Test in browser
   - Commit with clear messages

3. **Push to GitHub**
   ```bash
   git push origin feature/descriptive-name
   ```

4. **Create Pull Request**
   - Go to GitHub repo
   - Click "Compare & pull request"
   - Fill out PR template (auto-populated)
   - Request review if needed

5. **Merge to Main**
   - GitHub Pages auto-deploys on merge
   - Changes live at: `https://via-decide.github.io/decide.engine-tools/`

## Branch Naming Convention

- `feature/*` — New tools or functionality
- `fix/*` — Bug fixes
- `docs/*` — Documentation updates
- `design/*` — UI/UX changes

## Examples

### Adding a New Tool
```bash
git checkout -b feature/new-cta-graphic
# Add files, test
git add .
git commit -m "Add new CTA graphic and routing"
git push origin feature/new-cta-graphic
# Create PR on GitHub
```

### Bug Fix
```bash
git checkout -b fix/routing-404-issue
# Make fix
git push origin fix/routing-404-issue
# Create PR
```

## GitHub Pages Deployment

- **Automatic**: Changes merge to main → GitHub Pages rebuilds (~1-2 min)
- **Live URL**: `https://via-decide.github.io/decide.engine-tools/[filename]`
- **Status**: Check repo Settings > Pages for deployment status

---
**Last Updated**: March 29, 2026
