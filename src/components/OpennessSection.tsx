import { useEffect, useRef, useState } from 'react'

const PRINCIPLES = [
  {
    number: '01',
    title: 'Här och nu',
    text: 'Det som händer i gruppen den här veckan, inte det som hänt förut.',
  },
  {
    number: '02',
    title: 'Eget ansvar',
    text: 'Var och en väljer själv vad som delas, och ansvarar för sina egna känslor och handlingar.',
  },
  {
    number: '03',
    title: 'Utmana, inte kränka',
    text: 'Pröva nya sätt att tänka och handla. Aldrig på någon annans bekostnad.',
  },
]

const INTERVAL = 4500
const BG_IMAGE = 'https://www.uglsverige.store/assets/ugl-oppenhet.webp'

export default function OpennessSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => setInView(entries[0].isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || paused) return
    const t = setInterval(() => setActive((a) => (a + 1) % PRINCIPLES.length), INTERVAL)
    return () => clearInterval(t)
  }, [inView, paused, active])

  const choose = (i: number) => {
    setActive(i)
    setPaused(true)
  }

  return (
    <section id="oppenhet" className="relative z-10 bg-[#2B2724] rounded-t-[25px] py-20 md:py-32 px-6 overflow-hidden">
      {/* Background image with dark tone */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${BG_IMAGE}")` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(43,39,36,0.82) 0%, rgba(43,39,36,0.72) 45%, rgba(43,39,36,0.62) 100%)',
        }}
      />

      <div ref={ref} className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 lg:gap-24 items-start">
        {/* Left: heading + intro */}
        <div className="lg:sticky lg:top-28">
          <p className="text-[#F6E4CF]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">04. Öppenhet och trygghet</p>
          <h2 className="text-[#FFF9F2] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
            Utmanande,{' '}
            <em className="not-italic" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              aldrig utlämnande.
            </em>
          </h2>
          <p className="mt-8 text-[#FFF9F2] text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[52ch]">
            Gruppen bygger veckan tillsammans. Ingen sitter av den, och ju mer deltagarna vågar visa av sig själva,
            desto mer får de ut av varandra.
          </p>
          <p className="mt-5 text-[#F6E4CF]/75 text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[52ch]">
            Öppenhet uppstår inte på uppmaning. Den växer när det känns tryggt nog, och med den växer förtroende och
            tillhörighet. Det är det som gör att gruppen kan arbeta på riktigt, och det är det som byggs under veckan.
          </p>
        </div>

        {/* Right: interactive principles */}
        <div>
          <p className="text-[#F6E4CF]/60 text-xs uppercase tracking-[0.25em] font-medium mb-6">Tre spelregler för veckan</p>
          <ul className="border-t border-[#F6E4CF]/20">
            {PRINCIPLES.map((p, i) => {
              const open = active === i
              return (
                <li key={p.number} className="border-b border-[#F6E4CF]/20">
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    onMouseEnter={() => setPaused(true)}
                    aria-expanded={open}
                    className="w-full text-left py-6 md:py-7 flex gap-5 md:gap-8 items-start group"
                  >
                    <span
                      className={`text-xs tracking-[0.2em] font-medium pt-2 transition-colors duration-500 ${
                        open ? 'text-[#F6E4CF]' : 'text-[#F6E4CF]/40'
                      }`}
                    >
                      {p.number}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className={`block text-2xl md:text-[28px] tracking-tight transition-colors duration-500 ${
                          open ? 'text-[#FFF9F2]' : 'text-[#F6E4CF]/50 group-hover:text-[#F6E4CF]/80'
                        }`}
                      >
                        {p.title}
                      </span>
                      <span
                        className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
                        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-3 text-[#F6E4CF]/80 text-[15px] md:text-base leading-[1.5] max-w-[46ch]">
                            {p.text}
                          </span>
                        </span>
                      </span>
                      {/* progress line */}
                      <span className="block mt-4 h-[2px] w-full bg-[#F6E4CF]/10 rounded-full overflow-hidden">
                        <span
                          className="block h-full bg-[#F6E4CF] rounded-full"
                          style={{
                            width: open ? '100%' : '0%',
                            transition: open && !paused ? `width ${INTERVAL}ms linear` : 'width 300ms ease-out',
                          }}
                        />
                      </span>
                    </span>
                    <span
                      className={`mt-2 w-8 h-8 rounded-full border border-[#F6E4CF]/30 flex items-center justify-center shrink-0 transition-all duration-500 ${
                        open ? 'bg-[#F6E4CF] text-[#2B2724] rotate-45' : 'text-[#F6E4CF]/60'
                      }`}
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M6 1v10M1 6h10" />
                      </svg>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
