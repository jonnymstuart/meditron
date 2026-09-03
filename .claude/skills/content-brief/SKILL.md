---
name: content-brief
description: Turn a keyword cluster from data/keywords into a 4‑language content brief (EN master + DE/FR/IT localisation notes) with SERP intent, outline, entities, FAQs, schema and internal links. Output to content/_briefs/<slug>.md and an Airtable Content Calendar row.
---
# Content brief

Input: a head keyword (or `next` = pick the highest tier/volume keyword in `data/keywords/seed-ch.csv` with no `content/` file yet).

1. Semrush MCP: `phrase_related`, `phrase_questions`, `phrase_fullsearch` (db `ch`, plus `de`/`fr`/`it` proxies), `phrase_organic` for the top‑10 SERP; note SERP features and the dominant page type (hub, product, guide, listing). If the CH SERP is consumer‑polluted (Amazon/Galaxus), say so and target the B2B gap explicitly.
2. Read the top 3 competing pages that are B2B (smdmedical.ch, praxisdienst.com, EU distributors) and list what they cover and miss.
3. Write `content/_briefs/<slug>.md` with: target keyword per language (translated, verified in Semrush — never a literal translation without a volume check), search intent, page type & URL per locale, title/meta (≤60/≤155 chars) per language, H1–H3 outline, must‑include entities (models, specs, applications, Swiss specifics: CHF, Swissmedic/CE, two offices, financing), FAQ (from PAA), schema type, 3–5 internal links (existing pages in `content/`), CTA, word count range, Swiss localisation notes from `docs/glossary.md`, and the "no clinical claims" reminder from `CLAUDE.md`.
4. Create/update the Airtable Content Calendar record (status `Brief ready`). Don't draft the page — that's a separate step so the assistant can approve the brief first.
