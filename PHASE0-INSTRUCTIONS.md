# Phase 0 — commit these to a NEW branch

## 1. Create the branch on GitHub
On your repo → branch dropdown (says "main") → type `astro-migration` → "Create branch: astro-migration from main".

## 2. Upload these files to that branch
Switch to the `astro-migration` branch first (branch dropdown), THEN upload, so nothing lands on `main`.

Upload, preserving this structure:
- `package.json`                → repo root
- `astro.config.mjs`            → repo root
- `.gitignore`                  → repo root
- `public/style.css`            → public/ (NOTE: moved out of root)
- `public/favicon.svg`          → public/
- `public/pricing-data.js`      → public/
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/story-james-ozempic-to-mounjaro.astro`
- `src/pages/uk-glp1-price-comparison.astro`

DO NOT upload `node_modules/` or `dist/` (the .gitignore excludes them; they're build artefacts).

GitHub web upload tip: it can't create empty folders, but typing `public/style.css` as the
path when uploading (or dragging files into the right place) creates folders automatically.
Easiest: use "Add file → Upload files", drag everything in, and GitHub keeps the folder paths
from the zip structure.

## 3. Cloudflare auto-builds a preview
Because non-production branch builds are enabled, pushing to `astro-migration` triggers a build.
BUT the build command on the branch is still "None" — so for THIS preview to build with Astro,
Cloudflare needs the build command set. Two options:

  (a) Easiest for now: in Cloudflare → your project → Settings → Build, set
      Build command: `npm run build`
      Build output directory: `dist`
      This applies to all branches including previews. `main` keeps serving the
      OLD static files until we actually merge, because main has no Astro files yet —
      its build would just serve the existing HTML. (We confirm this is safe before merge.)

  (b) Safer but fiddlier: leave main's build alone, rely on the preview build picking up
      package.json. If unsure, send me a screenshot and I'll talk you through it.

## 4. Find the preview URL
Cloudflare → Deployments → the `astro-migration` build → "Visit preview". It'll be something
like `astro-migration.understandglp1-xxx.workers.dev` or similar.

## 5. Send me what you see
Check these three URLs on the preview and tell me how they look:
- `/` (homepage)
- `/story-james-ozempic-to-mounjaro`
- `/uk-glp1-price-comparison`  ← especially: does the price table render and do the tabs/filters work?

If all three look identical to live, Phase 0 is proven and we proceed to Phase 1.
