# Meditron DE pages: technical and on-page SEO audit

Audited 25 Nov 2026 against production (Framer build "Published Nov 24, 2026, 10:17 AM UTC"). Read-only. Method: curl of the raw HTML for the 262 URLs in `sitemap_de.xml`, Playwright render (de-CH, 1440px and 390px) of 17 target pages, a reciprocity check on the 51 EN/FR/IT alternates, and Playwright timing at 390px. PageSpeed Insights and CrUX could not run: the keyless PSI quota returned "rate limit exceeded", so there is no field data in this audit.

Pages audited in depth: `/de/`, `/de/solutions/ultrasound`, `/de/products`, `/de/products/samsung-{hera-z20,v8,r20,v7,v6,v5,v4}`, `/de/news-events`, the articles `welches-samsung-ultraschallgeraet-fuer-meine-praxis`, `samsung-ultraschallgeraet-preis-schweiz` and `ultraschallgeraet-neu-oder-occasion` (plus the older `1-000-samsung-ultrasound-systems-installed-in-switzerland-by-meditron`), `/de/contact` and `/de/team`.

## Summary

The international basics are sound:
- All 262 DE sitemap URLs return 200 and are self-canonical. None is noindexed.
- Every page has `<html lang="de">`.
- Hreflang (en/de/fr/it plus x-default to EN) is complete and reciprocal on all 17 audited pages. All 51 return checks passed.
- The hub and the 7 model pages have German titles and H1s that contain the target terms ("Samsung Ultraschall", "Samsung V8 Ultraschallgerät").
- No horizontal scroll at 390px and CLS is 0.

The problems are in shared templates and CMS bindings, so each one repeats across many pages:
1. On every DE article and product page, the JSON-LD declares the English or a 404 URL, with `inLanguage: "en"`.
2. 233 of 262 DE pages carry a literal `alt="var(--variable-…)"`.
3. `/de/products` is titled "Samsung Ultraschallgeräte" but shows mammography phantoms. Its HTML is 2.06 MB, which is 98.4% of what Googlebot fetches.
4. Template strings are still in English: the home H1 "Treat with Precision", "Related models", "Brochure", "See All", "Select Language" and the 404 page.
5. Two money articles link 11–12 times to the EN versions.
6. The V6, V5 and V4 pages are thin.
7. `legacy.meditron.ch` still serves an indexable English Joomla site. It is not a German competitor, but it is a quality and duplication liability.
8. Local signals: the Frauenfeld office is in the footer and in schema, but it has no phone number of its own, and the contact page has no H1.

---

## Critical

### C1. JSON-LD on DE CMS pages declares English or 404 URLs and `inLanguage: "en"` (about 228 pages)
Evidence:
- **Articles.** On `/de/news-events/samsung-ultraschallgeraet-preis-schweiz`, Article `url`, `mainEntityOfPage.@id` and the BreadcrumbList item all equal `https://www.meditron.ch/news-events/samsung-ultraschallgeraet-preis-schweiz`. That URL returns **404**. The same pattern returns 404 for `welches-samsung-ultraschallgeraet-fuer-meine-praxis` and `ultraschallgeraet-neu-oder-occasion`. `"inLanguage": "en"` on all 4 articles checked.
- **Products.** On `/de/products/samsung-v8`, MedicalDevice `@id`/`url` and `subjectOf.WebPage.@id` point to `https://www.meditron.ch/products/samsung-v8`, which is the EN page. All 7 model pages are the same.
- **Breadcrumbs.** On every DE article and product page, the breadcrumb names are English ("Home", "Products", "News & Events") and the URLs are EN, e.g. `https://www.meditron.ch/products`.

Effect: the structured data contradicts the canonical and the hreflang. On articles it points Google and AI crawlers at dead URLs.

Fix: in the Framer page-template custom code (or in the JSON-LD that `/framer-sync` injects), build URLs from the localized path with the locale prefix. Set `inLanguage` from the locale (`de-CH` on `/de/`). Localize the breadcrumb names to Start / Produkte / Ratgeber. Then re-test one article and one product in the Rich Results Test.

