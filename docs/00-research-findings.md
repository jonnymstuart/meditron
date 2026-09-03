# Research findings — 3 Sept 2026

Sources: Semrush MCP (databases `ch`, `de`, `fr`, `it`, pulled 2026‑09‑03), Semrush Backlink Analytics, web research. Direct crawling of meditron.ch was blocked from the sandbox; site structure below is from Semrush's index and Google results and must be verified with a crawl (see `/redirect-audit`).

## 1. Where meditron.ch stands today

| Metric (Semrush, `ch`) | meditron.ch | smdmedical.ch (competing Samsung distributor) | praxisdienst.com |
|---|---|---|---|
| Organic keywords in top‑100 | **1** | 87 | 1,000 |
| Est. organic traffic / mo | 10 | 722 | 1,633 |
| Authority Score | 14 | 22 | – |
| Referring domains | 154 (158 follow / 121 nofollow) | 111 | – |

- The new Framer site is effectively **invisible** in Swiss organic search. Semrush finds no ranking for any ultrasound term.
- **Migration damage:** the old Joomla URLs (`/ultrasound/index.php/...`, `/medical-physics/index.php/...`, `/quality-assurance/index.php/...`, `/++INDUSTRIAL++/...`) now return **"Page Not Found | Framer" (404)**. Some are still linked from external sites (backlink equity being thrown away). Part of the old site is alive at `legacy.meditron.ch` (returning 429s) — a duplicate‑content and confusion risk. Meditron has 154 referring domains, *more* than SMD; recovering them with redirects is the single cheapest win.
- Brand: "meditron" 260/mo (KD 48). Google confuses the brand with **Medtronic**; the brand SERP needs to be owned (homepage title, Knowledge Panel, Google Business Profile for both offices, LinkedIn).
- Direct competitor SMD Medical (`smdmedical.ch`, /fr /it /en subfolders) ranks **#4 for "ultraschall" (1,900)** with a single `/ultraschall` hub page and #23 for "ultraschallgerät kaufen". That is the page to beat.
- Generic SERPs for "ultraschallgerät" in CH are dominated by *consumer* results (Amazon, Galaxus, ultrasonic cleaners, therapy devices) plus praxisdienst.com — the medical‑imaging intent is under‑served. A well‑structured B2B hub page can take that.

## 2. Keyword reality (Semrush, monthly volume, database `ch`)

The literal target phrase has almost no Swiss search volume. Ranking for it is easy but worthless on its own; the value is in the category and model terms that a Samsung‑ultrasound hub naturally ranks for.

### Tier 1 — category heads (hub pages)
| Keyword | Lang | Vol | KD | Note |
|---|---|---|---|---|
| ultraschall | DE | 2,400 | 27 | mixed intent; SMD is #4 |
| échographe | FR | 1,000 | 32 | |
| échographie | FR | 1,000 | 32 | partly patient intent |
| medizintechnik schweiz | DE | 720 | 34 | company‑level term |
| ultraschallgerät | DE | 590 | 17 | consumer‑polluted SERP → opportunity |
| ecografia | IT | 390 | 16 | |
| ultraschallgerät kaufen | DE | 140 | 8 | **highest commercial intent** |
| échographie 3d | FR | 170 | 7 | OB/GYN angle |

### Tier 2 — long‑tail commercial (10–70/mo, KD ≈ 0)
ultraschallgerät preis · ultraschallgerät kaufen schweiz · mobiles/tragbares ultraschallgerät · ultraschallgerät gynäkologie · ultraschallgerät physiotherapie (70) · ultraschallgerät occasion/gebraucht · ultraschallgerät leasing · sonographie gerät · point of care ultraschall · appareil (d')échographie · échographe portable · échographe prix · échographe occasion · ecografo portatile (30) · ecografo prezzo · portable/handheld ultrasound · ultrasound machine.

### Tier 3 — brand + model (≤20/mo each, KD 0, pure buying intent)
samsung ultraschall (20) · samsung ultrasound (20) · échographe samsung (10) · samsung hera w10 · samsung v8 · samsung medison · samsung healthcare · samsung hs60/hs50/hs40 · hera w9 / z20 · rs85.

### Tier 4 — services (own them cheaply, they earn links)
ultraschall kurs (30) · sonographie kurs (20) · cours échographie · corso ecografia · ultraschallgerät reparatur/service.

Proxy volumes in the big‑neighbour databases (for prioritising within a language): DE `ultraschallgerät` 8,100 / `samsung ultraschall` 140; FR `échographe` 1,000 / `échographe portable` 210; IT `ecografo portatile` 2,400 / `ecografo samsung` 110. Italian intent skews strongly to *portable*.

Full seed list with metrics: `data/keywords/seed-ch.csv`.

## 3. Framer — what is automatable

- **Framer Server API** (`framer-api` on npm, v0.1.30, Node ≥22, released Feb 2026) runs from any script/CI without the Designer open. Verified from the package's type definitions that it exposes: `getCollections / addItems / removeItems / setFields` (CMS), `createLocale / getLocales / setLocalizationData / listLocalizationGroups` (localisation), `getRedirects / addRedirects / removeRedirects`, `createWebPage`, `getCustomCode / setCustomCode` (head snippets → JSON‑LD), `createBranch`, `getPublishInfo / publish / getDeploymentIssues`. Auth: project API key from project settings. This replaces the Framer MCP plugin for everything we need.
- **Framer Localization**: Pro plan, ~$20/locale/month, gives `/de/`, `/fr/`, `/it/` subfolder URLs, translated slugs, automatic reciprocal hreflang, per‑locale sitemap. x‑default handling must be verified after setup.
- Limits/quotas for the Server API are not published; the docs were unreachable from the sandbox — confirm on first run.

## 4. Off‑the‑shelf agent stacks (evaluated)

| Option | Verdict |
|---|---|
| **AgriciDaniel/claude-seo** (MIT, 16k★, v2.2.5 Aug 2026; 25 sub‑skills / 18 agents; `/seo audit, technical, hreflang, schema, content-brief, cluster, backlinks, plan`; native PSI/CrUX/Lighthouse, GSC/GA4 APIs, optional DataForSEO/Firecrawl/Ahrefs) | **Adopt** as the audit/technical layer. Installs as a Claude Code plugin. |
| OpenClaudia skills (MIT, 674★; keyword‑research needs Semrush *API* = Business plan) | Cherry‑pick `schema-markup`, `serp-analyzer`; skip the Semrush‑API ones (we have the MCP instead). |
| claude-blog / ivankuznetsov claude-seo | Blog‑writing suites; useful patterns, but our content is B2B product pages + localisation — custom skills in this repo fit better. |
| Backlink "agents" (Postaga $99, Linkee $49, Respona $399, Pitchbox agency‑tier) | No trusted fully‑automatic backlink builder exists; the ones that "guarantee links" are spam. Postaga is the only one worth the money at this budget, and only if the assistant runs outreach. Prospecting can be done with Semrush + Claude for free. |
| Searchable ($29–139/mo, AI‑visibility tracking) | Not now. Nice‑to‑have from month 4 if the client wants an "are we cited by ChatGPT/AI Overviews" line in the report. |
| Rank tracking | Semrush Position Tracking is included in the plan already connected via MCP (`position_tracking` tool) — use it, no extra spend. DataForSEO ($50 PAYG) only if Semrush CH data proves too thin. |
| Ahrefs | Lite $129/mo includes API+MCP (10k units) — best backlink index, but Semrush Backlink Analytics is already available. Don't buy both. |
