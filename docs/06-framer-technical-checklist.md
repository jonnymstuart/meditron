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
