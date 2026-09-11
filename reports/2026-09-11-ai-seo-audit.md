# AI SEO audit – meditron.ch, 11 Sep 2026

## Context
Goal: be the answer for "Samsung ultrasound" in DE/FR/IT/EN, in Google and in AI answers (ChatGPT, Gemini, Google AI Overviews). Audit done read-only against the live site today. Redirects, indexing, four locales, the hub intro and FAQ are already live. The FAQ accordion branch is waiting for merge.

## What the audit found (live site, today)

**Broken now**
1. German hub title is broken: `/de/solutions/ultrasound` renders `<title>{{jD9BMQN3T}}</title>` and the same in the meta description. Cause: the DE/FR/IT localised title template still points at the field id from the first (deleted) Meta Title field. FR/IT show older wording. Google will index a garbage title.
2. Model pages have no H1. `/products/samsung-hera-z20` puts the product name in a plain text block. EN version currently renders the site default title, no canonical, no hreflang (35 KB page, looks half-regenerated after the merge).

**Missing for AI answers and rich results**
3. Zero structured data on the whole site. No Organization, no LocalBusiness for Rolle and Frauenfeld, no Product on model pages, no FAQPage, no BreadcrumbList. AI engines and Google rely on these to know "Meditron = official Samsung distributor in Switzerland".
4. Hub H1 is "Ultrasound" / "Ultraschall", not "Samsung Ultraschall". The H1 comes from the Solutions Title field, which also feeds the nav.
5. Italian and French hub still show the English intro and FAQ (fallback). FR/IT are the easy wins in the SERP analysis.
6. No `llms.txt`. Robots allows all crawlers (good, keep it).
7. Home page: no H1, 194 images without alt text, 1.4 MB HTML and ~9,600 words of markup. Heavy for crawlers and slow for Core Web Vitals.
8. `/old-home` still indexed in four languages, duplicate of home.

**Fine as is**
Sitemap (4 files, 238 URLs each), hreflang reciprocal with x-default, canonicals, noindex gone, redirects, OG tags, robots.

## Plan – in order

### Week of 15 Sep (me, Framer branches, Jean proofreads text)
1. **Fix the title bug** – set DE/FR/IT localised values of the Solutions page title and description sources to `{{fM1J_4KGB}}` / `{{YuxfDRp5D}}` (current Meta Title / Meta Description field ids). Verify all four hub URLs render a real title.
2. **H1s** – add an `H1` field to Solutions (EN "Samsung Ultrasound", DE "Samsung Ultraschall", FR "Échographe Samsung", IT "Ecografo Samsung"), bind the hero title to it with `htmlTag="h1"`; nav keeps using Title. On the Products detail page set the name text block to `h1`.
3. **Structured data** via page custom code (`setCustomCode` head snippet, localised where text differs):
   - Site-wide `Organization` (name, logo, sameAs LinkedIn, contact) + two `LocalBusiness` (Rolle, Frauenfeld) with addresses and phone.
   - Solutions page: `BreadcrumbList` + `FAQPage` generated from the FAQ collection (only where FAQ rows exist).
   - Products page: `Product` with name, brand "Samsung", description, image, offers as "request quote" (no price).
4. **FR/IT hub content** – translate intro and the five FAQ rows from the German master; Jean proofreads.
5. **llms.txt** – Framer Site Settings → Files (or a code component route): short plain-text file listing who Meditron is, the hub URLs in four languages, the model pages, contact. Cheap, some AI crawlers use it.
6. **Home hygiene** – exclude `/old-home` from search engines (or redirect to `/`), give the home an H1 ("Official Samsung ultrasound distributor in Switzerland" per language), alt text on the ~30 meaningful images (rest are decorative, set `alt=""`).

### Week of 22 Sep (content, per docs/07-content-plan.md)
7. First article with the AI-answer template: 2-sentence summary up top, anchor TOC, H2 questions phrased as people ask them, FAQ block with FAQPage schema, named author with bio.
8. Model page copy for HERA Z20, V8, R20, V7 from `content/de/*.md` once Jean approves; Product schema picks it up automatically.

### Client side (Jonny / Jean / Henri)
- Search Console: add property, submit sitemap, request indexing for the hub in four languages.
- Merge + publish the FAQ accordion branch.
- Two Google Business Profiles (Rolle, Frauenfeld) with "Samsung ultrasound" in the description; link them from `sameAs`.
- Decide on German as default locale (recommended, before content is indexed).
- Confirm leasing / pre-owned wording with Henri.

## Verification
- `curl` each hub URL (`/`, `/de`, `/fr`, `/it` + `/solutions/ultrasound`): real title, one H1 containing "Samsung", JSON-LD blocks present and valid (Google Rich Results Test on one URL per language).
- Model page: H1 present, Product schema valid.
- `llms.txt` returns 200.
- After a week: Search Console shows the four hub URLs indexed; ask ChatGPT and Gemini "Samsung Ultraschall Schweiz Händler" and note whether Meditron is cited. Repeat monthly and log in `reports/`.

## Files
- Framer only for 1–3, 5, 6 (branches, no publish).
- `content/fr/samsung-ultraschall.md`, `content/it/…` for 4.
- `docs/06-framer-technical-checklist.md` status update; `reports/2026-09-11-ai-seo-audit.md` with this audit for the Monday email.
