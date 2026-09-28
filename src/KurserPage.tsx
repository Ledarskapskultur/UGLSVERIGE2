import { useMemo, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import KursKort from './KursKort'
import DelaModal from './DelaModal'
import Anmalan from './Anmalan'
import Kassa from './Kassa'
import { MAX_VALDA } from './forfragan'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useKurser } from './kursdata'

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }
const HERO_IMAGE = 'https://www.uglsverige.store/assets/ugl-grupp.webp'
const PERIODER = [
  { id: '3', label: 'Inom 3 månader', max: 3 },
  { id: '6', label: 'Om 4 till 6 månader', min: 4, max: 6 },
  { id: '12', label: 'Om 7 till 12 månader', min: 7, max: 12 },
]
const FAQ = [
  { q: 'Vad ingår i priset?', a: 'Kursledning med två handledare, kursmaterial och dokumentation samt kost och logi under veckan. Resa till och från kursgården tillkommer. Alla priser är exklusive moms.' },
  { q: 'Kan flera från samma arbetsplats gå?', a: 'Inte på samma vecka. Gruppen ska vara en främlingsgrupp, och det är en förutsättning för öppenheten. För en hel organisation är en egen kurs rätt väg.' },
  { q: 'Hur fungerar betalning och avbokning?', a: 'Betalning sker mot faktura efter bekräftad plats. Vid förhinder, hör av er så snart det går. Villkoren står i bekräftelsen.' },
]

const chip = (on: boolean) =>
  `px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
    on ? 'bg-[#321C04] text-[#FFF9F2] border-[#321C04]' : 'text-[#321C04] border-[#321C04]/25 hover:border-[#321C04]/60'
  }`

function manaderFram(d: Date) {
  const nu = new Date()
  return (d.getFullYear() - nu.getFullYear()) * 12 + d.getMonth() - nu.getMonth() + (d.getDate() >= nu.getDate() ? 0 : -1)
}

