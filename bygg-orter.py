# -*- coding: utf-8 -*-
"""Bygger ortsidorna under /ugl/ ur kurser-data.js.
Kor:  python bygg-orter.py
Varje gang kurslistan andras: kor skriptet igen och pusha ugl/ och sitemap.xml."""
import os, re, json, datetime, html
R = os.path.dirname(os.path.abspath(__file__))
BAS = 'https://www.uglsverige.store'
IDAG = datetime.date.today()
MAN = ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december']

def rd(p): return open(p,'rb').read().decode('utf-8').replace('\r\n','\n')
def wr(p,s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p,'wb').write(s.encode('utf-8'))
def slug(s):
    s = s.lower().replace('å','a').replace('ä','a').replace('ö','o')
    return re.sub(r'^-|-$','', re.sub(r'[^a-z0-9]+','-',s))
def esc(s): return html.escape(s, quote=True)
def kr(n): return f"{n:,}".replace(',',' ') + ' kr'

# ---------- kursdata
src = rd(os.path.join(R,'kurser-data.js'))
STD = int(re.search(r'UGL_KURSPRIS\s*=\s*(\d+)', src).group(1))
rader = [r for r in src.split('`')[1].strip().split('\n') if r.strip()]
kurser = []
for r in rader:
    d = r.split('|')
    start = datetime.date.fromisoformat(d[0]); slut = start + datetime.timedelta(days=4)
    logi = int(d[5]); pris = int(d[7]) if len(d) > 7 and d[7] else STD
    samlat = (logi == 0 and len(d) > 7 and bool(d[7]))
    total = pris + logi if logi else (pris if samlat else 0)
    kurser.append(dict(start=start, slut=slut, vecka=int(d[1]), anl=d[2], ort=d[3],
                       hl=[x for x in d[4].split(';') if x], total=total, ledig=(d[6]=='L'),
                       nyckel=d[0]+'-'+slug(d[2])))
kurser.sort(key=lambda k: k['start'])

# ---------- regioner
REGIONER = [
 dict(slug='stockholm', namn='Stockholm', orter=['Stockholm','Lidingö','Täby','Värmdö','Nacka Strand, Stockholm'],
      intro='Stockholmsområdet har flest UGL-veckor i landet. Kursgårdarna ligger på Lidingö, i Värmdö, i Täby, i Nacka och vid Mälaren, alla inom ungefär en timme från Stockholm C med bil eller kollektivtrafik. Boende ingår, så avståndet till hemmet spelar mindre roll än det brukar.'),
 dict(slug='goteborg', namn='Göteborg', orter=['Göteborg','Mölnlycke'],
      intro='I Göteborgsområdet hålls UGL på kursgårdar söder och öster om staden, i Onsala och i Mölnlycke, båda inom en halvtimme från Göteborg C. Deltagare från hela Västsverige och Halland väljer ofta dessa veckor.'),
 dict(slug='helsingborg', namn='Helsingborg', orter=['Helsingborg'],
      intro='UGL i Helsingborg hålls strax söder om staden, med tåg- och bilförbindelser från hela Skåne och från Danmark. Veckorna här samlar deltagare från nordvästra Skåne, Halland och Öresundsregionen.'),
 dict(slug='halmstad', namn='Halmstad', orter=['Halmstad'],
      intro='Halmstad har två kursgårdar vid kusten, båda en kort bilresa från centrum och från E6. Läget mitt emellan Göteborg och Malmö gör att veckorna här ofta har deltagare från båda hållen.'),
 dict(slug='kristianstad', namn='Kristianstad', orter=['Kristianstad'],
      intro='UGL i Kristianstad är östra Skånes och Blekinges alternativ, med tåg från Malmö, Lund och Karlskrona. Kursgården ligger nära staden och har hållit UGL under många år.'),
 dict(slug='jonkoping', namn='Jönköping', orter=['Jönköping'],
      intro='Kursgården för Jönköpingsområdet ligger i Mullsjö, en knapp halvtimme från Jönköping. Läget mitt i södra Sverige gör veckorna här lätta att nå från Småland, Västergötland och Östergötland.'),
 dict(slug='sundsvall', namn='Sundsvall', orter=['Sundsvall/Timrå'],
      intro='För Norrland hålls UGL vid Sundsvall och Timrå, nära Sundsvall Timrå flygplats och med tåg längs Norrlandskusten. Veckorna här är få, så den som vill gå i norr gör klokt i att boka tidigt.'),
]

