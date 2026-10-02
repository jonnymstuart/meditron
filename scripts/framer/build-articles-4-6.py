import re, json, html
D='/home/user/meditron/content/_drafts'
# --- 1. German: read like native German, not a translation ---
DE_FIX = {
 4: [
  ("Der Samsung HERA Z20 ist für Gynäkologie und Geburtshilfe gebaut: Er ist die Wahl für Praxen, deren Alltag hauptsächlich aus pränataler und gynäkologischer Bildgebung besteht und die die fortschrittlichsten 3D/4D- und KI-gestützten geburtshilflichen Workflows wollen.",
   "Der Samsung HERA Z20 ist speziell für Gynäkologie und Geburtshilfe entwickelt. Er eignet sich für Praxen, deren Alltag vor allem aus pränataler und gynäkologischer Bildgebung besteht und die auf die modernsten 3D/4D- und KI-gestützten Workflows in der Geburtshilfe setzen."),
  ("Der Samsung V8 ist die Wahl für Praxen, die Gynäkologie mit Abdomen-, Schilddrüsen-, Brust- oder Bewegungsapparat-Untersuchungen kombinieren oder ein Premium-System für die allgemeine Bildgebung in einer tieferen Preisklasse suchen.",
   "Der Samsung V8 passt zu Praxen, die Gynäkologie mit Untersuchungen von Abdomen, Schilddrüse, Brust oder Bewegungsapparat kombinieren oder ein Premium-System für die allgemeine Bildgebung in einer günstigeren Preisklasse suchen."),
  ("Über rund zwei Dritteln: HERA Z20; darunter: V8.", "Liegt er über rund zwei Dritteln, ist der HERA Z20 die richtige Wahl, darunter der V8."),
  ("Beide nehmen endokavitäre und Volumenschallköpfe auf", "Beide unterstützen endokavitäre und Volumenschallköpfe"),
  ("Der HERA Z20 ist für Ärztinnen und Ärzte, deren Arbeit den grössten Teil des Tages, jeden Tag, Frauenheilkunde ist.", "Der HERA Z20 richtet sich an Ärztinnen und Ärzte, die Tag für Tag hauptsächlich in der Frauenheilkunde arbeiten."),
  ("Das zeigt sich auf drei Arten:", "Das zeigt sich in drei Punkten:"),
  ("<b>Durchsatz.</b>", "<b>Effizienz.</b>"),
  ("Über ein Jahr sind das Tage an Praxiszeit.", "Aufs Jahr gerechnet sind das mehrere Tage Praxiszeit."),
  ("und viele Praxen nutzen sie als Differenzierungsmerkmal.", "und viele Praxen heben sich damit bewusst ab."),
  ("Sie Premium-Bildgebung in einer tieferen Preisklasse wollen.", "Sie Premium-Bildgebung zu einem günstigeren Preis suchen."),
  ("In beiden Fällen unverzichtbar.", "Bei beiden Systemen unverzichtbar."),
  ("Breite über alle Anwendungen", "Vielseitig in allen Anwendungen"),
  ("Durchsatz und Konsistenz über alle Untersuchenden", "Hohe Effizienz und einheitliche Ergebnisse bei allen Untersuchenden"),
  ("Jeder Raum erhält das für seine Untersuchungen gebaute System", "Jeder Raum bekommt das System, das zu seinen Untersuchungen passt"),
  ("Tieferer Einstiegspreis", "Günstigerer Einstiegspreis"),
  ("Als Regel liegt der HERA Z20 in der Premium-Klasse", "In der Regel liegt der HERA Z20 in der Premium-Klasse"),
  ("Der HERA Z20 ergänzt geburtshilfsspezifische Automatisierung und Presets rundherum.", "Der HERA Z20 bietet zusätzlich eine auf die Geburtshilfe abgestimmte Automatisierung und passende Presets."),
  ("Bei vergleichbarem Schallkopfset typischerweise ja.", "Bei vergleichbarem Schallkopfset in der Regel ja."),
  ("<b>Verwandt:</b>", "<b>Lesen Sie auch:</b>"), ("Verwandt: ", "Lesen Sie auch: "),
 ],
 5: [
  ("Jede beantwortet eine andere Frage.", "Jede Klasse ist für andere Aufgaben gedacht."),
  ("Bildqualität und Schallkopfflexibilität sprechen weiterhin für die Konsole; Handhelds gewinnen bei Verfügbarkeit und Preis.", "Bei Bildqualität und Schallkopfauswahl bleibt die Konsole vorn, Handhelds punkten mit Verfügbarkeit und Preis."),
  ("Viele Praxen landen bei Konsole plus Handheld, nicht bei entweder-oder.", "Viele Praxen entscheiden sich am Ende für Konsole plus Handheld statt für ein Entweder-oder."),
  ("Gebaut für einen festen Raum und den täglichen Einsatz.", "Gedacht für einen festen Raum und den täglichen Einsatz."),
  ("Gebaut für kleine Räume und den Wechsel zwischen Räumen.", "Gedacht für kleine Räume und den Wechsel zwischen Räumen."),
  ("Gebaut für Point of Care, Hausbesuche und schnelle Antworten am Patientenbett.", "Gedacht für Point of Care, Hausbesuche und schnelle Abklärungen am Patientenbett."),
  ("Wie vergleichen sich Konsole, kompakter Wagen und Handheld?", "Konsole, kompakter Wagen und Handheld im Vergleich"),
  ("Ein Handheld in der Tasche beantwortet die Frage vor Ort.", "Mit einem Handheld in der Tasche klären Sie die Frage direkt vor Ort."),
  ("ohne herunterzufahren", "ohne das Gerät herunterzufahren"),
  ("Schnelle Antworten, keine vollständigen Studien.", "Schnelle Abklärungen statt vollständiger Untersuchungen."),
  ("Point-of-Care-Fragen passen zum Handheld.", "Für solche Point-of-Care-Fragen ist das Handheld gemacht."),
  ("brauchen die Bildgebungstiefe, die Schallkopfwahl und die Befundung einer Konsole.", "brauchen die Bildqualität, die Schallkopfauswahl und die Befundungsfunktionen einer Konsole."),
  ("Sie rechnen viele Untersuchungen pro Tag ab.", "Sie führen viele Untersuchungen pro Tag durch."),
  ("Er kann:", "Was er kann:"), ("Er kann nicht:", "Was er nicht kann:"),
  ("eine Konsole für detaillierte diagnostische Studien ersetzen", "eine Konsole für detaillierte diagnostische Untersuchungen ersetzen"),
  ("Bildschirmgrösse, Akku und Wärme begrenzen lange Sitzungen.", "Bildschirmgrösse, Akkulaufzeit und Wärmeentwicklung setzen langen Untersuchungen Grenzen."),
  ("Nutzen Sie ihn als Ergänzung, nicht als einziges System, in einer Praxis, in der Ultraschall täglich abgerechnet wird.", "In einer Praxis, die täglich Ultraschall abrechnet, ist er eine Ergänzung und nicht das einzige System."),
  ("Das Gerät ändert die Regeln nicht.", "Das Gerät ändert nichts an den Regeln."),
  ("Schallköpfe sind die Komponente, die am ehesten repariert werden muss.", "Schallköpfe sind das Bauteil, das am häufigsten repariert werden muss."),
  ("die bessere Basis", "die bessere Grundlage"),
  ("Der V6 ergänzt einen optionalen Akku", "Der V6 bietet zusätzlich einen optionalen Akku"),
  ("Der Ausweis ist an die Untersuchung gebunden, nicht an das Gerät.", "Der Ausweis gilt für die Untersuchung, nicht für das Gerät."),
  ("Verwandt: ", "Lesen Sie auch: "),
 ],
 6: [
  ("Nach dieser Checkliste geht Meditron SA, der offizielle Samsung Healthcare Distributor in der Schweiz, mit Praxen vor.", "Mit dieser Checkliste begleitet Meditron SA, der offizielle Samsung Healthcare Distributor in der Schweiz, Praxen durch die ersten Monate."),
  ("Die erste Sitzung erklärt die Knöpfe; die zweite macht das System schnell.", "Die erste Schulung erklärt die Bedienung, die zweite macht das Team schnell."),
  ("Zahlen überprüfen, zweite Applikationsschulung durchführen, verbleibende Workflow-Lücken schliessen, Serviceplan bestätigen.", "Kennzahlen prüfen, zweite Applikationsschulung durchführen, letzte Lücken im Workflow schliessen, Serviceplan bestätigen."),
  ("Platz für das System und für die Untersucherin oder den Untersucher auf beiden Seiten der Liege.", "Platz für das System und genug Bewegungsfreiheit auf beiden Seiten der Liege."),
  ("Das entscheidet, wie schnell Bilder in der Patientenakte landen.", "Davon hängt ab, wie schnell die Bilder in der Patientenakte sind."),
  ("Wer schallt, wer befundet, wer administriert.", "Wer untersucht, wer befundet, wer das System verwaltet."),
  ("Planen Sie einen halben Tag mit dem ganzen Team ein.", "Reservieren Sie dafür einen halben Tag mit dem ganzen Team."),
  ("<b>Täglich schallen.</b>", "<b>Täglich mit dem neuen System arbeiten.</b>"),
  ("Notieren Sie nach zwei Wochen echter Untersuchungen, was zu viele Klicks braucht.", "Notieren Sie nach zwei Wochen im Praxisalltag, wo zu viele Klicks nötig sind."),
  ("Schliessen Sie jede Lücke jetzt, solange die Kontakte zum Anbieter frisch sind.", "Schliessen Sie jede Lücke jetzt, solange der Draht zum Anbieter noch kurz ist."),
  ("Jetzt, da das Team die Grundlagen kennt, behandelt die zweite Sitzung die erweiterten Funktionen, für die Sie bezahlt haben:", "Sobald das Team die Grundlagen beherrscht, geht es in der zweiten Schulung um die erweiterten Funktionen, für die Sie bezahlt haben:"),
  ("und die Abkürzungen, die Untersuchungen schnell machen.", "und die Tastenkürzel, mit denen Untersuchungen schneller gehen."),
  ("<b>Zahlen überprüfen.</b>", "<b>Kennzahlen prüfen.</b>"),
  ("<b>Nachzügler einarbeiten.</b>", "<b>Neue Mitarbeitende schulen.</b>"),
  ("Vier Gewohnheiten schützen sie:", "Vier Gewohnheiten schützen sie wirksam:"),
  ("verlangen Sie bei jeder vorbeugenden Wartung einen Elementtest.", "verlangen Sie bei jeder Wartung einen Elementtest."),
  ("Das Team lernt das neue nie richtig.", "So lernt das Team das neue System nie richtig kennen."),
  ("Werks-Presets belassen.", "Bei den Werks-Presets bleiben."),
  ("Patientendaten doppelt einzutippen kostet Zeit und verursacht Fehler.", "Patientendaten von Hand doppelt einzugeben kostet Zeit und führt zu Fehlern."),
  ("Verwandt: ", "Lesen Sie auch: "),
 ],
}
for n, fixes in DE_FIX.items():
    p=f'{D}/a{n}-de.html'; h=open(p).read(); miss=[]
    for a,b in fixes:
        if a in h: h=h.replace(a,b)
        else: miss.append(a[:50])
    open(p,'w').write(h); print(f"a{n}-de: {len(fixes)-len(miss)} fixes applied; missed: {miss}")

