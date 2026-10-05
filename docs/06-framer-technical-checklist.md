# Framer technical SEO checklist — Meditron (priority order)

Owner column: **script** = done via `scripts/framer` (Server API) · **Framer UI** = one-time setting in the editor · **you/client** = needs an account or DNS access.

## P1 — Stop losing what exists (week 1)
| # | Task | How in Framer | Owner |
|---|---|---|---|
| 1 | Push the redirect map (`data/redirects.csv`) | `addRedirects` via API; Site Settings → Redirects to verify order (explicit rows above wildcards) | script |
| 2 | Retire `legacy.meditron.ch` | 301 host‑wide at DNS/host, or `noindex` + robots disallow on the old server | you/client |
| 3 | Canonical host | Site Settings → Domains: `www.meditron.ch` primary, non‑www and http redirecting (Semrush shows 308s already — confirm no chain) | Framer UI |
| 4 | Google Search Console | Add `sc-domain:meditron.ch`; submit sitemap; export the 404 report into `data/gsc-404s.csv` | you/client |

## P2 — Sitemap & indexing (week 1–2)
| # | Task | How | Owner |
|---|---|---|---|
| 5 | Sitemap | Framer generates `/sitemap.xml` automatically, one entry per published page and locale. Check it after publish: every locale URL present, no `/jobs/` noise if jobs should be excluded, no draft/test pages. Submit in GSC. | script (`/seo sitemap` validates) |
| 6 | robots.txt | Framer serves a default; Site Settings → General → Robots to add `Sitemap:` line and disallow nothing important. Check it does not block `/de/` etc. | Framer UI |
| 7 | Index only what should rank | Page Settings → "Exclude from search engines" for: thank‑you pages, jobs listings (decide), privacy/legal duplicates, CMS detail pages that are placeholders. Everything else indexable. | Framer UI / script (page attributes) |
| 8 | Request indexing of new/changed URLs | GSC URL inspection for the hub + model pages on publish day; Indexing API via `/seo google` where allowed | script |
| 9 | Drift baseline | `/seo drift baseline` on the 10 key URLs so a future Framer edit that removes a title or noindexes a page is caught on Friday | script |