# ---------- gemensamma bitar
HEAD_FONTS = '''  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Libre+Franklin:wght@500;600;700&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css?v=88">
'''
HEADER = '''  <header class="site-header header-solid">
    <a class="brand" href="/" aria-label="UGL Sverige, startsida">
      <svg class="brand-mark" viewBox="0 0 100 100" aria-hidden="true"><g id="people"></g></svg>
      <span class="brand-type"><strong>UGL</strong><b>SVERIGE</b><small>Utveckling * Grupp * Ledare</small></span>
    </a>
    <button class="menu-button" aria-label="Öppna meny" aria-expanded="false">Meny</button>
    <nav class="nav" aria-label="Huvudmeny">
      <a href="/#om">Om UGL</a><a href="/#veckan">Veckan</a><a href="/ugl/">Kursorter</a><a href="/#grunder">Forskning</a><a href="/#fragor">Frågor</a>
      <a class="button button-small" href="/kurser">Kursdatum</a>
    </nav>
  </header>
'''
FOOTER = '''  <footer>
    <div class="brand footer-brand"><svg class="brand-mark" viewBox="0 0 100 100" aria-hidden="true"><g class="footer-people"></g></svg><span class="brand-type"><strong>UGL</strong><b>SVERIGE</b><small>Utveckling * Grupp * Ledare</small></span></div>
    <div class="footer-links"><a href="/#om">Om UGL</a><a href="/kurser">Kursdatum</a><a href="/ugl/">Kursorter</a><a href="/#organisationer">För organisationer</a><a href="/#kontakt">Kontakt</a></div>
    <p>© 2026 UGL Sverige</p>
  </footer>
  <script src="/script.js?v=9"></script>
'''
VAD_AR = '''<h2>Vad är UGL?</h2>
        <p>UGL, Utveckling av grupp och ledare, är Sveriges mest använda ledarskapsutbildning. Under fem sammanhängande dagar på kursgård lär sig 8 till 12 deltagare som inte känner varandra hur grupper utvecklas, hur de själva fungerar tillsammans med andra och hur de kan leda utifrån det. Konceptet ägs av Försvarshögskolan, som certifierar alla handledare, och kursen ser likadan ut oavsett var i landet den hålls. <a href="/">Läs mer om UGL, veckan och forskningen bakom.</a></p>'''
FAKTA = '''<ul class="facts-siffror ort-siffror">
          <li><b>5</b><span>sammanhängande dagar</span></li>
          <li><b>48</b><span>utbildningstimmar</span></li>
          <li><b>8<i>till</i>12</b><span>deltagare</span></li>
          <li><b>2</b><span>certifierade handledare</span></li>
        </ul>'''
def faq(namn):
    return f'''<div class="fragor faq-lista ort-faq">
          <details><summary>Måste man bo på kursgården?</summary><p>Ja. Kost och logi ingår, och ingen kommer och går under veckan. Det är också därför avståndet till {esc(namn)} spelar mindre roll än det brukar: man reser dit på måndagen och hem på fredagen.</p></details>
          <details><summary>Kan man gå tillsammans med en kollega?</summary><p>Inte på samma vecka. Gruppen ska vara en främlingsgrupp där ingen känner någon sedan tidigare. Flera från samma organisation fördelas på olika veckor, gärna på samma ort.</p></details>
          <details><summary>Vad kostar UGL i {esc(namn)}?</summary><p>Priset står vid varje vecka ovan och inkluderar kursledning med två handledare, kursmaterial, kost och logi. Resan till och från kursgården tillkommer.</p></details>
        </div>'''

