---
name: redirect-audit
description: Find legacy/404 URLs on meditron.ch that still have backlinks or traffic, map them to the best live page, maintain data/redirects.csv, and push via the Framer Server API.
---
# Redirect audit

1. Sources of legacy URLs: Semrush `backlinks_pages` (root_domain meditron.ch, sort domains_num_desc, paginate) and `backlinks` (per‑URL targets); GSC "Pages → Not found (404)" export; `legacy.meditron.ch` sitemap if reachable; Semrush `resource_organic` history (display_date last 12 months).
2. For each URL with `response_code` 404/308→404 or on `legacy.` host: infer the topic from the path (`/ultrasound/`, `/medical-physics/`, `/quality-assurance/`, `/++INDUSTRIAL++/`, product names) and pick the closest live page in `content/` or the site map; if nothing fits, the section hub; never the homepage unless truly generic.
3. Append to `data/redirects.csv` (`from,to,status,reason,added`) — keep it deduplicated; pattern rules (e.g. `/ultrasound/index.php/*` → `/ultrasound/`) where Framer supports wildcards, explicit rows otherwise.
4. `node scripts/framer/redirects.mjs --dry-run` then push. Flag `legacy.meditron.ch` for noindex/301 at the host level (client action) if still live.
5. Summarise: URLs fixed, referring domains recovered, remaining unknowns.
