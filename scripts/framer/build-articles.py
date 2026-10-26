#!/usr/bin/env python3
"""Convert content/_drafts/aN-{en,de,fr,it}.html into scripts/framer/.cache/aN.json for push-articles.mjs.
Usage: python3 scripts/framer/build-articles.py 7 8 9
Same transforms as build-articles-4-6.py (drop title block, h1, contents, back-links; FAQ section -> rows;
placeholder bylines -> real bylines), without the per-article fix lists."""
import re, json, html, sys, os
D = '/home/user/meditron/content/_drafts'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.cache')
LANGS = ('en', 'de', 'fr', 'it')

ROLE = {"Nikita Müller": {"en": "Sales Consultant Ultrasound", "de": "Kundenberater Ultraschall", "fr": "Conseiller de vente échographie", "it": "Consulente di vendita ecografia"},
        "Dr. Henri Hagenmüller": {"en": "Managing Director", "de": "Geschäftsführer", "fr": "Directeur général", "it": "Direttore generale"},
        "Christelle Sam-Hine": {"en": "Applications Specialist Ultrasound", "de": "Applikationsspezialistin Ultraschall", "fr": "Spécialiste d'application échographie", "it": "Specialista applicativa ecografia"}}
# article -> (author, reviewer)
AUTH = {7: ("Christelle Sam-Hine", "Dr. Henri Hagenmüller"), 8: ("Dr. Henri Hagenmüller", "Nikita Müller"), 9: ("Nikita Müller", "Christelle Sam-Hine")}
MONTH = {"en": "October 2026", "de": "Oktober 2026", "fr": "octobre 2026", "it": "ottobre 2026"}
BYL = {"en": ("Last reviewed: {m}. Author: {a}, {ar}.", "Author: {a}, {ar}, Meditron SA. Reviewed by: {r}, {rr}. Last updated: {m}."),
       "de": ("Zuletzt geprüft: {m}. Autor: {a}, {ar}.", "Autor: {a}, {ar}, Meditron SA. Geprüft von: {r}, {rr}. Zuletzt aktualisiert: {m}."),
       "fr": ("Dernière révision : {m}. Auteur : {a}, {ar}.", "Auteur : {a}, {ar}, Meditron SA. Relu par : {r}, {rr}. Dernière mise à jour : {m}."),
       "it": ("Ultima revisione: {m}. Autore: {a}, {ar}.", "Autore: {a}, {ar}, Meditron SA. Revisione: {r}, {rr}. Ultimo aggiornamento: {m}.")}
FAQ_H2 = {"en": "Frequently asked questions", "de": "Häufige Fragen", "fr": "Questions fréquentes", "it": "Domande frequenti"}
TOC_H2 = {"en": "Contents", "de": "Inhalt", "fr": "Sommaire", "it": "Indice"}
SLUG = {7: {"en": "samsung-ultrasound-service-training-warranty-switzerland", "de": "samsung-ultraschall-service-schulung-garantie-schweiz", "fr": "echographe-samsung-service-formation-garantie-suisse", "it": "ecografo-samsung-assistenza-formazione-garanzia-svizzera"},
        8: {"en": "ultrasound-leasing-medical-practice-switzerland", "de": "ultraschall-leasing-arztpraxis", "fr": "leasing-echographe-cabinet-medical", "it": "leasing-ecografo-studio-medico"},
        9: {"en": "buying-an-ultrasound-machine-checklist-gp-practice", "de": "ultraschallgeraet-kaufen-checkliste-hausarztpraxis", "fr": "acheter-un-echographe-checklist-cabinet-medecine-generale", "it": "acquistare-un-ecografo-checklist-studio-medicina-generale"}}
DATE = {7: "2026-10-27", 8: "2026-10-29", 9: "2026-10-31"}
IMG = {7: "flat-7-D8C8C8.jpg", 8: "flat-1-D9E7D1.jpg", 9: "flat-2-EFDCDF.jpg"}

def strip(s): return html.unescape(re.sub('<[^>]+>', '', s)).strip()

def convert(n, l):
    h = open(f'{D}/a{n}-{l}.html', encoding='utf8').read()
    head, h = h.split('<hr>', 1)
    meta = re.search(r'<b>Meta[^:]*:</b>\s*(.*?)<br>', head, re.S)
    title = strip(re.search(r'<h1>(.*?)</h1>', h, re.S).group(1))
    h = re.sub(r'<h1>.*?</h1>\s*', '', h, flags=re.S)
    h = re.sub(r'<h2[^>]*>\s*' + TOC_H2[l] + r'\s*</h2>\s*<ol>.*?</ol>\s*', '', h, flags=re.S)
    h = re.sub(r'<p><a href="#contents">[^<]*</a></p>\s*', '', h)
    m = re.search(r'<h2[^>]*>\s*' + FAQ_H2[l] + r'\s*</h2>(.*?)(?=<h2)', h, re.S)
    faq = []
    if m:
        faq = [(strip(q), strip(a)) for q, a in re.findall(r'<p><b>(.*?)</b></p>\s*<p>(.*?)</p>', m.group(1), re.S)]
        h = h[:m.start()] + h[m.end():]
    h = re.sub(r'<hr>\s*<p><i>[^<]*\[[^<]*</i></p>\s*$', '', h.strip())
    a, r = AUTH[n]; first, last = BYL[l]
    h = re.sub(r'<p><i>[^<]*\[[^<]*\]\.?</i></p>', '<p><em>' + first.format(a=a, ar=ROLE[a][l], m=MONTH[l]) + '</em></p>', h, count=1)
    h = h.rstrip() + '\n<p><em>' + last.format(a=a, ar=ROLE[a][l], r=r, rr=ROLE[r][l], m=MONTH[l]) + '</em></p>\n'
    assert '[' not in strip(h), f"placeholder left in a{n}-{l}"
    return title, h, faq, strip(meta.group(1)) if meta else ""

os.makedirs(OUT, exist_ok=True)
for n in [int(x) for x in sys.argv[1:]]:
    out = {"n": n, "slug": SLUG[n], "author": AUTH[n][0], "date": DATE[n], "image": IMG[n], "langs": {}}
    for l in LANGS:
        if not os.path.exists(f'{D}/a{n}-{l}.html'): print(f"a{n}-{l}: missing, skipped"); continue
        t, b, f, meta = convert(n, l)
        out["langs"][l] = {"title": t, "body": b, "faq": f, "intro": meta}
        print(n, l, len(b), "faq", len(f), "|", t[:70])
    counts = {len(v["faq"]) for v in out["langs"].values()}
    assert len(counts) == 1, f"faq count mismatch in a{n}: {counts}"
    json.dump(out, open(f'{OUT}/a{n}.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print("wrote", f'{OUT}/a{n}.json')