### C2. `/de/products`: Samsung title on a radiology-phantom page, and HTML at the 2 MB Googlebot limit
Evidence:
- Title "Samsung Ultraschallgeräte | Meditron Schweiz". The meta description is about Samsung.
- The visible H1 is "Lösungen". The 15 items shown before "Mehr laden" are all Diagnomatic mammography/dental phantoms (Pro-MAM Biopsie, Pro-MAM HCRP …), sorted by CMS date and showing a timestamp such as "24.04.26, 12:20".
- The raw HTML is 2,064,612 bytes, 98.4% of Googlebot's 2 MiB fetch cap. All 211 product cards are server-rendered, and the page carries 422 `alt="var(--…)"` attributes.
- The first link to `samsung-v8` sits at byte 866,768 (42%).
- The title competes with the hub "Samsung Ultraschall Schweiz – Distributor | Meditron" for the same query.

Fix:
- Retitle `/de/products` as the full catalogue, e.g. "Produkte: Ultraschall, Radiologie, Strahlentherapie | Meditron". Give it a matching H1, e.g. "Produkte".
- Leave "Samsung Ultraschallgeräte" to the hub.
- Cap the server-rendered collection list (Framer "Limit" of about 24 plus real pagination or filtered pages) so the HTML drops well under 1 MB.
- Sort ultrasound first, or default to the category filter.
- Remove the date/time line from the cards.

---

## High

### H1. Literal `alt="var(--variable-…)"` on 233 of 262 DE pages
Evidence:
- `/de/products`: 422 attributes in the raw HTML.
- `/de/solutions/ultrasound`: 21 × `var(--variable-krFC3FLEV)` and 9 × `var(--variable-vw83FnJy7)`.
- `/de/products/samsung-v8`: 6 + 1. Every model page shows 2–4 of them on visible images, including the hero gallery.

The product-card and gallery components bind alt text to a component variable that is not resolved. Browsers and Google receive the CSS-variable string as the alt text.

Fix: in the component (Product Card, Gallery), bind Alt Text to the CMS field. Add a localized "Bild-Alt" field to the Products collection, or fall back to the product name. Re-run `cms-lint` with a check for `alt="var(`.

### H2. DE articles link to EN pages
Evidence (rendered links):
- `welches-samsung-ultraschallgeraet-fuer-meine-praxis`: 11 links to `/products/samsung-{hera-z20,r20,v8,v7,v6,v5,v4}`, `/solutions/ultrasound`, `/contact`, and two EN articles.
- `samsung-ultraschallgeraet-preis-schweiz`: 12 links of the same kind.
- `ultraschallgeraet-neu-oder-occasion` is clean (0).
- In the raw (pre-hydration) HTML of `/de/`, `/de/purpose` and the 5 `/de/solutions/*` pages, the brand/category links point to EN `https://www.meditron.ch/products?brand=…` (66 targets across 9 pages). JS rewrites them to `/de/` after hydration.

Fix:
- In the DE rich-text fields, replace the absolute EN URLs with `/de/...` (or with Framer page links, which localize).
- Add a lint rule: any `href="https://www.meditron.ch/` without `/de/` in `content/de/*.md` fails.
- For the category links, use Framer internal page links with query params instead of absolute URLs.

### H3. Home H1 is English and does not name the topic
Evidence:
- The visible H1 is split into two `<h1>` tags: "Treat with" + "Precision".
- The meta description says "Seit über 12 Jahren …". 2012 to 2026 is 14 years, so this is stale.
- The meta description is 176 characters.

Fix:
- One German H1 with the entity and the topic, e.g. "Samsung Ultraschall und Medizintechnik für die Schweiz". The slogan can move to a styled `<p>`.
- Update the description to "Seit 2012 …", ≤155 characters.
- The client must approve the copy.

### H4. English strings in the shared DE templates
Evidence, all on DE pages:

| String | Where | Element |
|---|---|---|
| "Related models" | HERA Z20, V8, R20, V7 | H2 |
| "Brochure" | all 7 model pages | spec label |
| "See All" | `/de/contact` | link |
| "Select Language" plus "English / German / French / Italian" | every page | locale switcher |
| "Page Not Found \| Framer" | any DE 404, e.g. `/de/produkte` | `<html lang="en">` |
| "Home" / "Products" / "News & Events" | articles and products | schema breadcrumbs |

