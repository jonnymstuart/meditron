# 5‑month plan — Sept 2026 → Jan 2027

## Thesis
meditron.ch has authority (154 referring domains, 30 years, official Samsung distributor) but the Framer relaunch threw away every ranking URL and the site has no language versions. The fastest path to "rank for Samsung ultrasound in CH in 4 languages" is: **(1) stop the bleeding with redirects, (2) build one strong localised Samsung‑ultrasound hub + model pages, (3) publish a small amount of genuinely useful Swiss B2B content per language, (4) win 10–20 relevant Swiss links.** Everything is scripted so the weekly cadence costs the owner ~1 h and the assistant ~4–6 h.

Success metrics (reported weekly): positions for the tracked set in 4 languages (Semrush Position Tracking, `ch`), GSC clicks/impressions per locale folder, indexed pages per locale, referring domains, and contact‑form/quote enquiries attributed to organic (GA4 or Framer form → Airtable).

Targets by end of Jan 2027 (conservative, based on KD ≤ 35 and current AS 14): top‑3 for all Tier 3 brand/model terms in DE/FR/EN; top‑10 for `ultraschallgerät kaufen`, `échographe portable`, `ecografo portatile`, `samsung ultraschall/ultrasound`; top‑20 for `ultraschallgerät`, `échographe`; brand SERP owned.

## Site architecture (Framer, subfolder locales)
```
/                    EN master (x‑default)
/de/  /fr/  /it/     Framer Localization, translated slugs, auto hreflang
/ultrasound/                      Samsung ultrasound hub (the page that beats smdmedical.ch/ultraschall)
/ultrasound/<model>/              HERA W10, HERA Z20, V8, V7, V6, HS60, HS40, HM70 EVO … (CMS collection "Products")
/ultrasound/<application>/        cardiology, ob‑gyn, POCUS, radiology/general imaging, MSK, vet (CMS "Applications")
/services/ (training, service & repair, financing/leasing, demo)
/insights/ (CMS "Articles": buyer guides, comparisons, case studies, course listings)
/about/, /contact/ (two offices → LocalBusiness schema each)
```
Every page: localised title/meta/H1/slug, `Product`/`Article`/`LocalBusiness`/`FAQPage` JSON‑LD via `setCustomCode`, breadcrumbs, one internal link block per language.

## Month by month

| Month | Theme | Deliverables | Who |
|---|---|---|---|
| **1 (Sept)** | Foundation & fix | Legacy‑URL crawl + `data/redirects.csv` pushed (target: every 404 with ≥1 backlink or legacy traffic redirected); `legacy.meditron.ch` noindex or 301; GSC/GA4/Position Tracking live; Framer locales created; `/seo audit` baseline; brand SERP (GBP ×2, Knowledge Panel); hub page EN written + localised ×3 | Claude scripts; owner 2 h to hand over keys; assistant QA |
| **2 (Oct)** | Product depth | 6–8 model pages ×4 languages from Samsung spec sheets; application pages; Product schema; internal linking; first 4 Tier‑2 articles (kaufen/prix/prezzo buyer guides) | Claude drafts → assistant reviews → `/framer-sync` |
| **3 (Nov)** | Content & links | 2 articles/week EN → ×3; link outreach wave 1 (associations, partners, course listings, directories); case study with a Swiss clinic | assistant outreach (Postaga optional) |
| **4 (Dec)** | Consolidate | Refresh underperformers from GSC data; FAQ schema from PAA; AI‑visibility check (optional Searchable); outreach wave 2 | mostly automated |
| **5 (Jan)** | Compound | Comparisons (HERA vs V8, Samsung vs GE/Philips in CH context — careful, factual), used/leasing pages, final report + handover runbook | — |

## Weekly cadence (automated by Claude Code Routines — scheduled sessions in this environment)
- **Mon 07:00** `/weekly-report`: Semrush Position Tracking + GSC pull → `reports/YYYY-WW.md/.html` → commit → email to client (Gmail MCP) with a 5‑line summary + link. Owner reads it, replies if anything.
- **Tue** `/content-brief` for next 2 topics from `data/keywords` gaps → assistant approves in Airtable.
- **Wed–Thu** Claude drafts EN + `/localize` → assistant native QA (~45 min/page) → `/framer-sync` publish.
- **Fri** `/redirect-audit` + `/seo technical` delta; new 404s/hreflang errors auto‑fixed or filed.
- Monthly: `/seo audit` full, backlink prospect list refresh, budget check.

## Budget (CHF 5,000 / 5 months ≈ 1,000/mo)
| Item | /mo | 5 mo |
|---|---|---|
| Framer Pro + 3 locales (~$30 + 3×$20) | ~90 | ~450 |
| Semrush (Pro, already connected via MCP; Position Tracking included) | ~140 if not already paid | ~700 |
| Claude (Max plan for scheduled sessions) | ~100–200 | ~500–1,000 |
| Postaga (optional, months 3–4 only) | 99 | ~200 |
| Assistant, ~5 h/wk × 22 wk at CHF 25–35 | — | ~2,750–3,500 |
| **Total** | | **≈ 4,600–5,800** |
Trim if needed: skip Postaga, run 2 locales first (DE+FR; IT market is small — `ecografia` 390 but portable‑skewed), Claude Pro instead of Max.

## Language priority
DE (≈65% of CH + biggest volumes) > FR (Meditron has a FR office; échographe 1,000) > EN (master, international/expat clinics, and Google CH shows EN pages for EN queries) > IT (small; do hub + model pages only, articles from month 4).

## Risks
- Server API quotas/plan gating unknown → verify day 1; fallback is CSV import in Framer CMS UI (assistant).
- Framer Localization at scale: translated slugs must be set for every page or hreflang points at EN slugs.
- Client approval latency on medical copy → agree a 48 h silent‑approval rule in week 1.
- Medtronic brand confusion → own brand SERP early; never target "medtronic".
