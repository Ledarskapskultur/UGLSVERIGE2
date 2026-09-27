import { ArrowRight, Calendar, Check, MapPin, Send, Users } from 'lucide-react'
import { kr, type Kurs } from './kursdata'
const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }

export default function KursKort({ k, vald, fullt, onToggle, onChef, badge }: { k: Kurs; vald: boolean; fullt: boolean; onToggle: () => void; onChef: () => void; badge: string | null }) {
  const muted = vald ? 'text-[#F6E4CF]/70' : 'text-[#321C04]/70'
  return (
    <article
      className={`rounded-3xl border p-4 md:p-5 grid gap-5 md:gap-8 items-center transition-colors md:grid-cols-[220px_minmax(0,1.4fr)_minmax(0,1fr)_auto] ${
        vald ? 'bg-[#321C04] border-[#321C04] text-[#FFF9F2]' : 'bg-[#FFF9F2] border-[#D9C4AA] text-[#321C04]'
      }`}
    >
      <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-2xl overflow-hidden bg-[#2B2724]">
        <img src={k.bild} alt="" loading="lazy" className="w-full h-full object-cover" />
        {(badge || !k.ledig) && (
          <span className={`absolute top-3 left-3 text-[11px] uppercase tracking-[0.18em] font-medium px-3 py-1.5 rounded-full ${k.ledig ? 'bg-[#321C04] text-[#F6E4CF]' : 'bg-[#FFF9F2] text-[#321C04]'}`}>
            {k.ledig ? badge : 'Fullbokad'}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-3xl md:text-[34px] leading-none tracking-tight" style={EM}>Vecka {k.vecka}</h3>
        <ul className={`mt-4 flex flex-col gap-2 text-[15px] ${muted}`}>
          <li className="flex items-start gap-2.5"><Calendar size={16} className="shrink-0 mt-0.5" />{k.period}</li>
          <li className="flex items-start gap-2.5"><MapPin size={16} className="shrink-0 mt-0.5" />{k.anlaggning}, {k.ort}</li>
          <li className="flex items-start gap-2.5"><Users size={16} className="shrink-0 mt-0.5" /><span>{k.handledare.length ? k.handledare.join(', ') : 'Handledare meddelas senare'}</span></li>
        </ul>
      </div>

      <div className={`md:border-l md:pl-8 ${vald ? 'border-[#F6E4CF]/20' : 'border-[#D9C4AA]'}`}>
        {k.total ? (
          <>
            <p className="text-2xl font-medium tracking-tight">{kr(k.total)}</p>
            <p className={`text-xs ${muted}`}>exkl. moms</p>
            <dl className={`mt-3 pt-3 border-t text-sm ${vald ? 'border-[#F6E4CF]/20' : 'border-[#D9C4AA]/70'} ${muted}`}>
              {k.samlat ? (
                <div className="flex justify-between gap-3"><dt>Kurs, kost och logi</dt><dd>Ingår</dd></div>
              ) : (
                <>
                  <div className="flex justify-between gap-3"><dt>Kurs</dt><dd>{kr(k.kurspris)}</dd></div>
                  <div className="flex justify-between gap-3 mt-1"><dt>Kost och logi</dt><dd>{kr(k.logi)}</dd></div>
                </>
              )}
            </dl>
          </>
        ) : (
          <p className="text-base">Pris meddelas</p>
        )}
      </div>

      <div className="flex flex-row md:flex-col gap-3 md:items-stretch md:min-w-[190px]">
        <button
          type="button"
          onClick={onToggle}
          disabled={!k.ledig || (fullt && !vald)}
          aria-pressed={vald}
          className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            vald ? 'bg-[#F6E4CF] text-[#321C04] hover:bg-[#FFF9F2]' : 'bg-[#321C04] text-[#FFF9F2] hover:bg-[#2B2724]'
          }`}
        >
          {vald ? <><Check size={15} /> Vald</> : !k.ledig ? 'Fullbokad' : fullt ? 'Max tre valda' : 'Välj veckan'}
        </button>
        <button
          type="button"
          onClick={onChef}
          disabled={!k.ledig || (fullt && !vald)}
          className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            vald ? 'border-[#F6E4CF]/40 text-[#FFF9F2] hover:bg-[#F6E4CF]/10' : 'border-[#321C04]/30 text-[#321C04] hover:border-[#321C04]'
          }`}
        >
          <Send size={14} /> Skicka till chefen
        </button>
        <a
          href={k.lank}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-1.5 text-sm font-medium py-1 underline underline-offset-4 transition-colors ${
            vald ? 'text-[#F6E4CF]/80 hover:text-[#FFF9F2]' : 'text-[#321C04]/70 hover:text-[#321C04]'
          }`}
        >
          Se kursen
          <ArrowRight size={15} />
        </a>
      </div>
    </article>
  )
}

