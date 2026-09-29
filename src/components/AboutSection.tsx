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

// Snabbfakta: det besökaren vill veta innan hen läser vidare. fran = startvärde för uppräkningen.
const FAKTA = [
  {
    enhet: 'dagar',
    till: 5,
    fran: 0,
    visa: (n: number) => String(n),
    text: 'i följd, måndag till fredag',
  },
  {
    enhet: 'deltagare',
    till: 12,
    fran: 0,
    visa: (n: number) => `8–${Math.max(8, n)}`,
    text: 'som inte känner varandra',
  },
  {
    enhet: 'handledare',
    till: 2,
    fran: 0,
    visa: (n: number) => String(n),
    text: 'certifierade av FHS',
  },
  {
    enhet: 'sedan',
    till: 1981,
    fran: 1900,
    visa: (n: number) => String(n),
    text: 'har kursen utvecklats och prövats',
  },
]

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
    roll: 'Medarbetare och specialist',
    text: 'Du vill samarbeta bättre, våga säga ifrån och förstå varför vissa möten skaver.',
  },
  {
    nr: '02',
    roll: 'Ny chef eller projektledare',
    text: 'Du har fått ansvar för en grupp och vill ha trygghet i rollen från början.',
  },
  {
    nr: '03',
    roll: 'Erfaren chef',
    text: 'Du vill se ditt eget ledarskap med nya ögon och leda gruppen utifrån var den är.',
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

export default function AboutSection() {
  const [ingressRef, ingressSyns] = useSyns<HTMLDivElement>(0.3)
  const [bildRef, bildAndel] = useScrollAndel<HTMLDivElement>(1, 0.2)
  const [faktaRef, faktaSyns] = useSyns<HTMLDListElement>(0.4)
  const [stegRef, stegAndel] = useScrollAndel<HTMLOListElement>(0.75, 0.45)
  const [stegRubrikRef, stegRubrikSyns] = useSyns<HTMLDivElement>(0.3)
  const [malRef, malSyns] = useSyns<HTMLDivElement>(0.2)
  const aktivtSteg = Math.min(STEG.length - 1, Math.floor(stegAndel * STEG.length * 0.999))
  const ingressOrd = 'En vecka där du lär dig hur grupper fungerar genom att vara'.split(' ')

  return (
    <>
      <section id="om-ugl" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] pt-20 md:pt-32 pb-28 md:pb-36 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-16 md:gap-24">
          {/* Ingress: svaret först, ord för ord */}
          <div
            ref={ingressRef}
            className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start"
          >
            <div className={in_(ingressSyns)}>
              <p className={EYEBROW}>Kort om UGL</p>
              <h2 className={`${H2} max-w-[14ch]`}>
                Vad är{' '}
                <em className="not-italic" style={EM}>
                  UGL?
                </em>
              </h2>
              <dl
                ref={faktaRef}
                className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#321C04]/15 rounded-2xl overflow-hidden border border-[#321C04]/15"
              >
                {FAKTA.map((f, i) => (
                  <div
                    key={f.enhet}
                    className="bg-[#F6E4CF] p-4 lg:p-3.5 xl:p-4 transition-all duration-700 ease-out"
                    style={{
                      transitionDelay: `${i * 110}ms`,
                      opacity: faktaSyns ? 1 : 0,
                      transform: faktaSyns ? 'none' : 'translateY(16px)',
                    }}
                  >
                    <dt className="text-[#321C04]/60 text-[10px] uppercase tracking-[0.18em] font-medium">{f.enhet}</dt>
                    <dd className="mt-2 text-[#321C04] text-3xl leading-none tracking-tight tabular-nums" style={EM}>
                      <Rakna fran={f.fran} till={f.till} visa={f.visa} igang={faktaSyns} />
                    </dd>
                    <dd className="mt-2 text-[#321C04]/75 text-xs leading-snug">{f.text}</dd>
                  </div>
                ))}
              </dl>
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

          {/* Bild med mjuk zoom när den scrollas fram */}
          <div>
            <div
              ref={bildRef}
              className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-[#EBD3B6]"
            >
              <img
                src={BILD_GRUPP}
                alt="En UGL-grupp sitter i ring på en kursgård och samtalar"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                style={{
                  transform: `scale(${1.14 - bildAndel * 0.14}) translateY(${(0.5 - bildAndel) * 4}%)`,
                  filter: 'sepia(0.12) saturate(0.95)',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(50,28,4,0) 45%, rgba(50,28,4,0.35) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sektion 2: Lärandet sker i gruppen */}
      <section
        id="sa-fungerar"
        className="relative z-10 bg-[#FFF9F2] rounded-t-[25px] -mt-[25px] pt-20 md:pt-28 pb-28 md:pb-36 px-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Så går veckan till: rubrik och bild står still, stegen fylls i takt med scrollen */}
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 md:gap-16 items-start">
            <div ref={stegRubrikRef} className={`md:sticky md:top-28 ${in_(stegRubrikSyns)}`}>
              <p className={EYEBROW}>Så fungerar det</p>
              <h2 className={`${H2} max-w-[12ch]`}>
                Lärandet sker{' '}
                <em className="not-italic" style={EM}>
                  i gruppen.
                </em>
              </h2>
              <div className="hidden md:block mt-10 rounded-2xl overflow-hidden aspect-[4/3] max-w-[380px] bg-[#EBD3B6]">
                <img
                  src={BILD_SAMTAL}
                  alt="Deltagare i samtal under en UGL-vecka"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out"
                  style={{
                    transform: `scale(${1.08 - stegAndel * 0.08})`,
                    filter: 'sepia(0.12) saturate(0.95)',
                  }}
                />
              </div>
            </div>

            <ol ref={stegRef} className="relative flex flex-col pl-8 md:pl-10">
              {/* Linje som fylls */}
              <span
                aria-hidden="true"
                className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-[2px] bg-[#321C04]/12 rounded-full"
              />
              <span
                aria-hidden="true"
                className="absolute left-[7px] md:left-[9px] top-2 w-[2px] bg-[#321C04] rounded-full"
                style={{
                  height: `calc(${stegAndel * 100}% - 16px)`,
                  maxHeight: 'calc(100% - 16px)',
                }}
              />
              {STEG.map((s, i) => {
                const pa = i <= aktivtSteg && stegAndel > 0.02
                return (
                  <li key={s.nr} className={`relative py-7 ${i ? 'border-t border-[#321C04]/12' : 'pt-0'}`}>
                    <span
                      aria-hidden="true"
                      className={`absolute -left-8 md:-left-10 ${i ? 'top-9' : 'top-2'} w-4 h-4 md:w-5 md:h-5 rounded-full border-2 transition-all duration-500 ${
                        pa ? 'bg-[#321C04] border-[#321C04] scale-100' : 'bg-[#FFF9F2] border-[#321C04]/30 scale-90'
                      }`}
                    />
                    <span
                      className={`text-xs tracking-[0.2em] font-medium transition-colors duration-500 ${pa ? 'text-[#321C04]/70' : 'text-[#321C04]/35'}`}
                    >
                      {s.nr}
                    </span>
                    <h3
                      className={`mt-2 text-xl md:text-[26px] leading-tight tracking-tight font-medium transition-colors duration-500 ${
                        pa ? 'text-[#321C04]' : 'text-[#321C04]/45'
                      }`}
                    >
                      {s.titel}
                    </h3>
                    <p
                      className={`mt-3 text-base sm:text-[17px] leading-[1.55] max-w-[55ch] transition-all duration-700 ${
                        pa
                          ? 'text-[#321C04]/85 opacity-100 translate-y-0'
                          : 'text-[#321C04]/60 opacity-60 translate-y-1'
                      }`}
                    >
                      {s.text}
                    </p>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* Sektion 3: Passar det mig? */}
      <section
        id="malgrupp"
        className="relative z-10 bg-[#EBD3B6] rounded-t-[25px] -mt-[25px] pt-20 md:pt-28 pb-20 md:pb-28 px-6"
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-14 md:gap-20">
          {/* Passar det mig? */}
          <div ref={malRef} className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start">
            <div className={in_(malSyns)}>
              <p className={EYEBROW}>Passar det mig?</p>
              <h2 className={`${H2} max-w-[12ch]`}>
                <em className="not-italic" style={EM}>
                  Målgrupp.
                </em>
              </h2>
              <p className="mt-5 text-[#321C04]/80 text-base leading-[1.55] max-w-[34ch]">
                Du behöver inte vara chef. UGL handlar om att leda sig själv lika mycket som andra.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {FOR_DIG.map((d, i) => (
                <div
                  key={d.roll}
                  style={{
                    transitionDelay: malSyns ? `${150 + i * 120}ms` : '0ms',
                  }}
                  className={`group rounded-2xl bg-[#FFF9F2] border border-[#D9C4AA] p-6 flex flex-col transition-all duration-700 ease-out hover:-translate-y-1 hover:border-[#321C04]/40 hover:shadow-[0_18px_40px_rgba(50,28,4,0.10)] ${
                    malSyns ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <span className="text-[#321C04]/45 text-xs tracking-[0.2em] font-medium">{d.nr}</span>
                  <h3 className="mt-3 text-[#321C04] text-lg leading-snug font-medium">{d.roll}</h3>
                  <p className="mt-3 text-[#321C04]/80 text-[15px] leading-[1.5]">{d.text}</p>
                  <div className="mt-auto pt-5">
                    <span className="block h-[2px] w-full bg-[#D9C4AA]/60 rounded-full overflow-hidden">
                      <span className="block h-full w-0 bg-[#321C04] rounded-full transition-all duration-500 ease-out group-hover:w-full" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trovärdighet och vidare */}
          <div
            className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-8 pt-8 border-t border-[#321C04]/15 ${in_(malSyns, 'delay-500')}`}
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
