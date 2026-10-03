import { useEffect, useRef, useState } from 'react'

const H2 = 'text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal'
const P = 'text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.55] max-w-[60ch]'
const EYEBROW = 'text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5'
const EM = {
  fontFamily: "'Instrument Serif', serif",
  fontStyle: 'italic' as const,
}
const BILD_GRUPP = 'https://www.uglsverige.store/assets/ugl-grupp.webp'
const BILD_SAMTAL = 'https://www.uglsverige.store/assets/ugl-samtal.webp'
const STEGBILD = [
  'https://www.uglsverige.store/assets/ugl-hero.webp',
  'https://www.uglsverige.store/assets/ugl-oppenhet.webp',
  BILD_SAMTAL,
]
const BILD_HANDLEDARE = 'https://www.uglsverige.store/assets/ugl-handledare.webp'

const STEG = [
  {
    nr: '01',
    titel: 'Ni möts som främlingar',
    text: 'Ingen har en roll att försvara. Det gör att du kan pröva nya sätt att vara utan att det följer med hem till jobbet.',
  },
  {
    nr: '02',
    titel: 'Gruppen blir kursmaterialet',
    text: 'Ni löser uppgifter tillsammans och ser en grupp växa fram på riktigt. Handledarna hjälper er stanna upp och förstå vad som händer.',
  },
  {
    nr: '03',
    titel: 'Du ser dig själv utifrån',
    text: 'Genom feedback från de andra får du en klarare bild av hur du påverkar en grupp, och vad du vill göra annorlunda.',
  },
]

const FOR_DIG = [
  {
    nr: '01',
    etikett: 'Samarbete',
    roll: 'Medarbetare och specialist',
    text: 'Du vill samarbeta bättre, våga säga ifrån och förstå varför vissa möten skaver.',
  },
  {
    nr: '02',
    etikett: 'Ny i rollen',
    roll: 'Ny chef eller projektledare',
    text: 'Du har fått ansvar för en grupp och vill ha trygghet i rollen från början.',
  },
  {
    nr: '03',
    etikett: 'Nya ögon',
    roll: 'Erfaren chef',
    text: 'Du vill se ditt eget ledarskap med nya ögon och leda gruppen utifrån var den är.',
  },
]

// Utseende per ruta i bento-gridet: bred ljus, mörk och beige.
const BENTO = [
  {
    ruta: 'bg-[#FFF9F2] border border-[#D9C4AA] md:col-span-2',
    svag: 'text-[#321C04]/45',
    etikett: 'bg-[#F6E4CF] text-[#321C04]',
    rubrik: 'text-[#321C04]',
    text: 'text-[#321C04]/80',
    spar: 'bg-[#D9C4AA]/60',
    fyll: 'bg-[#321C04]',
  },
  {
    ruta: 'bg-[#2B2724]',
    svag: 'text-[#F6E4CF]/45',
    etikett: 'bg-[#F6E4CF]/15 text-[#F6E4CF]',
    rubrik: 'text-[#FFF9F2]',
    text: 'text-[#F6E4CF]/80',
    spar: 'bg-[#F6E4CF]/15',
    fyll: 'bg-[#F6E4CF]',
  },
  {
    ruta: 'bg-[#F6E4CF] border border-[#D9C4AA]',
    svag: 'text-[#321C04]/45',
    etikett: 'bg-[#FFF9F2] text-[#321C04]',
    rubrik: 'text-[#321C04]',
    text: 'text-[#321C04]/80',
    spar: 'bg-[#D9C4AA]/60',
    fyll: 'bg-[#321C04]',
  },
]

const lugn = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Blir true första gången elementet syns.
function useSyns<T extends HTMLElement>(troskel = 0.2) {
  const ref = useRef<T | null>(null)
  const [syns, setSyns] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (lugn()) return setSyns(true)
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setSyns(true)
          io.disconnect()
        }
      },
      { threshold: troskel },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [troskel])
  return [ref, syns] as const
}

