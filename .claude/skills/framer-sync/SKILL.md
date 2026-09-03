---
name: framer-sync
description: Push approved content/**/*.md into the Framer CMS via the Server API (scripts/framer), set localisation data for de/fr/it, inject JSON‑LD, then publish. Also pushes data/redirects.csv.
---
# Framer sync

Pre‑req: `.env` with `FRAMER_API_KEY` + `FRAMER_PROJECT_URL`; `npm ci` in `scripts/framer`.

1. `node scripts/framer/sync-content.mjs --dry-run` → prints the diff (new/updated items per collection & locale). Only files with `review: approved` (or EN masters) are included.
2. If the diff looks right: `node scripts/framer/sync-content.mjs` (writes items, sets `setLocalizationData` for each locale's fields incl. slug/title/meta, sets custom code JSON‑LD for the page).
3. `node scripts/framer/redirects.mjs` → pushes any new rows of `data/redirects.csv` (301, idempotent).
4. `node scripts/framer/publish.mjs` → `getDeploymentIssues()` must be empty, then `publish()`; print the publish URL and time.
5. Post‑publish check: fetch `/sitemap.xml` per locale and 3 random new URLs (if the sandbox can't reach the site, ask the assistant to confirm and record it in the log).
6. Commit a one‑line entry in `reports/_sync-log.md`.
