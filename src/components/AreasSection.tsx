import { useEffect, useRef, useState } from 'react'

const AREAS = [
  {
    number: '01',
    direction: 'Inåt',
    title: 'Sig själv',
    goals: [
      'Förstå drivkrafterna bakom det egna handlandet',
      'Upptäcka hur känslor och värderingar färgar relationer',
      'Göra reflektion till en vana, inte en engångsövning',
    ],
  },
  {
    number: '02',
    direction: 'Utåt',
    title: 'Mötet med andra',
    goals: [
      'Kommunicera direkt och klart, även när det är obekvämt',
      'Ge och ta emot feedback utan att gå i försvar',
      'Gå in i konflikter i stället för runt dem',
    ],
  },
  {
    number: '03',
    direction: 'Uppåt',
    title: 'Gruppen',
    goals: [
      'Läsa vilket stadium en grupp befinner sig i',
      'Förstå vad roller, normer och ledarstil gör med gruppen',
      'Fatta beslut som gruppen står bakom',
    ],
  },
]

export default function AreasSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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

  return (
    <section id="utvecklingsomraden" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-32 px-6 mb-[-25px]">
      <div className="max-w-6xl mx-auto">
        {/* Intro */}
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 md:gap-16 items-start">
          <div>
            <p className="text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">
              Tre riktningar
            </p>
            <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
              Utvecklingsområden{' '}
              <em className="not-italic" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                under UGL.
              </em>
            </h2>
          </div>
          <p className="text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[60ch]">
            Under veckan arbetar gruppen med det som avgör hur en grupp fungerar: hur den bildas och utvecklas, hur man
            kommunicerar och lyssnar, hur feedback ges och tas emot, hur konflikter uppstår och kan hanteras, och vad
            värderingar och känslor gör med relationer och ledarskap. Deltagarna prövar olika sätt att leda och ser
            direkt vad de gör med gruppen, i stunden. Försvarshögskolans utvecklingsmål håller ihop det.
            De pekar åt tre håll: inåt mot en själv, utåt mot mötet med andra, och uppåt mot gruppen som helhet.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-16 md:mt-20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D9C4AA]" />
          <span className="flex-1 h-[2px] bg-[#D9C4AA]" />
          <span className="w-2 h-2 rounded-full bg-[#D9C4AA]" />
        </div>

        {/* Three directions */}
        <div ref={ref} className="mt-12 md:mt-16 grid md:grid-cols-3 gap-5 md:gap-6">
          {AREAS.map((a, i) => (
            <div
              key={a.number}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`bg-[#FFF9F2] border border-[#D9C4AA] rounded-3xl p-7 md:p-8 flex flex-col transition-all duration-700 ease-out ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium">{a.number}</span>
                <span className="text-[#321C04] text-[11px] uppercase tracking-[0.2em] font-medium px-3 py-1 rounded-full bg-[#F6E4CF]">
                  {a.direction}
                </span>
              </div>
              <h3 className="text-[#321C04] text-2xl md:text-[26px] font-medium tracking-tight mt-5">{a.title}</h3>
              <ul className="mt-6 flex flex-col">
                {a.goals.map((g) => (
                  <li
                    key={g}
                    className="flex gap-3 py-3 border-t border-[#D9C4AA]/70 text-[#321C04] text-[15px] leading-snug"
                  >
                    <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#321C04] shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
