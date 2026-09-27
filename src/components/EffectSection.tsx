const EFFECTS = [
  {
    number: '01',
    title: 'Konflikter tas i tid',
    text: 'Efter UGL blir det lättare att ge och ta emot feedback, att se en konflikt innan den låst sig och att hantera den i stället för att vänta ut den. Den största effekten, enligt både cheferna och deras medarbetare, var ett ökat självförtroende i ledarrollen. Det är det som gör att samtalet blir av.',
    tags: ['Feedback', 'Konflikthantering', 'Kommunikation'],
    bg: '#FFF9F2',
  },
  {
    number: '02',
    title: 'Gruppen leds utifrån var den är',
    text: 'Med en klar bild av vilket stadium gruppen befinner sig i går det att anpassa ledarstilen: riktning när gruppen är ny, utrymme när den är mogen. Det ger färre omtag, tydligare roller och mindre stress. Deltagarna i studien började förändra arbetssätt och samarbete i sina egna team.',
    tags: ['Gruppens utveckling', 'Ledarstilar', 'Värderingar'],
    bg: '#F6E4CF',
  },
  {
    number: '03',
    title: 'Självkännedom som märks',
    text: 'En klarare bild av hur det egna beteendet påverkar andra, hur andra påverkar en själv och vad känslor gör med individer och grupper. Medarbetarna skattade cheferna som mer utvecklande ledare efter kursen, och nivån låg kvar sex månader senare. Hos dem som reflekterade regelbundet och fick stöd på jobbet fanns förändringen kvar efter två år.',
    tags: ['Självkännedom', 'Känslor i grupp', 'Erfarenhet av gruppdynamik'],
    bg: '#EBD3B6',
  },
]

export default function EffectSection() {
  return (
    <section id="effekten" className="relative z-10 bg-[#FFF9F2] rounded-t-[25px] py-20 md:py-32 px-6 -mt-[25px]">
      <div className="max-w-6xl mx-auto">
        {/* Intro */}
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 md:gap-16 items-start">
          <div>
            <p className="text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">05. Effekter av UGL</p>
            <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
              Effekter{' '}
              <em className="not-italic" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                av UGL.
              </em>
            </h2>
          </div>
          <p className="text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[60ch]">
            UGL ger medarbetare, ledare och chefer medvetenhet och handlingskraft: en förståelse för hur det egna
            sättet att vara påverkar andra, och verktyg för att göra något åt det. Karolinska Institutet och Försvarshögskolan har
            följt deltagare och deras medarbetare upp till två år efter kursen, och effekten håller i sig.
            Organisationer som vill skicka flera får hjälp att planera vilka som ska gå och när.
          </p>
        </div>

        {/* Stacking cards */}
        <div className="mt-16 md:mt-24 flex flex-col gap-6 md:gap-10">
          {EFFECTS.map((e, i) => (
            <article
              key={e.number}
              className="md:sticky rounded-3xl border border-[#D9C4AA] p-7 md:p-12 shadow-[0_-12px_40px_rgba(50,28,4,0.08)]"
              style={{
                backgroundColor: e.bg,
                top: `calc(96px + ${i * 28}px)`,
              }}
            >
              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 md:gap-16 items-start">
                <div>
                  <span className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium">{e.number}</span>
                  <h3 className="mt-4 text-[#321C04] text-2xl md:text-[30px] leading-[1.15] tracking-tight font-medium max-w-[16ch]">
                    {e.title}
                  </h3>
                </div>
                <div>
                  <p className="text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[60ch]">{e.text}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[#321C04] text-[11px] uppercase tracking-[0.18em] font-medium px-3 py-1.5 rounded-full border border-[#321C04]/25"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