# --- 2. authors, bylines, slugs, intros ---
AUTH = {4: ("Nikita Müller", {"en":"Sales Consultant Ultrasound","de":"Kundenberater Ultraschall","fr":"Conseiller de vente échographie"}, ("Dr. Henri Hagenmüller", {"en":"Managing Director","de":"Geschäftsführer","fr":"Directeur général"})),
        5: ("Dr. Henri Hagenmüller", {"en":"Managing Director","de":"Geschäftsführer","fr":"Directeur général"}, ("Christelle Sam-Hine", {"en":"Applications Specialist Ultrasound","de":"Applikationsspezialistin Ultraschall","fr":"Spécialiste d'application échographie"})),
        6: ("Christelle Sam-Hine", {"en":"Applications Specialist Ultrasound","de":"Applikationsspezialistin Ultraschall","fr":"Spécialiste d'application échographie"}, ("Dr. Henri Hagenmüller", {"en":"Managing Director","de":"Geschäftsführer","fr":"Directeur général"}))}
BYL = {"en": ("Last reviewed: September 2026. Author: {a}, {ar}.", "Author: {a}, {ar}, Meditron SA. Reviewed by: {r}, {rr}. Last updated: September 2026."),
       "de": ("Zuletzt geprüft: September 2026. Autor: {a}, {ar}.", "Autor: {a}, {ar}, Meditron SA. Geprüft von: {r}, {rr}. Zuletzt aktualisiert: September 2026."),
       "fr": ("Dernière révision : septembre 2026. Auteur : {a}, {ar}.", "Auteur : {a}, {ar}, Meditron SA. Relu par : {r}, {rr}. Dernière mise à jour : septembre 2026.")}
