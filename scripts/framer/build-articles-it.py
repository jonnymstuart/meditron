# Converts content/_drafts/aN-it.html (articles 1-6) into Framer-ready Italian bodies, FAQ rows, titles, intros and slugs.
# Output: scripts/framer/.cache/it.json  Usage: python3 scripts/framer/build-articles-it.py
import re, json, html, os
D='/home/user/meditron/content/_drafts'
AUTH = {1:("Nikita Müller","Consulente di vendita ecografia",("Dr. Henri Hagenmüller","Direttore generale")),
        2:("Dr. Henri Hagenmüller","Direttore generale",("Christelle Sam-Hine","Specialista applicativa ecografia")),
        3:("Christelle Sam-Hine","Specialista applicativa ecografia",("Dr. Henri Hagenmüller","Direttore generale")),
        4:("Nikita Müller","Consulente di vendita ecografia",("Dr. Henri Hagenmüller","Direttore generale")),
        5:("Dr. Henri Hagenmüller","Direttore generale",("Christelle Sam-Hine","Specialista applicativa ecografia")),
        6:("Christelle Sam-Hine","Specialista applicativa ecografia",("Dr. Henri Hagenmüller","Direttore generale"))}
EN = {1:"which-samsung-ultrasound-system-for-my-practice",2:"samsung-ultrasound-price-switzerland",3:"new-or-pre-owned-ultrasound-system",
      4:"samsung-hera-z20-or-v8-gynaecology",5:"mobile-or-stationary-ultrasound-system",6:"first-90-days-new-ultrasound-system"}
IT = {1:"quale-ecografo-samsung-per-il-mio-studio",2:"prezzo-ecografo-samsung-svizzera",3:"ecografo-nuovo-o-usato",
      4:"samsung-hera-z20-o-v8-ginecologia",5:"ecografo-portatile-o-fisso",6:"primi-90-giorni-nuovo-ecografo"}
INTRO = {1:"Specialità, volume di esami, sonde, spazio e budget: le quattro domande che decidono tra HERA Z20, R20, V8, V7, V6, V5 e V4, più i requisiti svizzeri da verificare prima.",
         2:"Non esiste un prezzo di listino. Cosa determina il costo di un ecografo Samsung, acquisto, leasing o usato a confronto, cosa preparare per un'offerta e le domande da porre a ogni fornitore.",
         3:"Quando un ecografo Samsung usato è una scelta sensata, quando è meglio il nuovo, una checklist in nove punti e le domande da porre al venditore.",
         4:"HERA Z20 per gli studi concentrati sull'imaging prenatale e ginecologico, V8 per gli studi misti: le differenze tra i due sistemi Samsung in imaging, flusso di lavoro, ingombro e fascia di prezzo.",
         5:"Console, carrello compatto o palmare senza fili: quale classe si adatta a uno studio svizzero, con Samsung V4, V5 e Clarius come esempi, e cosa dicono le regole di fatturazione.",
         6:"Installazione, DICOM, preset, formazione e assistenza: una checklist di 90 giorni perché tutto il team sfrutti al meglio il nuovo ecografo Samsung."}
FIRST="Ultima revisione: settembre 2026. Autore: {a}, {ar}."
LAST="Autore: {a}, {ar}, Meditron SA. Revisione: {r}, {rr}. Ultimo aggiornamento: settembre 2026."

def convert(n):
    h=open(f'{D}/a{n}-it.html').read()
    h=h[h.index('<hr>')+4:]
    title=html.unescape(re.sub('<[^>]+>','',re.search(r'<h1>(.*?)</h1>',h,re.S).group(1))).strip()
    h=re.sub(r'<h1>.*?</h1>\s*','',h,flags=re.S)
    h=re.sub(r'<h2[^>]*>\s*Indice\s*</h2>\s*<ol>.*?</ol>\s*','',h,flags=re.S)
    h=re.sub(r'<p><a href="#contents">[^<]*</a></p>\s*','',h)
    m=re.search(r'<h2[^>]*>\s*Domande frequenti\s*</h2>(.*?)(?=<h2)',h,re.S)
    faq=[]
    if m:
        pairs=re.findall(r'<p><b>(.*?)</b></p>\s*<p>(.*?)</p>',m.group(1),re.S)
        faq=[(html.unescape(re.sub('<[^>]+>','',q)).strip(), html.unescape(re.sub('<[^>]+>','',a)).strip()) for q,a in pairs]
        h=h[:m.start()]+h[m.end():]
    h=re.sub(r'<hr>\s*<p><i>[^<]*\[[^<]*</i></p>\s*$','',h.strip())
    a,ar,(r,rr)=AUTH[n]
    h=re.sub(r'<p><i>[^<]*\[[^<]*\]\.?</i></p>','<p><em>'+FIRST.format(a=a,ar=ar)+'</em></p>',h,count=1)
    h=h.rstrip()+'\n<p><em>'+LAST.format(a=a,ar=ar,r=r,rr=rr)+'</em></p>\n'
    assert '[' not in re.sub('<[^>]+>','',h), f"placeholder left in a{n}-it"
    h=re.sub(r' id="[^"]*"','',h); h=h.replace('<b>','<strong>').replace('</b>','</strong>').replace('<i>','<em>').replace('</i>','</em>')
    for k in EN: h=h.replace(f'/it/news-events/{EN[k]}', f'/it/news-events/{IT[k]}')
    assert 'Domande frequenti' not in h
    return title,h.strip(),faq

out={}
for n in range(1,7):
    t,b,f=convert(n); out[n]={"en_slug":EN[n],"it_slug":IT[n],"title":t,"intro":INTRO[n],"body":b,"faq":f}
    print(n,len(b),"faq",len(f),"|",t[:60])
os.makedirs('/home/user/meditron/scripts/framer/.cache',exist_ok=True)
json.dump(out,open('/home/user/meditron/scripts/framer/.cache/it.json','w'),ensure_ascii=False,indent=1)
