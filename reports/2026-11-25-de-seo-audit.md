# German-speaking Switzerland: SEO audit and action plan (25 November 2026)

Sources:
- the live site www.meditron.ch, crawled 25 Nov (262 German URLs)
- DataForSEO, Swiss Google in German, 38 live searches and Google Ads volumes, 25 Nov
- Search Console figures from 24 Nov

Evidence is in `reports/data/audit-de-2026-11-25/` (`technical.md`, `keywords.md`).

## In short

The German site is technically sound at the base:
- every German page loads
- every page points to itself as the main version
- every page declares German
- the language links between DE, EN, FR and IT are complete

What holds it back is in four areas:

1. **Shared templates that send Google the wrong signals on every page:**
   - structured data that calls German articles English and points to addresses that don't exist
   - broken image descriptions
   - English labels on German pages
2. **No page that targets the main German term.** "Ultraschallgerät" is searched about 590 times a month, and Google answers it with category pages. Meditron has only the Samsung page and articles.
3. **Thin pages for V6, V5 and V4.** Google confuses them with each other.
4. **Authority:** the old site is still live, the site is missing from the directory doctors use (citymed.ch), and Samsung doesn't link to Meditron as its distributor.

**The market is small.** All medical ultrasound searches in Swiss German add up to about 1,300–1,500 a month, and Samsung brand and model searches are 10–30 a month each. So a few well-placed pages and links move results quickly.

## Where Meditron stands in German (Swiss Google, 25 Nov, one sample per search)

| Search | Searches/month | Meditron | Who leads |
|---|---|---|---|
| ultraschallgerät hausarzt | n/a | 1 (Samsung page) | Meditron |
| clarius | small | 1 | Meditron |
| samsung v7 | 10 | 4 | SMD Medical |
| ultraschall leasing | small | 4 | |
| handheld ultraschall | 10 | 5, on the old site legacy.meditron.ch | |
| ultraschallgerät kosten | small | 7 | |
| tragbares ultraschallgerät | 10 | 8 | vscan.rocks |
| ultraschallgerät vaginal | 90 | 18 | medicalexpo.de |
| ultraschallgerät kaufen | 110 | 22 | medidor.ch, denios.ch |
| ultraschallgerät | 590 | not in top 30 | neurolite.ch, amazon.de, doccheckshop.ch |
| medizinisches ultraschallgerät | 70 | not in top 30 | galaxus.ch |
| pocus (point-of-care ultrasound) | 480 | not in top 30 | course providers, 3B Scientific |
| ultraschallgerät gynäkologie / frauenarzt | 10 / 20 | not in top 30 | Art Medical Suisse, gyn-med.ch |
| ultraschallgerät gebraucht / occasion | 20 / small | not in top 30 | ebay.ch, Art Medical Suisse |
| samsung ultraschall | 30 | not in top 30 in this sample (6 on 24 Nov) | samsung.com, SMD Medical |

**What the competition does:**
- **SMD Medical** ranks #1 for "samsung v7" and "hera z20" with pages of about 200 words.
- **Art Medical Suisse** wins the used-equipment and price searches with priced listings.
- **citymed.ch,** a directory with 8 paid supplier listings, appears on 8 generic searches.
- **samsung.com/ch** only ranks with thin support pages.

About half of the generic "Ultraschallgerät" results are for cleaning or therapy devices. A shopping strip with prices shows on 23 of 38 searches, and Meditron can't appear there without prices.

## Action plan

### A. Fix in the templates and CMS (us, about 2 days, no client input)
1. **Structured data on German pages:**
   - Articles: say `inLanguage: de` and point to the real `/de/news-events/<slug>` address (today they point to addresses that return 404).
   - Product pages: use the German address and German breadcrumb names.
   - Make one FAQ block per page instead of 6–10.
   - About 230 pages, one template change each.
2. **Image descriptions:**
   - 233 German pages carry the literal text `var(--variable-…)` instead of a description. That's 422 on /de/products, 30 on the Samsung page and 7 on V8.
   - Bind them to the product or article name.
3. **English text on German pages:**
   - Home H1 "Treat with Precision", split over two headings.
   - "See All", "Select Language" and the language names.
   - The German 404 page (Framer default, in English).
   - English image descriptions on three article thumbnails.
   - Already fixed on staging: "Related models", "Brochure" and "Download PDF" are translated, and the phone menu link to /old-home is gone.
4. **German articles that link to English pages:**
   - The two main buying guides ("Welches Samsung Ultraschallgerät…" and "…Preis Schweiz") send 11 and 12 links to English model pages.
   - Point them to /de/.
5. **Form of address and Swiss German:**
   - "Lass uns sprechen!" becomes "Sprechen Sie mit uns".
   - "Angebot" becomes "Offerte".
   - The team page should use Sie throughout.
   - Fix ß on 25 pages (team, jobs). The product texts are already clean.
   - The cookie banner wording and its link.