def datumtext(k):
    a, b = k['start'], k['slut']
    if a.month == b.month: return f"{a.day} till {b.day} {MAN[a.month-1]} {a.year}"
    return f"{a.day} {MAN[a.month-1]} till {b.day} {MAN[b.month-1]} {a.year}"

def kursrader(lista):
    ut = []
    for k in lista:
        pris = kr(k['total']) if k['total'] else 'Pris på förfrågan'
        status = '<span class="ort-status ort-ledig">Platser kvar</span>' if k['ledig'] else '<span class="ort-status ort-full">Fullbokad</span>'
        hl = ', '.join(esc(x) for x in k['hl']) or 'Handledare meddelas'
        ut.append(f'''          <li class="ort-kurs">
            <span class="ort-vecka"><b>Vecka {k['vecka']}</b>{datumtext(k)}</span>
            <span class="ort-anl"><b>{esc(k['anl'])}</b>{esc(k['ort'])}</span>
            <span class="ort-hl">{hl}</span>
            <span class="ort-pris"><b>{pris}</b>{status}</span>
            <a class="button button-small" href="/kurs?k={esc(k['nyckel'])}">Se veckan &#8594;</a>
          </li>''')
    return '\n'.join(ut)

def schema_events(reg, lista):
    ev = []
    for k in lista:
        e = {"@type":"EducationEvent","name":f"UGL vecka {k['vecka']}, {k['anl']}","description":f"UGL, Utveckling av grupp och ledare, fem dagar på {k['anl']} i {k['ort']}.",
             "startDate":k['start'].isoformat(),"endDate":k['slut'].isoformat(),"eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
             "eventStatus":"https://schema.org/EventScheduled",
             "location":{"@type":"Place","name":k['anl'],"address":{"@type":"PostalAddress","addressLocality":k['ort'],"addressCountry":"SE"}},
             "organizer":{"@id":BAS+"/#org"},"url":f"{BAS}/kurs?k={k['nyckel']}",
             "about":{"@id":BAS+"/#kurs"}}
        if k['total']:
            e["offers"] = {"@type":"Offer","price":k['total'],"priceCurrency":"SEK","url":f"{BAS}/kurs?k={k['nyckel']}",
                           "availability":"https://schema.org/InStock" if k['ledig'] else "https://schema.org/SoldOut"}
        ev.append(e)
    return ev

