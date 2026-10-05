# Insights publishing cadence

Decided 2026-10-05 (Jonny): three articles a week, published Monday, Wednesday and Friday, staggered so the Insights list always shows fresh dates. Two routines run this; nothing goes live without Meditron's approval of the German text.

## How it runs

| When (Europe/Zurich) | Routine | What it does |
|---|---|---|
| Monday 06:50 | Draft 3 articles | Takes the next three backlog topics, writes EN + DE + FR, pushes them to Framer **staging as drafts**, adds them with staging links and a comments box to the status Google Doc, messages Jonny. |
| Mon / Wed / Fri 08:50 | Publish approved | Reads the status Google Doc. If an article's comments box contains **APPROVED**, sets its date to today, un-drafts it, deploys to production, verifies the URLs, updates the doc and the report page. If nothing is approved, it only sends a one-line note. |

Approval: Meditron (Jean for language, Henri for commercial wording) writes **APPROVED** in the article's comments box in the Google Doc. Jonny can also approve by adding the article number under "Approved by Jonny" below.

Reality check: three a week means Jean reviews three German texts a week. If approvals lag, the publish routine simply skips days; the backlog keeps building on staging. The drafting routine should be paused (disable the Monday trigger) if more than six articles are waiting unreviewed.

## Approved by Jonny
(none yet)

## Backlog
Ordered. Status: live / staging / next. Keywords from docs/05-samsung-ultrasound-cluster.md.

| # | Title (DE working title) | Target searches | Status |
|---|---|---|---|
| 1 | Welches Samsung Ultraschallgerät passt zu meiner Praxis? | samsung ultraschall, ultraschallgerät kaufen | live 21 Sep |
| 2 | Was kostet ein Samsung Ultraschallgerät in der Schweiz? | samsung ultraschall preis | live 25 Sep |
| 3 | Ultraschallgerät neu oder Occasion | ultraschallgerät occasion | live 30 Sep |
| 4 | Samsung HERA Z20 oder V8 für die Gynäkologie | samsung hera z20, samsung v8 | staging, planned 5 Oct |
| 5 | Ultraschallgerät tragbar oder stationär | ultraschallgerät tragbar, échographe portable | staging, planned 7 Oct |
| 6 | Die ersten 90 Tage mit dem neuen Ultraschallgerät | brand, retention | staging, planned 9 Oct |
| 7 | Samsung Ultraschall in der Schweiz: Service, Schulung, Garantie | samsung healthcare schweiz | next |
| 8 | Ultraschall-Leasing für Arztpraxen: so funktioniert es | ultraschallgerät leasing | next |
| 9 | Ultraschallgerät kaufen: Checkliste für die Hausarztpraxis | ultraschallgerät kaufen (140/month, not ranking) | next |
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
