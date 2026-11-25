# German keyword, SERP and competitor audit: meditron.ch in Swiss Google

Date: 25 Nov 2026. Sources: DataForSEO Google Ads search volume and keywords_for_keywords (location 2756 Switzerland, language de, last 12 months); DataForSEO live SERP advanced (Google CH, de, desktop, depth 30, one sample per term, 38 terms, 25 Nov 2026); DataForSEO On-Page instant_pages / content_parsing for competitor pages; direct fetch of meditron.ch pages; tracking file reports/data/google-2026-11-24.json; GSC German queries (last 28 days) as supplied. Raw JSON: volumes-raw.json, ideas-raw.json, serp-summary.json, serps/*.json, onpage/*.json, pages/*.html in this folder.

Caveats. Live SERPs vary between calls (the 24 Nov tracking used a 3-sample median; this audit is one sample), so treat a single position as plus/minus a few places. Google Ads groups close variants (ultraschallgerät = ultraschallgeräte) and reports Swiss-German volumes in coarse buckets; "10" means 0–10 a month. Direct curl to competitor sites (smdmedical.ch, citymed.ch, artmedicalsuisse.ch, doccheckshop.ch) and to google.com was refused by this session's network proxy (403), so competitor pages were measured through the DataForSEO On-Page API instead. Art Medical renders its catalogue in JavaScript, so its category pages could only be measured partly.

## 1. Summary

- Swiss German demand is small and concentrated. The whole medical-ultrasound universe adds up to roughly 1,300–1,500 searches a month, and 590 of them are the head term ultraschallgerät(e). After that come ultraschallgerät kaufen (110), ultraschallgerät vaginal (90, from keyword ideas), the medizinisches ultraschallgerät / ultraschallgerät medizin cluster (70) and ultraschall gerät (70). Every Samsung brand or model term is at 10–30 a month (samsung ultraschall 30). GSC agrees: samsung ultraschall had 48 impressions in 28 days.
- The generic SERPs are messy. In ultraschallgerät, ultraschall gerät, ultraschallgerät kaufen and ultraschallgerät schweiz, roughly half the results are ultrasonic cleaners, physio or therapy devices and home-use gadgets (amanda-nails, denios, medidor, praximedico, Galaxus). Doctors add a qualifier (praxis, medizin, gynäkologie, mobil). A Popular Products carousel appears on 23 of 38 SERPs, filled by Remma, Bimedis, Medizinio, praxisdienst and Amazon listings that show prices.
- Meditron appears in the top 30 for 14 of 38 terms (counting legacy.meditron.ch). Top 10: ultraschallgerät hausarzt #1 (hub), clarius ultraschall #1 (Clarius L7 page), samsung v7 #4 (V7 page, plus #10 for the comparison article), ultraschallgerät leasing #4, handheld ultraschall #5 (but on legacy.meditron.ch, the old Joomla host), ultraschallgerät kosten #7, tragbares ultraschallgerät #8. Meditron is absent from the top 30 for the head term ultraschallgerät, for medizinisches ultraschallgerät, ultraschall gerät, ultraschallgerät praxis, gynäkologie, frauenarzt, tierarzt, gebraucht, occasion and preis, and in this sample also for samsung ultraschall, samsung ultraschallgerät, samsung v8 and samsung r20.
- The Samsung brand SERP is winnable. samsung.com/ch ranks mainly with thin support pages (including pages titled "DONOTUSE"), alongside oegum.at, doccheck, lysis.cc and SMD Medical's "Ultrasound Partnership with Samsung" news post (#5). The model SERPs are polluted by Samsung phones, watches and the Dyson V8 (toppreise, Galaxus), so the full model name plus "Ultraschall" is the term to own.
- Main competitors on the terms that matter. SMD Medical owns the Samsung model SERPs (#1 for samsung v7 and samsung hera z20) with thin product pages of about 190–220 words. Art Medical Suisse owns the price and used terms (positions 1–4 and 9–23 for ultraschallgerät occasion; #1 for ultraschallgerät preis, ultraschallgerät gynäkologie and samsung hera z20 preis) with inventory listings that show CHF prices. The citymed.ch directory page "Ultraschallgeräte in der Schweiz" (8 paid premium partners, Meditron not listed) ranks 3–10 on 8 generic terms. DocCheck Shop CH category pages rank on the mobile and handheld terms.
- Technical issues found along the way:
  - legacy.meditron.ch still ranks (#5 for handheld ultraschall). The redirect plan exists but is not published.
  - Samsung V4, V5 and V6 pages have no links to sibling models or probes, while the HERA Z20 page links 10. Google returned the V4 page for samsung v6 and the V6 page for samsung v4.
  - The HERA Z20 product page does not rank for samsung hera z20 (articles rank 19 and 22 instead).
  - The DE V8 page has an untranslated English heading, "Related models".
  - Every page links to /de/old-home, which returns 200.
- DataForSEO spend: about USD 0.40 (section 7).

## 2. Keyword universe (119 terms)

Volume: Google Ads, CH, de, monthly average. "n/a" means Google Ads returned no volume, effectively zero. Position: live SERP on 25 Nov, organic rank_group, "–" means no SERP checked. "hub" is /de/solutions/ultrasound, which shows in Google as "meditron.ch › ... › Samsung Ultraschall". Google shortens article URLs ("samsung-ultra…"); the likely target is named in the gap list. Close variants share one volume figure (for example ultraschallgerät and ultraschallgeräte, 590 each, which is one pool of searches, not 1,180).

### Generic category

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| ultraschallgerät | 590 | 1.62 | not in top 30 | neurolite.ch, amazon.de, doccheckshop.ch |
| ultraschallgeräte | 590 | 1.62 | – | – |
| ultraschallgerät kaufen | 110 | 1.53 | 22 hub /de/solutions/ultrasound | medidor.ch, denios.ch, maschinensucher.ch |
| ultraschallgeräte kaufen | 110 | 1.53 | – | – |
| ultraschall gerät | 70 | 1.77 | not in top 30 | amanda-nails.ch, drsono.com, frei-swiss.ch |
| medizinisches ultraschallgerät | 70 | 3.71 | not in top 30 | galaxus.ch, physiobuy.de, digitec.ch |
| ultraschallgerät medizin | 70 | 3.71 | – | – |
| medizinische ultraschallgeräte | 70 | 3.71 | – | – |
| sonographie gerät | 20 |  | – | – |
| sonographiegerät | 10 | 2.04 | 26 › news-events › samsung-ultra... | anibis.ch, selvatime.ch, sansotech.ch |
| ultraschall gerät kaufen | 10 | 3.15 | – | – |
| sonografiegerät | 10 |  | – | – |
| 3d ultraschallgerät | 10 |  | – | – |
| 4d ultraschallgerät | 10 |  | – | – |
| ultraschall elastographie | 10 |  | – | – |
| ultraschallgerät 3d 4d | n/a |  | – | – |

### Specialty / setting

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| ultraschallgerät praxis | 10 |  | not in top 30 | gehealthcare-ultrasound.com, medicalexpo.de, startnext.com |
| ultraschallgerät gynäkologie | 10 |  | not in top 30 | artmedicalsuisse.ch, unsplash.com, facebook.com |
| ultraschallgerät arztpraxis | 10 |  | – | – |
| ultraschall hausarzt | 10 |  | – | – |
| gynäkologisches ultraschallgerät | 10 |  | – | – |
| ultraschallgerät radiologie | 10 |  | – | – |
| ultraschallgerät kardiologie | 10 |  | – | – |
| ultraschallgerät hausarzt | n/a |  | 1 hub /de/solutions/ultrasound | meditron.ch, medicalexpo.de, coachling.de |
| ultraschallgerät vaginal | 90 |  | 18 hub /de/solutions/ultrasound | medicalexpo.de, unsplash.com, daweimed.com |
| ultraschallgerät frauenarzt | 20 |  | not in top 30 | seybold-medtech.de, medizinio.de, gyn-med.ch |
| gynäkologie ultraschall gerät | n/a |  | – | – |

### Portable / handheld / POCUS

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| pocus | 480 | 2.72 | not in top 30 | scs.meister-concept.ch, ceuscampus.de, 3bscientific.com |
| mobiles ultraschallgerät | 20 | 2.57 | not in top 30 | vscan.rocks, doccheckshop.ch, procamed.ch |
| portables ultraschallgerät | 20 | 1.88 | – | – |
| tragbares ultraschallgerät | 10 | 2.3 | 8 › news-events › ultraschallger... | vscan.rocks, doccheckshop.ch, medizinio.de |
| handheld ultraschall | 10 | 2.49 | 5 legacy.meditron.ch › hand... | de.sonostarmed.com, asus.com, blog.hopitalvs.ch |
| ultraschall handheld | 10 |  | – | – |
| pocket ultraschall | 10 | 1.72 | – | – |
| ultraschall app | 10 |  | – | – |
| point of care ultraschall | 10 | 1.68 | – | – |

### Used / price / finance

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| ultraschallgerät gebraucht | 20 |  | not in top 30 | ebay.ch, amt-abken.de, eshop.esaote.com |
| gebrauchte ultraschallgeräte | 20 |  | – | – |
| ultraschallgerät occasion | 10 | 1.65 | not in top 30 | artmedicalsuisse.ch, digitec.ch, rowamed.com |
| ultraschallgerät leasing | 10 |  | 4 › news-events › samsung-ultra... | galaxus.ch, tutti.ch, prestaflex.ch |
| ultraschallgerät preis | 10 | 1.83 | not in top 30 | artmedicalsuisse.ch, toppreise.ch, billiger.ch |
| ultraschallgerät kosten | 10 | 1.32 | 7 › news-events › ultraschallger... | toppreise.ch, ultrasoundmarkt.ch, artmedicalsuisse.ch |
| ultraschall occasion | 10 | 1.65 | – | – |
| ultraschallgerät mieten | 10 |  | – | – |
| was kostet ein ultraschallgerät | 10 | 1.33 | – | – |
| ultraschallgerät preise | 10 | 1.83 | – | – |
| ultraschall leasing | n/a |  | – | – |

### Swiss modifiers

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| ultraschall schweiz | 10 |  | – | – |
| ultraschallgerät schweiz | n/a |  | not in top 30 | medidor.ch, wlw.ch, praximedico.ch |
| ultraschallgerät kaufen schweiz | n/a |  | not in top 30 | demadent.ch, wlw.ch, citymed.ch |
| ultraschallgeräte schweiz | n/a |  | – | – |
| ultraschallgerät zürich | n/a |  | – | – |
| ultraschallgerät bern | n/a |  | – | – |

### Samsung brand + model

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| samsung ultraschall | 30 | 3.93 | not in top 30 | oegum.at, doccheck.com, samsung.com |
| ultraschall samsung | 30 | 3.93 | – | – |
| samsung ultraschallgerät | 10 | 3.95 | not in top 30 | samsung.com, oegum.at, lysis.cc |
| samsung ultraschall preis | 10 | 4.15 | not in top 30 | medicalexpo.de, at.bimedis.com, doc-market.eu |
| samsung v8 | 10 | 2.89 | not in top 30 | toppreise.ch, news.samsung.com, facebook.com |
| samsung v7 | 10 | 0.24 | 4 › Products › SAMSUNG V7; 10 › samsung-v7-v6-v5-vergleich | smdmedical.ch, usa.samsunghealthcare.com, mit-gelenk.ch |
| samsung v6 | 10 |  | 25 › Products › SAMSUNG V4 | samsung.com, news.samsung.com, ackermann.ch |
| samsung v5 | 10 |  | not in top 30 | galaxus.ch, toppreise.ch, community.samsung.com |
| samsung v4 | 10 |  | 22 › Products › SAMSUNG V6 | m.price.com.hk, notebook.de, toppreise.ch |
| samsung hera z20 | 10 |  | 19 › news-events › samsung-ultra...; 22 › news-events › samsung-r20-...; 25 hub /de/solutions/ultrasound | smdmedical.ch, global.samsungsuite.com, facebook.com |
| samsung r20 | 10 |  | not in top 30 | olympus.ch, downloadcenter.samsung.com, marathi.ndtv.com |
| samsung hera z20 preis | 10 |  | not in top 30 | artmedicalsuisse.ch, dormed.de, cornelia.ch |
| samsung ultraschallgeräte | 10 | 3.95 | – | – |
| samsung medison | 10 |  | – | – |
| samsung healthcare | 10 |  | – | – |
| hera z20 | 10 |  | – | – |
| samsung hera w10 | 10 |  | – | – |
| hera w10 | 10 |  | – | – |
| samsung rs85 | 10 |  | – | – |
| rs85 prestige | 10 |  | – | – |
| samsung hs40 | 10 | 4.67 | – | – |
| samsung hs50 | 10 |  | – | – |
| samsung hs60 | 10 |  | – | – |
| samsung hm70 | 10 |  | – | – |
| samsung ws80 | 10 |  | – | – |
| samsung ultraschall gynäkologie | 10 |  | – | – |
| samsung v8 preis | 10 |  | – | – |
| samsung v8 ultraschall | n/a |  | not in top 30 | news.samsung.com, samsung.com, abijita.com |
| samsung schallkopf | n/a |  | 18 › news-events › schallkoepfe-... | ultra-medical.de, news.samsung.com, samsung.com |
| samsung ultraschallgerät preis | n/a |  | – | – |
| samsung sonde | n/a |  | – | – |

### Probes

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| schallkopf | 10 |  | not in top 30 | acamed.ch, link.springer.com, thieme-connect.de |
| ultraschall sonde | 10 |  | – | – |
| linearschallkopf | 10 |  | – | – |
| konvexschallkopf | 10 |  | – | – |
| kabelloser schallkopf | 0 |  | – | – |
| schallkopf kaufen | n/a |  | – | – |

### Vet

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| esaote | 50 | 1.5 | not in top 30 | esaote.com, esaotevet.com, medizinio.de |
| ultraschall hund | 40 | 0.16 | – | – |
| ultraschallgerät tierarzt | 10 |  | not in top 30 | medicalexpo.de, siomedical.com, agriexpo.online |
| esaote ultraschall | 10 |  | – | – |
| ultraschall tierarzt | 10 |  | – | – |
| veterinär ultraschall | 10 |  | – | – |
| ultraschallgerät veterinär | 10 | 0.14 | – | – |
| esaote mylab | 10 |  | – | – |
| esaote vet | 10 |  | – | – |
| ultraschall pferd | 10 | 0.79 | – | – |
| ultraschallgerät pferd | 10 |  | – | – |

### Training / service

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| sonographie kurs | 30 | 8.23 | – | – |
| ultraschall kurs | 20 | 4.84 | – | – |
| ultraschall schulung | 10 |  | – | – |
| ultraschall service | n/a |  | – | – |

### Other brands

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| ge ultraschall | 40 | 0.31 | – | – |
| butterfly iq | 40 | 2.88 | – | – |
| clarius ultraschall | 20 | 3.63 | 1 › Products › Clarius L7 HD3; 18 › Products › Clarius PAL HD3; 27 › Products › Clarius C3 HD3 | meditron.ch, clarius.com, medizintechnikmarkt.de |
| philips ultraschall | 20 | 1.82 | – | – |
| mindray ultraschall | 20 | 3.42 | – | – |
| sonosite | 20 | 5.74 | – | – |
| ge voluson | 10 | 0.79 | – | – |
| voluson e10 | 10 |  | – | – |
| canon ultraschall | 10 |  | – | – |
| siemens ultraschall | 10 | 3.48 | – | – |
| fujifilm sonosite | 10 |  | – | – |

### Navigational

| Term | Vol/mo | CPC CHF | Meditron pos + URL | Top 3 domains |
|---|---|---|---|---|
| smd medical | 320 |  | – | – |
| meditron | 210 |  | – | – |
| art medical | 30 |  | – | – |

### Keyword ideas worth adding (Google Ads keywords_for_keywords, medical intent only)

Seeds: ultraschallgerät, sonographie gerät, ultraschallgerät praxis, samsung ultraschall, tragbares ultraschallgerät, ultraschall tierarzt, ultraschallgerät gebraucht, schallkopf. About 60% of the returned ideas are ultrasonic cleaners, physio or therapy devices and home-use gadgets, which we excluded.

| Term | Vol | Note |
|---|---|---|
| ultraschallgerät vaginal / vaginal ultraschallgerät | 90 | Biggest missing term. Mixed intent (patients and gynaecologists); Meditron ranks 18 with the hub |
| ultraschallgerät frauenarzt | 20 | Gynaecology buyer term; related searches include "ultraschallgerät frauenarzt kaufen / gebraucht / kosten" |
| medizinischer ultraschall | 20 | Generic medical |
| mobiles sonographiegerät, sonographiegerät mobil, mobile sonographiegeräte | 10 each | Synonyms for the portable cluster |
| sonogerät, sonogerät kaufen, sonogerät kosten, sonogerät gebraucht, tragbares sonogerät | 10 each | Swiss colloquial "Sono". None of our pages uses the word |
| sonographiegerät kaufen / preis / gebraucht | 10 each | |
| medizinisches ultraschallgerät kaufen, medizinische ultraschallgeräte preise | 10 each | |
| ultraschallgerät veterinärmedizin gebraucht, ultraschallgerät pferd gebraucht | 10 each | Vet used market |
| leasing ultraschallgeräte | 10 | Covered by the leasing article (#4) |
| mobiles ultraschallgerät rettungsdienst | 10 | Clarius / handheld use case |
| ultraschallgerät zahnarzt | 10 | Low fit |
| clarius ultraschall preis, lumify ultraschall (preis), vscan ultraschall, chison ultraschall, mindray ultraschall preise | 10 each | Competitor-brand price terms. Clarius is ours |
| samsung sonographie | 10 | Brand variant |
| pocus | 480 | Mostly training and education (SGUM, SVUPP, CEUS courses); AI Overview cites sgum-ssum.ch. Indirect fit, via handheld or Clarius content and SGUM links |
| sonographie kurs / ultraschall kurs | 30 / 20 | CPC CHF 8.23, the highest in the set. A training-page opportunity if Meditron runs application training |

## 3. SERP features (38 live SERPs, 25 Nov)

Totals: Popular Products 23, People Also Ask 19, AI Overview 7, local pack 5, video 4. Meditron is not cited in any of the 7 AI Overviews. Sources the AI Overviews cite: sonographiegerät (doccheckshop.de, medizinio.de, handheld-experten.de, gehealthcare-ultrasound.com); ultraschallgerät gynäkologie (degum.de, g-ba.de, medizinio.de); schallkopf (medsurf.iml.unibe.ch, thieme, acamed.ch, radiologie24.ch, medicalexpo.de); samsung r20 (smdmedical.ch, samsung.com); pocus (sgum-ssum.ch, svupp.ch, doccheck); esaote (esaote.com); ultraschallgerät leasing (no external source).

| Term | Meditron pos | AI Overview | Local pack | Popular Products | Video | PAA questions |
|---|---|---|---|---|---|---|
| ultraschallgerät | – |  |  | yes |  | 6 |
| ultraschallgerät kaufen | 22 |  |  | yes |  | 6 |
| ultraschall gerät | – |  |  | yes |  | 6 |
| medizinisches ultraschallgerät | – |  |  | yes |  | 6 |
| ultraschallgerät vaginal | 18 |  |  | yes |  | 6 |
| samsung ultraschall | – |  |  | yes |  |  |
| samsung ultraschallgerät | – |  |  | yes |  |  |
| samsung ultraschall preis | – |  |  | yes |  | 6 |
| samsung v8 | – |  |  | yes |  | 3 |
| samsung hera z20 | 19 |  |  |  | yes |  |
| samsung v7 | 4 |  |  | yes |  |  |
| samsung v6 | 25 |  |  |  |  | 6 |
| samsung r20 | – | yes |  |  | yes |  |
| mobiles ultraschallgerät | – |  |  | yes |  |  |
| tragbares ultraschallgerät | 8 |  |  | yes |  |  |
| handheld ultraschall | 5 |  |  | yes |  | 6 |
| ultraschallgerät gebraucht | – |  |  | yes |  |  |
| ultraschallgerät occasion | – |  |  | yes |  |  |
| sonographiegerät | 26 | yes |  |  | yes |  |
| ultraschallgerät preis | – |  |  | yes |  |  |
| ultraschallgerät praxis | – |  | yes | yes |  |  |
| ultraschallgerät gynäkologie | – | yes |  |  |  | 6 |
| ultraschallgerät frauenarzt | – |  |  |  |  | 6 |
| ultraschallgerät tierarzt | – |  | yes |  |  | 6 |
| esaote | – | yes |  |  |  |  |
| ultraschallgerät leasing | 4 | yes |  |  |  |  |
| schallkopf | – | yes |  |  |  |  |
| samsung v5 | – |  |  | yes | yes | 6 |
| samsung v4 | 22 |  |  | yes |  | 3 |
| ultraschallgerät hausarzt | 1 |  | yes |  |  | 6 |
| ultraschallgerät schweiz | – |  | yes | yes |  |  |
| samsung v8 ultraschall | – |  |  |  |  |  |
| samsung hera z20 preis | – |  |  |  |  |  |
| ultraschallgerät kosten | 7 |  |  | yes |  | 6 |
| samsung schallkopf | 18 |  |  |  |  | 6 |
| pocus | – | yes |  |  |  | 4 |
| clarius ultraschall | 1 |  |  | yes |  |  |
| ultraschallgerät kaufen schweiz | – |  | yes | yes |  | 6 |

Local packs: ultraschallgerät schweiz (swiss-sonic, Ultraschallbad.ch, KKS Ultraschall, all cleaner companies) and ultraschallgerät kaufen schweiz (Swissray Medical, AcuMax Med, Ultraschallbad.ch) are commercial packs Meditron could enter through its two Google Business Profiles (Rolle, Frauenfeld) with a "Medizintechnik / medical equipment supplier" category and "Ultraschallgeräte" listed as a product or service. The packs for praxis, hausarzt and tierarzt show doctors' practices (patient intent), not suppliers.

Popular Products carousels show priced product listings (Remma, Bimedis, Medizinio, praxisdienst, Medicalistore, Amazon). Without client-supplied prices Meditron cannot qualify (merchant listings need an offer price), so these slots stay out of reach unless the client decides to publish prices.

## 4. Competitor findings

### Domains seen most often across the 38 German SERPs

| Domain | Top-10 appearances | Top-30 appearances | Where |
|---|---|---|---|
| samsung.com (CH support pages) | 9 | 10 | all Samsung brand and model terms |
| toppreise.ch | 9 | 10 | price terms; model terms through Samsung phones and TVs |
| citymed.ch (health directory) | 8 | 10 | ultraschallgerät, kaufen, ultraschall gerät, tragbar, preis, praxis, hausarzt, kaufen schweiz |
| medicalexpo.de | 8 | 17 | praxis, tierarzt, schallkopf, vaginal, samsung preis |
| news.samsung.com | 8 | 9 | Samsung brand and model terms |
| galaxus.ch | 7 | 13 | medizinisch, leasing, kosten, samsung v5/v6 |
| wlw.ch (B2B directory) | 6 | 12 | generic and Swiss-modifier terms |
| meditron.ch (incl. legacy.) | 6 | 13 | v7, tragbar, leasing, hausarzt, kosten, clarius |
| artmedicalsuisse.ch | 6 | 6 | occasion, sonographiegerät, preis, gynäkologie, hera z20 preis, kosten |
| doccheckshop.ch | 5 | 9 | ultraschallgerät, vaginal, mobil, tragbar, praxis |
| maschinensucher.ch | 5 | 7 | generic, gebraucht, leasing |
| medizinio.de | 5 | 5 | v7, mobil, tragbar, frauenarzt, esaote (also cited in 2 AI Overviews) |
| smdmedical.ch | 4 | 9 | samsung ultraschall, hera z20 (#1), v7 (#1), r20 |
| praximedico.ch, medidor.ch | 4 each | 9–10 | generic terms, but with cleaning and therapy devices (intent mismatch) |

Swibrace-sonosolutions.ch ranked #2 for samsung ultraschall in the first test call but did not appear in the second sample, which shows how unstable this SERP is. MHZ did not appear in any of the 38 SERPs.

### Top 3 direct competitors: what ranks and what they have

1. SMD Medical (smdmedical.ch), a Samsung reseller that also claims a "partnership with Samsung".
   - What ranks: product pages (/produkte/samsung-v7 #1 for samsung v7; for samsung hera z20 a French-language R20 page ("Système d'échographie SAMSUNG R20") is #1 and the HERA Z10 page #4), the Samsung category page /ultraschall/samsung-ultraschallsysteme (#13 for samsung v7), the news post "Ultrasound Partnership with Samsung" (#5 samsung ultraschall, #8 samsung r20) and Italian /ecografia pages ranking on German queries (#11–12).
   - Page facts (DataForSEO On-Page): the V7 page has 220 words, H1 "SAMSUNG V7", 3 H2s ("Entwickelt, um Ihre Arbeitsbelastung zu reduzieren", "Technische Daten", "Wir sind für Sie da!"), no structured data, no price, a meta description that names the V5 on the V7 page, and 33 internal links. HERA Z20: 186 words, same template. The category page has 186 words and one H3 per model (HERA Z10, V4, EVO Q10, V5, V6 …) under "Für jede Fachrichtung das richtige Ultraschallsystem".
   - What they have that Meditron lacks:
     - Domain history on Samsung model terms.
     - The words "Samsung" plus partnership in a news URL that Google treats as the brand page.
     - Pages for HERA Z10 and EVO Q10, models Meditron does not list. The related searches for samsung v7 include "EVO Q10 Samsung" and "Samsung RS85".
     - A category page organised by medical specialty.

     Content depth is not their advantage: Meditron's model pages run about 2,400 words with MedicalDevice, FAQPage and BreadcrumbList schema.
2. Art Medical Suisse (artmedicalsuisse.ch), a used and new equipment marketplace (English UI, JavaScript-rendered shop).
   - What ranks: inventory and category listings titled "ECHOGRAPHY - Ultrasound for sale at Art Medical Suisse", "Other GYNECOLOGY for sale" and "Inventory". These hold positions 1–4, 9 and 12–23 for ultraschallgerät occasion; #1–2 for ultraschallgerät preis; #1 for ultraschallgerät gynäkologie and samsung hera z20 preis; #4–5 for sonographiegerät; #4 for ultraschallgerät kosten.
   - Page facts: the server-rendered HTML holds about 60 words ("Inventory", one H3), no structured data and 729 internal links; listings with CHF prices load in JavaScript. The canonical points every collection URL at /listings.
   - What they have that Meditron lacks: actual listings with prices and many indexable item URLs that match "occasion / gebraucht / preis" intent. Meditron has the article "neu oder occasion" but no list of demo or used units.
3. citymed.ch, a Swiss health directory with the page "Ultraschallgeräte in der Schweiz".
   - What ranks: one category landing page (/ultraschallgeraete/v5-lp-2-1171.html) on 8 generic terms (#3 for ultraschallgerät kaufen schweiz, #6 for ultraschallgerät, #7 for kaufen).
   - Page facts: 599 words, H1 "Ultraschalldiagnostik", H3s "Sonographie mit Ultraschall", "Transvaginaler Ultraschall", "Diagnostikbedarf" and "Wartung & Reparaturservice", plus 8 "Premium-Partner" supplier entries (Nyon, Cham, Horgen, Schwyz, Emmen, Zürich ×2). No schema.
   - What they have that Meditron lacks: a neutral, generic page aimed at "Ultraschallgeräte in der Schweiz" that lists suppliers. Meditron is not listed. The premium listings look paid; a paid listing link would have to be nofollow/sponsored under docs/03-link-playbook.md, so this is a client decision about lead generation, not a link tactic.

Also relevant:
- DocCheck Shop CH ranks with category pages (Sonographie, "Ultraschallgeräte kaufen » mobile Sonographiegeräte", Handheld, Laptop) on mobil, tragbar and praxis.
- samsung.com/ch is a weak brand owner. It ranks with support pages, some titled "DONOTUSE", and a 404 page ("common › error").
- The keyword ideas show nobody serves the colloquial "Sono" / "Sonogerät" vocabulary well.

### Meditron's own ranking pages (measured)

- /de/solutions/ultrasound (hub)
  - Title "Samsung Ultraschall Schweiz – Distributor | Meditron", about 4,400 words, FAQPage, Organization, LocalBusiness and BreadcrumbList schema.
  - Links all 7 Samsung model pages and 12 articles.
  - Ranks #1 for ultraschallgerät hausarzt and #22 for kaufen, but is not in the top 30 for samsung ultraschall in this sample (24 Nov tracking: found in some samples, median >100).
  - Links to /products?category=ultrasound (EN) rather than a DE equivalent.
- /de/products/samsung-v8 and the other model pages: about 2,400 words, MedicalDevice and FAQPage schema, and correct titles ("Samsung V6 Ultraschallgerät | Meditron Schweiz"). Internal linking is uneven:

  | Model page | Links to sibling model or probe pages |
  |---|---|
  | V4, V5, V6 | 0 |
  | V7, V8, R20 | 3 each |
  | HERA Z20 | 10 (including all 7 probe pages) |

  Google returned the V4 page for samsung v6 and the V6 page for samsung v4, which suggests weak model signals. The DE V8 page has an English H2, "Related models".
- Every page links /de/old-home (200). Worth checking whether it is noindex or should be removed.

## 5. Gap list and page mapping

Gap = the term has volume (or GSC impressions) and Meditron is absent or ranks below 20. Rows are ordered by volume and fit. Existing pages are DE URLs from sitemap_de.xml.

| # | Term cluster (vol/mo) | Meditron now | Target page | What to do |
|---|---|---|---|---|
| 1 | ultraschallgerät / ultraschallgeräte (590), medizinisches ultraschallgerät / ultraschallgerät medizin (70), ultraschall gerät (70), sonographiegerät / sonografiegerät / sonographie gerät (10–20), sonogerät (10), medizinischer ultraschall (20) | not in top 30 (sonographiegerät 26) | New DE category page, for example "Ultraschallgeräte für Praxis und Spital" (or give /de/products?category=ultrasound a real indexable DE URL with an intro) | The winners are category pages (citymed, DocCheck Shop, wlw), not brand pages. List Samsung, Clarius and Esaote vet. Add sections by setting (Hausarzt, Gynäkologie, Radiologie, Tierarzt), mobil vs stationär, Occasion and Leasing, Service and Schulung. Use the synonyms Sonographiegerät and Sonogerät. Link down to the hub and the model pages. Strategic note: docs/01-strategy.md expects the brand hub to pick these up as a by-product, but the SERP shows a Samsung-only page is not what Google returns here |
| 2 | ultraschallgerät kaufen / ultraschallgeräte kaufen (110), ultraschall gerät kaufen (10), medizinisches ultraschallgerät kaufen (10) | 22 (hub) | Category page from row 1, supported by /de/news-events/ultraschallgeraet-kaufen-checkliste-hausarztpraxis | Use "Ultraschallgerät kaufen in der Schweiz" as the H2 on the category page. Link the checklist article to it with that anchor |
| 3 | ultraschallgerät vaginal / vaginal ultraschallgerät (90) | 18 (hub) | /de/news-events/schallkoepfe-gynaekologie-ultraschall-praxis plus the endocavity probe page (check in the Products CMS which of samsung-ev2-12 / ea2-11av is the transvaginal probe) | Add an H2 "Vaginalsonde (transvaginaler Schallkopf)" with a plain definition. Link the probe page. citymed ranks with just one H3, "Transvaginaler Ultraschall" |
| 4 | ultraschallgerät frauenarzt (20), ultraschallgerät gynäkologie (10), gynäkologisches ultraschallgerät (10) | not in top 30 | /de/news-events/samsung-hera-z20-oder-v8-gynaekologie (and the Gynäkologie section of the row 1 page) | Put "Ultraschallgerät für die Gynäkologie" in the title and H1. Art Medical holds #1 with a bare listing, so the bar is low |
| 5 | samsung ultraschall / ultraschall samsung (30), samsung ultraschallgerät(e) (10), samsung medison (10), samsung healthcare (10), samsung sonographie (10). GSC: 48 impressions | not in top 30 in this sample; tracking median >100 | /de/solutions/ultrasound (hub) | The page is already strong on content, so the gap is authority. Ask Samsung Healthcare for a distributor link from samsung.com/ch (their CH pages are weak: support pages, "DONOTUSE"). Publish a news item in DE on Meditron as the official Samsung ultrasound distributor (SMD's partnership post ranks #5). Use "Samsung Ultraschall" as the anchor from all 15 articles. Mention "Samsung Medison" once |
| 6 | samsung v8 (10), samsung v8 ultraschall (GSC 16), samsung v8 preis (10) | not in top 30 (tracking 24 Nov: 23) | /de/products/samsung-v8 | Translate the "Related models" H2. Add anchor links "Samsung V8 Ultraschallgerät" from the hub, the gyn article and the price article. The SERP is polluted by Galaxy and Dyson V8, so "V8 Ultraschall" is the realistic term |
| 7 | samsung hera z20 / hera z20 (10), samsung hera z20 preis (10, GSC 4) | 19 (article), 22 (R20 article), 25 (hub); product page not ranking | /de/products/samsung-hera-z20 | Run GSC URL inspection on the product page. Point article links at the product page with the exact anchor "Samsung HERA Z20". Add an FAQ "Was kostet der HERA Z20?" (no numbers unless supplied) linking to the price article |
| 8 | samsung v6 / v5 / v4 (10 each) | v6 → V4 page at 25; v4 → V6 page at 22; v5 not in top 30 | /de/products/samsung-v4, -v5, -v6 | Fill the Related models and probe references for V4, V5 and V6 in the Products CMS (currently 0 links). Link the V7/V6/V5 comparison article to each with exact anchors. Expect noise from Galaxy phones on these SERPs |
| 9 | samsung r20 (10), samsung rs85 (10) | not in top 30 | /de/products/samsung-r20, /de/news-events/samsung-r20-radiologie-institute-spitaeler | The AI Overview cites smdmedical.ch and samsung.com. Add a short definitional opening ("Das Samsung R20 ist …") that AI can quote, using Samsung's published wording |
| 10 | handheld ultraschall (10, GSC 16), mobiles ultraschallgerät (20), portables ultraschallgerät (20), tragbares ultraschallgerät (10), pocket ultraschall (10), mobiles sonographiegerät (10) | legacy.meditron.ch #5; mobiles not in top 30; tragbares #8 | /de/news-events/handheld-ultraschall-clarius-scanner and /de/news-events/ultraschallgeraet-tragbar-oder-stationaer, plus the Clarius product pages | Publish the legacy redirect map (docs/04-redirect-plan.md), with legacy "hand…" mapped to the handheld article. Add "mobiles Ultraschallgerät" and "portables" to the H1 and H2 of the tragbar article |
| 11 | ultraschallgerät gebraucht (20), gebrauchte ultraschallgeräte (20), ultraschallgerät occasion / ultraschall occasion (10), sonographiegerät gebraucht (10), ultraschallgerät veterinärmedizin gebraucht (10) | not in top 30 | /de/news-events/ultraschallgeraet-neu-oder-occasion now; a new "Occasionen und Demogeräte" page if the client sells used or demo units | Art Medical wins with real listings. An article alone will not outrank it. Client decision |
| 12 | ultraschallgerät preis / preise (10), ultraschallgerät kosten (10, Meditron #7), was kostet ein ultraschallgerät (10), samsung ultraschall preis (10) | preis not in top 30; kosten 7 | /de/news-events/samsung-ultraschallgeraet-preis-schweiz | Widen the title to include the generic question "Was kostet ein Ultraschallgerät?", which appears as PAA on 5 SERPs. Price ranges only if Henri supplies them |
| 13 | ultraschallgerät praxis / arztpraxis (10) | not in top 30 (hausarzt is #1) | /de/news-events/welches-samsung-ultraschallgeraet-fuer-meine-praxis | Put "Ultraschallgerät für die Praxis" in the title and H1. GE's gehealthcare-ultrasound.com ranks #1 |
| 14 | esaote (50), esaote ultraschall / esaote vet / esaote mylab (10), ultraschallgerät tierarzt / veterinär (10), ultraschall pferd / ultraschallgerät pferd (10) | not in top 30 | /de/news-events/ultraschall-tierarztpraxis-esaote-geraet, /de/products/esaote-mylab-*-vet, the news post on exclusive Esaote vet distribution | "esaote" is navigational to esaote.com. Ask Esaote for the CH vet-distributor link. Target "Esaote Schweiz" and "Esaote Vet Schweiz" in the vet article title |
| 15 | schallkopf (10), samsung schallkopf (n/a, Meditron 18), linearschallkopf / konvexschallkopf / ultraschall sonde (10) | not in top 30; 18 | /de/news-events/samsung-schallkoepfe-ratgeber | The AI Overview is definitional (Unibe, Thieme, acamed). Open with a two-sentence answer to "Welche Schallköpfe gibt es?" (linear, konvex, sektor, endokavitär) |
| 16 | sonographie kurs (30, CPC 8.23), ultraschall kurs (20), ultraschall schulung (10) | not checked | New "Applikationsschulung" page only if Meditron runs training; otherwise SGUM outreach (docs/03) | High CPC signals commercial value |
| 17 | pocus (480) | not in top 30 | Optional article "POCUS mit Handheld-Ultraschall" tied to Clarius | Education intent (SGUM, SVUPP). Long shot, low priority |
| 18 | ultraschallgerät schweiz / kaufen schweiz (n/a, local pack), ultraschall schweiz (10) | not in top 30 | Google Business Profiles (Rolle, Frauenfeld) plus the row 1 page | Add the medical equipment supplier category and "Ultraschallgeräte" as a product or service. The pack today shows cleaner suppliers and Swissray / AcuMax |

Models seen in related searches and on SMD's category page that Meditron has no DE page for: HERA Z10, EVO Q10, RS85, HERA W10. Add pages only if Meditron sells them in CH (client to confirm).

## 6. People Also Ask: questions to answer in German

These are buyer-relevant questions seen in the 25 Nov SERPs (number of SERPs in brackets), with the page that should answer each. Patient-only questions are left out (pregnancy weeks, tumours, Krankenkasse for patients, Samsung phones, ultrasonic cleaners). Answers must stay within Samsung's or Clarius's published material, with no clinical claims and no prices unless the client supplies them.

| Question (as Google shows it) | Seen on | Answer on |
|---|---|---|
| Was kostet ein Ultraschallgerät beim Frauenarzt? | 5 (kaufen, samsung preis, gynäkologie, frauenarzt, kosten) | price article and gyn article (reframe: what a gynaecology practice pays for a system) |
| Wie viel kostet ein Ultraschallgerät? / Was kostet eine Ultraschallmaschine? | 2 / 1 | price article |
| Wie teuer ist ein tragbares Ultraschallgerät? | 1 | tragbar-oder-stationär article, handheld article |
| Kann man mit dem Handy Ultraschall machen? / Kann ich Ultraschall mit meinem Handy machen? | 4 / 1 | handheld (Clarius) article |
| Wie heisst das Gerät für Ultraschall? | 4 | category page (Ultraschallgerät = Sonographiegerät = Sonogerät) |
| Kann man privat ein Ultraschallgerät kaufen? | 3 | category page FAQ (professional medical devices; CE/Swissmedic wording verbatim from the client) |
| Welches Ultraschallgerät ist das beste? | 1 | welches-samsung-ultraschallgerät-für-meine-praxis article |
| Was ist eine Ultraschallsonde? / Welche Schallköpfe gibt es beim Ultraschall? | 2 / 1 | schallköpfe ratgeber, gyn probes article |
| Wie heisst das Ultraschallgerät beim Frauenarzt? / Wie lange ist das Ultraschallgerät beim Frauenarzt? | 1 / 1 | gyn probes article (Vaginalsonde section) |
| Hat jeder Tierarzt ein Ultraschallgerät? / Wie teuer ist ein Ultraschall beim Tierarzt? | 1 / 1 | vet (Esaote) article |
| Was kann der Hausarzt im Ultraschall sehen? | 1 | GP checklist article (applications list from Samsung material only) |
| Wie viel kostet ein Ultraschall beim Hausarzt? / Wird Ultraschall von der Krankenkasse bezahlt? | 1 / 2 | leasing article or GP checklist (TARDOC billing angle for practice ROI; client to verify facts) |
| Was ist Pocus in der Medizin? / Was versteht man unter Sono? | 1 / 1 | handheld article; category page glossary |
| Was bringt ein Ultraschallgerät? | 1 | category page intro |

## 7. DataForSEO cost (25 Nov 2026)

| Call | Count | USD |
|---|---|---|
| keywords_data/google_ads/search_volume/live (119 terms) | 1 | 0.090 |
| keywords_data/google_ads/keywords_for_keywords/live (8 seeds) | 1 | 0.090 |
| serp/google/organic/live/advanced (depth 30, async AI Overview, PAA depth 1) | 39 (1 test + 38) | 0.206 |
| on_page/instant_pages + content_parsing (competitor pages) | 14 | about 0.006 |
| serp/bing/organic/live/regular (site: probes, no results) | 3 | 0.000 |
| Total | | about 0.39 |

No backlink endpoints were used. Budget cap was USD 8.