## P3 — Localisation done properly (week 1–3)
| # | Task | How | Owner |
|---|---|---|---|
| 10 | Locales | `de-CH` `/de`, `fr-CH` `/fr`, `it-CH` `/it`; English default, no prefix, set as **x‑default** | Framer UI (done) |
| 11 | Translated slugs | Every localised page gets its own slug (`/de/samsung-ultraschall/`, not `/de/samsung-ultrasound/`) — Localization panel → page → slug, or `setLocalizationData` | script |
| 12 | Localised metadata | Title, description, OG title/description per locale — never inherited from EN. Length: ≤60 / ≤155 chars | script |
| 13 | hreflang | Framer emits reciprocal hreflang automatically once locales + slugs exist. Verify after publish with `/seo hreflang https://www.meditron.ch/` (all four + x‑default on every page, no pointing at untranslated EN pages) | script |
| 14 | Don't publish half‑translated pages | Framer falls back to EN for missing fields → a `/de/` page in English is duplicate content. Rule: a locale goes live per page only when `review: approved` | process |
| 15 | Language switcher | Header switcher links to the *same page* in the other locale, not the homepage; real `<a>` links (Framer's Locale Switcher component does this) | Framer UI |
| 16 | `lang` attribute + `content-language` | Set automatically by Framer per locale — verify in page source | check |
| 17 | Localised sitemap entries | One sitemap; confirm `/de/…`, `/fr/…`, `/it/…` appear after publish | check |

## P4 — On‑page fundamentals per page (ongoing, part of `/framer-sync`)
| # | Task | How |
|---|---|---|
| 18 | One H1 per page carrying the target phrase; H2/H3 outline from the brief | content front‑matter → CMS fields |
| 19 | Title / meta description per page and locale | as #12 |
| 20 | Structured data: `Organization` (site‑wide), `LocalBusiness` ×2 offices, `Product` on model pages, `BreadcrumbList`, `FAQPage` where FAQs exist, `Article` on insights | `setCustomCode` head snippet per page (JSON‑LD) |
| 21 | Internal linking: hub → model pages → applications → contact; same‑language only; breadcrumbs | content templates |
| 22 | Images: descriptive filenames, alt text per locale, WebP/AVIF, explicit width/height (Framer handles format; alt text is ours) | content + `/seo images` |
| 23 | Open Graph image per key page (hub + models) | Page Settings → Social image |
| 24 | Contact/quote form → GA4 conversion event | Framer form → GA4 event (Site Settings → Analytics or custom code) |

## P5 — Performance & hygiene (month 1 baseline, then monthly)
| # | Task | How |
|---|---|---|
| 25 | Core Web Vitals baseline (LCP, INP, CLS) via PageSpeed/CrUX; fix oversized hero images/videos, heavy third‑party scripts | `/seo technical`, `/seo google` |
| 26 | Remove unused embeds/custom code; lazy‑load below‑fold media | Framer UI |
| 27 | 404 page: helpful, links to hub + contact, returns real 404 status | Framer UI |
| 28 | Security headers / HTTPS: Framer‑managed; just confirm no mixed content from old PDFs | check |
| 29 | Old PDFs (catalogue) — host on new site under a stable URL or redirect | you/client |
| 30 | Brand SERP: homepage title "Meditron – Official Samsung Ultrasound Distributor Switzerland", `Organization` schema with `sameAs` (LinkedIn, GBP), two Google Business Profiles | Framer UI + you/client |

Verification after each publish: `/seo page <url>` on the changed pages, `/seo hreflang`, sitemap check, GSC coverage the following Monday.

## Status 2026-09-08
- #1 done: 22 redirect rules live on production, verified (see `docs/04-redirect-plan.md`).
- #7 in progress: the live site had **"Exclude from search engines" on every page** except `/old-home`, `/privacy-policy`, `/jobs/*` (page metadata `noIndex` + `noIndexSite` = true). Framer branch "SEO: allow indexing (remove noindex)" clears it on `/`, `/purpose`, `/team`, `/contact`, `/products`, `/products/:slug`, `/solutions/:slug`, `/news-events`, `/news-events/:slug`. Kept excluded on purpose: `/search`, `/case-studies` and detail (placeholder lorem items). Awaiting client merge + publish.
- Follow-ups surfaced: `/old-home` is the only indexed page and duplicates the home — exclude it (or redirect to `/`) once the home is indexable. `/`, `/purpose`, `/team`, `/contact`, `/news-events` have no page title set and fall back to the site default; fix under #19.
- #10 not done: only `gsw-CH` exists; `de-CH`/`fr-CH`/`it-CH` must be created.

## Status 2026-09-10
- Locales de/fr/it live (no region, `hreflang="de"` etc.). Swiss German removed. Sitemap: 4 files × 238 URLs.
- Framer branch "SEO: clean product URLs + page titles": 31 product slugs cleaned (™ and `-copy` removed) with 31 redirects (all locales), product detail title template fixed per locale, Solutions title template reworded, one `ß` fix. Awaiting client merge + publish.
- DE drafts written: `content/de/samsung-ultraschall.md` (hub), `samsung-hera-z20.md`, `samsung-v8.md`, `samsung-r20.md`, `samsung-v7.md` — `review: draft`, for Jean. V4/V5/V6 next.
- Hub needs new CMS fields on Solutions (intro, FAQ, model table) or a dedicated page; decide before syncing.
- Content plan: `docs/07-content-plan.md`.
- Still open (client): Search Console access + sitemap submission, Clarity snippet, `legacy.meditron.ch`, apex-domain hop check. Reminder set for 11 Sep.

## Status 2026-09-11
- Framer branch "SEO: Samsung hub content (intro, FAQ, meta, slugs)" (`p2e1ptntb`): Solutions collection gets four fields (SEO Intro, FAQ, Meta Title, Meta Description). Ultrasound item filled in EN + DE (from `content/de/samsung-ultraschall.md`); meta title/description in EN/DE/FR/IT; the other four solutions get EN meta titles. Solutions detail page: two new sections (intro after hero, FAQ after products) bound to the fields; page title/description now come from the fields. Not published. FR/IT intro and FAQ fall back to EN until translated.
- Lesson: CMS fields added through `collection.addFields` are invisible to `applyChanges`; create them with `+Variable … scope="<collectionId>"` instead.
- Localised slugs for the hub (`/de/solutions/samsung-ultraschall` etc.) could not be set through the API ("Source not found for variable Jpw7HmsAR" = Slug). Set them in the Localization panel → Solutions › Ultrasound → Slug, then add the three redirects from `/xx/solutions/ultrasound`.
- Pre-existing lint error on the Solutions page: Desktop breakpoint has no opaque background fill. Not ours; harmless.
- Two branches now await merge: "SEO: clean product URLs + page titles" then this one.

## Status 2026-09-15
- Decision: English stays the default locale. Recommend Framer "Automatic Locale" (browser language) instead of location rules.
- Search Console: domain property verified by the client, sitemap submitted, hub URLs indexing requested.
- Framer branch "SEO: H1 headings + FAQs" (`ex22zgd94`): Solutions get an `H1` field ("Samsung Ultrasound/Ultraschall/…") bound to the hub hero; product name is now h1 on product pages; h1 set on /products, /team, /news-events, /purpose ("Powered by innovation"); the "14+ / 35+" stats are no longer h1. FAQ collection: 22 new rows (6 home, 4 per other solution) EN + DE, "Show on Home" flag; home page gets an FAQ section with the accordion before "Let's Talk". Not published.
- Home hero H1 is "Treat With Precision" (no keyword). Copy decision for Jean, not changed.
- Product title template is set in the editor; the live fallback title is just the unpublished state.
- Branch "Fix DE/FR/IT hub title template" and the accordion are merged, still unpublished.

## Status 2026-09-21
- Framer branch "SEO: structured data" (`j6m3l79zc`): site-wide JSON-LD (Organization + LocalBusiness Rolle/Frauenfeld) via Site Settings custom code (headEnd); `SchemaJsonLd` code component on the Products and Solutions detail pages emitting Product + BreadcrumbList / BreadcrumbList per item. No company LinkedIn page found for `sameAs` – ask client. FAQPage schema deliberately skipped (Google no longer shows FAQ rich results for commercial sites).
- Article 1 German draft: `content/de/welches-samsung-ultraschallgeraet-praxis.md`, Google Doc for Jean. Needs author + Henri's leasing/pre-owned confirmation.

## Status 2026-09-21
- #20 structured data on branch `j6m3l79zc` (Organization, LocalBusiness ×2, Product+Breadcrumb on products, Breadcrumb on solutions, **Article+Breadcrumb on news detail** via `SchemaJsonLd` kind=article; foundingDate 1991). Preview builds clean. Awaiting merge + publish. Live check 21 Sep: 0 JSON-LD blocks on all pages.
- New branch `ohmgagfx1` "SEO: site hygiene": titles+descriptions EN/DE/FR/IT for /contact, /team, /purpose, /news-events; news detail `{{Title}} | Meditron` / `{{Introduction}}`; products detail description `{{Description}}`; `/old-home` noIndex; alt text on all 219 product images (Main Image); news title node `f3RLNs9qv` tag h1; hub hero `OrPQZ8QHQ` tag h1 (live hub had no h1 on 21 Sep); `/purpose` "1M+" no longer h1 ("Powered by" is the page h1).
- New branch `rb52a2qgm` "Content: three EN article drafts": News & Events items (draft=true, Type 3 = Thought pieces, author placeholder Nikita Müller) for `which-samsung-ultrasound-system-for-my-practice`, `samsung-ultrasound-price-switzerland`, `new-or-pre-owned-ultrasound-system`. Canonical copy in `content/en/`.
- Production last published 16 Sep 14:24 UTC; staging 18 Sep. Live pages still show `/purpose` stats as h1 and no hub h1 → publish needed after merge.
- Open: llms.txt (404; Framer has no root file upload, would need redirect to hosted file), home H1 is the tagline "Treat With Precision" (client decision), `/products` H1 reads "Solutions" (client decision), FR/IT hub intro+FAQ translations, company LinkedIn URL for sameAs.

## Status 2026-09-23 – article template (branch `rb52a2qgm`)
- News detail page `/news-events/:slug`: left column is now a `Sidebar` frame (280px) holding the author pill and a new `ArticleContents` code component (`scripts/framer/code/ArticleContents.tsx`, `codeFile/APr1tlF:default`). The component reads the `h2` headings of the `Body` rich text layer on the client, gives them ids and lists them as anchor links (not sticky). Renders nothing on pages without h2s. Reason: Framer strips `id` attributes and `#anchor` links from CMS rich text, so a hand-written TOC cannot work.
- FAQ: new single-reference field `Article` (`l059MJo6U`) on the FAQ collection → News & Events. Under the body: `FAQ Title List` (collection list, limit 1, shows the heading only when rows exist) + `FAQ List` (collection list filtered Article = current item, sorted by Order) repeating `FAQItem` with group = article id, so one row open at a time. 20 rows added for the three articles (`<slug>-1…7`). Headings localised (Inhalt/Sommaire/Indice, Häufige Fragen/Questions fréquentes/Domande frequenti).
- Article bodies no longer contain the TOC, the "Back to contents" links or the FAQ block; `content/en/*.md` keeps the full text as the canonical copy.
- Note: absolute links and tables survive in CMS rich text; heading ids and `#` links do not.

## Status 2026-09-29
- All articles are published under the **Insights** category (Types item `BV_nqtp0t`, labels Insights / Erkenntnisse / Analyses / Approfondimenti), not News or Events. The three draft articles on branch `rb52a2qgm` now reference it. New articles: set `Type` = Insights and `Type 3` = Thought pieces.
- URLs stay under `/news-events/<slug>` (the collection's path); the category is a filter on the list page.

## Status 2026-09-30 – first three articles published
- Published to production (deployment `7e5c14ac0`): articles 1–3 in EN with DE/FR localisations, category Insights, no placeholder text, hero image on each.
- Authors set in Framer: 1 Nikita Müller (reviewed by Henri), 2 Dr. Henri Hagenmüller (reviewed by Nikita), 3 Christelle Sam-Hine (reviewed by Henri). Bylines localised in DE/FR.
- Hero images: generated typographic images (1600×900 JPEG, site gradient palette) via `scripts/framer/hero-images.mjs` (headless Chromium), uploaded with `framer.uploadImage`, stored in `content/images/`. Replace with product photography when Meditron supplies it; same field, same alt text.
- Gotcha: `addItems` with `valueByLocale` needs `{ action: "set", value }` per locale; `uploadImage` takes `{ image: { bytes, mimeType }, name, altText }`.

## Status 2026-09-30 (later) – Insights labels and image ratio
- Nav (`New Navigation` Q6QxmZWoF) and footer (`New Footer` oY3QwAzZI): "Latest" → "Insights" in all four languages (Link component `$control__text` on F9FW9kWLm, pi1MyyNzu, KAcsaSE_i, Kj0yhCspj; localisation sources set to "Insights").
- Home section heading: "News & Events" → "News and Insights" (EN), "News und Insights" (DE), "Actualités et Insights" (FR), "Notizie e Insights" (IT). The /news-events page heading is unchanged.
- Article images: list card frame (EuCgXuDmA + breakpoint replicas) and article hero (pvpvOm4RW + replicas) both set to aspectRatio 1.5 (3:2) so the same image shows uncropped everywhere. Hero images regenerated at 1500×1000 with 110px safe margins (`scripts/framer/hero-images.mjs`). Any future article image should be supplied at 3:2.
- Published to production, version 089630422.

## Article image system (2026-09-30)
- Insights articles use a flat brand colour with the Meditron mark centred, 3:2, no text (`content/images/flat-N-<hex>.jpg`, generator `scripts/framer/hero-images.mjs`, mark `content/images/meditron-mark.svg`, navy #12304B).
- Seven colours, cycle in order per article: D9E7D1, EFDCDF, F8F6EA, FDD682, ECDBDB, EFE8D1, D8C8C8. Live: article 1 = D9E7D1, article 2 = FDD682, article 3 = EFDCDF. Published to production, version 05e5d3b3f.
- English pages are edge-cached by Framer for a while after a publish; German pages showed the change first. Check /de if EN looks stale.
- 2026-09-30: enum case "Thought pieces" (Type 3 field EYfJm_pqU, case VbiNulsKs) renamed to "Insights"; no DE/FR/IT overrides, shows "Insights" in all languages like the nav.
- Report page: source in `report/` (index.html + data.json, passcode gate). Live at https://mtrn-visibility-7k2q.vercel.app (Vercel project `mtrn-visibility-7k2q`, team Rise, Vercel Auth off). Deploy via the Vercel MCP `create_deployment` with `project` set to the project id and no `teamId`, or `npx vercel deploy report --prod --scope useriseco`.

## Status 2026-09-30 (evening)
- Article body headings: new text styles `Heading 2 Article` (KTQIeIvRq, 42/34/28/24px) and `Heading 3 Article` (Aj2ugLM0l) bound as the H2/H3 presets of the article Body node (FUCOvBnTG + breakpoint replicas). Semantic tags stay h2/h3; only the size changed (half of Heading 2).
- Article links: site custom code (head end) adds `<style id="mtr-article-links">` so links inside the article Body inherit colour at 90 % opacity, no underline (underline on hover). Framer's Link style API has no server-side access, hence CSS.
- Category label "Insights": localised as Erkenntnisse / Perspectives / Approfondimenti on the News & Events enum case, the Types item, and the nav/footer links (someone had already set FR "Perspectives", kept).
- Article 3 DE/FR bodies had been flattened to a single bold paragraph (no headings, no tables). Rebuilt from `content/_drafts/a3-de.html` / `a3-fr.html` (contents list, FAQ section and back-links stripped, bylines filled) and re-uploaded. Published, version 4239b351a.

## Status 2026-10-02 – localised article slugs
- Jonny switched on "Translate Page Paths" (Localization view → Settings) on main. Before that, CMS slugs reported `notLocalizable` and the API refused `slugByLocale` ("Source not found for variable GzMunCO_x"). Slug sources now exist for every collection item (type `slug`); page paths are untouched and stay English (decision: articles yes, section paths no).
- DE/FR slugs set via `scripts/framer/localized-slugs.mjs` (`addItems` with `slugByLocale: { <locale>: { action: "set", value } }`): article 1 `welches-samsung-ultraschallgeraet-fuer-meine-praxis` / `quel-echographe-samsung-pour-mon-cabinet`; article 2 `samsung-ultraschallgeraet-preis-schweiz` / `prix-echographe-samsung-suisse`; article 3 `ultraschallgeraet-neu-oder-occasion` / `echographe-neuf-ou-occasion`. IT keeps the English slug until Italian copy exists. ASCII only (ae/oe/ue/ss, no accents).
- Published dates staggered: 21 Sep, 25 Sep, 30 Sep 2026 (field VGodevXNq).
- Six 308 redirects from the old `/de|fr/news-events/<english-slug>` URLs (data/redirects.csv, pushed with redirects.mjs; 59 rows live).
- Production version 9b3532a94. Verified: new URLs 200, old locale URLs 308 to the new ones, hreflang on EN/DE/FR pages points at the new URLs, sitemap_de/fr list them, Article JSON-LD carries the new dates.
- Indexing: no Search Console API access from here. Ask in GSC → URL inspection → "Request indexing" for the 6 new URLs (EN URLs unchanged). Sitemaps are already submitted, so Google will pick them up within days regardless.

## Status 2026-10-02 (later) – articles 4–6 on staging
- Articles 4 (HERA Z20 vs V8, author Nikita, image F8F6EA, date 5 Oct), 5 (mobile vs stationary, Henri, ECDBDB, 7 Oct), 6 (first 90 days, Christelle, EFE8D1, 9 Oct) created as published CMS items `QfzpSrhuW`, `rsTlccaaW`, `OUPvGJ5aw` with EN body plus DE/FR `valueByLocale`, localised slugs (`samsung-hera-z20-oder-v8-gynaekologie` / `samsung-hera-z20-ou-v8-gynecologie`, `ultraschallgeraet-tragbar-oder-stationaer` / `echographe-portable-ou-fixe`, `die-ersten-90-tage-neues-ultraschallgeraet` / `90-premiers-jours-nouvel-echographe`) and 18 FAQ rows (6 per article, EN/DE/FR) in the FAQ collection linked via the Article field `l059MJo6U`.
- German copy got a naturalness pass before upload (`scripts/framer/build-articles-4-6.py` holds the edits; applied to `content/_drafts/a{4,5,6}-de.html`). Bylines filled, placeholders removed, in-body links point at the localised slugs of articles 1–3.
- Pipeline: `build-articles-4-6.py` (drafts → JSON) then `push-articles-4-6.mjs` (images, items, FAQ rows, publish preview → staging). Published to **staging only**, version 589ef1225 (https://only-measure-905157.framer.app). Not deployed to production. Note: the items are not drafts, so the next "deploy to production" by anyone will take them live.
- Staging host is blocked from this container, so the visual check is on the client side.
- 2026-10-05: article tables. Site custom code (head end) gained `<style id="mtr-article-tables">`: `table-layout:auto`, first column `width:1%; white-space:nowrap` (shrinks the number column to its content), `overflow-wrap:anywhere; hyphens:auto` on cells so long German words break instead of overflowing. On staging, version 00c4a256e. Production deploy pending Jonny's go-ahead (articles 4–6 are non-draft on main, so a production deploy takes them live too; flip them to draft first if they are not yet approved).

## Status 2026-10-05 – DataForSEO measurement
- Account team@userise.co (USD 50 credit). Credentials in `.env` (`DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`); Node fetch needs `NODE_USE_ENV_PROXY=1` in the cloud session; host `api.dataforseo.com` must be on the environment allowlist. API password was pasted into chat once and should be rotated.
- `scripts/dataforseo/baseline.mjs`: Google Ads volume + live Swiss SERP (3 samples per term, best position, AI Overview + citations) for `data/tracking-list.csv` → `reports/data/google-<date>.json`. Live Swiss results alternate between two result sets, so position = best of 3 with a "seen n/3" column.
- `scripts/dataforseo/ai-prompts.mjs`: 20 prompts × ChatGPT gpt-5.5, Gemini 3.5 Flash, Perplexity sonar-pro, web search on → `reports/data/ai-<date>.json`. ~USD 3 per run.
- `scripts/dataforseo/report-fill.mjs` puts both into `report/data.json`; redeploy via Vercel MCP `create_deployment` (inline files, project mtrn-visibility-7k2q).
- First run 5 Oct: 11 of 20 terms on page 1 (best of 3), 13 on pages 1–2; AI Overview on 5 terms, 1 cites Meditron (FR occasion); Meditron named in 20 of 60 AI answers, cited in 15; all 12 "who sells Samsung in Switzerland" answers name Meditron first. Cost of both runs ≈ USD 4.
- 2026-10-05 (later): report rebuilt as Overview + one tab per month (`report/index.html`, data model in `report/data.json`: `kpis` fixed list, `months[]` each with `values`, Google/AI tables, done/next/discuss). Ten fixed measures, same formulas every month (`scripts/dataforseo/report-fill.mjs` adds a month from the latest result files). September kept as a baseline month, marked "different method". Branded "Rise × Meditron · SEO / GEO report". Passcode `med`. Monthly routine: run `baseline.mjs` + `ai-prompts.mjs` (with `NODE_USE_ENV_PROXY=1`), then `report-fill.mjs YYYY-MM`, edit `status`/`done`/`next`/`discuss` for the month, redeploy via Vercel MCP.
- 2026-10-05: article 4 deployed to production (version 5585f57e3, with the article-table CSS). Articles 5 and 6 set to draft on main so the Mon/Wed/Fri publish routine (trig_016N97kwVWCoC1SAdCLxMDru) can un-draft one per publish day; drafting routine trig_01UHhnnCXbQnnfTfZfrn7cg4 runs Mondays. Decision: no client proofreading, publish on schedule; holds list in docs/08-publishing-cadence.md. Routines were created without the Drive and Vercel connectors; attach them in the Routines UI or report redeploys stay manual.
- 2026-10-05: Italian added to articles 1–6 by hand (Framer AI translation credits exhausted). `scripts/framer/build-articles-it.py` → `.cache/it.json` → `scripts/framer/push-articles-it.mjs` (IT `valueByLocale` on Title/Intro/Body, `slugByLocale` IT, 38 FAQ rows). Italian slugs: quale-ecografo-samsung-per-il-mio-studio, prezzo-ecografo-samsung-svizzera, ecografo-nuovo-o-usato, samsung-hera-z20-o-v8-ginecologia, ecografo-portatile-o-fisso, primi-90-giorni-nuovo-ecografo. Four IT redirects pushed (63 rows live). Production version e15f349ac; articles 5 and 6 remain drafts. Future articles: the drafting routine must include IT in step 2 and 3 (prompt says EN/DE/FR; add IT).
- 2026-10-05: Italian gap audit via `getLocalizationGroups` (8,697 sources; the 6,400 "missing" ones are product fields empty in English too). Real gap was 19 sources, ~365 words: Ultrasound hub intro (6lVGu1uzvzkOlFyrdrRp7M), the five hub FAQ rows, and title/description of the four other solution pages. Filled by hand with `setLocalizationData` (needsReview false), production version 7f4214ac4. Italian is now complete for everything that has English text; the other solution pages' intros never existed in any language (out of scope).
- 2026-10-05: Italian alt text for all 225 images (212 products via pattern, 6 article images = Italian title + "Meditron Insights"; `setLocalizationData` IT only). Production 8d57bae59 and the following version. DE and FR alt texts deliberately left untouched (German hands-off rule; FR not requested).
- 2026-10-05: report tooltips reworked (hover popup with the English text, no underline; faint eye icon on each scorecard tile explains the measure, text in `kpis[].help`); wording scrubbed of tooling references; Discuss items shortened. Keyword ideas pull: `scripts/dataforseo/kw-ideas.mjs` → `reports/data/keyword-ideas-2026-10-05.json`.
- 2026-10-05: product detail page (`/products/:Products`) on Framer branch `scc5sx6dj` "Product page: centred sections + FAQ accordion", branch preview https://only-measure-905157--amber-dune-scc5sx6dj.framer.app (version 0b4a64d26). Changes: Technical Data, Benefits, Compatible Products, Variants, Why work with Meditron and FAQ sections now centre at 1200px like the hero (section `stackAlignment` center, `maxWidth` 100%, children 1200px); "Why work with Meditron" and Benefits rich text use `Body/Body MD-Regular` with 12px paragraph spacing; the four static FAQ frames replaced by `FAQItem` accordion rows (group = product id, visible when the question is set). `FAQItem.tsx` gained an `answerRichText` rich-text control (the product FAQ answers are formatted text, which the string control refused) and renders HTML answers. **Not merged**: the merge to main was blocked in this session (counts as a production deploy); merge the branch in Framer, then publish staging → production. Benefits (204 products), Variants (31) and Download Brochure (81) already render under the body when filled; Compatible Products is empty on every item.
