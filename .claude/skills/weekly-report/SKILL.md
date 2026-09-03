---
name: weekly-report
description: Build and send the Monday client report for meditron.ch — rankings (Semrush Position Tracking, db ch, 4 languages), GSC per locale, content shipped, links gained, next week. Writes reports/YYYY-WW.md + .html, commits, emails the client.
---
# Weekly report

1. Determine ISO week `YYYY-WW`. Read last week's `reports/` file for deltas.
2. Data pulls (cite source + date in the report; if a pull fails, say so, don't invent):
   - Semrush MCP `position_tracking` → project for meditron.ch, database `ch`; per campaign (en/de/fr/it): visibility, avg position, top‑3/10/20 counts, biggest movers, and the Tier‑1/3 keywords from `data/keywords/seed-ch.csv` individually.
   - Semrush `domain_overview` (`domain_rank`, db ch) and `backlinks_research` (`backlinks_overview`) → keywords, traffic, AS, referring domains vs last week.
   - GSC (service account in `.env`): clicks/impressions/CTR/avg position for last 7d vs previous 7d, split by page path prefix `/`, `/de/`, `/fr/`, `/it/`; top 10 queries per locale; pages with impressions >50 and position 8–20 (quick‑win list).
   - `git log --since="7 days ago" -- content/ data/redirects.csv` → content shipped, redirects added.
   - `data/outreach.csv` → links won / in progress.
3. Write `reports/YYYY-WW.md`: 5‑line executive summary first (plain language, numbers with deltas), then sections: Rankings by language · Search traffic · What we shipped · Awaiting client review (files + links) · Links · Issues & fixes · Next week · Data notes. Keep it one screen for the summary.
4. Render `reports/YYYY-WW.html` (self‑contained, print‑friendly, same content, a small sparkline of visibility per language from previous reports).
5. `git add reports && git commit -m "report: week YYYY-WW"` and push.
6. Upload the HTML to Google Drive folder "Meditron SEO reports" and email `CLIENT_REPORT_TO` via Gmail MCP: subject `Meditron SEO — week WW`, body = the 5‑line summary + Drive link. CC `CLIENT_REPORT_CC`.
