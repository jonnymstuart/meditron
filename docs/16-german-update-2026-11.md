# German update, 3 November 2026

Jonny lifted the "do not touch the German locale" rule on 3 Nov ("Can you do a full update on the German translations? We've also noticed some of the translations aren't done."). This is what was written to the DE locale (`C9aJRu34X`) of the Samsung scope, by `scripts/framer/push-de.mjs`, and what was decided without client comments. Staging carries the result (versions 808112ee6 → 2fa8310c7 → f50ca44f1); **production is not published**. Full field-level log: scratchpad `de-changes-run1.json` (305 rows) plus the two follow-up runs (23 FAQ rows, 10 fixes).

## Rules applied (from docs/11 and docs/15)

| Rule | Hits in existing German |
|---|---|
| Ultraschallsystem(e/en/s) → Ultraschallgerät(e/en/s) | 44 |
| Support → Service (Software-Support → Software-Updates, lokaler Support → Service vor Ort, Wartungssupport → Wartung und Service, Service und Support → Service und Betreuung, "Ende des Supports" → "Ende der Software-Updates") | 20 |
| Gebrauchtgerät / gebrauchtes (Samsung-)System / Gebrauchtmarkt / "Neu oder gebraucht" → Occasion(sgerät/smarkt) | 24 |
| Angebot → Offerte with gender and case agreement ("ein detailliertes schriftliches Angebot" → "eine detaillierte schriftliche Offerte", "im Angebot" → "in der Offerte") | 17 |
| Workflow(s) → Arbeitsablauf/-abläufe; Workflow-Tools → Assistenzfunktionen; Workflow-Effizienz → Effizienz im Praxisalltag | 11 |
| Frauengesundheit → Gynäkologie und Geburtshilfe | 4 |
| ß → ss | 4 |
| 1.000 / "1000 installierten" → 1'000 | 6 |
| Krankenhaus/-häuser → Spital/Spitäler; Gesundheitsdienstleister → Praxen und Spitäler; Kliniker → Ärztinnen und Ärzte | 4 |

Left untouched on purpose: "Samsungs Angebot" in the sense of *product range* was rewritten by hand ("Er ist Samsungs Spitzenmodell für…") rather than by rule; "gebrauchte Ultraschallsonden" (one FAQ question) is correct German and stays.

## What changed, page by page

**HERA Z20, V8, R20, V7** (`content/de/products/samsung-{hera-z20,v8,r20,v7}.md`, new Swiss-German copy in the EN structure, 31–33 fields each): description, highlights, "Why Meditron", meta title and meta description, all 9–10 spec rows (keys and values; rows 5–10 had no German before and fell back to English), all 4 FAQs (2–4 were English before). Model names take the masculine article ("der HERA Z20", "der V8"), as Meditron's own newsroom does. The old generic Germany-German marketing text ("setzt neue Maßstäbe…") is gone.

**7 probe pages** (`content/de/products/samsung-transducers.md`, 14 fields each): description, "Why Meditron", meta title "{Name} Ultraschall-Schallkopf in der Schweiz | Meditron", meta description, 5 spec rows (Typ, Technologie, Nominaler Frequenzbereich, Anwendungen, 3D/4D-Volumenbildgebung). These pages had no German at all.

**V4, V5, V6** (7–10 fields each): term fixes only on the existing German (description, meta, spec rows 1–4, FAQ questions and answers, "Why Meditron").

**Hub `/de/solutions/ultrasound`** (7 fields): new Description ("Ihr Partner für Samsung Ultraschall in der Schweiz…", fixes "dermedizinische" and "ultra portable"), new Hero Description 1, Meta Title "Samsung Ultraschallgeräte Schweiz: Geräte, Beratung, Service | Meditron", new Meta Description, SEO Intro "für die Routine und gemischte Praxen", term fixes in hero 2/3.

**FAQ rows** (23 rows + 2 follow-ups): three "Wer ist Meditron?" answers that were still English now read "Meditron SA ist seit 2012 der offizielle Distributor von Samsung Healthcare Ultraschall in der Schweiz, mit über 1'000 installierten Samsung Ultraschallgeräten und Standorten in Rolle (VD) und Frauenfeld (TG)."; `ultrasound-1` "Händler" → "Distributor"; term fixes in the rest. The FAQ answer field `hF3or4UG4` is a plain **string** in this collection (not formattedText), which is why the first push of these rows failed; the script now sends strings.

**Articles 1–9 and legacy news** (15 items): article titles 1–3 renamed ("Welches Samsung Ultraschallgerät passt zu meiner Praxis?", "Was kostet ein Samsung Ultraschallgerät in der Schweiz?", "Ultraschallgerät neu oder Occasion: Was Sie vor dem Kauf prüfen sollten"); "Es gibt nicht wirklich einen festgelegten Listenpreis." → "Einen Listenpreis gibt es nicht."; term fixes in intros and bodies; legacy posts get ss, 1'000 and Service und Betreuung. Slugs unchanged.

## Not changed

- The rest of the catalogue (radiology, QA, dosimetry, Clarius: about 200 products) still uses Germany-German spelling: 440 ß, 8 Ultraschallsystem, 5 Krankenhaus, 3 Kliniker, 3 Frauengesundheit, 3 "1.000", 2 Workflow across those pages. Out of the programme scope; a ß→ss sweep over them is one run of the same script if Meditron wants it.
- Framer template text (buttons, section headings), navigation and footer.
- Nothing in FR or IT. Same job planned next from `docs/15-language-rules-fr-it.md`.

## Decisions taken without client comments (the audit Doc had none on 3 Nov)

1. Masculine article for model names ("der HERA Z20").
2. "Distributor" rather than "Händler" or "Vertriebspartner".
3. "Ultraschallgerät" everywhere instead of "Ultraschallsystem".
4. "Offerte", "Occasion", "Spital", "Service" as the house words.

If Jean overrules any of these, change the rule in `push-de.mjs` and re-run; every rule is a one-line regex and the script is idempotent (re-running re-applies the content files and the rules; Framer's HTML normalisation of the highlights list shows up as a "change" each time but the text is identical).

## Re-running

```
node scripts/framer/push-de.mjs --dry              # show what would change, write nothing
node scripts/framer/push-de.mjs --only=faq,news    # limit writes to steps
node scripts/framer/push-de.mjs --publish          # write everything and publish staging
```
Production publish is a Framer UI click (or `deploy_to_production` in the agent), and it takes the whole of main live, not only the German.
