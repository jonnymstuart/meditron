# Post-publish audit and plan, 5 November 2026

Jonny published production on 5 Nov ("I've deployed that"). This is what the live site shows, what went wrong, what was restored, and the plan for the next four weeks.

## 1. What happened at the publish

The Branches panel now lists only `main`: the `solution-configurator` branch was merged before the publish. That branch was created around 26 Oct, and Framer's auto-translate had run inside it on 26 Oct (lastEdited 10:54 for DE, 10:55 for FR) over the then-new English product fields. Merging the branch wrote those machine translations over Monday's German and French product fields on main. Read-back against Monday's snapshots:

| Scope | German | French | Italian |
|---|---|---|---|
| Products (Z20, V8, R20, V7, V4–V6, 7 probes) | 133 of 304 fields reverted to 26 Oct machine text | 132 of 152 reverted | intact (IT auto-translate is off, the branch had nothing to merge) |
| FAQ rows | intact | intact | intact |
| Articles and news | article 4 DE body reverted (27 Oct machine version) | intact | intact |
| Hub | intact | intact | intact |

Second effect, independent of the merge: Framer auto-translate is on for German and French. On 3 Nov it localised the **slugs** 15 seconds after our pushes: the hub became `/de/solutions/ultraschall` and `/fr/solutions/echographie`, the seven legacy news posts got German and French slugs, and 61 FAQ rows too (no pages, harmless). Framer does not redirect the old URL when a CMS slug changes, so `/de/solutions/ultrasound` (2nd for "samsung ultraschall" on 2 Nov) and `/fr/solutions/ultrasound` returned 404 on the live site, as did the old legacy-news URLs in DE and FR.

Also observed: after a publish the CDN serves a 39 KB home-page shell for other URLs for a minute or two; it clears on its own.

## 2. Restored on 5 Nov (staging version d33fd1e39, production pending)

- German and French product fields re-pushed from the content files (`push-de.mjs --only=products`, `push-lang.mjs --lang=fr --only=products`): 133 + 141 fields. Read-back: DE 303 of 304 match Monday's snapshot (the one difference is Framer's HTML normalisation of a list), FR 147 of 152 (same reason).
- Article 4 German body restored from the snapshot.
- Hub and the seven legacy news items: DE and FR slugs set back to the English slug, so the indexed URLs work again. FAQ slugs left alone.
- Nothing else touched. Italian, FAQ rows, hub text, articles 1–9 in FR/IT were never affected.

## 3. What Jonny has to do before the next publish

1. **Framer → Site Settings → Localization → German and French: turn off auto-translate** (the setting that translates new or changed content and slugs automatically). While it is on, every English edit we push gets machine German and French written over it and new localized slugs that 404 the old URLs. Italian already has it off.
2. **Publish main again, without merging a branch.** The solution-configurator branch is gone; if a new one is made for that work, its CMS values must not be merged over main until the configurator is ready.
3. If the configurator branch carried page or template changes, check `/` and `/products` in the Framer editor: anything from that branch is now live.

## 4. Live state after the publish (checked 5 Nov)

Working: `/it/products/samsung-hera-z20`, `/it/products/samsung-ca1-7sv2`, `/it/solutions/ultrasound` show the new Italian; `/fr/news-events/prix-echographe-samsung-suisse` and `/de/news-events/samsung-ultraschallgeraet-preis-schweiz` show the term fixes; hub DE/FR descriptions are the new ones.

Still wrong until the re-publish: German and French product pages show the 26 Oct machine text; `/de/solutions/ultrasound` and `/fr/solutions/ultrasound` 404; article 4 DE body is the machine version.

Unchanged defects from docs/14 (not touched by any of this):
- Page titles and meta descriptions come from the template, not from the CMS meta fields. Live: "SAMSUNG HERA Z20 – Ultrasound | Meditron Switzerland" (EN), "SAMSUNG HERA Z20 - Ultraschall | Meditron Schweiz" (DE), "… | Meditron Switzerland" on the Italian product pages. The meta description is the full description field. Audit item 1, highest value, still open.
- Hub links to none of the nine articles (item 4). Alt text missing on card images (item 8). Listing-page headings (item 10). Mobile speed (item 5). Home H1 letter animation (item 6).
- `legacy.meditron.ch` still live and indexed (item 2). The EN sitemap still lists the six German article slugs without `/de/` (Framer bug, docs/12).

## 5. Indexing ("Index?")

Nothing to request until the re-publish, otherwise Google fetches the machine German and French. After it:
1. Search Console → URL inspection → "Request indexing" for the twelve priority URLs: hub in four languages, Z20/V8/R20/V7 in DE, FR and IT. We need Search Console access for team@userise.co to do this ourselves (asked since October); otherwise Jean or Jonny does it, two minutes per URL.
2. Search Console → Sitemaps → resubmit `https://www.meditron.ch/sitemap.xml`.
3. The probe pages and articles need no request; they are in the sitemaps and get crawled within days.
4. On Monday 9 Nov the weekly measurement (DataForSEO, 20 terms, 20 prompts) shows whether the new DE/FR/IT copy moved the brand terms; Search Console impressions follow a week later.

## 6. Plan, next four weeks

| When | What | Who |
|---|---|---|
| Today | Auto-translate off for DE and FR; publish main again; request indexing for the 12 URLs; resubmit sitemap | Jonny (Framer, Search Console) |
| This week | Audit item 1: bind product and hub titles and meta descriptions to the CMS meta fields (one template change on `/products/:Products` and `/solutions/:Solutions`); item 4: Guides section on the hub linking the nine articles; item 8: alt text on card images; item 10: listing headings. One Framer branch, half a day, published together | us (agent), Jonny merges |
| This week | Reviewer sign-off per language on the live pages: Henri or Nikita (DE), a Romandie colleague (FR), a Ticino colleague (IT). Corrections are rule changes, re-run in minutes | Meditron |
| This week | `legacy.meditron.ch` → 301 to www (hosting contact) | Meditron |
| 9 Nov | Weekly measurement, November tab update, PDF | us |
| 9–13 Nov | Italian URLs for articles 1–6 (currently English slugs under `/it/`), with redirects from the English ones; report the sitemap bug to Framer support with the six URLs | us |
| 16–20 Nov | Mobile speed (item 5): lazy-load product listing images, drop unused font files, hub LCP target under 4 s | us + Jonny (Framer) |
| 16–27 Nov | Articles 10–12 from the backlog (docs/08), four languages, DE/FR/IT written with the rule sets rather than Framer auto-translate | us |
| 23–27 Nov | Home H1 and letter-spaced headings (item 6), listing meta "Scoprite" etc. | Jonny (Framer) |
| 30 Nov | Probe pages for V8, R20, V7 after Jean's probe list (docs/13) | us |

Decision still open from October: the legacy news posts (English only under DE/FR/IT) are now back on their English slugs. Translate, archive or noindex is the client's call; whichever it is, slugs change only together with redirects.