SLUG = {4: {"en":"samsung-hera-z20-or-v8-gynaecology","de":"samsung-hera-z20-oder-v8-gynaekologie","fr":"samsung-hera-z20-ou-v8-gynecologie"},
        5: {"en":"mobile-or-stationary-ultrasound-system","de":"ultraschallgeraet-tragbar-oder-stationaer","fr":"echographe-portable-ou-fixe"},
        6: {"en":"first-90-days-new-ultrasound-system","de":"die-ersten-90-tage-neues-ultraschallgeraet","fr":"90-premiers-jours-nouvel-echographe"}}
LIVE = {"which-samsung-ultrasound-system-for-my-practice": {"de":"welches-samsung-ultraschallgeraet-fuer-meine-praxis","fr":"quel-echographe-samsung-pour-mon-cabinet"},
        "samsung-ultrasound-price-switzerland": {"de":"samsung-ultraschallgeraet-preis-schweiz","fr":"prix-echographe-samsung-suisse"},
        "new-or-pre-owned-ultrasound-system": {"de":"ultraschallgeraet-neu-oder-occasion","fr":"echographe-neuf-ou-occasion"}}
INTRO = {4: {"en":"HERA Z20 for practices built around prenatal and gynaecological imaging, V8 for mixed practices: how the two Samsung systems differ in imaging, workflow, footprint and price tier.",
             "de":"HERA Z20 für Praxen mit Schwerpunkt Pränataldiagnostik und Gynäkologie, V8 für gemischte Praxen: Worin sich die beiden Samsung Systeme bei Bildgebung, Workflow, Stellfläche und Preisklasse unterscheiden.",
             "fr":"HERA Z20 pour les cabinets centrés sur l'imagerie prénatale et gynécologique, V8 pour les cabinets mixtes : les différences entre les deux systèmes Samsung en imagerie, flux de travail, encombrement et gamme de prix."},
         5: {"en":"Full-size console, compact cart or wireless handheld: which class fits a Swiss practice, with Samsung V4, V5 and Clarius as examples, and what billing rules say.",
             "de":"Konsole, kompakter Wagen oder kabelloses Handheld: Welche Klasse zu einer Schweizer Praxis passt, mit Samsung V4, V5 und Clarius als Beispielen, und was bei der Abrechnung gilt.",
             "fr":"Console, chariot compact ou appareil portable sans fil : quelle catégorie convient à un cabinet suisse, avec les Samsung V4, V5 et Clarius en exemples, et ce que disent les règles de facturation."},
         6: {"en":"Installation, DICOM, presets, training and service: a 90-day checklist so the whole team gets the full benefit of a new Samsung ultrasound system.",
             "de":"Installation, DICOM, Presets, Schulung und Service: Eine 90-Tage-Checkliste, damit das ganze Team den vollen Nutzen aus dem neuen Samsung Ultraschallgerät zieht.",
             "fr":"Installation, DICOM, préréglages, formation et service : une check-list sur 90 jours pour que toute l'équipe tire le meilleur d'un nouvel échographe Samsung."}}
