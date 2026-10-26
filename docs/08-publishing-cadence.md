# Insights publishing cadence

Decided 2026-10-05 (Jonny): three articles a week, published Monday, Wednesday and Friday, staggered so the Insights list always shows fresh dates. Two routines run this. Decision 2026-10-05 (Jonny): Meditron does not proofread the articles, so they publish on schedule without approval. Anyone can stop one by adding it under "Holds" below.

## How it runs

| When (Europe/Zurich) | Routine | What it does |
|---|---|---|
| Monday 06:50 | Draft 3 articles | Takes the next three backlog topics, writes EN + DE + FR, pushes them to Framer **staging as drafts**, adds them with staging links and a comments box to the status Google Doc, messages Jonny. |
| Mon / Wed / Fri 08:50 | Publish next | Takes the earliest-dated staged draft that is not on hold, sets its date to today, un-drafts it, deploys to production, verifies the URLs, updates the backlog, the report page and the status doc. If the queue is empty, it only sends a one-line note. |

Quality gate: the drafting routine is the reviewer. Facts only from meditron.ch and Samsung's published material, no prices, no clinical claims, German read once as a sceptical Swiss doctor. Meditron can still comment in the status Google Doc; comments are applied to the live article afterwards.

## Standing rule: German is hands-off
Decided 2026-10-05 (Jonny). The German version of the site is translated by hand by Meditron. Never write to the German locale (C9aJRu34X) of any existing page, component, collection item or FAQ row, and never run Framer's AI translation. The only German we create is the first German draft of a new Insights article, written before the item exists; after that the German belongs to Meditron. Scripts must skip DE in `valueByLocale` and `setLocalizationData` for existing items.

## How articles 7+ are built (25 Oct)
`content/_drafts/aN-{en,de,fr,it}.html` → `python3 scripts/framer/build-articles.py N` → `node scripts/framer/push-articles.mjs N [--production]` (EN default value, DE/FR/IT via valueByLocale and slugByLocale, FAQ rows, hero tile, staging publish). The two routines did not fire between 8 and 25 Oct; articles 7–9 were produced by hand on 25 Oct with this pipeline.

## Holds
Add an article number here to stop it publishing (e.g. `7 HOLD, Henri checking leasing wording`).
(none)

## Backlog
Ordered. Status: live / staging / next. Keywords from docs/05-samsung-ultrasound-cluster.md.

| # | Title (DE working title) | Target searches | Status |
|---|---|---|---|
| 1 | Welches Samsung Ultraschallgerät passt zu meiner Praxis? | samsung ultraschall, ultraschallgerät kaufen | live 21 Sep (EN DE FR IT) |
| 2 | Was kostet ein Samsung Ultraschallgerät in der Schweiz? | samsung ultraschall preis | live 25 Sep |
| 3 | Ultraschallgerät neu oder Occasion | ultraschallgerät occasion | live 30 Sep |
| 4 | Samsung HERA Z20 oder V8 für die Gynäkologie | samsung hera z20, samsung v8 | live 5 Oct |
| 5 | Ultraschallgerät tragbar oder stationär | ultraschallgerät tragbar, échographe portable | live 8 Oct (dated 7 Oct) |
| 6 | Die ersten 90 Tage mit dem neuen Ultraschallgerät | brand, retention | live 8 Oct |
| 7 | Samsung Ultraschall in der Schweiz: Service, Schulung, Garantie | samsung healthcare schweiz | staging 25 Oct, dated 27 Oct (EN DE FR IT) |
| 8 | Ultraschall-Leasing für Arztpraxen: so funktioniert es | ultraschallgerät leasing | staging 25 Oct, dated 29 Oct |
| 9 | Ultraschallgerät kaufen: Checkliste für die Hausarztpraxis | ultraschallgerät kaufen (140/month, not ranking) | staging 25 Oct, dated 31 Oct |
| 10 | Samsung V7 vs V6 vs V5: die Mittelklasse im Vergleich | samsung v7, samsung v5 | next |
| 11 | Ultraschall für die Gynäkologie: welche Schallköpfe braucht die Praxis? | schallkopf gynäkologie | next |
| 12 | Samsung R20: Premium-Radiologie für Institute und Spitäler | samsung r20 | next |
| 13 | Point-of-Care-Ultraschall in der Hausarztpraxis: Einstieg mit Clarius | pocus hausarzt, clarius schweiz | next |
| 14 | SGUM-Fähigkeitsausweis und Ultraschall-Abrechnung: was Praxen wissen müssen | sgum ultraschall abrechnung | next |
| 15 | Ultraschallgerät Occasion: so prüft Meditron ein zertifiziertes Gerät | ultraschallgerät occasion, ecografo usato | next |
| 16 | Elastografie, Kontrastmittel, 3D/4D: welche Pakete lohnen sich? | elastografie ultraschall | next |
| 17 | Ultraschallgerät für die Physiotherapie und Sportmedizin | ultraschall physiotherapie gerät | next |
| 18 | DICOM, PACS und Praxissoftware: Ultraschallbilder richtig anbinden | dicom ultraschall praxissoftware | next |

Add topics at the bottom; never reorder live or staged rows.

## Probe pages and the discuss list (20 Oct)
- Probe product pages (`/products/samsung-<code>`) are English only until the Meditron team translates them; German falls back to English under `/de/`. They are hidden from the catalogue grid (`Visible` = false) but reachable from the system pages and indexable.
- The dashboard's "To discuss" cards can be ticked with a note. On Monday, read `https://<storeid>.public.blob.vercel-storage.com/discuss.json` (URL in docs/06 once the Blob store exists), mark the matching `months[].discuss[]` entries `done/note/by/at` in `report/data.json`, add a "Decided" line to `done[]`, and mention the decisions in the client email.

