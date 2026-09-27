import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'

const BG_IMAGE = 'https://www.uglsverige.store/assets/ugl-upplevelse.webp'

const FEATURES = [
  {
    title: 'Tid för personlig utveckling',
    description:
      'Fem sammanhängande dagar ger ett djup som en enstaka workshop aldrig hinner med. Gruppen hinner gå från artighet till uppriktighet, och det finns tid att pröva nya sätt att agera flera gånger och se vad de gör med gruppen.',
    image: 'https://www.uglsverige.store/assets/ugl-tid.webp',
  },
  {
    title: 'Nya ögon på ledarskapet',
    description:
      'Deltagarna möts för första gången, och det är just det som gör uppriktigheten möjlig. Var och en blir sedd för det som faktiskt görs i rummet, av människor utan förutfattade meningar. Gruppen tränar på att ge och ta emot feedback så att den leder någonstans, och relationerna som växer fram blir ofta ovanligt nära.',
    image: 'https://www.uglsverige.store/assets/ugl-feedback.webp',
  },
  {
    title: 'Upplevelsebaserad utveckling',
    description:
      'Kursen handlar om hur grupper utvecklas, om kommunikation och feedback, konflikter, beslut och självkännedom. Innehållet är inte hemligt. Men upplevelsen blir starkare när uppgifterna möts i stunden, tillsammans med de andra. Ungefär som med en film: den blir bäst när ingen har berättat slutet i förväg.',
    image: 'https://www.uglsverige.store/assets/ugl-upplevelse.webp',
  },
]

export default function FeaturesSection() {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState<boolean[]>(() => FEATURES.map(() => false))
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null)

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setActive(idx)
          }
        })
      },
      { threshold: 0.6 },
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
      className="relative bg-[#2B2724] px-5 md:px-10 lg:px-16 py-20 md:py-40 lg:py-48 mb-[-25px]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(43,39,36,0.86) 0%, rgba(43,39,36,0.76) 45%, rgba(43,39,36,0.68) 100%), url("${BG_IMAGE}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[400px_1fr] xl:grid-cols-[460px_1fr] lg:gap-24 xl:gap-48">
        {/* Left column */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-between lg:py-32">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">
              Vad veckan ger
            </p>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
              Ny syn på sig själv, gruppen och{' '}
              <em className="not-italic" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                ledarskapet.
              </em>
            </h2>
            <div className="hidden lg:flex flex-col items-start gap-2 mt-10">
              {FEATURES.map((f, i) => (
                <button
                  key={f.title}
                  type="button"
                  onClick={() => scrollTo(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium text-left transition-colors ${
                    active === i ? 'bg-[#F6E4CF] text-[#2B2724]' : 'bg-[#2B2724]/50 text-[#F6E4CF]/60 border border-[#F6E4CF]/20'
                  }`}
                >
                  {f.title}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-start gap-4 mt-16">
            <p className="text-white text-sm font-medium">
              Fem dagar. Två handledare. En grupp som byggs från grunden.
            </p>
            <a
              href="/kurser"
              className="bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#FFF9F2] transition-colors"
            >
              Se kursdatum
            </a>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8 md:gap-12 mt-12 lg:mt-0">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              data-index={i}
              className={`bg-[#2B2724]/60 backdrop-blur-md border border-[#F6E4CF]/10 rounded-3xl p-6 md:p-10 transition-all duration-700 ease-out ${
                revealed[i] ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
              }`}
            >
              <Logo fill="#F6E4CF" />
              <h3 className="text-white text-xl md:text-2xl font-medium mt-6">{f.title}</h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-[#2B2724] mt-6">
                <img src={f.image} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="text-white/60 font-medium text-sm md:text-base leading-relaxed mt-6">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