FAQ_H2 = {"en":"Frequently asked questions","de":"Häufige Fragen","fr":"Questions fréquentes"}
NEXT_H2 = {"en":"Next step","de":"Nächster Schritt","fr":"Prochaine étape"}
TOC_H2 = {"en":"Contents","de":"Inhalt","fr":"Sommaire"}

def convert(n, l):
    h=open(f'{D}/a{n}-{l}.html').read()
    h=h[h.index('<hr>')+4:]
    title=html.unescape(re.sub('<[^>]+>','',re.search(r'<h1>(.*?)</h1>',h,re.S).group(1))).strip()
    h=re.sub(r'<h1>.*?</h1>\s*','',h,flags=re.S)
    # contents block
    h=re.sub(r'<h2[^>]*>\s*'+TOC_H2[l]+r'\s*</h2>\s*<ol>.*?</ol>\s*','',h,flags=re.S)
    # back to contents
    h=re.sub(r'<p><a href="#contents">[^<]*</a></p>\s*','',h)
    # FAQ section -> rows
    m=re.search(r'<h2[^>]*>\s*'+FAQ_H2[l]+r'\s*</h2>(.*?)(?=<h2)',h,re.S)
    faq=[]
    if m:
        pairs=re.findall(r'<p><b>(.*?)</b></p>\s*<p>(.*?)</p>',m.group(1),re.S)
        faq=[(html.unescape(re.sub('<[^>]+>','',q)).strip(), html.unescape(re.sub('<[^>]+>','',a)).strip()) for q,a in pairs]
        h=h[:m.start()]+h[m.end():]
    # trailing hr + placeholder author
    h=re.sub(r'<hr>\s*<p><i>[^<]*\[[^<]*</i></p>\s*$','',h.strip())
    a,ar,(r,rr)=AUTH[n]
    first,last=BYL[l]
    h=re.sub(r'<p><i>[^<]*\[[^<]*\]\.?</i></p>', '<p><em>'+first.format(a=a,ar=ar[l])+'</em></p>', h, count=1)
    h=h.rstrip()+'\n<p><em>'+last.format(a=a,ar=ar[l],r=r,rr=rr[l])+'</em></p>\n'
    assert '[' not in re.sub('<[^>]+>','',h), f"placeholder left in a{n}-{l}"
    h=re.sub(r' id="[^"]*"','',h); h=h.replace('<b>','<strong>').replace('</b>','</strong>').replace('<i>','<em>').replace('</i>','</em>')
    if l!='en':
        for en,loc in LIVE.items(): h=h.replace(f'/{l}/news-events/{en}', f'/{l}/news-events/{loc[l]}')
        for k,s in SLUG.items(): h=h.replace(f'/{l}/news-events/{s["en"]}', f'/{l}/news-events/{s[l]}')
    assert FAQ_H2[l] not in h and TOC_H2[l] not in re.sub('<[^>]+>','',h)[:200]
    return title, h.strip(), faq

out={}
for n in (4,5,6):
    out[n]={"slug":SLUG[n],"author":AUTH[n][0],"intro":INTRO[n],"langs":{}}
    for l in ('en','de','fr'):
        t,b,f=convert(n,l); out[n]["langs"][l]={"title":t,"body":b,"faq":f}
        print(n,l,len(b),"faq",len(f),"|",t[:60])
    assert len({len(out[n]["langs"][l]["faq"]) for l in ('en','de','fr')})==1, "faq count mismatch"
json.dump(out,open('./.cache/a456.json','w'),ensure_ascii=False,indent=1)