// Hur långt elementet har passerat skärmen, 0 till 1.
function useScrollAndel<T extends HTMLElement>(start = 0.85, slut = 0.35) {
  const ref = useRef<T | null>(null)
  const [andel, setAndel] = useState(0)
  useEffect(() => {
    if (lugn()) return setAndel(1)
    let raf = 0
    const rakna = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const a = (vh * start - r.top) / (r.height + vh * (start - slut))
      setAndel(Math.min(1, Math.max(0, a)))
    }
    const vid = () => {
      if (!raf) raf = requestAnimationFrame(rakna)
    }
    rakna()
    window.addEventListener('scroll', vid, { passive: true })
    window.addEventListener('resize', vid)
    return () => {
      window.removeEventListener('scroll', vid)
      window.removeEventListener('resize', vid)
      cancelAnimationFrame(raf)
    }
  }, [start, slut])
  return [ref, andel] as const
}

function Rakna({
  fran,
  till,
  visa,
  igang,
}: {
  fran: number
  till: number
  visa: (n: number) => string
  igang: boolean
}) {
  const [n, setN] = useState(fran)
  useEffect(() => {
    if (!igang) return
    if (lugn()) return setN(till)
    const t0 = performance.now()
    const tid = 1400
    let raf = 0
    const steg = (t: number) => {
      const p = Math.min(1, (t - t0) / tid)
      const e = 1 - Math.pow(1 - p, 3)
      setN(Math.round(fran + (till - fran) * e))
      if (p < 1) raf = requestAnimationFrame(steg)
    }
    raf = requestAnimationFrame(steg)
    return () => cancelAnimationFrame(raf)
  }, [igang, fran, till])
  return <>{visa(n)}</>
}

const in_ = (syns: boolean, extra = '') =>
  `transition-all duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] ${syns ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${extra}`

const INTERVALL_VAD = 6000

// Veckan i fyra siffror: glaskort över bild, med stor siffra som index och en ruta som säger vad det betyder.
const GLASKORT = [
  {
    etikett: 'Tid',
    till: 5,
    fran: 0,
    visa: (n: number) => String(n),
    enhet: 'dagar',
    titel: 'Fem dagar i följd',
    text: 'Måndag till fredag på kursgård, med boende och alla måltider. Du är borta från vardagen hela veckan.',
    betyder: 'Tid att landa, pröva och se mönster som en endagsutbildning aldrig hinner med.',
  },
  {
    etikett: 'Gruppen',
    till: 12,
    fran: 0,
    visa: (n: number) => `8–${Math.max(8, n)}`,
    enhet: 'deltagare',
    titel: 'En liten grupp främlingar',
    text: 'Ni känner inte varandra när veckan börjar. Gruppen formas på plats, och det är den ni lär er av.',
    betyder: 'Ingen roll att försvara, så du kan pröva nya sätt att vara.',
  },
  {
    etikett: 'Stödet',
    till: 2,
    fran: 0,
    visa: (n: number) => String(n),
    enhet: 'handledare',
    titel: 'Certifierade handledare',
    text: 'Handledarna är utbildade och certifierade av Försvarshögskolan och följer gruppen hela veckan.',
    betyder: 'Någon som hjälper er stanna upp och förstå vad som händer i gruppen.',
  },
  {
    etikett: 'Grunden',
    till: 1981,
    fran: 1900,
    visa: (n: number) => String(n),
    enhet: 'sedan',
    titel: 'Prövad sedan 1981',
    text: 'Sveriges mest använda ledarskapsutbildning. Effekten har utvärderats av Karolinska Institutet.',
    betyder: 'Ett beprövat upplägg med forskning bakom, inte ett experiment.',
  },
]

