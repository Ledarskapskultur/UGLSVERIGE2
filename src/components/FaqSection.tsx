import { useState } from 'react'

const FAQ = [
  {
    q: 'Måste man vara chef för att gå UGL?',
    a: 'Nej. UGL är för medarbetare, ledare och chefer, och inga förkunskaper krävs.',
  },
  {
    q: 'Kan man gå tillsammans med en kollega?',
    a: 'Inte på samma vecka. Gruppen ska vara en främlingsgrupp, där ingen känner någon sedan tidigare. Det är det som gör uppriktigheten möjlig.',
  },
  {
    q: 'Måste man berätta saker om sig själv?',
    a: 'Var och en bestämmer själv hur mycket som delas. Det gruppen arbetar med är det som händer i rummet under veckan.',
  },
  {
    q: 'Är UGL terapi?',
    a: 'Nej. UGL är en utbildning i grupputveckling och ledarskap, byggd på Försvarshögskolans ledarskapsmodell och forskning om gruppers utveckling.',
  },
  {
    q: 'Får man veta vad gruppen ska göra i förväg?',
    a: 'Ramarna, målen och veckans form är öppna. Exakt vilka uppgifter gruppen möter avslöjas inte i förväg, eftersom upplevelsen blir starkare när uppgifterna möts i stunden.',
  },
  {
    q: 'Måste man bo på kursgården?',
    a: 'Ja. Kost och logi ingår, och ingen kommer och går under veckan. Fem sammanhängande dagar, 48 utbildningstimmar.',
  },
  {
    q: 'Vad kostar det och vad ingår?',
    a: 'Priset varierar mellan kursorter. I priset ingår kursledning av två certifierade handledare, kursmaterial, kost och logi.',
  },
  {
    q: 'Vad händer efter kursen?',
    a: 'Deltagaren åker hem med en personlig utvecklingsplan som gruppen gett sin syn på.',
  },
  {
    q: 'Vem står bakom UGL?',
    a: 'Konceptet ägs av Försvarshögskolan sedan år 2000 och har använts sedan 1981. Försvarshögskolan certifierar alla handledare.',
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-32 px-6 -mt-[25px]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-12 lg:gap-24 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">Vanliga frågor</p>
          <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
            Frågor och{' '}
            <em className="not-italic" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              svar.
            </em>
          </h2>
          <p className="mt-8 text-[#321C04]/80 text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[40ch]">
            Saknas svaret? Skriv till{' '}
            <a
              href="mailto:kontakt@uglsverige.se"
              className="underline underline-offset-4 decoration-[#321C04]/40 hover:decoration-[#321C04] transition-colors"
            >
              kontakt@uglsverige.se
            </a>
            , så hör vi av oss.
          </p>
        </div>

        <ul className="border-t border-[#321C04]/15">
          {FAQ.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item.q} className="border-b border-[#321C04]/15">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left py-5 md:py-6 flex items-start gap-5 group"
                >
                  <span className="flex-1 min-w-0">
                    <span
                      className={`block text-lg md:text-[20px] tracking-tight transition-colors ${
                        isOpen ? 'text-[#321C04]' : 'text-[#321C04]/80 group-hover:text-[#321C04]'
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-3 text-[#321C04]/80 text-[15px] md:text-base leading-[1.5] max-w-[58ch]">
                          {item.a}
                        </span>
                      </span>
                    </span>
                  </span>
                  <span
                    className={`mt-1 w-8 h-8 rounded-full border border-[#321C04]/25 flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-[#321C04] text-[#F6E4CF] rotate-45' : 'text-[#321C04]/70'
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
    </section>
  )
}
