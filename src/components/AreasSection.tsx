import { useEffect, useRef, useState } from 'react'

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }

// Tre riktningar enligt Försvarshögskolans utvecklingsmål. x/y = nodens läge i kompassen (viewBox 320).
const AREAS = [
  {
    number: '01',
    direction: 'Inåt',
    title: 'Sig själv',
    lead: 'Hur du fungerar, och varför.',
    goals: [
      'Förstå drivkrafterna bakom det egna handlandet',
      'Upptäcka hur känslor och värderingar färgar relationer',
      'Göra reflektion till en vana, inte en engångsövning',
    ],
    x: 49,
    y: 224,
  },
  {
    number: '02',
    direction: 'Utåt',
    title: 'Mötet med andra',
    lead: 'Hur du kommunicerar när det spelar roll.',
    goals: [
      'Kommunicera direkt och klart, även när det är obekvämt',
      'Ge och ta emot feedback utan att gå i försvar',
      'Gå in i konflikter i stället för runt dem',
    ],
    x: 271,
    y: 224,
  },
  {
    number: '03',
    direction: 'Uppåt',
    title: 'Gruppen',
    lead: 'Hur en grupp fungerar som helhet.',
    goals: [
      'Läsa vilket stadium en grupp befinner sig i',
      'Förstå vad roller, normer och ledarstil gör med gruppen',
      'Fatta beslut som gruppen står bakom',
    ],
    x: 160,
    y: 32,
  },
]

const C = 160 // kompassens mittpunkt

