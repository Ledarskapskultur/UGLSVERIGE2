import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Award, Car, Compass, Eye, MessageSquare, Phone, Sparkles, Users, Waves } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import KursKort from './KursKort'
import KursModal from './KursModal'
import Kassa from './Kassa'
import DelaModal from './DelaModal'
import SaGarDetTill from './SaGarDetTill'
import Omdomen, { Stjarnor, snitt } from './Omdomen'
import RingMig, { oppnaRingMig } from './RingMig'
import { BevakningForm } from './Bevakning'
import Kortsektion from './components/Kortsektion'
import { useKurser, useOmdomen, kr } from './kursdata'
import { useBevis } from './bevis'
import { useOrter, kurserNara, restid, type Stad } from './orter'
import { MAX_VALDA } from './forfragan'
import { spara } from './spar'

// Mastersida for alla landningssidor per ort: /ugl/<stad>. Allt utom hero och kurslistan ar gemensamt.
// Kurserna valjs efter avstand fran staden, sa "UGL Vasteras" visar veckorna i Stockholmsomradet med restid.

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }
const BAS = 'https://www.uglsverige.store/assets/'
const HERO_VIDEO = BAS + 'hero-3247036.mp4'
const HERO_BILD = BAS + 'ugl-grupp.webp'
const BILD_CTA = BAS + 'ugl-feedback.webp'
const BILD_PROBLEM = BAS + 'ugl-oppenhet.webp'
const NARA_KM = 220 // veckor inom det har avstandet raknas som "nara"

const PROBLEM = [
  { title: 'Gruppen fungerar, men inte fullt ut', description: 'Möten som går på rutin, beslut som fattas utan att någon riktigt står bakom dem och konflikter som ligger kvar under ytan. Det kostar tid varje vecka, och energi hos alla inblandade.', image: BAS + 'ugl-samtal.webp' },
  { title: 'Du leder utan att veta hur du uppfattas', description: 'Feedback på riktigt är sällsynt på en arbetsplats. De flesta ledare får aldrig veta vad andra ser, och fortsätter därför göra samma sak år efter år.', image: BAS + 'ugl-feedback.webp' },
  { title: 'Kurser som inte fastnar', description: 'En dag med modeller och teori glöms bort på vägen hem. Beteenden ändras inte av att man hört om dem, utan av att man prövat dem och fått gensvar.', image: BAS + 'ugl-tid.webp' },
]
const VARDE = [
  { i: Eye, t: 'Se dig själv som andra ser dig', d: 'Fem dagar av ärlig återkoppling från människor som inte har något att förlora på att säga som det är.' },
  { i: Users, t: 'Förstå vad som händer i en grupp', d: 'Du lär dig läsa var gruppen befinner sig och vad den behöver av dig just då, i stället för att gissa.' },
  { i: MessageSquare, t: 'Feedback som går att använda', d: 'Att ge och ta emot återkoppling utan att gå i försvar. Det är den färdighet deltagare oftast säger förändrat mest.' },
  { i: Waves, t: 'Gå in i konflikter, inte runt dem', d: 'Träning i att ta upp det som skaver medan det fortfarande handlar om sak, inte person.' },
  { i: Compass, t: 'Ett ledarskap som är ditt', d: 'Kursen bygger på Försvarshögskolans ledarskapsmodell, men det du tar med hem är din egen utvecklingsplan.' },
  { i: Award, t: 'Sveriges mest använda ledarskapsutbildning', d: 'UGL har funnits sedan 1981, ägs av Försvarshögskolan och har utvärderats av Karolinska Institutet. Alla handledare är certifierade.' },
]
const FAQ = (stad: string) => [
  { q: `Finns UGL i ${stad}?`, a: `UGL hålls på kursgård med internat, så veckorna ligger där kursgårdarna finns. På den här sidan visas de veckor som ligger närmast ${stad}, med uppskattad restid med bil. De flesta deltagare reser dit på måndag morgon och hem på fredag eftermiddag.` },
  { q: 'Måste man bo på kursgården?', a: 'Ja. Kvällarna är en del av veckan, och gruppen behöver vara samlad. Boende och alla måltider ingår i priset.' },
  { q: 'Kan jag gå tillsammans med en kollega?', a: 'Inte samma vecka. Gruppen ska vara en främlingsgrupp där ingen känner någon sedan tidigare, det är det som gör öppenheten möjlig. Går ni var sin vecka har ni varandra att bolla med efteråt.' },
  { q: 'Vad kostar det och vad ingår?', a: 'Priset står vid varje vecka och är per deltagare exklusive moms. Kursledning med två handledare, kursmaterial, boende fyra nätter och alla måltider ingår. Resa tillkommer. Betalning mot faktura när platsen är bekräftad.' },
  { q: 'Hur bokar jag, och när blir det bindande?', a: 'Boka plats på den vecka som passar, så ringer vi inom två arbetsdagar och stämmer av. Platsen är bindande först när vi bekräftat den. Vill du hålla flera veckor öppna kan du anmäla intresse i stället.' },
  { q: 'Finns det någon sista anmälningsdag?', a: 'Nej. Det går att boka fram till dagen före kursstart, så länge det finns platser kvar. Veckorna fylls i den ordning anmälningarna kommer in.' },
]