English alt text on 3 article thumbnails, shown on the hub and on `/de/news-events`:
- "Samsung R20: premium radiology ultrasound for institutes and hospitals"
- "Samsung V7 vs V6 vs V5: which system fits your practice?"
- "Ultrasound for gynaecology: which probes does the practice need?"

Fix:
- Localize the component texts in Framer Localization: "Verwandte Modelle", "Broschüre", "Alle ansehen".
- Show the locale switcher as endonyms: Deutsch / Français / Italiano / English.
- Design a localized 404 page.
- Fill the DE thumbnail-alt field for those 3 articles.

### H5. `legacy.meditron.ch` still serves an indexable site
Evidence:
- `http://legacy.meditron.ch/` returns 200 (Apache/Joomla, `lang="en-gb"`). There is no noindex and no canonical.
- The page prints visible PHP warnings ("Warning: Undefined array key 5 in …/mod_jmg_sidebar/…").
- `/ultrasound/` returns 200 (452 KB).
- HTTPS fails: the certificate is for `preview.infomaniak.website`, not `legacy.meditron.ch`.
- robots.txt allows crawling.
- No German content was found: 0 German function words on `/` and `/ultrasound/`, and `/de/` returns 404.

It does not compete in German. It does duplicate the brand and leaks low-quality pages, and `docs/04-redirect-plan.md` lists it as still open.

Fix (at Infomaniak/DNS, outside Framer): a host-wide 301 to `https://www.meditron.ch/` (preferred, with path rules for `/ultrasound/*`). As a stopgap, `X-Robots-Tag: noindex` plus removal in GSC.

### H6. V6, V5 and V4 model pages are thin and generic
Evidence:
- Main-content words: V6 416, V5 409, V4 416. That count includes the shared "Warum Meditron", "Weiterlesen" and FAQ blocks, so the unique text is about 250–300 words. For comparison: V8 1,122, R20 1,074, HERA Z20 1,477.
- No "Vorteile" section and no related models.
- The FAQ answers are boilerplate, e.g. "Ja, es unterstützt sowohl allgemeine als auch spezialisierte klinische Anwendungen."
- The spec label "Physische Abmessungen" comes from the older template.
- V6 lists the same depth (96,4 cm) as V8.

Fix: bring the V6/V5/V4 CMS items up to the V8 pattern: intro, Vorteile, Related models, and model-specific FAQs (Occasion/Leasing, V6 vs V5). Use only Samsung-published specs, verified by the client. Use the same field IDs as V8.

---

## Medium

