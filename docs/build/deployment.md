# Deployment

> How to serve locally and deploy to production via Vercel.

---

## Overview

7K Skill Planner has no build step — the app runs directly from static files. Deployment is a git push to the remote repository, which triggers automatic deployment to Vercel.

## When to Read This

### Trigger

- Setting up local development environment
- Deploying a new version to production
- Troubleshooting deployment issues

### Read With

- `docs/testing/manual-testing.md` [[docs/testing/manual-testing]] — how to verify before deploying
- `docs/project/overview.md` [[docs/project/overview]] — version history and current status

---

## Local Development

The app requires a local HTTP server (for Screen Capture API to work over HTTPS-like context). Choose one:

```bash
# Python (recommended — .venv already set up)
python -m http.server 8000

# Node.js
npx serve

# Then open http://localhost:8000
```

**Important:** Screen Capture API requires HTTPS or localhost. Opening `index.html` directly as a file (`file://`) will not work for screen capture.

## Production Deployment

Deployed to Vercel via git push:

```bash
git add -A && git commit -m "message" && git push
```

Vercel auto-detects the static site and deploys. No configuration needed.

**Live URL:** https://7k-autoskill.vercel.app/

## Version Bumping

When releasing a new version, update these files:

| File | What to update |
|------|---------------|
| `index.html` | `<title>` tag if version number shown |
| `package.json` | `version` field |
| `manifest.json` | App metadata if needed |
| `sw.js` | `CACHE_NAME` (e.g., `7k-skill-planner-v2`) to bust cache |
| `docs/project/overview.md` | Version history table |

## Rollback

If a deployment has issues, use Vercel dashboard to redeploy a previous commit, or `git revert` + push.

---

Related: [[docs/testing/manual-testing]] | [[docs/project/overview]] | [[docs/integrations/browser-apis]]
