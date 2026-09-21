# Week 3 update – for the client call on Tue 22 Sep 2026

Written for Jonny to present. Plain language, with what to show for each point.

## What is live on meditron.ch today (published 16 Sep)
- 53 redirects from old URLs to the new pages (no more dead links from Google or old bookmarks).
- Site is indexable; sitemap has 238 pages per language; four languages EN/DE/FR/IT with clean URLs (/de/…).
- Hub page /solutions/ultrasound with intro text and FAQ in EN and DE; model pages have H1 headings; page titles on the hub in four languages.
- Google Search Console verified, sitemap submitted, hub indexing requested.

## Done since Tue 15 Sep (all on Framer branches, nothing published)
1. H1 headings fixed site-wide (hub "Samsung Ultrasound/Ultraschall/…", model pages, /products, /team, /news-events, /purpose). FAQ accordion built, then removed from production again on request (kept on branch).
2. Structured data branch `j6m3l79zc`: Organization + two LocalBusiness (Rolle, Frauenfeld) site-wide; Product + BreadcrumbList on every model page; BreadcrumbList on solution pages; Article + BreadcrumbList on every news/article page (new today). Founding date corrected to 1991.
3. Three English articles written and improved for readers and AI answers (key takeaways, question headings, tables, FAQ, sources, internal links): Google Docs + draft items in Framer (branch `rb52a2qgm`, marked draft so they never go live by accident).
4. Site hygiene branch `ohmgagfx1`: unique titles/descriptions in four languages for /contact, /team, /purpose, /news-events; article pages use their own title/intro; product pages use their own description; /old-home excluded from Google; alt text on 219 product images; article title and hub headline render as H1; stat numbers on /purpose no longer H1.
5. German draft of article 1 for Jean (Google Doc). Meditron's own German edits in Framer untouched.

## Still to do (client)
- Merge and publish three branches: `j6m3l79zc`, `ohmgagfx1`, `rb52a2qgm`.
- Name an author, proofread the three articles, confirm leasing/pre-owned/SGUM wording, then set articles to not-draft.

## Questions – see reports section in the Google Doc "Meditron – update for 22 Sep".

## Sources
Live checks by curl on 21 Sep 2026 (title, H1, JSON-LD, robots per page). Framer branch state from the Framer API on 21 Sep. No Semrush data this week (API units at zero).
