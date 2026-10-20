# Product CMS: Variants, Compatible Products, Related Products

Status 20 Oct 2026, from a read-only audit of the Framer CMS (219 products, 124 variant cards).

## The three fields in plain words

| Field | What it is for | Points at | Clickable? | Products using it |
|---|---|---|---|---|
| **Variants** | Versions of the *same* product you can order: frame styles, apron cuts, test-pattern types, detector models | side collection "Product - Variants" (picture, name, one line of text) | No, cards only | 31 (none ultrasound) |
| **Compatible Products** | Add-ons that *work with* this product: probes for an ultrasound system, a needle guide, a software module | the Products collection, so each card opens a real product page | Yes | 0 before this fix (the CMS label still has the typo "Compactible") |
| **Related Products** (new) | *Other models* a buyer should also look at: V8 next to the HERA Z20 | the Products collection | Yes | 0, being added now |

On the page each field is its own section under the body copy. A section hides itself when the field is empty.

## How Variants is used today (examples)

| Brand | Products | Example page | Variant cards |
|---|---|---|---|
| Orfit (radiotherapy positioning) | 13 | https://www.meditron.ch/products/head-and-neck-solutions | High Precision, Push-pin, U- and S-type, Pediatric, HP PRO immobilisation |
| Thermo Scientific (radiation detectors) | 6 | https://www.meditron.ch/products/radeye-x-series-survey-meters | RadEye GX, SX, PX survey meters |
| MDT X-ray (radiation protection) | 5 | https://www.meditron.ch/products/lead-glasses | Discovery, Focus, Nike Blue, Nike Silver |
| | | https://www.meditron.ch/products/radioprotective-aprons | Coat, Vest & Kilt, Front |
| Diagnomatic (QA phantoms) | 4 | https://www.meditron.ch/products/resolution-patterns | 21 Pro-Res test patterns with lead thickness and line-pair range |
| RTI (dose meters) | 3 | https://www.meditron.ch/products/piranha | Premium, Dental, Mammo, CT, R/F, Multi editions |
| Samsung | 1 | https://only-measure-905157.framer.app/products/samsung-hera-z20 (staging) | the 7 probes added on 8 Oct, **wrongly**, see below |

All 31 correct uses are outside ultrasound. The field is right for them and is not being changed.

## What was wrong on the HERA Z20 test page (8 Oct)

- The seven probes (CA1-7Sv2, CA3-10A, CV1-8A, EA2-11AR, EA2-11AV, EV2-12, LM2-18) went into **Variants**. Probes are not versions of the Z20, they are add-ons, so they belong in Compatible Products.
- The V8, R20 and V6 went into **Compatible Products**. They are other systems, not add-ons, so they belong in Related Products.
- The on-page headings were then renamed on a Framer branch (`w4nj9a8pj`) to paper over this. That branch is not merged and will be deleted.

## The fix (approved 20 Oct)

1. Probes become real products in the Products collection with their own pages, e.g. `/products/samsung-ca1-7sv2`, brand Samsung, solution Ultrasound. Each probe page lists the systems it fits under Compatible Products, and each system lists its probes. Works in both directions, and gives Google one page per probe.
2. The field label "Compactible Products" is corrected to "Compatible Products".
3. A new **Related Products** field is added to Products, with a matching "Related models" section in the page template. The Z20 gets V8, R20, V6 there.
4. The seven probe cards are removed from Variants and the Z20's Variants field is emptied. The other 117 variant cards and 31 products are untouched.
5. English only. German is translated by hand by the Meditron team; the new probe pages show English under `/de/` until they are translated.

## What this means for ultrasound

- **Every Samsung system page** (R20, HERA Z20, V8, V7, V6, V5, V4) will follow the same pattern: body copy, technical data, Compatible Products = its probes, Related Products = the neighbouring models. Variants stays empty and hidden; the only honest content would be monitor options, which is too thin.
- **Probes get pages.** Samsung publishes roughly 30 transducers for this range and several are shared between systems (the CV1-8A fits the V8 and the Z20, for example). One probe page can therefore sit under several systems, which is the main reason to make them products instead of cards.
- **Order of work:** HERA Z20 first (7 probes, this week), then V8, R20, V7, then V6/V5/V4. Each model adds only the probes not already created.
- **Needed from Meditron:** real probe photos (placeholder tiles are in use), and a check of the Swiss probe configuration per system against the brochures. Specs on the probe pages are limited to what Samsung publishes; where a figure could not be confirmed it is left out rather than guessed.
- **Clarius and Esaote** ultrasound products are not touched. Clarius items are handheld probes in their own right, so Compatible Products does not apply to them.

## Where things live

- Canonical copy: `content/en/products/samsung-hera-z20.md`, probes in `content/en/products/samsung-transducers.md`.
- Scripts: `scripts/framer/fix-product-schema.mjs` (field rename and new field), `scripts/framer/push-probes.mjs` (probe products, Z20 links, cleanup).
- Technical log with field and item IDs: `docs/06-framer-technical-checklist.md`.
