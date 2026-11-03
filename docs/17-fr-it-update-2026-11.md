# French and Italian update, 3 November 2026

Same job as the German update (docs/16), run the same afternoon on Jonny's instruction ("do the same on French and Italian first, and then … do it"). Written to the FR locale (`rRxiWhpq8`) and the IT locale (`D9HoCmqY1`) of the Samsung scope by `scripts/framer/push-lang.mjs --lang=fr|it`. Staging carries the result (versions b9807adb9 → 32edac7f8 → 8b4e25c88). **Production is not published**: the production deploy is blocked for the agent in this session, so it is one click in Framer (Publish) by Jonny. The German locale was snapshotted before and after the run: 0 of 526 DE fields changed.

## Starting point (read-only dump, 3 Nov, scratchpad `frit-state.json`)

- **French**: every field had a value, but the values for the new fields (highlights, spec rows 5–10, the four FAQs on Z20/V8/R20/V7, all seven probe pages) had been written by Framer's auto-translate 15 seconds after the German push the same morning. They were machine French with the usual faults: "L'HERA Z20", "système d'échographie" ×27, "santé des femmes" ×8, "devis" ×37, "flux de travail" ×21, "support" ×17, French-France spacing before ? ! ; ×300. Note for the team: as long as that Framer setting is on, every English or German edit produces machine French until it is overwritten.
- **Italian**: the new fields were empty (English fallback), the old Z20/V8/R20/V7 Italian was the obsolete generic copy with FAQ questions that no longer matched the English ones, the probes had nothing (0 of 19 fields). Terms: "supporto" ×36, "salute della donna" ×24, "flusso di lavoro" ×12, "Meditron Switzerland" in titles, "assicuratori malattia" ×3, "1.000" ×2.

## What was written

| Where | FR fields | IT fields | Source |
|---|---|---|---|
| HERA Z20, V8, R20, V7 (description, highlights, Why Meditron, meta title and description, 9–10 spec rows, 4 FAQs) | 94 | 128 | new `content/fr/products/samsung-*.md`, `content/it/products/samsung-*.md`, translated from the EN files with the docs/15 rules |
| 7 probe pages (description, Why Meditron, meta, 5 spec rows) | 37 | 98 | `content/{fr,it}/products/samsung-transducers.md` |
| V4, V5, V6 (term fixes on the existing text) | 21 | 15 | rules |
| Hub `/solutions/ultrasound` | 7 | 3 | FR: new Description, Samsung hero, Meta Title "Échographes Samsung en Suisse : distributeur officiel \| Meditron", Meta Description, SEO intro ("échographe haut de gamme", "une offre pour chaque configuration plutôt qu'un tarif"), Clarius/Esaote hero term fixes. IT: new Description and Samsung hero (title and meta were already right), SEO intro "nella vostra lingua" |
| FAQ rows | 81 | 5 | rules; FR punctuation on every row; `ultrasound-1` "La société Meditron est-elle…" → "Meditron est-elle…" |
| Articles 1–9 and legacy news | 33 | 15 | rules; slugs unchanged |
| **Total** | **273** (+4 follow-up) | **264** (+5 follow-up) | |

FR count is lower than IT on the model pages because many FR spec values were already identical (numbers, product names).

## Rules applied and hit counts in the existing text

**French** (388 hits): no space before ? ! ; (274, Swiss punctuation; the space before : stays); formation applicative → formation d'application (16); système(s) d'échographie → échographe(s) with article agreement (25); devis → offre with agreement (18); santé des femmes / de la femme → gynécologie-obstétrique (15); flux de travail → protocole(s) d'examen (16); support → assistance with article agreement, support local → service en Suisse, support de maintenance → service de maintenance, support logiciel → mises à jour logicielles (17); professionnels de (la) santé → médecins et hôpitaux (3); L'HERA → Le HERA (1); haut de gamme (premium) → haut de gamme (1).

**Italian** (72 hits): supporto → assistenza with gender agreement and six phrase-level variants (29); salute della donna → ginecologia e ostetricia (17); flusso/flussi di lavoro → percorso/percorsi d'esame (16); professionisti/operatori sanitari → medici e ospedali (4); agli assicuratori malattia → alla cassa malati (3); 1.000 → 1'000 (2); nella sua lingua → nella vostra lingua (1). "Meditron Switzerland" and "preventivo" had no hits left in the CMS (the title rule still exists for new rows).

## Decisions taken without client comments (the FR/IT rule Doc had none on 3 Nov)

1. FR model article without elision: "le HERA Z20", "le V8", "le R20", "le V7". IT: "l'HERA Z20", "il V8", "l'R20", "il V7".
2. FR "échographe" for the machine everywhere; "sonde" for probes. IT "ecografo" and "sonda".
3. FR "offre", IT "offerta" as the only quote word. FR "assistance / service après-vente", IT "assistenza / servizio tecnico" instead of support/supporto.
4. "Workflow" rendered as FR "protocole d'examen", IT "percorso d'esame" (both keep gender and number in every context found). Clinical features keep Samsung's English names.
5. FR numbers "1 000" (the site's existing format), IT "1'000". Screen sizes 21,5" / 23,8" / 27".
6. IT titles end in "Meditron Svizzera".

Left as is, on purpose: adjectives (avancé, de pointe, avanzato, eccellenza) in the old V4–V6, FAQ and news texts are not regexed; they are gone from the hand-written model, probe and hub copy only. The articles 1–6 in Italian use the Lei form ("verifichi", "chieda", "Vuole") while docs/15 rule I8 asks for Voi; converting that by regex is unsafe, so it is an open item for the Italian reviewer. "système d'occasion / appareil d'occasion" is correct French and stays. IT product slugs stay null (fall back to the English slug), as before.

## Not changed

- The rest of the catalogue in FR and IT (radiology, QA, dosimetry, Clarius), Framer template strings (buttons, nav, footer "obtenir un devis" / "richiedere un preventivo"), home H1, team page. Listed in docs/14 and docs/15 for Framer page work.
- Nothing in DE or EN.

## Re-running

```
node scripts/framer/push-lang.mjs --lang=fr --dry            # show what would change, write nothing
node scripts/framer/push-lang.mjs --lang=it --only=faq,news  # limit writes to steps
node scripts/framer/push-lang.mjs --lang=fr --publish        # write everything and publish staging
```
Each rule is a one-line regex in the `CFG` block; the script is idempotent (Framer's HTML normalisation of the highlights list shows as a change on every run, the text is identical). Beware `\b` after an accented letter in JS regexes without the `u` flag: it never matches, use a lookahead instead (the "avancé" rule).
