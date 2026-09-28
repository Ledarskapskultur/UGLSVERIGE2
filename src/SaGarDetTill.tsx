import { ArrowRight, Phone } from 'lucide-react'
import { oppnaRingMig } from './RingMig'

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }
const BILD = 'https://www.uglsverige.store/assets/ugl-samtal.webp'
const STEG = [
  { n: '01', t: 'Boka plats eller anmäl intresse', d: 'Boka när du vet vilken vecka. Anmäl intresse om du vill hålla upp till tre veckor öppna. Inget är bindande ännu.' },
  { n: '02', t: 'Vi hörs kort', d: 'Inom två arbetsdagar stämmer vi av att veckan passar och att gruppen blir rätt sammansatt.' },
  { n: '03', t: 'Bekräftelse och faktura', d: 'Först då är platsen din. Välkomstbrev med kursgård, tider och resväg kommer före kursstart. Ingen sista anmälningsdag: det går att boka fram till dagen före kursstart, så länge det finns platser.' },
]

export default function SaGarDetTill({ antal, onVidare }: { antal: number; onVidare: () => void }) {
  const upp = () => document.getElementById('kurslista')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <section id="anmalan" className="relative z-10 bg-[#2B2724] rounded-t-[25px] py-20 md:py-28 px-6 mb-[-25px] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${BILD}")` }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(43,39,36,0.9) 0%, rgba(43,39,36,0.8) 50%, rgba(43,39,36,0.7) 100%)' }} />
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-12 lg:gap-24 items-start">
        <div>
          <p className="text-[#F6E4CF]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">02. Så går det till</p>
          <h2 className="text-[#FFF9F2] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[16ch]">
            Tre steg, inga <em className="not-italic" style={EM}>överraskningar.</em>
          </h2>
          <p className="mt-8 text-[#F6E4CF]/80 text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[46ch]">
            Allt börjar i kurslistan. Du väljer veckor, vi hör av oss, och först när du sagt ja är platsen bokad.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {antal > 0 ? (
              <button type="button" onClick={onVidare} className="inline-flex items-center gap-2 bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#FFF9F2] transition-colors">
                Gå vidare med {antal === 1 ? 'din vecka' : `dina ${antal} veckor`} <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={upp} className="inline-flex items-center gap-2 bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#FFF9F2] transition-colors">
                Välj veckor i listan <ArrowRight size={16} />
              </button>
            )}
            <button type="button" onClick={oppnaRingMig} className="inline-flex items-center gap-2 text-[#F6E4CF]/85 hover:text-[#FFF9F2] text-sm font-medium underline underline-offset-4 decoration-[#F6E4CF]/40"><Phone size={14} /> Vi ringer upp dig</button>
          </div>
        </div>
        <ul className="border-t border-[#F6E4CF]/20">
          {STEG.map((s) => (
            <li key={s.n} className="border-b border-[#F6E4CF]/20 py-6 flex gap-6">
              <span className="text-[#F6E4CF]/50 text-xs tracking-[0.2em] font-medium pt-1.5">{s.n}</span>
              <span>
                <span className="block text-[#FFF9F2] text-xl md:text-2xl tracking-tight">{s.t}</span>
                <span className="block mt-2 text-[#F6E4CF]/75 text-[15px] md:text-base leading-[1.5] max-w-[52ch]">{s.d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