def sida(reg):
    namn = reg['namn']
    alla = [k for k in kurser if k['ort'] in reg['orter']]
    kommande = [k for k in alla if k['start'] >= IDAG]
    lediga = [k for k in kommande if k['ledig']]
    anl = {}
    for k in alla: anl.setdefault(k['anl'], {'ort':k['ort'],'n':0}); anl[k['anl']]['n'] += 1
    nasta = lediga[0] if lediga else (kommande[0] if kommande else None)
    title = f"UGL i {namn}: kursdatum, kursgårdar och pris | UGL Sverige"
    desc = f"UGL, Utveckling av grupp och ledare, i {namn}: {len(kommande)} kommande kursveckor på {len(anl)} kursgårdar. Datum, handledare, pris och platser kvar." if kommande else f"UGL i {namn}: kursgårdar, kommande veckor och pris."
    lead = (f"{len(kommande)} kommande kursveckor på {len(anl)} kursgårdar. " + (f"Nästa vecka med platser kvar är vecka {nasta['vecka']}, {datumtext(nasta)}, på {nasta['anl']}." if nasta and nasta['ledig'] else "")) if kommande else "Inga inplanerade veckor just nu. Nyhetsbrevet ger besked när nya datum läggs ut."
    anl_html = '\n'.join(f'''          <li><b>{esc(a)}</b><span>{esc(v['ort'])}, {v['n']} {'vecka' if v['n']==1 else 'veckor'} i listan</span></li>''' for a, v in sorted(anl.items(), key=lambda x: -x[1]['n']))
    andra = ' · '.join(f'<a href="/ugl/{r["slug"]}">{esc(r["namn"])}</a>' for r in REGIONER if r['slug'] != reg['slug'])
    graph = [
        {"@type":"BreadcrumbList","itemListElement":[
            {"@type":"ListItem","position":1,"name":"UGL Sverige","item":BAS+"/"},
            {"@type":"ListItem","position":2,"name":"Kursorter","item":BAS+"/ugl/"},
            {"@type":"ListItem","position":3,"name":f"UGL i {namn}","item":f"{BAS}/ugl/{reg['slug']}"}]},
        {"@type":"WebPage","url":f"{BAS}/ugl/{reg['slug']}","name":f"UGL i {namn}","inLanguage":"sv-SE","dateModified":IDAG.isoformat(),
         "isPartOf":{"@id":BAS+"/#webbplats"},"about":{"@id":BAS+"/#kurs"}},
        {"@type":"ItemList","name":f"Kommande UGL-veckor i {namn}","itemListElement":[{"@type":"ListItem","position":i+1,"item":e} for i,e in enumerate(schema_events(reg, kommande))]},
    ]
    return f'''<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="{esc(desc)}">
  <title>{esc(title)}</title>
  <link rel="canonical" href="{BAS}/ugl/{reg['slug']}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="sv_SE">
  <meta property="og:site_name" content="UGL Sverige">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{BAS}/ugl/{reg['slug']}">
  <meta property="og:image" content="{BAS}/assets/ugl-hero.webp">
  <meta name="twitter:card" content="summary_large_image">
{HEAD_FONTS}  <script type="application/ld+json">
  {json.dumps({"@context":"https://schema.org","@graph":graph}, ensure_ascii=False)}
  </script>
</head>
<body>
{HEADER}
  <main id="top">
    <section class="page-hero ort-hero">
      <p class="eyebrow"><a href="/ugl/">Kursorter</a> / {esc(namn)}</p>
      <h1>UGL i {esc(namn)}</h1>
      <p class="lead">{esc(lead)}</p>
      <p class="ort-intro">{esc(reg['intro'])}</p>
    </section>

    <section class="section ort-kurser reveal">
      <div class="section-head"><p class="eyebrow">Kommande veckor</p><h2>Kursdatum i {esc(namn)}.</h2></div>
      <ol class="ort-lista">
{kursrader(kommande[:16])}
      </ol>
      {f'<p class="ort-fler">Ytterligare {len(kommande)-16} veckor i {esc(namn)} finns på <a href="/kurser">kursdatumsidan</a>.</p>' if len(kommande) > 16 else ''}
      <p class="ort-not">Priser är per deltagare exklusive moms och inkluderar kursledning, kursmaterial, kost och logi. Uppdaterad {IDAG.day} {MAN[IDAG.month-1]} {IDAG.year}.</p>
      <div class="sektion-cta"><p>Besked när nya veckor läggs ut i {esc(namn)}?</p><a class="button" href="/#nyhetsbrev">Få nyhetsbrevet &#8594;</a><a class="text-link" href="/kurser">Alla kursdatum</a></div>
    </section>

    <section class="section ort-gardar reveal">
      <div class="ort-tva">
        <div>
          <p class="eyebrow">Kursgårdar</p>
          <h2>Här hålls UGL i {esc(namn)}.</h2>
          <ul class="ort-anlaggningar">
{anl_html}
          </ul>
        </div>
        <div>
          {VAD_AR}
        </div>
      </div>
    </section>

    <section class="section facts ort-fakta reveal">
      <div class="section-head"><p class="eyebrow">Fakta</p><h2>Samma ramar överallt.</h2></div>
      {FAKTA}
      <div class="ort-tva ort-tva-fakta">
        <div>
          <h3>Vanliga frågor</h3>
          {faq(namn)}
        </div>
        <div>
          <h3>Andra kursorter</h3>
          <p class="ort-andra">{andra}</p>
          <p class="ort-andra-not">Alla veckor i landet finns på <a href="/kurser">kursdatumsidan</a>, där de kan filtreras på restid hemifrån.</p>
        </div>
      </div>
    </section>
  </main>

{FOOTER}</body>
</html>
'''

