# Phase 0 deploy fix — two changes

The branch build got all the way through install + build, then failed at the
DEPLOY step with: "Missing entry-point to Worker script or to assets directory."

Two causes, two fixes.

## Fix 1 — swap the wrangler config file (in the repo, on astro-migration branch)
- DELETE `wrangler.toml` (the old one)
- ADD `wrangler.jsonc` (included here) — this is the exact format wrangler 4.x
  asked for in the error log, pointing it at ./dist as a static assets directory.

To delete on GitHub: open `wrangler.toml` on the astro-migration branch → trash-can
icon → commit. Then upload `wrangler.jsonc`.

## Fix 2 — correct the Cloudflare Deploy command
Settings → Build → Build configuration → edit (pencil):
- Build command:  `npm run build`     ← confirm this is set (last build showed "None")
- Deploy command: `npx wrangler deploy`   ← CHANGE from "npx wrangler versions upload"
- Root directory: `/`                  (leave as-is)

`wrangler deploy` reads wrangler.jsonc, finds ./dist, publishes it. `versions upload`
(the old value) doesn't do that — it was the wrong command.

## Then
Re-trigger the build: either push the wrangler.jsonc change (auto-triggers), or hit
"Retry build" on the failed build. Watch for Deploying → green. Then grab the preview URL.