function stadFranUrl(stader: Stad[]): Stad | null {
  const q = new URLSearchParams(location.search).get('stad')
  const del = q || location.pathname.replace(/\/+$/, '').split('/').pop() || ''
  if (!del || del === 'ugl' || del === 'index.html') return null
  return stader.find((s) => s.slug === del) ?? null
}

export default function OrtPage() {
  const orter = useOrter()
  const { kurser, fel } = useKurser()
  const omdomen = useOmdomen()
  const bevis = useBevis()
  const stad = useMemo(() => (orter ? stadFranUrl(orter.stader) : null), [orter])

  const [valda, setValda] = useState<string[]>([])
  const [visa, setVisa] = useState<string | null>(null)
  const [dela, setDela] = useState<null | 'chef' | 'tips'>(null)
  const [kassa, setKassa] = useState(false)
  const [oppnaIntresse, setOppnaIntresse] = useState(0)
  const [oppnaVal, setOppnaVal] = useState(0)
  const [oppnaBoka, setOppnaBoka] = useState(0)
  const [bokaVal, setBokaVal] = useState<string | null>(null)
  const [visade, setVisade] = useState(6)

  const nara = useMemo(() => {
    if (!kurser || !stad || !orter) return []
    const alla = kurserNara(kurser.filter((k) => k.ledig), stad, orter.kursorter)
    const inom = alla.filter((x) => x.km <= NARA_KM)
    // Minst sex veckor visas alltid, aven om staden ligger langt fran narmaste kursgard.
    return (inom.length >= 6 ? inom : alla.slice(0, Math.max(6, inom.length))).sort((a, b) => a.k.start.getTime() - b.k.start.getTime() || a.km - b.km)
  }, [kurser, stad, orter])
  const kursorterNara = useMemo(() => {
    const m = new Map<string, number>()
    for (const { k, km } of nara) if (!m.has(k.ort) || m.get(k.ort)! > km) m.set(k.ort, km)
    return [...m.entries()].sort((a, b) => a[1] - b[1])
  }, [nara])
  const nasta = nara[0]
  const fran = nara.length ? Math.min(...nara.filter((x) => x.k.total).map((x) => x.k.total)) : 0

  // Titel och beskrivning per stad, for sokmotorer och delning.
  useEffect(() => {
    if (!stad) return
    document.title = `UGL i ${stad.namn}: kursdatum, restid och bokning | UGL Sverige`
    const d = `UGL, Utveckling av grupp och ledare, nära ${stad.namn}: ${nara.length} kommande veckor med restid, pris och bokning. Boka plats eller anmäl intresse.`
    for (const sel of ['meta[name="description"]', 'meta[property="og:description"]']) document.querySelector(sel)?.setAttribute('content', d)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://www.uglsverige.store/ugl/${stad.slug}`)
    spara('ortsida', { stad: stad.slug })
  }, [stad, nara.length])

  const betygFor = (anlaggning: string) => { const o = omdomen.filter((x) => !x.anlaggning || x.anlaggning === anlaggning); return o.length ? { snitt: snitt(o), antal: o.length } : null }
  const valdaKurser = (kurser || []).filter((k) => valda.includes(k.id))
  const toggle = (id: string) => setValda((v) => (v.includes(id) ? v.filter((x) => x !== id) : v.length >= MAX_VALDA ? v : [...v, id]))
  const fullt = valda.length >= MAX_VALDA
  const lagg = (id: string) => setValda((v) => (v.includes(id) || v.length >= MAX_VALDA ? v : [...v, id]))
  const boka = (id: string) => { spara('boka_klick', { id, stad: stad?.slug ?? '' }); lagg(id); setBokaVal(id); setOppnaBoka((n) => n + 1); if (window.innerWidth < 1024) setKassa(true) }
  const intresse = (id: string) => { spara('intresse_klick', { id, stad: stad?.slug ?? '' }); lagg(id); setOppnaVal((n) => n + 1); if (window.innerWidth < 1024) setKassa(true) }
  const tillLista = () => document.getElementById('veckor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const kassaProps = { valda: valdaKurser, toggle, oppnaIntresse, oppnaVal, oppnaBoka, bokaVal, omdomen, svarar: bevis.svarar, onTipsa: (f?: 'chef' | 'tips') => { spara('tipsa_klick', { flik: f ?? 'chef' }); setKassa(false); setDela(f ?? 'chef') } }

  // Oversikten /ugl: alla stader som lankar, grupperade pa forsta bokstav.
  if (orter && !stad) {
    const grupper = new Map<string, Stad[]>()
    for (const s of [...orter.stader].sort((a, b) => a.namn.localeCompare(b.namn, 'sv'))) { const b = s.namn[0].toUpperCase(); grupper.set(b, [...(grupper.get(b) ?? []), s]) }
    return (
      <>
        <section className="relative bg-[#2B2724] mb-[-25px]"><Navbar />
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-20 md:pb-28">
            <p className="text-[#F6E4CF]/70 text-xs uppercase tracking-[0.25em] font-medium mb-5">Kursorter</p>
            <h1 className="text-5xl md:text-7xl text-white leading-[1.05] tracking-tight">UGL nära <em className="not-italic" style={EM}>dig.</em></h1>
            <p className="mt-6 text-white/80 text-base md:text-lg max-w-[52ch] leading-[1.5]">Välj din ort, så visar vi kursveckorna som ligger närmast, med restid, pris och bokning. Kurserna hålls på kursgård med internat i Stockholmsområdet, Göteborg, Halland, Skåne, Jönköping och Sundsvall.</p>
          </div>
        </section>
        <section className="relative z-10 bg-[#FFF9F2] rounded-t-[25px] py-16 md:py-24 px-6 -mt-[25px]">
          <div className="max-w-6xl mx-auto columns-2 sm:columns-3 lg:columns-5 gap-8">
            {[...grupper.entries()].map(([b, lista]) => (
              <div key={b} className="break-inside-avoid mb-6">
                <p className="text-[#321C04]/50 text-[11px] uppercase tracking-[0.25em] font-medium mb-2">{b}</p>
                <ul className="space-y-1">{lista.map((s) => <li key={s.slug}><a href={`/ugl/${s.slug}`} className="text-[#321C04] text-[15px] hover:underline underline-offset-4">{s.namn}</a></li>)}</ul>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </>
    )
  }

  if (!orter || !kurser || !stad) {
    return (
      <>
        <section className="relative bg-[#2B2724] min-h-[60vh]"><Navbar />
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-20 text-white/80">
            {orter && !stad ? <><h1 className="text-4xl text-white">Orten finns inte i listan ännu.</h1><p className="mt-4">Se alla orter på <a href="/ugl" className="underline">uglsverige.store/ugl</a> eller alla kursdatum på <a href="/kurser" className="underline">/kurser</a>.</p></> : fel ? 'Kursdatumen kunde inte hämtas just nu.' : 'Hämtar…'}
          </div>
        </section>
        <Footer />
      </>
    )
  }

  const tal = bevis.nyckeltal.length ? bevis.nyckeltal : omdomen.length >= 3 ? [
    { tal: snitt(omdomen).toFixed(1).replace('.', ','), text: 'i snittbetyg av 5' },
    { tal: String(omdomen.length), text: 'omdömen från deltagare' },
    { tal: Math.round((omdomen.filter((o) => o.betyg >= 4).length / omdomen.length) * 100) + ' %', text: 'rekommenderar kursen' },
  ] : []
  const label = 'text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5'

  return (
    <>
      {/* 1. Hero: det enda som skiljer sig mellan orterna, tillsammans med kurslistan */}
      <section id="top" className="relative min-h-[92vh] overflow-hidden mb-[-25px] bg-[#2B2724] flex flex-col">
        <video src={HERO_VIDEO} poster={HERO_BILD} autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.66) contrast(1.18) saturate(1.05) sepia(0.18)' }} />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 40%, rgba(43,39,36,0) 40%, rgba(43,39,36,0.55) 100%), linear-gradient(180deg, rgba(43,39,36,0.25) 0%, rgba(43,39,36,0.3) 55%, rgba(43,39,36,0.8) 100%)' }} />
        <Navbar />
        <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 pt-40 pb-14 md:pb-20 grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 items-end">
          <div>
            <p className="text-[#F6E4CF]/70 text-xs uppercase tracking-[0.25em] font-medium mb-5">Kursorter · {stad.namn}</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] tracking-tight">UGL i <em className="not-italic" style={EM}>{stad.namn}.</em></h1>
            <p className="mt-6 text-white/85 text-base md:text-lg max-w-[50ch] leading-[1.5]">
              Fem dagar som förändrar hur du leder och hur du fungerar i grupp, utan att du behöver lämna vardagen i mer än en vecka.
              {nasta ? <> Närmaste vecka med lediga platser: <strong className="font-medium text-white">vecka {nasta.k.vecka}</strong> på {nasta.k.anlaggning}, {restid(nasta.km)} från {stad.namn}.</> : null}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={tillLista} className="inline-flex items-center gap-2 bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-6 py-3.5 rounded-xl hover:bg-[#FFF9F2] transition-colors">Se veckorna nära {stad.namn} <ArrowRight size={16} /></button>
              <button type="button" onClick={oppnaRingMig} className="inline-flex items-center gap-2 border border-white/40 text-white text-sm font-medium px-6 py-3.5 rounded-xl hover:bg-white/10 transition-colors"><Phone size={15} /> Vi ringer upp dig</button>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-3 lg:gap-4">
            {[
              { tal: String(nara.length), text: nara.length === 1 ? 'vecka nära dig' : 'veckor nära dig' },
              { tal: nasta ? restid(nasta.km).replace('ca ', '') : '–', text: 'till närmaste vecka' },
              { tal: fran ? kr(fran).replace(' kr', '') : '–', text: 'kr, pris från, exkl. moms' },
            ].map((n) => <li key={n.text} className="rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 px-4 py-4"><span className="block text-2xl md:text-3xl text-white leading-none tracking-tight" style={EM}>{n.tal}</span><span className="block mt-1.5 text-[11px] uppercase tracking-[0.14em] text-[#F6E4CF]/70 leading-tight">{n.text}</span></li>)}
          </ul>
        </div>
      </section>

      {/* 2. Bevis */}
      <section className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-14 md:py-20 px-6 -mt-[25px]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-center">
            <div>
              <p className={label}>Deltagarna</p>
              <h2 className="text-[#321C04] text-3xl md:text-[40px] leading-[1.08] tracking-tight max-w-[16ch]">Sveriges mest använda ledarskapsutbildning, <em className="not-italic" style={EM}>sedan 1981.</em></h2>
            </div>
            <div>
              {tal.length > 0 && (
                <ul className="grid grid-cols-3 gap-4 mb-6">
                  {tal.map((n) => <li key={n.text}><span className="block text-3xl md:text-4xl text-[#321C04] leading-none tracking-tight" style={EM}>{n.tal}</span><span className="block mt-1.5 text-[12px] uppercase tracking-[0.14em] text-[#321C04]/60">{n.text}</span></li>)}
                </ul>
              )}
              {omdomen.length > 0 ? (
                <ul className="grid sm:grid-cols-2 gap-4">
                  {omdomen.filter((o) => o.text).slice(0, 2).map((o, i) => (
                    <li key={i} className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-2xl p-5"><Stjarnor betyg={o.betyg} className="text-[#9C7A4A]" size={13} /><p className="mt-3 text-[#321C04] text-[16px] leading-[1.45]" style={EM}>”{o.text}”</p><p className="mt-3 text-[13px] text-[#321C04]">{o.namn}<span className="text-[#321C04]/60">{o.roll ? ', ' + o.roll : ''}</span></p></li>
                  ))}
                </ul>
              ) : (
                <ul className="grid sm:grid-cols-3 gap-4 text-[14px] text-[#321C04]/80 leading-[1.5]">
                  <li className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-2xl p-5"><strong className="block text-[#321C04] mb-1">Försvarshögskolan</strong>Äger konceptet och certifierar alla handledare.</li>
                  <li className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-2xl p-5"><strong className="block text-[#321C04] mb-1">Karolinska Institutet</strong>Har utvärderat kursens effekt på deltagarna.</li>
                  <li className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-2xl p-5"><strong className="block text-[#321C04] mb-1">8 till 12 deltagare</strong>Två handledare per grupp, fem sammanhängande dagar.</li>
                </ul>
              )}
              {bevis.kunder.length > 0 && <p className="mt-5 text-[13px] text-[#321C04]/70"><span className="uppercase tracking-[0.18em] text-[11px] font-medium text-[#321C04]/55 mr-3">Deltagare från</span>{bevis.kunder.join(' · ')}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problemet, i samma design som "Vad veckan ger" pa startsidan */}
      <Kortsektion
        rundad
        eyebrow="01. Känner du igen dig?"
        heading={<>Det som kostar mest syns <em className="not-italic" style={EM}>sällan.</em></>}
        items={PROBLEM}
        bild={BILD_PROBLEM}
        fot={`Ett team på halvfart kostar en arbetsdag i veckan. Det är därför arbetsgivare i ${stad.namn} skickar sina ledare på UGL.`}
        cta={`Se veckorna nära ${stad.namn}`}
        ctaOnClick={tillLista}
      />

      {/* 4. Lösningen, ljus mellan två mörka */}
      <section className="relative z-10 bg-[#FFF9F2] rounded-t-[25px] py-20 md:py-28 px-6 -mt-[25px]">
        <div className="max-w-6xl mx-auto">
          <p className={label}>02. Vad UGL ger</p>
          <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight max-w-[22ch]">Fem dagar på kursgård. Ett ledarskap som håller <em className="not-italic" style={EM}>i flera år.</em></h2>
          <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {VARDE.map((v) => <li key={v.t} className="flex gap-4"><span className="w-11 h-11 rounded-xl bg-[#F6E4CF] border border-[#D9C4AA] flex items-center justify-center shrink-0 text-[#321C04]"><v.i size={20} strokeWidth={1.6} /></span><div><h3 className="text-[#321C04] text-[18px] leading-tight tracking-tight">{v.t}</h3><p className="mt-2 text-[#321C04]/70 text-[14px] leading-[1.5]">{v.d}</p></div></li>)}
          </ul>
        </div>
      </section>

      {/* 5. Veckorna nära orten: den andra ortspecifika delen */}
      <section id="veckor" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-28 px-6 -mt-[25px] scroll-mt-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-10 lg:gap-20 items-start mb-10">
            <div>
              <p className={label}>03. Kursveckor nära {stad.namn}</p>
              <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight max-w-[14ch]">Välj din <em className="not-italic" style={EM}>vecka.</em></h2>
            </div>
            <div>
              <p className="text-[#321C04]/75 text-base leading-[1.5] max-w-[52ch]"><strong className="font-medium text-[#321C04]">Boka plats</strong> när du vet vilken vecka. <strong className="font-medium text-[#321C04]">Anmäl intresse</strong> om du vill hålla flera veckor öppna. Inget är bindande förrän vi har bekräftat, och det går att boka fram till dagen före kursstart.</p>
              {kursorterNara.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {kursorterNara.map(([ort, km]) => <li key={ort} className="inline-flex items-center gap-1.5 text-[13px] text-[#321C04] bg-[#FFF9F2] border border-[#D9C4AA] rounded-full px-3 py-1.5"><Car size={13} className="text-[#9C7A4A]" /> {ort} · {restid(km)}</li>)}
                </ul>
              )}
            </div>
          </div>
          <div className="lg:grid lg:gap-x-6 lg:items-start transition-[grid-template-columns] duration-300" style={{ gridTemplateColumns: valda.length ? 'minmax(0,1fr) 340px' : 'minmax(0,1fr) 0px' }}>
            <div className="flex flex-col gap-4 md:gap-5">
              {nara.slice(0, visade).map(({ k, km }, i) => (
                <div key={k.id}>
                  <KursKort k={k} vald={valda.includes(k.id)} fullt={fullt} kompakt={valda.length > 0} onToggle={() => toggle(k.id)} onIntresse={() => intresse(k.id)} onBoka={() => boka(k.id)} onVisa={() => { spara('se_kursen', { id: k.id }); setVisa(k.id) }} betyg={betygFor(k.anlaggning)} badge={i === 0 ? 'Närmast i tiden' : km < 30 ? 'Närmast dig' : null} />
                  <p className="mt-1.5 ml-1 text-[12px] text-[#321C04]/60 inline-flex items-center gap-1.5"><Car size={12} /> {restid(km)} från {stad.namn}</p>
                </div>
              ))}
              {nara.length === 0 && <p className="text-[#321C04]/80">Inga lediga veckor just nu. Bevaka orten nedan, så mejlar vi när nya veckor släpps.</p>}
              {nara.length > visade && <button type="button" onClick={() => setVisade((v) => v + 6)} className="self-start inline-flex items-center gap-2 border border-[#321C04]/40 text-[#321C04] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#321C04] hover:text-[#FFF9F2] transition-colors">Visa fler veckor <ArrowRight size={16} /></button>}
              <a href="/kurser" className="self-start text-sm text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4">Alla kursdatum i hela landet</a>
            </div>
            <aside className={`hidden lg:block lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto no-scrollbar transition-opacity duration-300 ${valda.length ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={valda.length === 0}>
              <Kassa {...kassaProps} onAndra={tillLista} />
            </aside>
          </div>
        </div>
      </section>

      {/* 6. Så går det till */}
      <SaGarDetTill antal={valda.length} onVidare={() => { setOppnaIntresse((n) => n + 1); if (window.innerWidth < 1024) setKassa(true); else tillLista() }} />

      {/* 7. Frågor */}
      <section className="relative z-10 bg-[#FFF9F2] rounded-t-[25px] py-20 md:py-28 px-6 -mt-[25px]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-12 lg:gap-24 items-start">
          <div>
            <p className={label}>04. Vanliga frågor</p>
            <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight max-w-[14ch]">Bra att veta innan du <em className="not-italic" style={EM}>bokar.</em></h2>
            <button type="button" onClick={oppnaRingMig} className="mt-8 inline-flex items-center gap-2 border border-[#321C04]/40 text-[#321C04] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#321C04] hover:text-[#FFF9F2] transition-colors"><Phone size={15} /> Hellre prata? Vi ringer upp dig</button>
          </div>
          <ul className="border-t border-[#321C04]/15">
            {FAQ(stad.namn).map((f) => <li key={f.q} className="border-b border-[#321C04]/15 py-6"><p className="text-[#321C04] text-lg md:text-[20px] tracking-tight">{f.q}</p><p className="mt-3 text-[#321C04]/80 text-[15px] md:text-base leading-[1.5] max-w-[58ch]">{f.a}</p></li>)}
          </ul>
        </div>
      </section>

      {omdomen.length > 2 && <Omdomen omdomen={omdomen} />}

      {/* 8. Sista uppmaningen */}
      <section className="relative z-10 bg-[#2B2724] rounded-t-[25px] py-20 md:py-28 px-6 -mt-[25px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BILD_CTA}")` }} />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(43,39,36,0.86) 0%, rgba(43,39,36,0.76) 45%, rgba(43,39,36,0.66) 100%)' }} />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[#F6E4CF]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">Nästa steg</p>
            <h2 className="text-[#FFF9F2] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight max-w-[16ch]">Din vecka nära {stad.namn} <em className="not-italic" style={EM}>väntar.</em></h2>
            <p className="mt-6 text-[#F6E4CF]/75 text-base leading-[1.5] max-w-[44ch]">{nasta ? `Nästa lediga vecka är vecka ${nasta.k.vecka}, ${nasta.k.period}, på ${nasta.k.anlaggning}. ` : ''}Boka plats så ringer vi och stämmer av. Inget är bindande förrän du fått bekräftelsen.</p>
            <button type="button" onClick={tillLista} className="mt-8 inline-flex items-center gap-2 bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-6 py-3.5 rounded-xl hover:bg-[#FFF9F2] transition-colors">Boka plats eller anmäl intresse <ArrowRight size={16} /></button>
          </div>
          <div className="rounded-3xl border border-[#F6E4CF]/15 bg-[#2B2724]/70 backdrop-blur-md p-6 md:p-8">
            <p className="text-[#F6E4CF]/60 text-[11px] uppercase tracking-[0.25em] font-medium mb-2 inline-flex items-center gap-2"><Sparkles size={12} /> Inte rätt vecka ännu?</p>
            <h3 className="text-[#FFF9F2] text-[26px] leading-[1.1] tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>Få nya veckor nära {stad.namn} till mejlen.</h3>
            <BevakningForm kanal={'ort-' + stad.slug} morkt />
          </div>
        </div>
      </section>

      <Footer />

      {/* Kassa på mobil */}
      {valda.length > 0 && !kassa && (
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 flex justify-center">
          <button type="button" onClick={() => setKassa(true)} className="inline-flex items-center gap-3 bg-[#2B2724] text-[#FFF9F2] text-sm font-medium pl-5 pr-4 py-3 rounded-full shadow-[0_8px_30px_rgba(43,39,36,0.35)]"><span className="text-[#F6E4CF]/70 text-xs uppercase tracking-[0.2em]">{valda.length} av {MAX_VALDA}</span>Valda veckor <ArrowRight size={15} /></button>
        </div>
      )}
      {kassa && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#2B2724]/70 backdrop-blur-sm" onClick={() => setKassa(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto p-3"><Kassa {...kassaProps} onClose={() => setKassa(false)} onAndra={() => setKassa(false)} /></div>
        </div>
      )}
      {visa && (() => { const k = kurser.find((x) => x.id === visa); return k ? <KursModal k={k} vald={valda.includes(k.id)} fullt={fullt} betyg={betygFor(k.anlaggning)} onToggle={() => toggle(k.id)} onIntresse={() => { setVisa(null); intresse(k.id) }} onBoka={() => { setVisa(null); boka(k.id) }} onTipsa={() => { setVisa(null); if (!valda.includes(k.id) && !fullt) toggle(k.id); setDela('chef') }} onClose={() => setVisa(null)} /> : null })()}
      {dela && <DelaModal flik={dela} setFlik={setDela} valda={valdaKurser} onClose={() => setDela(null)} />}
      <RingMig valda={valdaKurser} />
    </>
  )
}
