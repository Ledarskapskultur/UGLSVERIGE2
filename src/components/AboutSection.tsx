const H2 = 'text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]'
const P = 'text-[#321C04] text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[60ch]'
const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }

export default function AboutSection() {
  return (
    <section className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-16 md:gap-24">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start">
          <h2 className={H2}>
            Vad är{' '}
            <em className="not-italic" style={EM}>
              UGL.
            </em>
          </h2>
          <p className={P}>
            UGL, Utveckling av grupp och ledare, är Sveriges mest använda ledarskapsutbildning. Under fem sammanhängande
            dagar på kursgård lär sig 8 till 12 deltagare som inte känner varandra hur grupper utvecklas, hur de själva
            fungerar tillsammans med andra och hur de kan leda utifrån det. Konceptet ägs av{' '}
            <a
              href="https://www.fhs.se/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-[#321C04]/40 hover:decoration-[#321C04] transition-colors"
            >
              Försvarshögskolan
            </a>
            , som har använt det sedan 1981 och certifierar alla handledare. Kursen bygger på Försvarshögskolans
            ledarskapsmodell och forskning om gruppers utveckling, och dess effekt har utvärderats av Karolinska
            Institutet.
          </p>
        </div>

        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 md:gap-16 items-start">
          <h2 className={H2}>
            Målgrupp och{' '}
            <em className="not-italic" style={EM}>
              deltagare.
            </em>
          </h2>
          <p className={P}>
            UGL riktar sig till medarbetare, ledare och chefer. Kursen utvecklar de förmågor som ledarskap kräver, oavsett
            riktning: att leda sig själv, att leda kollegor och kunder, och att leda ett team eller andra ledare.
            Grunden är självkännedom och en ökad trygghet i den egna rollen. Det är det som märks i organisationen:
            tydligare samarbete, konflikter som tas i tid och grupper som får mer gjort.
          </p>
        </div>
      </div>
    </section>
  )
}
