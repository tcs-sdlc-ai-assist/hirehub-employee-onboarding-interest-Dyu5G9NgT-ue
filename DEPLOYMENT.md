# Deployment Guide — HireHub Onboarding Portal

## Overview

This project is a static single-page application (SPA) built with **Vite + React 18**. It produces a static `dist/` folder that can be deployed to any static hosting provider. This guide focuses on **Vercel** as the recommended platform.

---

## Build Command

```bash
npm run build
```

This runs `vite build` under the hood and outputs production-ready files to the **`dist/`** directory.

To preview the production build locally before deploying:

```bash
npm run preview
```

---

## Vercel Deployment

### Option 1: Deploy via GitHub Integration (Recommended)

1. Push your repository to GitHub.
2. Go to [https://vercel.com](https://vercel.com) and sign in with your GitHub account.
3. Click **"Add New Project"** and import your repository.
4. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**.

Every subsequent push to the `main` branch will trigger an automatic deployment. Pull requests will generate preview deployments.

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. From the project root, run:

   ```bash
   vercel
   ```

3. Follow the prompts to link your project. The CLI will detect Vite automatically.

4. For production deployment:

   ```bash
   vercel --prod
   ```

---

## SPA Rewrite Configuration

Single-page applications require all routes to be rewritten to `index.html` so that client-side routing (React Router) handles navigation. Create a **`vercel.json`** file in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that direct navigation to any route (e.g., `/dashboard`, `/onboarding/step-2`) serves the SPA entry point instead of returning a 404.

---

## Environment Variables

**No environment variables are required** for the base deployment of this application.

If you add environment variables in the future, follow these rules:

- All client-side environment variables **must** be prefixed with `VITE_` (e.g., `VITE_API_URL`).
- Access them in code via `import.meta.env.VITE_API_URL` — **never** use `process.env`.
- In Vercel, add environment variables under **Project Settings → Environment Variables**.
- Variables can be scoped to Production, Preview, or Development environments.

---

## CI/CD Notes

### Auto-Deploy from GitHub

Once your repository is connected to Vercel:

| Branch        | Behavior                                      |
|---------------|-----------------------------------------------|
| `main`        | Triggers a **production** deployment           |
| Other branches| Triggers a **preview** deployment              |
| Pull requests | Generates a unique **preview URL** per PR      |

### Branch Protection Recommendations

- Require status checks to pass before merging (Vercel adds deployment status checks automatically).
- Enable preview deployments for all pull requests so reviewers can test changes live.

### Custom CI Pipeline (Optional)

If you use GitHub Actions or another CI tool alongside Vercel, you can add a build verification step:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm test -- --run
```

---

## Troubleshooting

### 404 on Page Refresh or Direct URL Navigation

**Symptom:** Navigating directly to a route like `/dashboard` returns a 404 error.

**Cause:** The hosting provider is looking for a physical file at that path instead of serving `index.html`.

**Fix:** Ensure the `vercel.json` file with the SPA rewrite rule is present in the project root (see [SPA Rewrite Configuration](#spa-rewrite-configuration) above). Redeploy after adding the file.

### Blank Page After Deployment

**Symptom:** The deployed site shows a blank white page with no errors in the network tab.

**Fixes:**
- Verify the `base` option in `vite.config.js` is set correctly. For root-level deployment, it should be `'/'` (the default). For subdirectory deployment, set it to `'/subdirectory/'`.
- Open the browser console and check for JavaScript errors — a common cause is an unhandled import or missing dependency.

### Assets Not Loading (404 for JS/CSS Files)

**Symptom:** The HTML loads but JavaScript and CSS files return 404.

**Fixes:**
- Confirm the **Output Directory** in Vercel is set to `dist` (not `build` or `public`).
- Check that `vite build` completes successfully locally before deploying.

### Stale Deployment / Changes Not Appearing

**Symptom:** You deployed but the live site still shows old content.

**Fixes:**
- Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bypass the cache.
- In Vercel, go to **Deployments** and verify the latest deployment completed successfully.
- If using a custom domain, DNS propagation or CDN caching may cause a delay — wait a few minutes and try again.

### Preview Deployments Not Generating

**Symptom:** Pull requests do not generate preview URLs.

**Fixes:**
- Ensure the GitHub integration is properly connected under **Vercel → Project Settings → Git**.
- Check that the repository has granted Vercel the necessary permissions.
- Verify the branch is not excluded in the **Ignored Build Step** settings.

---

## Output Directory Structure

After running `npm run build`, the `dist/` folder will contain:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

This entire `dist/` directory is what gets deployed to Vercel's CDN.