export default function AreasSection() {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setVisible(true)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = (active + (e.key === 'ArrowRight' ? 1 : AREAS.length - 1)) % AREAS.length
    setActive(i)
    document.getElementById(`omrade-flik-${i}`)?.focus()
  }

  const a = AREAS[active]

  return (
    <section
      id="utvecklingsomraden"
      className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-28 px-6 mb-[-25px]"
    >
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Intro */}
        <div
          className={`grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-end transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <p className="text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">Tre riktningar</p>
            <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
              Utvecklingsområden{' '}
              <em className="not-italic" style={EM}>
                under UGL.
              </em>
            </h2>
          </div>
          <p className="text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.55] max-w-[60ch]">
            Under veckan arbetar gruppen med det som avgör hur en grupp fungerar: hur den utvecklas, kommunikation och
            feedback, konflikter, värderingar och känslor. Försvarshögskolans utvecklingsmål håller ihop det och pekar
            åt tre håll. Välj en riktning för att se målen.
          </p>
        </div>

        <div className="mt-14 md:mt-20 grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 items-center">
          {/* Kompass */}
          <div
            className={`relative mx-auto w-full max-w-[420px] aspect-square transition-all duration-1000 ease-out ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <svg viewBox="0 0 320 320" className="absolute inset-0 w-full h-full" aria-hidden="true">
              <circle cx={C} cy={C} r="128" fill="none" stroke="#D9C4AA" strokeWidth="1.5" strokeDasharray="3 6" />
              <circle cx={C} cy={C} r="84" fill="none" stroke="#D9C4AA" strokeWidth="1" />
              {AREAS.map((o, i) => {
                const pa = active === i
                // Inåt pekar mot mitten, de andra pekar ut från mitten.
                const inat = o.direction === 'Inåt'
                const [x1, y1, x2, y2] = inat ? [o.x, o.y, C, C] : [C, C, o.x, o.y]
                const dx = x2 - x1
                const dy = y2 - y1
                const len = Math.hypot(dx, dy)
                const ux = dx / len
                const uy = dy / len
                // Korta av linjen så den slutar vid mittcirkeln respektive noden.
                const s0 = inat ? 40 : 40
                const s1 = inat ? 42 : 42
                const ax = x2 - ux * s1
                const ay = y2 - uy * s1
                return (
                  <g key={o.direction} className="transition-all duration-500">
                    <line
                      x1={x1 + ux * s0}
                      y1={y1 + uy * s0}
                      x2={ax}
                      y2={ay}
                      stroke="#321C04"
                      strokeOpacity={pa ? 1 : 0.22}
                      strokeWidth={pa ? 2.5 : 1.5}
                      strokeLinecap="round"
                      strokeDasharray={pa ? '0' : '4 5'}
                      style={{ transition: 'all 500ms ease' }}
                    />
                    <path
                      d={`M ${ax + ux * 2} ${ay + uy * 2} L ${ax - ux * 10 - uy * 6} ${ay - uy * 10 + ux * 6} L ${ax - ux * 10 + uy * 6} ${ay - uy * 10 - ux * 6} Z`}
                      fill="#321C04"
                      fillOpacity={pa ? 1 : 0.22}
                      style={{ transition: 'all 500ms ease' }}
                    />
                  </g>
                )
              })}
              <circle cx={C} cy={C} r="36" fill="#FFF9F2" stroke="#D9C4AA" />
              <text
                x={C}
                y={C + 6}
                textAnchor="middle"
                fill="#321C04"
                fontSize="18"
                fontFamily="'Instrument Serif', serif"
                fontStyle="italic"
              >
                Du
              </text>
            </svg>

            {/* Klickbara noder ovanpå kompassen */}
            {AREAS.map((o, i) => {
              const pa = active === i
              return (
                <button
                  key={o.direction}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={pa}
                  aria-label={`${o.direction}: ${o.title}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full w-[23%] aspect-square flex flex-col items-center justify-center text-center border transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#321C04] ${
                    pa
                      ? 'bg-[#321C04] border-[#321C04] text-[#FFF9F2] scale-105 shadow-[0_16px_40px_rgba(50,28,4,0.25)]'
                      : 'bg-[#FFF9F2] border-[#D9C4AA] text-[#321C04] hover:border-[#321C04]/50 hover:scale-105'
                  }`}
                  style={{ left: `${(o.x / 320) * 100}%`, top: `${(o.y / 320) * 100}%` }}
                >
                  <span className="text-base sm:text-xl leading-none" style={EM}>
                    {o.direction}
                  </span>
                  <span
                    className={`mt-1 text-[8px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.16em] leading-tight px-1 font-medium ${pa ? 'text-[#F6E4CF]/75' : 'text-[#321C04]/55'}`}
                  >
                    {o.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Flikar och mål för vald riktning */}
          <div
            className={`transition-all duration-700 delay-200 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div role="tablist" aria-label="Utvecklingsområden" className="flex flex-wrap gap-2">
              {AREAS.map((o, i) => {
                const pa = active === i
                return (
                  <button
                    key={o.direction}
                    id={`omrade-flik-${i}`}
                    role="tab"
                    type="button"
                    aria-selected={pa}
                    aria-controls="omrade-panel"
                    tabIndex={pa ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={onKey}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#321C04] ${
                      pa
                        ? 'bg-[#321C04] border-[#321C04] text-[#FFF9F2]'
                        : 'bg-transparent border-[#321C04]/20 text-[#321C04]/70 hover:border-[#321C04]/50 hover:text-[#321C04]'
                    }`}
                  >
                    {o.number} {o.direction}
                  </button>
                )
              })}
            </div>

            <div id="omrade-panel" role="tabpanel" aria-labelledby={`omrade-flik-${active}`} className="mt-6 grid">
              {AREAS.map((o, i) => {
                const pa = active === i
                return (
                  <article
                    key={o.direction}
                    aria-hidden={!pa}
                    className={`[grid-area:1/1] bg-[#FFF9F2] border border-[#D9C4AA] rounded-3xl p-7 md:p-9 transition-all duration-500 ease-out ${
                      pa ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium">{o.number} / 03</span>
                      <span className="text-[#321C04] text-[11px] uppercase tracking-[0.2em] font-medium px-3 py-1 rounded-full bg-[#F6E4CF]">
                        {o.direction}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[#321C04] text-2xl md:text-[30px] leading-tight tracking-tight font-medium">
                      {o.title}
                    </h3>
                    <p className="mt-2 text-[#321C04]/70 text-lg" style={EM}>
                      {o.lead}
                    </p>
                    <ul className="mt-6 flex flex-col">
                      {o.goals.map((g, gi) => (
                        <li
                          key={g}
                          style={{ transitionDelay: pa ? `${120 + gi * 90}ms` : '0ms' }}
                          className={`flex gap-3 py-3.5 border-t border-[#D9C4AA]/70 text-[#321C04] text-[15px] md:text-base leading-snug transition-all duration-500 ${
                            pa ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                          }`}
                        >
                          <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#321C04] shrink-0" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
            <p className="sr-only" aria-live="polite">
              {a.direction}: {a.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
