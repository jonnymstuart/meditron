# Project context — Meditron AISEO

Client: Meditron SA (meditron.ch), official Samsung Healthcare ultrasound distributor in Switzerland (30+ yrs, offices in DE‑ and FR‑speaking Switzerland). Also sells radiotherapy / radiology QA / dosimetry — **out of scope** for this programme except where it earns links.

Programme: Sept 2026 → Jan 2027 (5 months), budget CHF 5,000 all‑in (tools + assistant time). Weekly client report every Monday.

Goal (client brief): rank in Swiss Google for **"Samsung ultrasound"** in each language — `samsung ultrasound` (EN), `samsung ultraschall` (DE), `échographe samsung` (FR), `ecografo samsung` (IT) — plus the model and price/used terms around them. Full cluster and SERP analysis: `docs/05-samsung-ultrasound-cluster.md`. The generic category terms (ultraschallgerät, échographe, ecografo, ultraschall…) are secondary targets that the brand hub and model pages rank for as a by-product (`docs/01-strategy.md`). Priority 1 before any content: the redirect map (`docs/04-redirect-plan.md`).

## Rules of the road
- Site is **Framer**. Never hand‑edit in the Framer UI when a script exists: use `scripts/framer` (official `framer-api` Server API). The Framer MCP plugin is unreliable — don't depend on it.
- `content/<lang>/*.md` is the canonical copy. Framer CMS is the render target. Edit Markdown, then `/framer-sync`.
- EN is the master; DE/FR/IT are localisations. Use Swiss conventions: `ss` not `ß`, CHF, Swiss French/Italian terms (glossary in `docs/glossary.md`). Machine output is a draft — the assistant signs off every localised page before publish.
- Medical device marketing: no clinical claims beyond Samsung's own published material; no pricing unless client supplies it; CE/Swissmedic wording verbatim.
- Keyword data comes from the Semrush MCP (database `ch`; `de`/`fr`/`it` only as proxies). Rankings come from Semrush Position Tracking + GSC. Cite the source and date in every report.
- Backlinks: no paid links, no PBNs, no automated directory blasts. Only outreach in `docs/03-link-playbook.md`.
- Every week produces a commit in `reports/` and an email to the client. If a step fails, the report says so.
- Commit messages in English, imperative. No secrets in git (`.env` is ignored).
