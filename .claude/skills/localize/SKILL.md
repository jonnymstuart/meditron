---
name: localize
description: Localise an EN master page in content/en/<slug>.md into content/de, fr, it with Swiss variants, keyword‑verified titles/slugs, and a review checklist for the client's in-house reviewer.
---
# Localize

1. Read `content/en/<slug>.md` (front‑matter: title, description, slug, keyword, schema, locale_keywords{de,fr,it}). If `locale_keywords` are missing, run the brief step's Semrush check first.
2. For each of de/fr/it write `content/<lang>/<slug>.md`: same structure, **localised not translated** — Swiss terminology (`docs/glossary.md`), `ss` never `ß`, CHF, local office/contact, locale keyword in title/H1/first 100 words/slug, meta lengths respected, internal links pointing at the same‑language pages, FAQ rewritten for local phrasing.
3. Front‑matter: `translated_from: en/<slug>`, `review: pending`, `hreflang_group: <slug>`.
4. Append a review checklist at the bottom (terminology, numbers/units, legal wording, CTA) for the client's in-house reviewer; the file is not synced to Framer until they set `review: approved`. Hand-off: the weekly email lists files awaiting review with a GitHub link.
