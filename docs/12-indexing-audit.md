# Indexing audit, 25 October 2026

Scope: www.meditron.ch, four locales (EN default at `/`, DE `/de/`, FR `/fr/`, IT `/it/`). Evidence from live fetches on 25 Oct (robots.txt, sitemaps, page heads) and a DataForSEO `site:` check (Swiss Google). Search Console data is not available to us yet; the recommendations say where it would change the picture.

## What is fine
- `robots.txt` allows everything and points to `sitemap.xml`; the index lists one sitemap per locale (`sitemap_en/de/fr/it.xml`).
- Every page carries `rel=canonical` to its own clean URL and hreflang for en, de, fr, it plus `x-default` → EN. Filtered catalogue URLs (`?category=…&brand=…`) canonicalise to the plain product URL.
- `/old-home` is `noindex`. `<html lang>` matches the locale on DE pages.
- Localised article slugs work: `/de/news-events/samsung-ultrasound-price-switzerland` 308-redirects to the German slug.
- Structured data on article pages: Article, BreadcrumbList, Organization, LocalBusiness ×2, Person; on product pages Product + Brand.

## Findings, ranked

| # | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|
| 1 | **EN sitemap lists the six German article slugs without `/de/`**, all 404 | `sitemap_en.xml` contains `/news-events/samsung-ultraschallgeraet-preis-schweiz`, `/news-events/ultraschallgeraet-neu-oder-occasion`, `…/die-ersten-90-tage-neues-ultraschallgeraet`, `…/samsung-hera-z20-oder-v8-gynaekologie`, `…/ultraschallgeraet-tragbar-oder-stationaer`, `…/welches-samsung-ultraschallgeraet-fuer-meine-praxis`; each returns 404 | Google wastes crawl on 404s and reports "Not found" errors in Search Console; no ranking effect on the real pages | Framer generates the sitemap; this is a Framer bug with "translate page paths". Report it to Framer support with the six URLs. Nothing to change on our side. Re-check after each publish; the same leak will appear for articles 7–9 (`/news-events/ultraschall-leasing-arztpraxis` etc.). |
| 2 | **`legacy.meditron.ch` is live and indexed** | `site:meditron.ch` returns `https://legacy.meditron.ch/` among the first 20 results | A second copy of the old site competes with the new one on brand searches and splits authority | Meditron's hosting/DNS: 301 the whole `legacy.` host to `www.meditron.ch` (page-level where the redirect map in `docs/04` has a target, otherwise to `/`). If it must stay reachable, `noindex` every page. |
| 3 | **Legacy news posts appear under English slugs in DE/FR/IT** | `sitemap_de.xml` lists `/de/news-events/4-broken-fingers.-2-broken-wrists.-1-broken-shoulder.`, `…/mindray-meditron---we-just-made-it-official`, `…/35-years-of-meditron`, `…/welcome-stephen` etc., 7 posts; the DE pages show English text | Thin, duplicate pages in three locales; the "Legacy news posts" card on the dashboard | Decision for Meditron: translate the three Samsung-relevant posts (1'000 systems, 35 years, Esaote) with DE/FR slugs; archive or `noindex` the rest. Also the two test drafts in the collection ("Innovative technologies…", "New High-Resolution…") can be deleted. |
| 4 | **New model copy and the 7 probe pages are not in production** | Live `/products/samsung-hera-z20` still shows the pre-20 Oct content and the old Compatible/Related mix; probe URLs 404 on production and are absent from the sitemaps | Google keeps indexing the old pages; the model-term slide in the 20 Oct reading cannot reverse until they are live | Merge the two open Framer branches and publish production. The probe pages are `Visible = false` (hidden from the catalogue grid) but indexable; they enter the sitemap on publish. |
| 5 | **Indexed count below sitemap count** | DataForSEO: `site:meditron.ch` ≈ 775 results vs 980 sitemap URLs (4 × 245); per-locale `site:` counts are not reliable from DataForSEO | Roughly a fifth of the URLs, most likely DE/FR/IT product pages of the QA and radiotherapy ranges, are not indexed | Only Search Console shows which. Export Pages → "Why pages aren't indexed" (team@userise.co has access) and we work the list. Expected causes: "Duplicate without user-selected canonical" where the DE/FR/IT product text equals the EN text, and "Crawled, currently not indexed" on the long tail. |
| 6 | **Hub DE slug** | `/de/solutions/samsung-ultraschall` 404; the German hub lives at `/de/solutions/ultrasound` | None live; our own docs referenced the wrong URL | Fixed in docs. If Meditron wants the German slug, it is set in Framer's Localization panel (Solutions › Ultrasound › Slug) and we add the redirect. |
| 7 | **Italian article slugs still English** on articles 1–6 (IT text is in place) | `/it/news-events/samsung-ultrasound-price-switzerland` serves Italian | Minor; keyword in URL missing for IT | Set the IT slugs from `scripts/framer/build-articles-it.py` (already defined) with `localized-slugs.mjs`; add the redirects. Articles 7–9 already have IT slugs. |

## Not a problem, checked
- No `noindex` on product, solution or article pages. No blocked resources in robots.txt. Sitemaps carry 219 products + 13 news + static pages per locale, identical URL sets across locales (as expected for Framer).
- Articles 7–9 published to staging on 25 Oct with EN/DE/FR/IT slugs; they will appear in all four sitemaps on the production publish.

## Next check
Repeat the three commands after the production publish and again on the Monday run: sitemap diff per locale, 404s among sitemap URLs, `site:` count. Add the Search Console indexing export as soon as it exists.