### M1. Local signals for German-speaking Switzerland
Evidence:
- The Frauenfeld address (Schönenhofstrasse 19, 8500 Frauenfeld) appears on every DE page, but only in the shared contact block as one line: "Place de l'Industrie 2, 1180 Rolle, Schönenhofstrasse 19, 8500 Frauenfeld".
- Only one phone number appears anywhere: +41 22 995 01 91, a Rolle (022) number. The format is correct.
- `/de/contact` has **no H1**. "Lass uns sprechen!" is an H2, and "See All" is English.
- Schema has one Organization and two LocalBusiness entries (#rolle, #frauenfeld).
  - Both carry `"telephone": "+41 22 995 01 91"`.
  - Both have `url: https://www.meditron.ch/contact`, which is the EN page.
  - No `geo`, `openingHoursSpecification` or `hasMap`.
  - The Organization `description` is in English.

Fix:
- `/de/contact` gets the H1 "Kontakt: Meditron in Rolle und Frauenfeld" and two address cards, each with its own phone number (a 052 number if one exists), opening hours and a map link.
- In schema: the Frauenfeld phone, `url` set to `/de/contact`, `geo`, opening hours, and the German description on DE.
- Make sure the Google Business Profile for Frauenfeld uses the same NAP.

### M2. FAQ schema is split into separate FAQPage blocks
Evidence: the hub carries 10 `FAQPage` blocks with one Question each. Each model page carries 6 and the articles carry 7. Google expects one FAQPage per page and the Rich Results Test reports duplicates. FAQ rich results are limited anyway, but Bing and AI parsers read the markup.

Fix: emit one `FAQPage` with a `mainEntity` array in the template, from the CMS FAQ list.

### M3. Title and description length, duplicates and brand repeats

| Page | Title length | Description length |
|---|---|---|
| welches-… | 67 | 200 |
| preis-schweiz | 66 | **274** |
| neu-oder-occasion | 82 | 161 |
| 1-000-… | 90 | 212 |
| team | 76 | 149 |
| `/de/products` | 44 | 197 |
| `/de/` | 57 | 176 |
| `/de/contact` | 60 | 182 |

- The brand appears twice in some titles: "Meditron Team – … | Meditron", "Kontakt Meditron – … | Meditron", "… durch Meditron | Meditron".
- All 3 `/de/jobs/*` pages reuse the homepage title and description.
- `/de/privacy-policy` has the title "Meditron: Präzise behandeln".

Fix: titles ≤60 characters, with a single brand suffix. Descriptions 120–155 characters. Give the job and privacy pages their own titles and descriptions.

### M4. Du/Sie mix, Swiss wording and the cookie banner
Evidence:
- "Lass uns sprechen!" (du) is the H2 on 17/17 audited pages. The sentence directly below it uses Sie ("Sie haben Fragen, benötigen ein Angebot …").
- That shared sentence uses "Angebot" where the Swiss term is "Offerte".
- `/de/team` mixes "Wir sind für Dich da", "Hast Du Interesse", "Werde Teil des Teams" and "Installiere …" with "Sie liefern …" and "Beraten Sie …".
- The cookie text says "Lesen Sie unseren Cookie-Richtlinie" (wrong article). It links to `https://www.framer.com/legal/policy/`, which is Framer's own policy, not Meditron's.
- Home: "das Wohle der Patienten" (should be "das Wohl"). The footer says "© 2025" and lists "Erkenntnisse" twice.

Fix (for client copy approval):
- "Sprechen Sie mit uns" with "Offerte".
- Sie throughout the B2B pages. Du only on job ads, and consistently within them.
- Cookie text "unsere Cookie-Richtlinie", linking to `/de/privacy-policy`.
- A dynamic year in the footer.

### M5. `ß` on 25 DE pages
Evidence:
- `/de/team`: "fließend" ×2
- `/de/jobs/logistiktechniker`: "Außendienst"
- `/de/privacy-policy`: "regelmäßig"
- `/de/solutions/radiology`: "einschließlich"
- 21 radiotherapy/radiology product pages, e.g. `radioprotective-aprons` ("Maßanfertigung", "Größen") and `the-aio-solution-3.0`.

None of the ultrasound pages has a `ß`.

Fix: a find-and-replace ß→ss in the DE CMS fields. Add it to `cms-lint`.

### M6. Open Graph
Evidence:
- `og:locale` is missing on every page.
- The model `og:image` files are portrait cut-out PNGs:
  - V8, V7 and V6 all use the same image, `XcCKec…png?width=5464&height=8192` (1.67 MB).
  - V5 and V4 share one image (2732×4096).
  - R20 uses a 4540×6809 image.
- Shares on LinkedIn and Teams crop these to 1.91:1, and V7 and V6 show the V8.
- Hub, listing, contact and team use the logo PNG.

Fix:
- Add `og:locale=de_CH` (plus `og:locale:alternate`) in the page head per locale.
- Give each model and the hub its own 1200×630 in-context image (from the client's article-image Drive folder, as the project rules require).

### M7. Speed and mobile (no field data; lab only)
Playwright at 390px, Pixel UA, cache disabled:

| Page | Requests | Weight | JS | Fonts | LCP (unthrottled) | LCP (slow-4G, 4× CPU) | CLS |
|---|---|---|---|---|---|---|---|
| `/de/solutions/ultrasound` | 77 | 1.47 MB | 41 files / 449 KB | 5 woff2 / 243 KB | 1.74 s (IMG) | **10.5 s** | 0 |
| `/de/products/samsung-v8` | 67 | 1.43–1.66 MB | 38 / 444 KB | 5 / 243 KB | 0.30 s (P) | 0.52 s | 0 |

- On the hub, the LCP element is a PNG served `scale-down-to=2048` (`CIVxxPXTSh9PISuAEjBdBb1Dnt8.png`), with no `fetchpriority`/preload (0 preloads, 31 modulepreloads).
- The two largest fonts are 98 KB and 74 KB.
- TTFB was 135–467 ms. The document is 52–55 KB compressed.

Fix:
- Convert the hub hero to WebP/AVIF or a JPG photo and mark it as the LCP image (Framer "Load: Eager" / no lazy).
- Drop unused font weights to 3 files or fewer.
- Re-run PSI with an API key for real CrUX data.

### M8. `/de/news-events` listing
Evidence:
- The intro is copied from the products listing ("Wir arbeiten stolz mit weltweit führenden Herstellern …").
- The card titles are not headings: the page has 0 H2/H3 besides the contact block.
- The naming is inconsistent: H1 "Nachrichten & Veranstaltungen", nav "Erkenntnisse", title "News, Events und Ratgeber".
- Only 9 cards are server-rendered, with "Mehr laden" for the rest. All 21 articles are in the sitemap.

Fix:
- A German intro that names Ratgeber zu Samsung Ultraschall.
- Card titles as H2/H3.
- Use "Ratgeber" consistently in the H1, nav and title.

---

## Low

### L1. Hreflang uses `de`, not `de-CH`
Evidence: Framer generates hreflang `de` (and `lang="de"`). The set is complete and reciprocal, and x-default points to EN. One FR alternate (`/fr/news-events/1-000-…`) once returned an EN shell without a canonical, but 4 re-fetches were correct, so this was transient.

Fix (optional): set the Framer locale region to `de-CH` if that keeps the `/de/` path. This is not needed for ranking in Switzerland.

### L2. URL slugs
- The CMS model slugs are model names, which are fine in every language.
- Path segments are English: `/de/products`, `/de/solutions/ultrasound`, `/de/news-events`.
- The new DE articles have German slugs. Five older DE articles keep English slugs: `4-broken-fingers.-2-broken-wrists.-1-broken-shoulder.` (with dots), `mindray-meditron---we-just-made-it-official`, `35-years-of-meditron`, `1-000-samsung-ultrasound-systems-installed-in-switzerland-by-meditron`, `welcome-stephen`. So does `/de/jobs/customer-consultant-ultrasound-chd`.
- `/de/produkte` and `/de/ultraschall` return 404. Uppercase paths return 404. A trailing slash redirects with a 308.

Fix: keep the paths, because of URL stability and backlinks. Optionally localize the slugs of the old news items, adding 308s.

### L3. Sitemap
- `sitemap_de.xml` has 262 URLs (EN, FR and IT have 262 each). All return 200 and are self-canonical. There is no `<lastmod>`.
- Breakdown: 227 products (29 ultrasound), 21 articles plus the listing, 5 solutions pages, and core pages.
- 79 DE product pages have English titles (e.g. "Radioprotective Aprons", "Head and Neck Solutions"). These are out of scope, but they dilute the DE locale.

Fix: enable lastmod if Framer offers it. Localize the product titles as the client finds time.

### L4. Heading order and copy consistency
- **Articles:**
  - The H3 "Einführung" comes before the first H2.
  - The H3 "Häufige Fragen" sits after the H2 "Nächster Schritt".
  - "Sonden" and "Schallköpfe" are both used.
- **Model texts:** the grammatical gender changes between "Das Samsung V6" and "den Samsung V6", and between "Das V4" and "der V5".
- **The 1'000 article:** "Service & Service".
- **Team:** "Cédric Bauvad" with `cedric.bauvad@meditron.ch`, but his LinkedIn slug is `cédric-bavaud`. Check the spelling and that the mailbox works.

Fix: make the article intro a plain paragraph or an H2, and place the FAQ heading as an H2. The copy fixes go through the client.

### L5. robots.txt and AI crawlers
- robots.txt is `User-agent: * Allow: /` and declares the sitemap index.
- GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot and Googlebot user agents all get 200.
- `llms.txt` returns 404 (optional).
- HSTS is set. No X-Robots-Tag.
- `http://www.` redirects to `https://www.` with a 308.
- The apex `meditron.ch` could not be resolved from the sandbox. Verify that apex → www is a single 301/308 hop.

### L6. Multiple H1 tags in the raw HTML
Framer renders breakpoint variants, so the raw HTML holds several H1 tags: 4 on home, 3 on jobs, 2 on articles. Only one is visible per breakpoint, except on home (two visible H1 tags, see H3). There is no action beyond the H3 fix.

---

## Per-page reference

| Page | Title (chars) | Desc | H1 | Main words* | Internal links (non-/de/) | Visible imgs / empty alt / `var()` alt | Schema |
|---|---|---|---|---|---|---|---|
| /de/ | 57 | 176 | "Treat with" + "Precision" (EN, 2 tags) | 402 | 75 (0) | 55 / 52 / 0 | Org, 2× LocalBusiness |
| /de/solutions/ultrasound | 52 | 147 | Samsung Ultraschall | 1,638 | 59 (0) | 24 / 8 / 10 | + 10× FAQPage, Breadcrumb |
| /de/products | 44 | 197 | Lösungen | 1,112 (phantoms) | 36 (0) | 16 / 0 / 16 (211 in DOM) | Org only |
| /de/products/samsung-hera-z20 | 52 | 151 | Samsung HERA Z20 Ultraschallgerät | 1,477 | 31 (0) | 17 / 5 / 4 | + 6× FAQPage, Breadcrumb (EN), MedicalDevice (EN url) |
| …/samsung-v8 | 46 | 155 | Samsung V8 Ultraschallgerät | 1,122 | 24 (0) | 10 / 5 / 4 | same |
| …/samsung-r20 | 47 | 150 | Samsung R20 Ultraschallgerät | 1,074 | 24 (0) | 10 / 5 / 4 | same |
| …/samsung-v7 | 46 | 149 | Samsung V7 Ultraschallgerät | 900 | 24 (0) | 10 / 5 / 4 | same |
| …/samsung-v6 | 46 | 150 | Samsung V6 Ultraschallgerät | 416 | 21 (0) | 7 / 5 / 1 | same |
| …/samsung-v5 | 46 | 149 | Samsung V5 Ultraschallgerät | 409 | 21 (0) | 7 / 5 / 1 | same |
| …/samsung-v4 | 46 | 152 | Samsung V4 Ultraschallgerät | 416 | 21 (0) | 7 / 5 / 1 | same |
| /de/news-events | 36 | 143 | Nachrichten & Veranstaltungen | 137 | 29 (0) | 9 / 0 / 0 (3 EN alts) | Org only |
| …/welches-samsung-… | 67 | 200 | Welches Samsung Ultraschallgerät passt zu meiner Praxis? | 1,446 | 38 (**11**) | 2 / 1 / 0 | + 7× FAQPage, Article (inLanguage en, 404 url) |
| …/samsung-ultraschallgeraet-preis-schweiz | 66 | 274 | Was kostet ein Samsung Ultraschallgerät in der Schweiz? | 1,358 | 40 (**12**) | 2 / 1 / 0 | same |
| …/ultraschallgeraet-neu-oder-occasion | 82 | 161 | Ultraschallgerät neu oder Occasion: … | 1,267 | 34 (0) | 2 / 1 / 0 | + 6× FAQPage, Article (en, 404 url) |
| …/1-000-samsung-… (EN slug) | 90 | 212 | Über 1'000 installierte … | 133 | 20 (0) | 2 / 2 / 0 | Article (en) |
| /de/contact | 60 | 182 | **none** | 0 (form only) | 20 (0) | 5 / 5 / 0 | Org only |
| /de/team | 76 | 149 | Lernen Sie das Team kennen | 465 | 23 (0) | 17 / 17 / 0 | Org only |

\* Main words means the visible text between the nav and the shared "Lass uns sprechen!" block. On the model pages this includes the "Related models" excerpts (about 390 words on HERA/V8/R20/V7).

All pages: `lang="de"`, self-canonical, hreflang en/de/fr/it/x-default reciprocal, `og:locale` missing, `robots: max-image-preview:large`.

## Raw evidence files
`/tmp/claude-0/-home-user-meditron/194500fc-8658-52aa-ad35-f2d2c33b33d5/scratchpad/audit-de/`
- `rendered.json`: the per-page render extraction
- `text/`: the visible text of each page
- `all/`: the raw HTML of all 262 DE URLs
- `de_status.txt`
- `raw/legacy.html`
- `v8-mobile-top.png`, `hub-mobile.png`, `home-mobile.png`