export default function KurserPage() {
  const { kurser, fel } = useKurser()
  const [period, setPeriod] = useState<string | null>(null)
  const [region, setRegion] = useState<string | null>(null)
  const [baraLediga, setBaraLediga] = useState(true)
  const [sort, setSort] = useState<'datum' | 'pris'>('datum')
  const [visade, setVisade] = useState(6)
  const [valda, setValda] = useState<string[]>([])
  const [dela, setDela] = useState<null | 'chef' | 'tips'>(null)
  const [kassa, setKassa] = useState(false)

  const regioner = useMemo(() => (kurser ? [...new Set(kurser.map((k) => k.region))].sort((a, b) => a.localeCompare(b, 'sv')) : []), [kurser])

  const lista = useMemo(() => {
    if (!kurser) return []
    const idag = new Date()
    idag.setHours(0, 0, 0, 0)
    let f = kurser.filter((k) => k.start >= idag)
    if (period) {
      const p = PERIODER.find((x) => x.id === period)!
      f = f.filter((k) => {
        const m = manaderFram(k.start)
        return m <= p.max && (p.min === undefined || m >= p.min)
      })
    }
    if (region) f = f.filter((k) => k.region === region)
    if (baraLediga) f = f.filter((k) => k.ledig)
    if (sort === 'pris') f = [...f].sort((a, b) => (a.total || 1e9) - (b.total || 1e9))
    return f
  }, [kurser, period, region, baraLediga, sort])

  const billigast = useMemo(() => lista.filter((k) => k.total).sort((a, b) => a.total - b.total)[0]?.id ?? null, [lista])
  const valdaKurser = (kurser || []).filter((k) => valda.includes(k.id))
  const toggle = (id: string) => setValda((v) => (v.includes(id) ? v.filter((x) => x !== id) : v.length >= MAX_VALDA ? v : [...v, id]))
  const fullt = valda.length >= MAX_VALDA

  return (
    <>
      {/* Hero */}
      <section id="top" className="relative min-h-[70vh] overflow-hidden mb-[-25px] bg-[#2B2724]">
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${HERO_IMAGE}")` }} />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(43,39,36,0.55) 0%, rgba(43,39,36,0.45) 50%, rgba(43,39,36,0.85) 100%)' }}
        />
        <Navbar />
        <div className="relative z-10 min-h-[70vh] flex flex-col justify-end items-center px-6 pb-14 md:pb-20 pt-40 gap-6 text-center">
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
        </div>
      </section>

      {/* Filter + lista */}
      <section id="kurser" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-28 px-6 mb-[-25px]">
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
          <aside className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-3xl p-5">
              <p className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium">01</p>
              <h3 className="text-[#321C04] text-xl font-medium tracking-tight mt-3">När?</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {PERIODER.map((p) => (
                  <button key={p.id} type="button" onClick={() => { setPeriod(period === p.id ? null : p.id); setVisade(6) }} aria-pressed={period === p.id} className={chip(period === p.id)}>
                    {p.label}
                  </button>
                ))}
                <button type="button" onClick={() => { setPeriod(null); setVisade(6) }} aria-pressed={period === null} className={chip(period === null)}>
                  Alla datum
                </button>
              </div>
            </div>
            <div className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-3xl p-5">
              <p className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium">02</p>
              <h3 className="text-[#321C04] text-xl font-medium tracking-tight mt-3">Var?</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {regioner.map((r) => (
                  <button key={r} type="button" onClick={() => { setRegion(region === r ? null : r); setVisade(6) }} aria-pressed={region === r} className={chip(region === r)}>
                    {r}
                  </button>
                ))}
                <button type="button" onClick={() => { setRegion(null); setVisade(6) }} aria-pressed={region === null} className={chip(region === null)}>
                  Hela landet
                </button>
              </div>
            </div>
            <div className="bg-[#FFF9F2] border border-[#D9C4AA] rounded-3xl p-5">
              <p className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium">03</p>
              <h3 className="text-[#321C04] text-xl font-medium tracking-tight mt-3">Visa</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setBaraLediga((v) => !v)} aria-pressed={baraLediga} className={`inline-flex items-center gap-2 ${chip(baraLediga)}`}>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${baraLediga ? 'border-[#FFF9F2] bg-[#FFF9F2] text-[#321C04]' : 'border-current'}`}>
                    {baraLediga && <Check size={10} />}
                  </span>
                  Bara lediga platser
                </button>
                <button type="button" onClick={() => setSort('datum')} aria-pressed={sort === 'datum'} className={chip(sort === 'datum')}>
                  Närmast först
                </button>
                <button type="button" onClick={() => setSort('pris')} aria-pressed={sort === 'pris'} className={chip(sort === 'pris')}>
                  Lägst pris först
                </button>
              </div>
            </div>
          </aside>

          <div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[#321C04] text-lg">
              {kurser === null && !fel && 'Hämtar kursdatum…'}
              {fel && 'Kursdatumen kunde inte hämtas just nu. Skriv till kontakt@uglsverige.se, så skickar vi aktuella datum.'}
              {kurser && (
                <>
                  <strong className="font-medium">{lista.length}</strong> {lista.length === 1 ? 'kursvecka' : 'kursveckor'}
                  {region ? ` i ${region}` : ' i hela landet'}
                  {period ? `, ${PERIODER.find((p) => p.id === period)!.label.toLowerCase()}` : ''}
                </>
              )}
            </p>
            {valda.length > 0 && <span className="text-[#321C04]/70 text-sm">{valda.length} av {MAX_VALDA} veckor valda</span>}
            {(period || region || !baraLediga || sort !== 'datum') && (
              <button type="button" onClick={() => { setPeriod(null); setRegion(null); setBaraLediga(true); setSort('datum'); setVisade(6) }} className="text-[#321C04]/70 hover:text-[#321C04] text-sm underline underline-offset-4">
                Rensa val
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4 md:gap-5">
            {lista.slice(0, visade).map((k, i) => (
              <KursKort key={k.id} k={k} vald={valda.includes(k.id)} fullt={fullt} kompakt={valda.length > 0} onToggle={() => toggle(k.id)} badge={i === 0 && sort === 'datum' ? 'Närmast i tiden' : billigast === k.id ? 'Lägst totalpris' : null} />
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
          <aside className={`hidden lg:block lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto transition-opacity duration-300 ${valda.length ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={valda.length === 0}>
            <Kassa valda={valdaKurser} toggle={toggle} onTipsa={() => setDela('chef')} onAndra={() => document.getElementById('kurslista')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
          </aside>
          </div>
        </div>
      </section>

      <Anmalan valdaKurser={valdaKurser} toggle={toggle} />

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
            <Kassa valda={valdaKurser} toggle={toggle} onClose={() => setKassa(false)} onTipsa={() => { setKassa(false); setDela('chef') }} onAndra={() => setKassa(false)} />
          </div>
        </div>
      )}

      {dela && <DelaModal flik={dela} setFlik={setDela} valda={valdaKurser} onClose={() => setDela(null)} />}
    </>
  )
}

