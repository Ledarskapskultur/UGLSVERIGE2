import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, Calendar, ChevronDown, MapPin, Navigation, Phone, Search, SlidersHorizontal, X } from 'lucide-react'
import KursKort from './KursKort'
import DelaModal from './DelaModal'
import SaGarDetTill from './SaGarDetTill'
import Omdomen, { snitt } from './Omdomen'
import KursModal from './KursModal'
import { lasVia } from './delning'
import { SAMTAL } from './Kassa'
import Kassa from './Kassa'
import { MAX_VALDA } from './forfragan'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useKurser, useOmdomen } from './kursdata'

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }
const HERO_IMAGE = 'https://www.uglsverige.store/assets/ugl-grupp.webp'
const MANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december']
const manadId = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const PERIODER = [
  { id: '3', label: 'Inom 3 månader', kort: '1 till 3 mån', min: 0, max: 3 },
  { id: '6', label: '4 till 6 månader', kort: '4 till 6 mån', min: 4, max: 6 },
  { id: '12', label: '7 till 12 månader', kort: '7 till 12 mån', min: 7, max: 12 },
  { id: '99', label: 'Längre fram', kort: 'Längre fram', min: 13, max: 999 },
]
function manaderFram(d: Date) {
  const nu = new Date()
  const m = (d.getFullYear() - nu.getFullYear()) * 12 + d.getMonth() - nu.getMonth()
  return d.getDate() >= nu.getDate() ? m : m - 1
}
const flabel = 'block text-[#321C04]/60 text-[11px] uppercase tracking-[0.2em] font-medium mb-2'
const fselect = 'w-full bg-white border border-[#D9C4AA] rounded-xl px-3 py-2.5 text-[15px] text-[#321C04] focus:outline-none focus:border-[#321C04]'
const chipS = (on: boolean) =>
  `px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
    on ? 'bg-[#321C04] text-[#FFF9F2] border-[#321C04]' : 'text-[#321C04] border-[#321C04]/25 hover:border-[#321C04]/60'
  }`
const FAQ = [
  { q: 'Vad ingår i priset?', a: 'Kursledning med två handledare, kursmaterial och dokumentation samt kost och logi under veckan. Resa till och från kursgården tillkommer. Alla priser är exklusive moms.' },
  { q: 'Kan flera från samma arbetsplats gå?', a: 'Inte på samma vecka. Gruppen ska vara en främlingsgrupp, och det är en förutsättning för öppenheten. För en hel organisation är en egen kurs rätt väg.' },
  { q: 'Hur fungerar betalning och avbokning?', a: 'Betalning sker mot faktura efter bekräftad plats. Vid förhinder, hör av er så snart det går. Villkoren står i bekräftelsen.' },
]


function Pill({ icon, label, aktiv, children }: { icon: ReactNode; label: string; aktiv: boolean; children: ReactNode }) {
  return (
    <div className={`relative inline-flex items-center gap-2.5 text-[15px] font-medium px-5 py-3 rounded-2xl border transition-colors ${aktiv ? 'bg-[#321C04] text-[#FFF9F2] border-[#321C04]' : 'bg-white text-[#321C04] border-[#D9C4AA] hover:border-[#321C04]'}`}>
      {icon}
      <span>{label}</span>
      <ChevronDown size={16} className="opacity-70" />
      {children}
    </div>
  )
}

