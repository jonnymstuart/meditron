# Builds the before -> after report from two snapshot files written by scripts/framer/snapshot-seo.mjs.
# Usage: python3 scripts/seo-report.py <before.json> <after.json> <out.md>
import json, sys
B, A = (json.load(open(p)) for p in sys.argv[1:3])
L = ['en', 'de', 'fr', 'it']; MODELS = ['samsung-hera-z20', 'samsung-v8', 'samsung-r20', 'samsung-v7', 'samsung-v6', 'samsung-v5', 'samsung-v4']
c = lambda s: s.replace('|', '\\|')
ps = lambda d: list(d['products'].values())
cnt = lambda d, k, n: sum(1 for p in ps(d) for l in L if len(p[k][l]) > n)
cut = lambda d: sum(1 for p in ps(d) for l in L if p['description'][l].endswith('…'))
o = ["# Meditron – optimisation before → after, 12 November 2026", "",
     "Everything below is written to Framer (CMS and templates) and published to staging (version 8e3a12e4e). It goes live when Jonny presses Publish.", "",
     "## Site-wide numbers", "", "| Measure | Before | After |", "|---|---|---|",
     f"| Product titles over 60 characters (211 products × 4 languages) | {cnt(B,'title',60)} | {cnt(A,'title',60)} |",
     f"| Product descriptions over 160 characters | {cnt(B,'description',160)} | {cnt(A,'description',160)} |",
     f"| Samsung hub FAQ rows | {B['hubs']['ultrasound']['faqRows']} | {A['hubs']['ultrasound']['faqRows']} |",
     f"| Samsung model pages with 6 FAQs | 0 of 7 | {sum(1 for s in MODELS if A['products'][s]['faq'] == 6)} of 7 |",
     "| Product page heading | the product Name, e.g. \"SAMSUNG V8\" | its own H1 field, e.g. \"Samsung V8 Ultraschallgerät\" |", "",
     "## Hub pages", ""]
for s in A['hubs']:
    for k in ['title', 'description']:
        for l in L:
            b, a = B['hubs'][s][k][l], A['hubs'][s][k][l]
            if b != a: o.append(f"- **{s}, {l.upper()} {k}**: \"{b}\" ({len(b)}) → \"{a}\" ({len(a)})")
o += ["", "## The seven Samsung model pages", ""]
for s in MODELS:
    b, a = B['products'][s], A['products'][s]
    o += [f"### {s}", "", "| | Before | After |", "|---|---|---|"]
    o += [f"| Title {l.upper()} | {c(b['title'][l])} ({len(b['title'][l])}) | {c(a['title'][l])} ({len(a['title'][l])}) |" for l in L]
    o += [f"| Description {l.upper()} | {c(b['description'][l])} ({len(b['description'][l])}) | {c(a['description'][l])} ({len(a['description'][l])}) |" for l in L]
    o += [f"| H1 {l.upper()} | {c(b['h1'][l])} | {c(a['h1'][l])} |" for l in L]
    o += [f"| FAQs | {b['faq']} | {a['faq']} |", ""]
o += ["## Other products (rule-based), examples", ""]
n = 0
for s, p in A['products'].items():
    if s in MODELS: continue
    for l in L:
        b, a = B['products'][s]['title'][l], p['title'][l]
        if b != a and n < 12: o.append(f"- {s}, {l.upper()}: \"{b}\" ({len(b)}) → \"{a}\" ({len(a)})"); n += 1
o += ["", "## Other changes", "",
      "- **Samsung hub content**: the list \"The Samsung range\" in the intro is now a comparison table of the seven models (model, main use, highlights) in all four languages. Five FAQ rows added: leasing, warranty and service, which model for a GP practice, which model for radiology, available probes.",
      "- **Headings**: \"Guides\" now reads Ratgeber / Guides / Guide. \"Popular\" was \"Fréquent\" in French and \"Comune\" in Italian; now \"Populaires\" and \"I più richiesti\".",
      "- **Alt text**: hub product cards use the product name, hub partner logos the partner name, product main, gallery and variant images the page H1.",
      "- **Samsung model pages**: FAQ 5 (pre-owned or leasing) and FAQ 6 (service in Switzerland) added. A \"Further reading\" block links two guides in each language, using each language's own article URL. The R20 page links the service and price guides until its own article goes live on 13 Nov.",
      "", "## Not changed, still open", "",
      f"- {cut(A)} product descriptions (mostly radiology and radiotherapy QA products) end with \"…\" because their first sentence is longer than 155 characters. They were already cut this way before today ({cut(B)} before). They need hand-written descriptions; out of scope for the Samsung programme.",
      "- Product names, URLs and slugs are unchanged.",
      "- Small decorative icons on the hub still have no alt text; they carry no content.",
      "- Production needs Jonny's Publish; I check the 12 key URLs live after that."]
open(sys.argv[3], 'w').write("\n".join(o) + "\n")
print("\n".join(o[:16]))
