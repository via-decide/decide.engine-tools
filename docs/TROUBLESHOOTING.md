# Troubleshooting (Batch 1)

## Smoke tests skipped
If smoke tests are skipped with a Playwright executable warning, install browser binaries in a network-enabled environment:

```bash
npx playwright install chromium
```

If install fails due to CDN/network restrictions, unit tests still validate core logic while smoke tests remain explicitly marked skipped.
