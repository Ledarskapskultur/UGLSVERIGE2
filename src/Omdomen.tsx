import { Star } from 'lucide-react'
import type { Omdome } from './kursdata'

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }
export const MOTTAGARE_OMDOME = 'kontakt@uglsverige.se'

export function Stjarnor({ betyg, size = 14, className = '' }: { betyg: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${betyg.toFixed(1)} av 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} className={i <= Math.round(betyg) ? 'fill-current' : 'opacity-30'} />)}
    </span>
  )
}

export function snitt(o: Omdome[]) {
  return o.length ? o.reduce((a, x) => a + x.betyg, 0) / o.length : 0
}

export default function Omdomen({ omdomen }: { omdomen: Omdome[] }) {
  const s = snitt(omdomen)
  const rek = omdomen.length ? Math.round((omdomen.filter((o) => o.betyg >= 4).length / omdomen.length) * 100) : 0
  const skriv = `mailto:${MOTTAGARE_OMDOME}?subject=${encodeURIComponent('Mitt omdöme om UGL')}&body=${encodeURIComponent('Vecka och kursgård:\nBetyg 1 till 5:\nVad gav veckan dig?\n\nNamn och roll (får visas på uglsverige.store):')}`
  return (
    <section id="omdomen" className="relative z-10 bg-[#FFF9F2] rounded-t-[25px] py-20 md:py-28 px-6 -mt-[25px]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-[#321C04]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">Deltagarna</p>
            <h2 className="text-[#321C04] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[14ch]">
              Vad säger de som <em className="not-italic" style={EM}>gått.</em>
            </h2>
            {omdomen.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-8">
                <div><p className="text-4xl tracking-tight text-[#321C04]" style={EM}>{s.toFixed(1).replace('.', ',')}</p><Stjarnor betyg={s} size={16} className="text-[#9C7A4A] mt-1" /><p className="text-xs text-[#321C04]/60 mt-1">{omdomen.length} {omdomen.length === 1 ? 'omdöme' : 'omdömen'}</p></div>
                <div><p className="text-4xl tracking-tight text-[#321C04]" style={EM}>{rek} %</p><p className="text-xs text-[#321C04]/60 mt-1 max-w-[16ch]">rekommenderar kursen</p></div>
              </div>
            )}
            <a href={skriv} className="mt-8 inline-flex items-center justify-center border border-[#321C04]/40 text-[#321C04] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#321C04] hover:text-[#FFF9F2] transition-colors">Skriv ett omdöme</a>
          </div>
          {omdomen.length ? (
            <ul className="grid sm:grid-cols-2 gap-5">
              {omdomen.slice(0, 6).map((o, i) => (
                <li key={i} className="bg-[#F6E4CF] border border-[#D9C4AA] rounded-3xl p-6">
                  <Stjarnor betyg={o.betyg} className="text-[#9C7A4A]" />
                  <p className="mt-4 text-[#321C04] text-[17px] leading-[1.45]" style={EM}>”{o.text}”</p>
                  <p className="mt-4 text-sm text-[#321C04]">{o.namn}</p>
                  <p className="text-xs text-[#321C04]/60">{[o.roll, o.anlaggning, o.datum].filter(Boolean).join(' · ')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#321C04]/75 text-base sm:text-[17px] leading-[1.5] max-w-[52ch]">
              Omdömen från deltagare publiceras här löpande, med namn och roll, efter genomförd kurs. Har du gått UGL med oss? Dela vad veckan gav dig.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