6. **Meta descriptions:**
   - 7 of the 18 key pages run over 160 characters.
   - The three job pages reuse the homepage title.
7. **/de/products:**
   - The H1 says "Lösungen", and the first products shown are mammography phantoms.
   - The page is 2 MB, almost Google's read limit, because all 211 products load at once.
   - Give it a proper heading, show the ultrasound systems first and load products in pages.
8. **Old-home page:** set /de/old-home (and /old-home) to noindex, or remove it.

### B. Content (us writing, Meditron proofreading, 1–2 weeks)
9. **New German category page** "Ultraschallgeräte für Praxis und Spital":
   - Targets ultraschallgerät(e), medizinisches ultraschallgerät, ultraschall gerät, sonographiegerät and ultraschallgerät kaufen, about 800 searches a month together.
   - Content: systems by speciality, new / occasion / leasing, service in German-speaking Switzerland, and links to Samsung, Clarius and Esaote.
   - Google answers these searches with category pages, not brand pages. This adjusts `docs/01-strategy.md`, which expected the Samsung page to rank for generic terms as a by-product.
10. **V6, V5 and V4 pages:** bring them up to the V8 standard. Each needs:
    - its own description
    - "who it is for"
    - specifications
    - benefits
    - links to the other models and to probes
    - six model-specific FAQs

    Today they have about 250–300 words of their own, against 1,100–1,500 for V8, R20 and HERA Z20.
11. **HERA Z20 page:** strengthen it for "samsung hera z20" and "ultraschallgerät gynäkologie". Retitle the "HERA Z20 oder V8" article towards gynaecology ("Ultraschallgerät für die Gynäkologie: HERA Z20 oder V8?"), linking to the product page.
12. **Price article:** widen it to answer "Was kostet ein Ultraschallgerät?", a People-Also-Ask question on 5 searches. Use ranges only if Meditron approves them; otherwise explain what drives the price. "Kosten" is at #7 and can reach the top 3.
13. **"Vaginalsonde" / "ultraschallgerät vaginal"** (90 a month, #18): add a section to the gynaecology probes article, linking the endocavity probe page.
14. **Handheld / POCUS:**
    - Add "mobil", "portabel" and "tragbar" to the portable article and the Clarius pages.
    - Write a German POCUS guide ("POCUS in der Praxis: was ein Handheld-Ultraschall kann"). "Pocus" alone has 480 searches a month, mostly from training-course seekers, so link Meditron's training offer if there is one.
15. **Internal links:**
    - Every German article should link "Samsung Ultraschall" to the Samsung page.
    - V4, V5 and V6 should link to each other and to the comparison.

### C. Needs Meditron (authority, the biggest remaining lever)
16. **Old site:** redirect legacy.meditron.ch with a 301, at the host.
    - Over HTTP it still serves an English Joomla site with PHP warnings and a certificate mismatch.
    - It ranks #5 for "handheld ultraschall".
    - Who has the domain access, Henri or Philipp?
17. **Samsung distributor link:** a link from samsung.com/ch (the "where to buy" or partner page) to meditron.ch/de/solutions/ultrasound. Also a short German news post, "Meditron ist offizieller Samsung-Distributor in der Schweiz". SMD Medical's partnership post ranks #5 for "samsung ultraschall".
18. **citymed.ch:** a listing in the directory, ranking 3–10 on 8 generic searches. Check the cost and decide; it's a paid listing, so it fits our rules only as a directory entry, not as a paid link.
19. **Google Business Profile for Frauenfeld** (and Rolle):
    - the right category ("Medizinprodukte-Lieferant")
    - the German site as website
    - a Frauenfeld phone number, opening hours and photos

    On the site, give Frauenfeld its own phone number and German contact link; today both offices link to the English /contact.
20. **Esaote:** a link from Esaote's Swiss vet-distributor page ("esaote" has about 50 searches a month).
21. **HERA Z10 and EVO Q10:** SMD lists them. Does Meditron sell them in Switzerland? If so, they need pages.

## What we can't do
- **Priced shopping results:** they show on 23 of 38 searches, and Meditron can't appear there without published prices. This is the "no pricing" rule, a decision for Meditron.
- **Speed:** Google's free speed data was rate-limited during the audit, so there's no field data. In a lab test the Samsung page's main image appears after 1.7 s normally and 10.5 s on slow mobile. Making that image smaller is part of A.

## Order of work
1. A1–A4 this week: they affect every German page and need no client input.
2. B9 and B10 next: the new category page and the V4–V6 pages.
3. Ask Meditron for C16–C19 in the next weekly email.
4. Measure on 1 and 8 December: German positions, and Search Console for German searches.