function VadArUgl() {
  const [ingressRef, ingressSyns] = useSyns<HTMLDivElement>(0.3)
  const [panelRef, panelAndel] = useScrollAndel<HTMLDivElement>(1, 0.2)
  const [kortRef, kortSyns] = useSyns<HTMLDivElement>(0.25)
  const panelEl = useRef<HTMLDivElement | null>(null)
  const [aktiv, setAktiv] = useState(0)
  const [pausad, setPausad] = useState(false)
  const [hovrar, setHovrar] = useState(false)
  const [iBild, setIBild] = useState(false)
  const [omgang, setOmgang] = useState(0)
  const autoplay = !lugn()
  const spelar = autoplay && !pausad && !hovrar && iBild
  const ingressOrd = 'En vecka där du lär dig hur grupper fungerar genom att vara'.split(' ')

  // Autoplay går bara när panelen syns på skärmen.
  useEffect(() => {
    const el = panelEl.current
    if (!el) return
    const io = new IntersectionObserver((e) => setIBild(e[0].isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const valj = (i: number) => {
    setAktiv(i)
    setPausad(true)
    setOmgang((n) => n + 1)
  }
  const nasta = () => {
    setAktiv((a) => (a + 1) % GLASKORT.length)
    setOmgang((n) => n + 1)
  }
  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = (aktiv + (e.key === 'ArrowRight' ? 1 : GLASKORT.length - 1)) % GLASKORT.length
    valj(i)
    document.getElementById(`vad-flik-${i}`)?.focus()
  }

  return (
    <section id="om-ugl" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] pt-20 md:pt-32 pb-28 md:pb-36 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Ingress */}
        <div ref={ingressRef} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start">
          <div className={in_(ingressSyns)}>
            <p className={EYEBROW}>Kort om UGL</p>
            <h2 className={`${H2} max-w-[14ch]`}>
              Vad är{' '}
              <em className="not-italic" style={EM}>
                UGL?
              </em>
            </h2>
          </div>
          <div>
            <p className="text-[#321C04] text-xl sm:text-2xl lg:text-[28px] leading-[1.3] tracking-tight max-w-[30ch]">
              {ingressOrd.map((o, i) => (
                <span
                  key={i}
                  className="inline-block transition-all duration-700 ease-out"
                  style={{
                    transitionDelay: `${150 + i * 55}ms`,
                    opacity: ingressSyns ? 1 : 0,
                    transform: ingressSyns ? 'none' : 'translateY(0.5em)',
                    filter: ingressSyns ? 'none' : 'blur(4px)',
                  }}
                >
                  {o}&nbsp;
                </span>
              ))}
              <em
                className="not-italic inline-block transition-all duration-700 ease-out"
                style={{
                  ...EM,
                  transitionDelay: `${150 + ingressOrd.length * 55 + 120}ms`,
                  opacity: ingressSyns ? 1 : 0,
                  transform: ingressSyns ? 'none' : 'translateY(0.5em) scale(0.9)',
                }}
              >
                i en.
              </em>
            </p>
            <p className={in_(ingressSyns, `${P} mt-6 delay-700`)}>
              UGL, Utveckling av grupp och ledare, är Sveriges mest använda ledarskapsutbildning. Det är ingen
              föreläsning. Du bor på kursgård med en liten grupp och lär dig av det som händer mellan er, med stöd av
              två handledare.
            </p>
          </div>
        </div>

        {/* Bildpanel med glaskort */}
        <div
          ref={panelRef}
          className="relative mt-14 md:mt-20 rounded-[28px] overflow-hidden bg-[#2B2724] text-[#FFF9F2]"
        >
          <img
            src={BILD_GRUPP}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{
              transform: `scale(${1.12 - panelAndel * 0.12})`,
              filter: 'sepia(0.15) saturate(0.9)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(43,39,36,0.55) 0%, rgba(43,39,36,0.72) 45%, rgba(43,39,36,0.9) 100%)',
            }}
          />

          <div
            ref={(el) => {
              kortRef.current = el
              panelEl.current = el
            }}
            className="relative p-6 sm:p-8 md:p-12"
            onMouseEnter={() => setHovrar(true)}
            onMouseLeave={() => setHovrar(false)}
          >
            <style>{'@keyframes uglFyll{from{width:0}to{width:100%}}'}</style>
            <div className="flex items-end justify-between gap-6">
              <div className={in_(kortSyns)}>
                <p className="text-[#F6E4CF]/70 text-xs uppercase tracking-[0.25em] font-medium mb-4">
                  Veckan i fyra siffror
                </p>
                <p className="text-[#FFF9F2] text-2xl sm:text-3xl md:text-[38px] leading-[1.1] tracking-tight max-w-[18ch]">
                  Det här får du{' '}
                  <em className="not-italic" style={EM}>
                    under veckan.
                  </em>
                </p>
              </div>
              {autoplay && (
                <button
                  type="button"
                  onClick={() => {
                    setPausad((p) => !p)
                    setOmgang((n) => n + 1)
                  }}
                  aria-label={pausad ? 'Spela upp automatiskt' : 'Pausa automatisk visning'}
                  className="shrink-0 w-11 h-11 rounded-full border border-[#F6E4CF]/30 bg-white/5 backdrop-blur-md flex items-center justify-center transition-colors duration-300 hover:bg-[#F6E4CF] hover:text-[#2B2724] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F6E4CF]"
                >
                  {pausad ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <path d="M3 1.5v11l9-5.5z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <rect x="2.5" y="1.5" width="3" height="11" rx="0.8" />
                      <rect x="8.5" y="1.5" width="3" height="11" rx="0.8" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* Sifferflikar */}
            <div
              role="tablist"
              aria-label="Veckan i fyra siffror"
              className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {GLASKORT.map((k, i) => {
                const pa = aktiv === i
                return (
                  <button
                    key={k.titel}
                    id={`vad-flik-${i}`}
                    role="tab"
                    type="button"
                    aria-selected={pa}
                    aria-controls="vad-panel"
                    tabIndex={pa ? 0 : -1}
                    onClick={() => valj(i)}
                    onKeyDown={onTabKey}
                    style={{ transitionDelay: kortSyns ? `${150 + i * 100}ms` : '0ms' }}
                    className={`group relative overflow-hidden text-left rounded-2xl border px-4 pt-4 pb-5 md:px-5 backdrop-blur-md transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6E4CF] ${
                      pa
                        ? 'bg-[#F6E4CF] border-[#F6E4CF] text-[#2B2724]'
                        : 'bg-white/[0.06] border-[#F6E4CF]/20 text-[#F6E4CF] hover:bg-white/[0.12] hover:border-[#F6E4CF]/40'
                    } ${kortSyns ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  >
                    <span
                      className={`block text-[10px] uppercase tracking-[0.2em] font-medium ${pa ? 'text-[#2B2724]/60' : 'text-[#F6E4CF]/60'}`}
                    >
                      {k.etikett}
                    </span>
                    <span
                      className="mt-2 block text-4xl md:text-5xl leading-none tracking-tight tabular-nums"
                      style={EM}
                    >
                      <Rakna fran={k.fran} till={k.till} visa={k.visa} igang={kortSyns} />
                    </span>
                    <span
                      className={`mt-1.5 block text-[11px] uppercase tracking-[0.2em] ${pa ? 'text-[#2B2724]/70' : 'text-[#F6E4CF]/60'}`}
                    >
                      {k.enhet}
                    </span>
                    {/* Framstegslinje: när den är full byts kortet */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-4 right-4 md:left-5 md:right-5 bottom-2 h-[2px] rounded-full overflow-hidden ${pa ? 'bg-[#2B2724]/15' : 'bg-transparent'}`}
                    >
                      {pa && (
                        <span
                          key={`${aktiv}-${omgang}`}
                          className="block h-full rounded-full bg-[#2B2724]"
                          onAnimationEnd={nasta}
                          style={
                            autoplay && !pausad
                              ? {
                                  width: 0,
                                  animation: `uglFyll ${INTERVALL_VAD}ms linear forwards`,
                                  animationPlayState: spelar ? 'running' : 'paused',
                                }
                              : { width: '100%' }
                          }
                        />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Det valda kortet. Alla ligger i samma ruta så höjden inte hoppar. */}
            <div
              id="vad-panel"
              role="tabpanel"
              aria-labelledby={`vad-flik-${aktiv}`}
              className={`mt-4 grid ${in_(kortSyns, 'delay-500')}`}
            >
              {GLASKORT.map((k, i) => {
                const pa = aktiv === i
                return (
                  <article
                    key={k.titel}
                    aria-hidden={!pa}
                    className={`[grid-area:1/1] rounded-2xl border border-[#F6E4CF]/20 bg-white/[0.07] backdrop-blur-md p-6 md:p-9 grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 md:gap-10 items-end transition-all duration-700 ease-out ${
                      pa ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
                    }`}
                  >
                    <div>
                      <p className="text-[#F6E4CF]/60 text-[11px] uppercase tracking-[0.2em] font-medium">
                        {String(i + 1).padStart(2, '0')} / {String(GLASKORT.length).padStart(2, '0')}
                      </p>
                      <h3 className="mt-4 text-[#FFF9F2] text-2xl md:text-[32px] leading-[1.1] tracking-tight font-medium">
                        {k.titel}
                      </h3>
                      <p className="mt-4 text-[#F6E4CF]/85 text-base md:text-[17px] leading-[1.55] max-w-[46ch]">
                        {k.text}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#F6E4CF]/15 bg-black/15 px-5 py-4">
                      <p className="text-[#F6E4CF]/60 text-[10px] uppercase tracking-[0.2em] font-medium">
                        Det betyder för dig
                      </p>
                      <p className="mt-2 text-[#FFF9F2] text-[15px] md:text-base leading-[1.5]">{k.betyder}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutSection() {
  const [stegRef, stegAndel] = useScrollAndel<HTMLOListElement>(0.85, 0.4)
  const [stegRubrikRef, stegRubrikSyns] = useSyns<HTMLDivElement>(0.3)
  const [malRef, malSyns] = useSyns<HTMLDivElement>(0.2)
  const [slutRef, slutSyns] = useSyns<HTMLDivElement>(0.3)
  const [bentoRef, bentoSyns] = useSyns<HTMLDivElement>(0.1)
  const aktivtSteg = Math.min(STEG.length - 1, Math.floor(stegAndel * STEG.length * 0.999))

  return (
    <>
      <VadArUgl />

      {/* Sektion 2: Passar det mig? */}
      <section
        id="malgrupp"
        className="relative z-10 bg-[#EBD3B6] rounded-t-[25px] -mt-[25px] pt-20 md:pt-28 pb-28 md:pb-36 px-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Rubrik */}
          <div
            ref={malRef}
            className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 ${in_(malSyns)}`}
          >
            <div>
              <p className={EYEBROW}>Passar det mig?</p>
              <h2 className={`${H2} max-w-[12ch]`}>
                <em className="not-italic" style={EM}>
                  Målgrupp.
                </em>
              </h2>
            </div>
            <p className="text-[#321C04]/80 text-base leading-[1.55] max-w-[40ch]">
              Tre vanliga ingångar till veckan. Känner du igen dig i någon av dem är du rätt.
            </p>
          </div>

          {/* Bento-grid */}
          <div
            ref={bentoRef}
            className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[250px] gap-4"
          >
            {/* Stor bildruta */}
            <div
              style={{ transitionDelay: bentoSyns ? '100ms' : '0ms' }}
              className={`group relative overflow-hidden rounded-3xl min-h-[340px] md:col-span-2 lg:row-span-2 transition-all duration-700 ease-out ${
                bentoSyns ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <img
                src={BILD_HANDLEDARE}
                alt="Två personer i samtal på en kursgård"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                style={{ filter: 'sepia(0.12) saturate(0.95)' }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(43,39,36,0.05) 30%, rgba(43,39,36,0.82) 100%)' }}
              />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <p className="text-[#FFF9F2] text-3xl md:text-[40px] leading-[1.05] tracking-tight" style={EM}>
                  Du behöver inte vara chef.
                </p>
                <p className="mt-3 text-[#F6E4CF]/85 text-base leading-[1.5] max-w-[38ch]">
                  UGL handlar om att leda sig själv lika mycket som andra.
                </p>
              </div>
            </div>

            {FOR_DIG.map((d, i) => {
              const stil = BENTO[i]
              return (
                <div
                  key={d.roll}
                  style={{ transitionDelay: bentoSyns ? `${220 + i * 120}ms` : '0ms' }}
                  className={`group relative rounded-3xl p-7 flex flex-col overflow-hidden transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(50,28,4,0.14)] ${stil.ruta} ${
                    bentoSyns ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs tracking-[0.2em] font-medium ${stil.svag}`}>{d.nr}</span>
                    <span
                      className={`text-[10px] uppercase tracking-[0.18em] font-medium px-3 py-1 rounded-full ${stil.etikett}`}
                    >
                      {d.etikett}
                    </span>
                  </div>
                  <h3
                    className={`mt-auto pt-6 text-xl md:text-2xl leading-tight tracking-tight font-medium ${stil.rubrik}`}
                  >
                    {d.roll}
                  </h3>
                  <p className={`mt-3 text-[15px] leading-[1.5] max-w-[42ch] ${stil.text}`}>{d.text}</p>
                  <span className={`mt-5 block h-[2px] w-full rounded-full overflow-hidden ${stil.spar}`}>
                    <span
                      className={`block h-full w-0 rounded-full transition-all duration-500 ease-out group-hover:w-full ${stil.fyll}`}
                    />
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sektion 3: Lärandet sker i gruppen */}
      <section
        id="sa-fungerar"
        className="relative z-10 bg-[#FFF9F2] rounded-t-[25px] -mt-[25px] pt-20 md:pt-28 pb-20 md:pb-28 px-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Rubrik och ingress */}
          <div
            ref={stegRubrikRef}
            className={`grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-end ${in_(stegRubrikSyns)}`}
          >
            <div>
              <p className={EYEBROW}>Så fungerar det</p>
              <h2 className={`${H2} max-w-[12ch]`}>
                Lärandet sker{' '}
                <em className="not-italic" style={EM}>
                  i gruppen.
                </em>
              </h2>
            </div>
            <p className={`${P} md:pb-1`}>
              Det finns inga föreläsningar att anteckna. Ni gör saker tillsammans, och det som händer i gruppen är det
              ni lär er av. Så går det till, i tre steg.
            </p>
          </div>

          {/* Vågrät tidslinje som fylls när du scrollar. På mobilen går den lodrätt. */}
          <ol ref={stegRef} className="relative mt-14 md:mt-20 grid md:grid-cols-3 gap-12 md:gap-8">
            <span
              aria-hidden="true"
              className="hidden md:block absolute left-0 right-0 top-[9px] h-[2px] bg-[#321C04]/12 rounded-full"
            />
            <span
              aria-hidden="true"
              className="hidden md:block absolute left-0 top-[9px] h-[2px] bg-[#321C04] rounded-full"
              style={{ width: `${stegAndel * 100}%` }}
            />
            <span
              aria-hidden="true"
              className="md:hidden absolute left-[9px] top-2 bottom-2 w-[2px] bg-[#321C04]/12 rounded-full"
            />
            <span
              aria-hidden="true"
              className="md:hidden absolute left-[9px] top-2 w-[2px] bg-[#321C04] rounded-full"
              style={{ height: `${stegAndel * 100}%`, maxHeight: 'calc(100% - 16px)' }}
            />
            {STEG.map((s, i) => {
              const pa = i <= aktivtSteg && stegAndel > 0.02
              return (
                <li
                  key={s.nr}
                  style={{ transitionDelay: stegRubrikSyns ? `${200 + i * 140}ms` : '0ms' }}
                  className={`group relative pl-10 md:pl-0 md:pt-12 transition-all duration-700 ease-out ${
                    stegRubrikSyns ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 w-5 h-5 rounded-full border-2 transition-all duration-500 ${
                      pa ? 'bg-[#321C04] border-[#321C04] scale-100' : 'bg-[#FFF9F2] border-[#321C04]/30 scale-90'
                    }`}
                  />
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#EBD3B6]">
                    <img
                      src={STEGBILD[i]}
                      alt=""
                      loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-105 ${
                        pa ? 'scale-100' : 'scale-[1.04]'
                      }`}
                      style={{
                        filter: pa ? 'sepia(0.1) saturate(0.95)' : 'sepia(0.35) saturate(0.6) brightness(1.05)',
                      }}
                    />
                    <span
                      className="absolute top-3 left-4 text-[#FFF9F2] text-4xl leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
                      style={EM}
                    >
                      {s.nr}
                    </span>
                  </div>
                  <h3
                    className={`mt-5 text-xl md:text-[24px] leading-tight tracking-tight font-medium transition-colors duration-500 ${
                      pa ? 'text-[#321C04]' : 'text-[#321C04]/50'
                    }`}
                  >
                    {s.titel}
                  </h3>
                  <p
                    className={`mt-3 text-[15px] md:text-base leading-[1.55] transition-colors duration-500 ${
                      pa ? 'text-[#321C04]/80' : 'text-[#321C04]/55'
                    }`}
                  >
                    {s.text}
                  </p>
                </li>
              )
            })}
          </ol>

          {/* Trovärdighet och vidare */}
          <div
            ref={slutRef}
            className={`mt-16 md:mt-24 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 pt-8 border-t border-[#321C04]/15 ${in_(slutSyns)}`}
          >
            <p className="text-[#321C04]/70 text-sm leading-relaxed max-w-[70ch]">
              Konceptet ägs av{' '}
              <a
                href="https://www.fhs.se/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-[#321C04]/40 hover:decoration-[#321C04] transition-colors"
              >
                Försvarshögskolan
              </a>
              , som certifierar alla handledare. Effekten har utvärderats av Karolinska Institutet.
            </p>
            <a
              href="/kurser"
              className="group md:ml-auto inline-flex items-center gap-3 rounded-full bg-[#321C04] text-[#FFF9F2] pl-5 pr-2 py-2 text-sm font-medium whitespace-nowrap self-start transition-colors hover:bg-[#4a2c0c]"
            >
              Se kommande veckor
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-[#FFF9F2] text-[#321C04] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