def oversikt():
    rader = []
    for reg in REGIONER:
        alla = [k for k in kurser if k['ort'] in reg['orter'] and k['start'] >= IDAG]
        lediga = [k for k in alla if k['ledig']]
        nasta = lediga[0] if lediga else None
        anl = len({k['anl'] for k in alla})
        txt = f"{len(alla)} kommande veckor på {anl} {'kursgård' if anl==1 else 'kursgårdar'}." + (f" Nästa lediga: vecka {nasta['vecka']}, {datumtext(nasta)}." if nasta else "")
        rader.append(f'''          <li><a href="/ugl/{reg['slug']}"><b>UGL i {esc(reg['namn'])}</b><span>{esc(txt)}</span></a></li>''')
    graph = [{"@type":"BreadcrumbList","itemListElement":[
                {"@type":"ListItem","position":1,"name":"UGL Sverige","item":BAS+"/"},
                {"@type":"ListItem","position":2,"name":"Kursorter","item":BAS+"/ugl/"}]},
             {"@type":"CollectionPage","url":BAS+"/ugl/","name":"UGL-kurser per ort","inLanguage":"sv-SE","isPartOf":{"@id":BAS+"/#webbplats"}}]
    return f'''<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="UGL-kurser per ort: Stockholm, Göteborg, Helsingborg, Halmstad, Kristianstad, Jönköping och Sundsvall. Kommande veckor, kursgårdar och pris.">
  <title>UGL-kurser per ort: Stockholm, Göteborg, Skåne, Jönköping, Sundsvall | UGL Sverige</title>
  <link rel="canonical" href="{BAS}/ugl/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="sv_SE">
  <meta property="og:site_name" content="UGL Sverige">
  <meta property="og:title" content="UGL-kurser per ort | UGL Sverige">
  <meta property="og:description" content="Kommande UGL-veckor per ort med kursgårdar, datum och pris.">
  <meta property="og:url" content="{BAS}/ugl/">
  <meta property="og:image" content="{BAS}/assets/ugl-hero.webp">
  <meta name="twitter:card" content="summary_large_image">
{HEAD_FONTS}  <script type="application/ld+json">
  {json.dumps({"@context":"https://schema.org","@graph":graph}, ensure_ascii=False)}
  </script>
</head>
<body>
{HEADER}
  <main id="top">
    <section class="page-hero ort-hero">
      <p class="eyebrow">Kursorter</p>
      <h1>UGL i hela landet.</h1>
      <p class="lead">UGL hålls på kursgårdar över hela landet, alltid med samma ramar och med handledare certifierade av Försvarshögskolan. Välj ort för kommande veckor, kursgårdar och pris.</p>
    </section>
    <section class="section ort-oversikt reveal">
      <ul class="ort-ortlista">
{chr(10).join(rader)}
      </ul>
      <p class="ort-not">Andra orter: alla veckor finns på <a href="/kurser">kursdatumsidan</a>, där de kan filtreras på restid hemifrån. Boende ingår, så avståndet spelar mindre roll än det brukar.</p>
    </section>
  </main>

{FOOTER}</body>
</html>
'''

# ---------- skriv filer
for reg in REGIONER:
    wr(os.path.join(R,'ugl',reg['slug']+'.html'), sida(reg))
wr(os.path.join(R,'ugl','index.html'), oversikt())

# ---------- sitemap
urls = [('/', '1.0', 'weekly'), ('/kurser', '0.9', 'weekly'), ('/ugl/', '0.8', 'weekly')] + [(f"/ugl/{r['slug']}", '0.8', 'weekly') for r in REGIONER] + [('/kommun', '0.6', 'monthly'), ('/offert', '0.4', 'monthly'), ('/portal', '0.5', 'monthly')]
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    f'  <url><loc>{BAS}{u}</loc><lastmod>{IDAG.isoformat()}</lastmod><changefreq>{c}</changefreq><priority>{p}</priority></url>\n' for u,p,c in urls) + '</urlset>\n'
wr(os.path.join(R,'sitemap.xml'), sm)
print('ok', len(REGIONER), 'ortsidor,', sum(1 for k in kurser if k['start']>=IDAG), 'kommande kurser')
