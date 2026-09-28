import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import type { ReactNode } from 'react'



export type Kort = { title: string; description: string; image: string }
// Samma design som "Vad veckan ger" pa startsidan: fast bakgrundsbild, vanster kolumn med rubrik och
// piller, hoger kolumn med kort som glider in. Innehallet skickas in.
export default function Kortsektion({ id, eyebrow, heading, items: FEATURES, bild, fot, cta, ctaHref, ctaOnClick, rundad }: {
  id?: string; eyebrow: string; heading: ReactNode; items: Kort[]; bild: string; fot?: string; cta?: string; ctaHref?: string; ctaOnClick?: () => void; rundad?: boolean
}) {
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
      id={id}
      className={`relative bg-[#2B2724] px-5 md:px-10 lg:px-16 py-20 md:py-40 lg:py-48 mb-[-25px] ${rundad ? 'z-10 rounded-t-[25px] -mt-[25px] overflow-hidden' : ''}`}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(43,39,36,0.86) 0%, rgba(43,39,36,0.76) 45%, rgba(43,39,36,0.68) 100%), url("${bild}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[400px_1fr] xl:grid-cols-[460px_1fr] lg:gap-24 xl:gap-48">
        {/* Left column */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-between lg:py-32">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">{eyebrow}</p>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">{heading}</h2>
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

          {(fot || cta) && (
            <div className="hidden lg:flex flex-col items-start gap-4 mt-16">
              {fot && <p className="text-white text-sm font-medium">{fot}</p>}
              {cta && (ctaHref
                ? <a href={ctaHref} className="bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#FFF9F2] transition-colors">{cta}</a>
                : <button type="button" onClick={ctaOnClick} className="bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#FFF9F2] transition-colors">{cta}</button>)}
            </div>
          )}
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
