# Product pages in the Framer CMS: rules for editors

For anyone adding or editing a product in Framer (CMS → Products). The limits are also in each field's name, so they are visible while you type.

## Before you publish

1. Fill the five required fields in all four languages: Name, H1, Description, Meta Title, Meta Description. Framer marks them as required.
2. Keep to the limits below. Google cuts longer titles and descriptions, and long text breaks the page layout.
3. Ask Rise to run the CMS check (`node scripts/framer/cms-lint.mjs`). It lists every problem by product and language. Fix the errors before publishing.

## Limits

| Field | Limit | Notes |
|---|---|---|
| Name | max 60 | Product name as the manufacturer writes it. Not in capitals ("Samsung V8", not "SAMSUNG V8"). |
| H1 | max 70 | The page heading. For ultrasound: model + category word, e.g. "Samsung V8 Ultraschallgerät". |
| Description | 300–600 characters | Shown under the heading (with "Read more") and as 3 lines on product cards. Start with what it is and who it is for. |
| Meta Title | max 60 | Shown in Google. Model first, end with "\| Meditron" (or "\| Meditron Schweiz / Suisse / Svizzera"). Never the same title on two products. |
| Meta Description | 120–155 | Shown in Google. One or two full sentences; never end in "…". No prices. |
| Key 1–10 | max 30 | Technical Data label, e.g. "Monitor". |
| Value 1–10 | max 150 | Technical Data text. Fill Key and Value together, never one without the other. |
| FAQ Question 1–6 | max 90 | Written the way a customer asks. |
| FAQ Answer 1–6 Text | max 350 | This is the answer shown on the page and read by Google. Fill it whenever there is a question. |

"FAQ Answer 1–4 (old, not shown)" are the previous rich-text answers. The page shows the Text field, so editing the old field changes nothing.

## Always

- Swiss spelling: "ss", never "ß". CHF, not EUR. Swiss terms from `docs/glossary.md` (Offerte, offre, offerta).
- No prices in any text. No clinical claims beyond the manufacturer's own material. CE/Swissmedic wording verbatim.
- No bold text.
- Translate every language. A DE/FR/IT field that is still in English counts as an error in the check.
- Do not change a product's URL (slug) once it is live; if it must change, ask Rise for a redirect first.
- Images: Thumbnail and Main Image are required. Use a real product photo, not a logo.

## What the check looks for

Required fields empty; length limits; Meta Description cut off with "…"; duplicate Meta Titles; H1 in capitals; untranslated DE/FR/IT; "ß"; IT text saying "Switzerland"; prices; bold; half-filled Technical Data rows; FAQ questions without answers; missing images; slugs that are not lowercase-with-hyphens.
