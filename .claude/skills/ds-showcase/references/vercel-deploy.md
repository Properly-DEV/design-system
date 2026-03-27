# Vercel Deploy — ds-showcase

The showcase is a static HTML file — Vercel deploys it with zero config.

## Requirements

- `index.html` at repo root
- `tokens/tokens.css` (or wherever tokens live) — must be at the path referenced in `index.html`
- No `package.json` required for pure HTML showcase

## Steps to deploy

1. Push repo to GitHub (if not already)
2. Go to vercel.com → New Project → Import Git Repository
3. Framework Preset: **Other** (not Next.js, not Vite)
4. Root Directory: `.` (repo root)
5. Build Command: leave **empty**
6. Output Directory: `.` (repo root)
7. Click Deploy

That's it. Vercel serves `index.html` as the root.

## Custom domain (optional)

After deploy: Project Settings → Domains → Add your domain.

## Auto-redeploy

Every push to `main` triggers a redeploy automatically.

## Token path fix

If tokens.css is referenced as `../tokens/tokens.css` in index.html,
change the path to `./tokens/tokens.css` for Vercel compatibility.
The `..` prefix assumes a parent directory which won't exist on Vercel.

## vercel.json (only if needed)

If you need custom routing or headers:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Usually not needed for a single-page static showcase.
