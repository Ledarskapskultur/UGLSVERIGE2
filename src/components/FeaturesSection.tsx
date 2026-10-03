import { useEffect, useRef, useState } from 'react'

const BG_IMAGE = 'https://www.uglsverige.store/assets/ugl-upplevelse.webp'
const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }

// Varje kort: en kort poäng först (det man ska minnas), sedan förklaringen.
const FEATURES = [
  {
    nr: '01',
    title: 'Tid för personlig utveckling',
    poang: 'Fem dagar ger ett djup som en workshop aldrig hinner med.',
    description:
      'Gruppen hinner gå från artighet till uppriktighet, och det finns tid att pröva nya sätt att agera flera gånger och se vad de gör med gruppen.',
    image: 'https://www.uglsverige.store/assets/ugl-tid.webp',
  },
  {
    nr: '02',
    title: 'Nya ögon på ledarskapet',
    poang: 'Du blir sedd för det du faktiskt gör, inte för din roll.',
    description:
      'Deltagarna möts för första gången, och det är det som gör uppriktigheten möjlig. Gruppen tränar på att ge och ta emot feedback så att den leder någonstans, och relationerna blir ofta ovanligt nära.',
    image: 'https://www.uglsverige.store/assets/ugl-feedback.webp',
  },
  {
    nr: '03',
    title: 'Upplevelsebaserad utveckling',
    poang: 'Som en film: bäst när ingen har berättat slutet i förväg.',
    description:
      'Kursen handlar om hur grupper utvecklas, kommunikation och feedback, konflikter, beslut och självkännedom. Innehållet är inte hemligt, men det blir starkare när uppgifterna möts i stunden, tillsammans med de andra.',
    image: 'https://www.uglsverige.store/assets/ugl-upplevelse.webp',
  },
]

export default function FeaturesSection() {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState<boolean[]>(() => FEATURES.map(() => false))
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null)

    // Kortet som ligger närmast mitten av skärmen är aktivt.
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setRevealed((prev) => {
              if (prev[idx]) return prev
              const next = [...prev]
              next[idx] = true
              return next
            })
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    cards.forEach((c) => {
      activeObserver.observe(c)
      revealObserver.observe(c)
    })
    return () => {
      activeObserver.disconnect()
      revealObserver.disconnect()
    }
  }, [])

  const scrollTo = (i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section
      id="features"
      className="relative bg-[#2B2724] px-5 md:px-10 lg:px-16 pt-20 pb-24 md:pt-28 md:pb-32 mb-[-25px]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(43,39,36,0.88) 0%, rgba(43,39,36,0.8) 45%, rgba(43,39,36,0.72) 100%), url("${BG_IMAGE}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16 xl:gap-24">
        {/* Vänster: rubrik, ingress och vägvisare som står still */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">Vad veckan ger</p>
          <h2 className="text-white text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
            Ny syn på sig själv, gruppen och{' '}
            <em className="not-italic" style={EM}>
              ledarskapet.
            </em>
          </h2>
          <p className="mt-6 text-[#F6E4CF]/80 text-base md:text-[17px] leading-[1.55] max-w-[42ch]">
            Det du tar med dig hem är inte en metod att följa, utan en klarare bild av hur du påverkar andra och vad
            du vill göra annorlunda. Tre saker gör det möjligt.
          </p>

          {/* Vägvisare med linje som visar var du är */}
          <ol className="hidden lg:block mt-10 relative border-l border-[#F6E4CF]/15">
            {FEATURES.map((f, i) => (
              <li key={f.title}>
                <button
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-current={active === i}
                  className="group relative w-full text-left pl-6 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F6E4CF] rounded-r-lg"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-px top-2 bottom-2 w-[2px] rounded-full transition-all duration-500 ${
                      active === i ? 'bg-[#F6E4CF]' : 'bg-transparent'
                    }`}
                  />
                  <span
                    className={`block text-[11px] tracking-[0.2em] font-medium transition-colors duration-500 ${
                      active === i ? 'text-[#F6E4CF]' : 'text-[#F6E4CF]/40'
                    }`}
                  >
                    {f.nr}
                  </span>
                  <span
                    className={`block mt-1 text-lg tracking-tight transition-colors duration-500 ${
                      active === i ? 'text-white' : 'text-white/45 group-hover:text-white/75'
                    }`}
                  >
                    {f.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="hidden lg:flex items-center gap-5 mt-10">
            <a
              href="/kurser"
              className="shrink-0 whitespace-nowrap bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#FFF9F2] transition-colors"
            >
              Se kursdatum
            </a>
            <p className="text-white/60 text-sm">Fem dagar. Två handledare. En grupp som byggs från grunden.</p>
          </div>
        </div>

        {/* Höger: tre kompakta kort, bild och text sida vid sida */}
        <div className="flex flex-col gap-5 md:gap-6 mt-12 lg:mt-0">
          {FEATURES.map((f, i) => {
            const pa = active === i
            return (
              <div
                key={f.title}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                data-index={i}
                className={`group grid sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-0 rounded-3xl overflow-hidden border backdrop-blur-md transition-all duration-700 ease-out ${
                  pa ? 'bg-[#2B2724]/75 border-[#F6E4CF]/30' : 'bg-[#2B2724]/55 border-[#F6E4CF]/10'
                } ${revealed[i] ? `translate-x-0 opacity-100 ${pa ? '' : 'lg:opacity-60'}` : 'translate-x-16 opacity-0'}`}
              >
                <div className="relative aspect-[2/1] sm:aspect-auto sm:min-h-[260px] overflow-hidden bg-[#2B2724]">
                  <img
                    src={f.image}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out ${
                      pa ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  <span
                    className="absolute top-4 left-4 text-[#FFF9F2] text-4xl leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
                    style={EM}
                  >
                    {f.nr}
                  </span>
                </div>
                <div className="p-5 sm:p-6 md:p-8 flex flex-col">
                  <h3 className="text-[#F6E4CF]/70 text-[11px] uppercase tracking-[0.2em] font-medium">{f.title}</h3>
                  <p className="mt-3 text-white text-xl md:text-[24px] leading-[1.25] tracking-tight">{f.poang}</p>
                  <p className="mt-4 text-white/65 text-[15px] leading-relaxed">{f.description}</p>
                </div>
              </div>
            )
          })}

          {/* Mobil: knappen syns också här */}
          <a
            href="/kurser"
            className="lg:hidden self-start mt-2 bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#FFF9F2] transition-colors"
          >
            Se kursdatum
          </a>
        </div>
      </div>
    </section>
  )
}