export default function KurserPage() {
  const { kurser, fel } = useKurser()
  const omdomen = useOmdomen()
  const [oppnaIntresse, setOppnaIntresse] = useState(0)
  const [visa, setVisa] = useState<string | null>(null)
  const betygFor = (anlaggning: string) => {
    const o = omdomen.filter((x) => !x.anlaggning || x.anlaggning === anlaggning)
    return o.length ? { snitt: snitt(o), antal: o.length } : null
  }
  const intresse = (id: string) => {
    setValda((v) => (v.includes(id) || v.length >= MAX_VALDA ? v : [...v, id]))
    setOppnaIntresse((n) => n + 1)
    if (window.innerWidth < 1024) setKassa(true)
  }
  const [sok, setSok] = useState('')
  const [period, setPeriod] = useState('')
  const [manad, setManad] = useState('')
  const [visaManad, setVisaManad] = useState(false)
  const [region, setRegion] = useState('')
  const [ort, setOrt] = useState('')
  const [pris, setPris] = useState('')
  const [baraLediga, setBaraLediga] = useState(true)
  const [sort, setSort] = useState<'datum' | 'pris' | 'ort'>('datum')
  const [snabbAktiv, setSnabbAktiv] = useState<string | null>(null)
  const [visade, setVisade] = useState(6)
  const [valda, setValda] = useState<string[]>([])
  const [tips, setTips] = useState<{ av: string | null; veckor: string[] } | null>(null)
  useEffect(() => {
    if (!kurser) return
    const { av, valda: nycklar } = lasVia()
    if (!nycklar.length && !av) return
    const traff = kurser.filter((k) => nycklar.includes(k.nyckel))
    setTips({ av, veckor: traff.map((k) => k.id) })
    if (traff.length && !av) setValda(traff.slice(0, MAX_VALDA).map((k) => k.id))
    if (!traff.length && !av) return
    setBaraLediga(false)
    setTimeout(() => document.getElementById('kurslista')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
  }, [kurser])
  const [dela, setDela] = useState<null | 'chef' | 'tips'>(null)
  const [kassa, setKassa] = useState(false)

  const regioner = useMemo(() => (kurser ? [...new Set(kurser.map((k) => k.region))].sort((a, b) => a.localeCompare(b, 'sv')) : []), [kurser])
  const orter = useMemo(() => (kurser ? [...new Set(kurser.map((k) => k.ort))].sort((a, b) => a.localeCompare(b, 'sv')) : []), [kurser])
  const manader = useMemo(() => {
    if (!kurser) return []
    const idag = new Date(); idag.setHours(0, 0, 0, 0)
    const ids = [...new Set(kurser.filter((k) => k.start >= idag).map((k) => manadId(k.start)))]
    return ids.map((id) => { const d = new Date(id + '-01T00:00:00'); return { id, label: MANADER[d.getMonth()] + ' ' + d.getFullYear() } })
  }, [kurser])
  const filtrerat = !!(sok || period || manad || region || ort || pris || !baraLediga || snabbAktiv)
  const rensa = () => { setSok(''); setPeriod(''); setManad(''); setRegion(''); setOrt(''); setPris(''); setBaraLediga(true); setSnabbAktiv(null); setVisade(6) }
  const snabb = (q: string) => {
    const av = snabbAktiv === q
    setSnabbAktiv(av ? null : q); setRegion(''); setManad(''); setPeriod(''); setVisade(6)
    if (!av) { if (q === 'snart') setPeriod('3'); else setRegion(q) }
  }

  const lista = useMemo(() => {
    if (!kurser) return []
    const idag = new Date()
    idag.setHours(0, 0, 0, 0)
    let f = kurser.filter((k) => k.start >= idag)
    if (manad) f = f.filter((k) => manadId(k.start) === manad)
    else if (period) { const p = PERIODER.find((x) => x.id === period)!; f = f.filter((k) => { const m = manaderFram(k.start); return m >= p.min && m <= p.max }) }
    if (region) f = f.filter((k) => k.region === region)
    if (ort) f = f.filter((k) => k.ort === ort)
    if (sok.trim()) { const q = sok.trim().toLowerCase(); f = f.filter((k) => [k.ort, k.anlaggning, k.region, ...k.handledare, 'vecka ' + k.vecka].some((t) => t.toLowerCase().includes(q))) }
    if (pris) f = f.filter((k) => k.total && k.total < +pris)
    if (baraLediga) f = f.filter((k) => k.ledig)
    if (sort === 'pris') f = [...f].sort((a, b) => (a.total || 1e9) - (b.total || 1e9))
    else if (sort === 'ort') f = [...f].sort((a, b) => a.ort.localeCompare(b.ort, 'sv') || a.start.getTime() - b.start.getTime())
    return f
  }, [kurser, sok, period, manad, region, ort, pris, baraLediga, sort])

  const billigast = useMemo(() => lista.filter((k) => k.total).sort((a, b) => a.total - b.total)[0]?.id ?? null, [lista])
  const valdaKurser = (kurser || []).filter((k) => valda.includes(k.id))
  const toggle = (id: string) => setValda((v) => (v.includes(id) ? v.filter((x) => x !== id) : v.length >= MAX_VALDA ? v : [...v, id]))
  const fullt = valda.length >= MAX_VALDA

  return (
    <>
      {/* Hero */}
      <section id="top" className="relative overflow-hidden mb-[-25px] bg-[#2B2724]">
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${HERO_IMAGE}")` }} />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(43,39,36,0.55) 0%, rgba(43,39,36,0.45) 50%, rgba(43,39,36,0.85) 100%)' }}
        />
        <Navbar />
        <div className="relative z-10 min-h-[62vh] flex flex-col justify-end items-center px-6 pb-12 md:pb-16 pt-40 gap-6 text-center">
          <p className="text-[#F6E4CF]/70 text-xs uppercase tracking-[0.25em] font-medium">Öppna kurser</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal text-white leading-[1.05] tracking-tight">
            Kursdatum och{' '}
            <em className="not-italic" style={EM}>
              bokning.
            </em>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-[520px]">
            Fem sammanhängande dagar på kursgård, 8 till 12 deltagare och två handledare certifierade av Försvarshögskolan.
            Anmälan är inte bindande förrän den bekräftats.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); document.getElementById('kurslista')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className="mt-2 w-full max-w-[560px] relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#321C04]/50" />
            <input value={sok} onChange={(e) => { setSok(e.target.value); setVisade(6) }} placeholder="Sök ort, kursgård eller handledare" aria-label="Sök kurs" className="w-full bg-white text-[#321C04] placeholder:text-[#321C04]/50 rounded-2xl pl-12 pr-5 py-4 text-base shadow-[0_10px_40px_rgba(43,39,36,0.35)] focus:outline-none focus:ring-2 focus:ring-[#F6E4CF]" />
          </form>
          <a href={SAMTAL} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm underline underline-offset-4 decoration-white/40"><Phone size={14} /> Vill du hellre prata? Boka ett kort samtal</a>
        </div>

        {/* Filterrad */}
        <div className="relative z-10 bg-[#F6E4CF]/95 backdrop-blur px-6 pt-6 pb-14">
          <div className="max-w-6xl mx-auto">
            <p className="text-[#321C04] text-sm font-medium mb-3">Filtrera efter</p>
            <div className="flex flex-wrap gap-3">
              <Pill icon={<Calendar size={16} />} aktiv={!!(period || manad)} label={manad ? manader.find((m) => m.id === manad)?.label ?? 'När' : period ? PERIODER.find((p) => p.id === period)!.label : 'När vill du gå?'}>
                <select value={manad ? 'm:' + manad : period} onChange={(e) => { const v = e.target.value; if (v.startsWith('m:')) { setManad(v.slice(2)); setPeriod('') } else { setPeriod(v); setManad('') } setVisade(6) }} aria-label="När vill du gå" className="absolute inset-0 opacity-0 cursor-pointer w-full">
                  <option value="">Alla datum</option>
                  {PERIODER.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  <optgroup label="Exakt månad">
                    {manader.map((m) => <option key={m.id} value={'m:' + m.id}>{m.label}</option>)}
                  </optgroup>
                </select>
              </Pill>
              <Pill icon={<MapPin size={16} />} aktiv={!!region} label={region || 'Region'}>
                <select value={region} onChange={(e) => { setRegion(e.target.value); setVisade(6) }} aria-label="Region" className="absolute inset-0 opacity-0 cursor-pointer w-full">
                  <option value="">Alla regioner</option>
                  {regioner.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Pill>
              <Pill icon={<Navigation size={16} />} aktiv={!!ort} label={ort || 'Ort'}>
                <select value={ort} onChange={(e) => { setOrt(e.target.value); setVisade(6) }} aria-label="Ort" className="absolute inset-0 opacity-0 cursor-pointer w-full">
                  <option value="">Alla orter</option>
                  {orter.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Pill>
              <button type="button" onClick={() => document.getElementById('kurslista')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex items-center gap-2 bg-white border border-[#D9C4AA] text-[#321C04] text-[15px] font-medium px-5 py-3 rounded-2xl hover:border-[#321C04] transition-colors">
                <SlidersHorizontal size={16} /> Visa alla filter
              </button>
              {filtrerat && (
                <button type="button" onClick={rensa} className="inline-flex items-center gap-1.5 text-sm text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4 px-2">
                  <X size={13} /> Rensa
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter + lista */}
      <section id="kurser" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] pt-16 md:pt-20 pb-20 md:pb-28 px-6 mb-[-25px]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 md:gap-16 items-start">
            <div>
              <p className="text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">01. Hitta rätt kurs</p>
              <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
                Välj tid och{' '}
                <em className="not-italic" style={EM}>
                  plats.
                </em>
              </h2>
            </div>
            <p className="text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[60ch]">
              De flesta bokar tre till sex månader i förväg, och populära veckor fylls tidigt. Välj när och var, markera upp till tre
              veckor som passar, och gå vidare till anmälan eller tipsa chefen eller en kollega om UGL. De flesta som går UGL har fått kursen
              godkänd av sin chef, och vi skriver förslaget: pris, innehåll och vad veckan ger organisationen.
            </p>
          </div>

          {/* Filter, lista och kassa */}
          <div id="kurslista" className="mt-12 md:mt-16 flex flex-col gap-8 lg:grid lg:gap-x-6 lg:items-start transition-[grid-template-columns,column-gap] duration-300" style={{ gridTemplateColumns: valda.length ? '230px minmax(0,1fr) 340px' : '230px minmax(0,1fr) 0px' }}>
          <aside className="lg:sticky lg:top-6 bg-[#FFF9F2] border border-[#D9C4AA] rounded-3xl p-5 flex flex-col gap-5" aria-label="Filtrera kurser">
            <div>
              <p className={flabel}>När vill du gå?</p>
              <div className="grid grid-cols-2 gap-2">
                {PERIODER.map((p) => (
                  <button key={p.id} type="button" onClick={() => { setPeriod(period === p.id ? '' : p.id); setManad(''); setVisade(6) }} aria-pressed={period === p.id && !manad} className={`px-2 py-2 rounded-xl text-[12.5px] font-medium border text-center whitespace-nowrap transition-colors ${period === p.id && !manad ? 'bg-[#321C04] text-[#FFF9F2] border-[#321C04]' : 'bg-white text-[#321C04] border-[#D9C4AA] hover:border-[#321C04]'}`}>
                    {p.kort}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setVisaManad((v) => !v)} className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4">
                <ChevronDown size={13} className={`transition-transform ${visaManad || manad ? 'rotate-180' : ''}`} /> {manad ? 'Vald månad' : 'Välj exakt månad'}
              </button>
              {(visaManad || manad) && (
                <select id="f-manad" value={manad} onChange={(e) => { setManad(e.target.value); setPeriod(''); setVisade(6) }} className={fselect + ' mt-2'}>
                  <option value="">Alla månader</option>
                  {manader.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              )}
            </div>
            <div>
              <label htmlFor="f-region" className={flabel}>Var vill du gå?</label>
              <select id="f-region" value={region} onChange={(e) => { setRegion(e.target.value); setVisade(6) }} className={fselect}>
                <option value="">Alla regioner</option>
                {regioner.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-ort" className={flabel}>Ort</label>
              <select id="f-ort" value={ort} onChange={(e) => { setOrt(e.target.value); setVisade(6) }} className={fselect}>
                <option value="">Alla orter</option>
                {orter.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-pris" className={flabel}>Totalpris</label>
              <select id="f-pris" value={pris} onChange={(e) => { setPris(e.target.value); setVisade(6) }} className={fselect}>
                <option value="">Alla priser</option>
                <option value="33000">Under 33 000 kr</option>
                <option value="34000">Under 34 000 kr</option>
              </select>
            </div>
            <label className="flex items-center gap-2.5 text-[15px] text-[#321C04] cursor-pointer">
              <input type="checkbox" checked={baraLediga} onChange={(e) => { setBaraLediga(e.target.checked); setVisade(6) }} className="w-4 h-4 accent-[#321C04]" />
              Visa bara lediga
            </label>
            <div className="pt-4 border-t border-[#D9C4AA]">
              <p className={flabel}>Snabbfilter</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => snabb('snart')} aria-pressed={snabbAktiv === 'snart'} className={chipS(snabbAktiv === 'snart')}>Närmast i tiden</button>
                {['Stockholm', 'Skåne', 'Västra Götaland', 'Halland'].filter((r) => regioner.includes(r)).map((r) => (
                  <button key={r} type="button" onClick={() => snabb(r)} aria-pressed={snabbAktiv === r} className={chipS(snabbAktiv === r)}>{r}</button>
                ))}
              </div>
              {filtrerat && (
                <button type="button" onClick={rensa} className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4">
                  <X size={13} /> Rensa filter
                </button>
              )}
            </div>
          </aside>

          <div>
          {tips && (tips.av || tips.veckor.length > 0) && (
            <div className="mb-5 rounded-2xl border border-[#321C04]/20 bg-[#FFF9F2] px-5 py-4 text-[15px] text-[#321C04] leading-[1.5]">
              {tips.av ? (
                <>
                  <strong className="font-medium">{tips.av} tipsade dig om UGL.</strong>{' '}
                  {tips.veckor.length ? `${tips.av} går ${tips.veckor.length === 1 ? 'veckan' : 'någon av veckorna'} som är markerad nedan. ` : ''}
                  UGL bygger på att deltagarna inte känner varandra sedan tidigare, så välj gärna en annan vecka. Då har ni varandra att bolla med efteråt.
                </>
              ) : (
                <>De veckor som delades med dig är förvalda i kassan. Ändra fritt.</>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[#321C04] text-lg">
              {kurser === null && !fel && 'Hämtar kursdatum…'}
              {fel && 'Kursdatumen kunde inte hämtas just nu. Skriv till kontakt@uglsverige.se, så skickar vi aktuella datum.'}
              {kurser && (
                <>
                  <strong className="font-medium text-2xl">{lista.length}</strong> {lista.length === 1 ? 'kurs' : 'kurser'}
                  {valda.length > 0 && <span className="ml-3 text-[#321C04]/60 text-sm">{valda.length} av {MAX_VALDA} veckor valda</span>}
                </>
              )}
            </p>
            <label className="flex items-center gap-2 text-sm text-[#321C04]/70">
              Sortera
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={fselect + ' w-auto'}>
                <option value="datum">Datum, närmast först</option>
                <option value="pris">Pris, lägst först</option>
                <option value="ort">Ort, A till Ö</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:gap-5">
            {lista.slice(0, visade).map((k, i) => (
              <KursKort key={k.id} k={k} vald={valda.includes(k.id)} fullt={fullt} kompakt={valda.length > 0} onToggle={() => toggle(k.id)} onIntresse={() => intresse(k.id)} onVisa={() => setVisa(k.id)} tipsaresVecka={!!tips?.av && (tips?.veckor.includes(k.id) ?? false)} betyg={betygFor(k.anlaggning)} badge={i === 0 && sort === 'datum' ? 'Närmast i tiden' : billigast === k.id ? 'Lägst totalpris' : null} />
            ))}
          </div>
          {kurser && lista.length === 0 && (
            <p className="mt-6 text-[#321C04]/80 text-base max-w-[60ch]">
              Inga veckor matchar valet. Prova en annan period eller hela landet, eller skicka anmälan utan vald kurs så föreslår vi datum.
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            {lista.length > visade && (
              <button type="button" onClick={() => setVisade((v) => v + 6)} className="inline-flex items-center gap-2 border border-[#321C04]/40 text-[#321C04] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#321C04] hover:text-[#FFF9F2] transition-colors">
                Visa fler
                <ArrowRight size={16} />
              </button>
            )}
            <p className="text-[#321C04]/60 text-sm max-w-[60ch]">
              Alla priser anges exklusive moms. Kurserna i Jönköping har ett samlat pris där allt ingår.
            </p>
          </div>
          </div>
          <aside className={`hidden lg:block lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto no-scrollbar transition-opacity duration-300 ${valda.length ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={valda.length === 0}>
            <Kassa valda={valdaKurser} toggle={toggle} oppnaIntresse={oppnaIntresse} tipsare={tips?.av ? { namn: tips.av, veckor: tips.veckor } : null} onTipsa={() => setDela('chef')} onAndra={() => document.getElementById('kurslista')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
          </aside>
          </div>
        </div>
      </section>

      <SaGarDetTill antal={valda.length} onVidare={() => { setOppnaIntresse((n) => n + 1); if (window.innerWidth < 1024) setKassa(true); else document.getElementById('kurslista')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} />

      <Omdomen omdomen={omdomen} />

      {/* FAQ */}
      <section id="praktiskt" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-32 px-6 -mt-[25px]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-12 lg:gap-24 items-start">
          <div>
            <p className="text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">03. Praktiskt</p>
            <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
              Bra att{' '}
              <em className="not-italic" style={EM}>
                veta.
              </em>
            </h2>
            <p className="mt-8 text-[#321C04]/80 text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[40ch]">
              Fler frågor och svar finns på{' '}
              <a href="/#faq" className="underline underline-offset-4 decoration-[#321C04]/40 hover:decoration-[#321C04] transition-colors">
                startsidan
              </a>
              .
            </p>
          </div>
          <ul className="border-t border-[#321C04]/15">
            {FAQ.map((f) => (
              <li key={f.q} className="border-b border-[#321C04]/15 py-6">
                <p className="text-[#321C04] text-lg md:text-[20px] tracking-tight">{f.q}</p>
                <p className="mt-3 text-[#321C04]/80 text-[15px] md:text-base leading-[1.5] max-w-[58ch]">{f.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />

      {/* Kassa på mobil: knapp och utfällbar panel */}
      {valda.length > 0 && !kassa && (
        <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 flex justify-center">
          <button type="button" onClick={() => setKassa(true)} className="inline-flex items-center gap-3 bg-[#2B2724] text-[#FFF9F2] text-sm font-medium pl-5 pr-4 py-3 rounded-full shadow-[0_8px_30px_rgba(43,39,36,0.35)]">
            <span className="text-[#F6E4CF]/70 text-xs uppercase tracking-[0.2em]">{valda.length} av {MAX_VALDA}</span>
            Valda veckor <ArrowRight size={15} />
          </button>
        </div>
      )}
      {kassa && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#2B2724]/70 backdrop-blur-sm" onClick={() => setKassa(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto p-3">
            <Kassa valda={valdaKurser} toggle={toggle} oppnaIntresse={oppnaIntresse} tipsare={tips?.av ? { namn: tips.av, veckor: tips.veckor } : null} onClose={() => setKassa(false)} onTipsa={() => { setKassa(false); setDela('chef') }} onAndra={() => setKassa(false)} />
          </div>
        </div>
      )}

      {visa && (() => { const k = (kurser || []).find((x) => x.id === visa); return k ? <KursModal k={k} vald={valda.includes(k.id)} fullt={fullt} betyg={betygFor(k.anlaggning)} onToggle={() => toggle(k.id)} onIntresse={() => { setVisa(null); intresse(k.id) }} onTipsa={() => { setVisa(null); if (!valda.includes(k.id) && !fullt) toggle(k.id); setDela('chef') }} onClose={() => setVisa(null)} /> : null })()}
      {dela && <DelaModal flik={dela} setFlik={setDela} valda={valdaKurser} onClose={() => setDela(null)} />}
    </>
  )
}

