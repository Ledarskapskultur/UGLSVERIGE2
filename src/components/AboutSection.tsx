const H2 = 'text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal'
const P = 'text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.55] max-w-[60ch]'
const EYEBROW = 'text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5'
const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }

// Snabbfakta: det besökaren vill veta innan hen läser vidare.
const FAKTA = [
  { tal: '5', enhet: 'dagar', text: 'i följd, måndag till fredag' },
  { tal: '8–12', enhet: 'deltagare', text: 'som inte känner varandra' },
  { tal: '2', enhet: 'handledare', text: 'certifierade av Försvarshögskolan' },
  { tal: '1981', enhet: 'sedan', text: 'har kursen utvecklats och prövats' },
]

// Så går veckan till, i tre steg.
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

// Vem kursen passar, uttryckt som roller besökaren kan känna igen sig i.
const FOR_DIG = [
  { roll: 'Medarbetare och specialist', text: 'Du vill samarbeta bättre, våga säga ifrån och förstå varför vissa möten skaver.' },
  { roll: 'Ny chef eller projektledare', text: 'Du har fått ansvar för en grupp och vill ha trygghet i rollen från början.' },
  { roll: 'Erfaren chef', text: 'Du vill se ditt eget ledarskap med nya ögon och leda gruppen utifrån var den är.' },
]

export default function AboutSection() {
  return (
    <section id="om-ugl" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-16 md:gap-24">
        {/* Ingress: svaret först, på en rad */}
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start">
          <div>
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
              En vecka där du lär dig hur grupper fungerar genom att vara{' '}
              <em className="not-italic" style={EM}>
                i en.
              </em>
            </p>
            <p className={`${P} mt-6`}>
              UGL, Utveckling av grupp och ledare, är Sveriges mest använda ledarskapsutbildning. Det är ingen föreläsning.
              Du bor på kursgård med en liten grupp och lär dig av det som händer mellan er, med stöd av två handledare.
            </p>
          </div>
        </div>

        {/* Snabbfakta */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#321C04]/15 rounded-2xl overflow-hidden border border-[#321C04]/15">
          {FAKTA.map((f) => (
            <div key={f.enhet} className="bg-[#F6E4CF] p-6 md:p-8">
              <dt className="text-[#321C04]/60 text-[11px] uppercase tracking-[0.2em] font-medium">{f.enhet}</dt>
              <dd className="mt-2 text-[#321C04] text-4xl md:text-5xl leading-none tracking-tight" style={EM}>
                {f.tal}
              </dd>
              <dd className="mt-3 text-[#321C04]/75 text-sm leading-snug">{f.text}</dd>
            </div>
          ))}
        </dl>

        {/* Sa gar veckan till */}
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start">
          <div>
            <p className={EYEBROW}>Så fungerar det</p>
            <h2 className={`${H2} max-w-[12ch]`}>
              Lärandet sker{' '}
              <em className="not-italic" style={EM}>
                i gruppen.
              </em>
            </h2>
          </div>
          <ol className="flex flex-col">
            {STEG.map((s, i) => (
              <li
                key={s.nr}
                className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-6 ${i ? 'border-t border-[#321C04]/15' : 'pt-0'}`}
              >
                <span className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium pt-1.5">{s.nr}</span>
                <div>
                  <h3 className="text-[#321C04] text-xl md:text-2xl leading-tight tracking-tight font-medium">{s.titel}</h3>
                  <p className="mt-2 text-[#321C04]/80 text-base sm:text-[17px] leading-[1.55] max-w-[55ch]">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Passar det mig? */}
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start">
          <div>
            <p className={EYEBROW}>Målgrupp</p>
            <h2 className={`${H2} max-w-[12ch]`}>
              Passar det{' '}
              <em className="not-italic" style={EM}>
                mig?
              </em>
            </h2>
            <p className="mt-5 text-[#321C04]/75 text-base leading-[1.55] max-w-[34ch]">
              Du behöver inte vara chef. UGL handlar om att leda sig själv lika mycket som andra.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {FOR_DIG.map((d) => (
              <div key={d.roll} className="rounded-2xl bg-[#FFF9F2] border border-[#D9C4AA] p-6">
                <h3 className="text-[#321C04] text-lg leading-snug font-medium">{d.roll}</h3>
                <p className="mt-3 text-[#321C04]/80 text-[15px] leading-[1.5]">{d.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trovardighet */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 pt-8 border-t border-[#321C04]/15">
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
            className="md:ml-auto inline-flex items-center gap-2 text-[#321C04] text-sm font-medium underline underline-offset-4 decoration-[#321C04]/40 hover:decoration-[#321C04] whitespace-nowrap"
          >
            Se kommande veckor <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
