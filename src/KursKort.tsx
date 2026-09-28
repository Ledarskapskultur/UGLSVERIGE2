import { ArrowRight, Calendar, Check, MapPin, Users } from 'lucide-react'
import { kr, type Kurs } from './kursdata'
import { Stjarnor } from './Omdomen'
const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }

export default function KursKort({ k, vald, fullt, onToggle, onIntresse, onVisa, betyg, badge, kompakt }: { k: Kurs; vald: boolean; fullt: boolean; onToggle: () => void; onIntresse: () => void; onVisa: () => void; betyg?: { snitt: number; antal: number } | null; kompakt?: boolean; badge: string | null }) {
  const muted = vald ? 'text-[#F6E4CF]/70' : 'text-[#321C04]/70'
  return (
    <article
      className={`rounded-3xl border p-4 md:p-5 grid gap-4 md:gap-5 items-start transition-colors ${kompakt ? 'md:grid-cols-[120px_minmax(0,1fr)]' : 'md:grid-cols-[150px_minmax(0,1fr)_200px]'} ${
        vald ? 'bg-[#321C04] border-[#321C04] text-[#FFF9F2]' : 'bg-[#FFF9F2] border-[#D9C4AA] text-[#321C04]'
      }`}
    >
      <div className={`relative aspect-[4/3] ${kompakt ? 'md:aspect-[3/4]' : 'md:aspect-[4/5]'} rounded-2xl overflow-hidden bg-[#2B2724]`}>
        <img src={k.bild} alt="" loading="lazy" className="w-full h-full object-cover" />
        {(badge || !k.ledig) && (
          <span className={`absolute top-2 left-2 text-[10px] uppercase tracking-[0.16em] font-medium px-2.5 py-1 rounded-full ${k.ledig ? 'bg-[#321C04] text-[#F6E4CF]' : 'bg-[#FFF9F2] text-[#321C04]'}`}>
            {k.ledig ? badge : 'Fullbokad'}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-3xl md:text-[30px] leading-none tracking-tight" style={EM}>Vecka {k.vecka}</h3>
          {kompakt && (k.total ? (
            <p className="text-xl font-medium tracking-tight whitespace-nowrap">{kr(k.total)} <span className={`text-xs font-normal ${muted}`}>exkl. moms</span></p>
          ) : (
            <p className="text-base">Pris meddelas</p>
          ))}
        </div>
        {(betyg || (k.ledig && k.platser !== null)) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
            {betyg && <span className={`inline-flex items-center gap-1.5 ${vald ? 'text-[#F6E4CF]' : 'text-[#9C7A4A]'}`}><Stjarnor betyg={betyg.snitt} size={13} /><span className={muted}>{betyg.snitt.toFixed(1).replace('.', ',')} · {betyg.antal} {betyg.antal === 1 ? 'omdöme' : 'omdömen'}</span></span>}
            {k.ledig && k.platser !== null && (
              <span className={`inline-flex items-center gap-1.5 font-medium ${k.platser <= 3 ? (vald ? 'text-[#F6C9A8]' : 'text-[#9C3A2E]') : muted}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${k.platser <= 3 ? 'bg-current' : 'bg-current opacity-50'}`} />
                {k.platser === 1 ? '1 plats kvar' : `${k.platser} platser kvar`}
              </span>
            )}
          </div>
        )}
        <ul className={`mt-3 flex flex-col gap-1.5 text-[14px] ${muted}`}>
          <li className="flex items-start gap-2.5"><Calendar size={16} className="shrink-0 mt-0.5" />{k.period}</li>
          <li className="flex items-start gap-2.5"><MapPin size={16} className="shrink-0 mt-0.5" />{k.anlaggning}, {k.ort}</li>
          <li className="flex items-start gap-2.5"><Users size={16} className="shrink-0 mt-0.5" /><span>{k.handledare.length ? k.handledare.join(', ') : 'Handledare meddelas senare'}</span></li>
        </ul>
        {kompakt && k.total > 0 && (
          <p className={`mt-2 text-[13px] ${muted}`}>
            {k.samlat ? 'Kurs, kost och logi ingår' : `Kurs ${kr(k.kurspris)} · Kost och logi ${kr(k.logi)}`}
          </p>
        )}
        <div className={`mt-4 pt-4 border-t flex flex-wrap items-center gap-3 ${kompakt ? '' : 'md:hidden'} ${vald ? 'border-[#F6E4CF]/20' : 'border-[#D9C4AA]/70'}`}>
          <button
            type="button"
            onClick={onToggle}
            disabled={!k.ledig || (fullt && !vald)}
            aria-pressed={vald}
            className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              vald ? 'bg-[#F6E4CF] text-[#321C04] hover:bg-[#FFF9F2]' : 'bg-[#321C04] text-[#FFF9F2] hover:bg-[#2B2724]'
            }`}
          >
            {vald ? <><Check size={15} /> Vald</> : !k.ledig ? 'Fullbokad' : fullt ? 'Max tre valda' : 'Välj veckan'}
          </button>
          <button type="button" onClick={onIntresse} disabled={fullt && !vald} className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${vald ? 'border-[#F6E4CF]/40 text-[#FFF9F2] hover:bg-[#F6E4CF]/10' : 'border-[#321C04]/30 text-[#321C04] hover:border-[#321C04]'}`}>{k.ledig ? 'Jag är intresserad' : 'Ställ mig på kö'}</button>
          <button
            type="button"
            onClick={onVisa}
            className={`inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 transition-colors ${
              vald ? 'text-[#F6E4CF]/80 hover:text-[#FFF9F2]' : 'text-[#321C04]/70 hover:text-[#321C04]'
            }`}
          >
            Se kursen
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {!kompakt && (
        <div className={`hidden md:flex flex-col gap-4 md:border-l md:pl-6 self-stretch ${vald ? 'border-[#F6E4CF]/20' : 'border-[#D9C4AA]'}`}>
          <div>
            {k.total ? (
              <>
                <p className="text-2xl font-medium tracking-tight whitespace-nowrap">{kr(k.total)}</p>
                <p className={`text-xs ${muted}`}>exkl. moms</p>
                <dl className={`mt-2 pt-2 border-t text-[13px] ${vald ? 'border-[#F6E4CF]/20' : 'border-[#D9C4AA]/70'} ${muted}`}>
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
          <div className="mt-auto flex flex-col gap-3">
            <button type="button" onClick={onToggle} disabled={!k.ledig || (fullt && !vald)} aria-pressed={vald} className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${vald ? 'bg-[#F6E4CF] text-[#321C04] hover:bg-[#FFF9F2]' : 'bg-[#321C04] text-[#FFF9F2] hover:bg-[#2B2724]'}`}>
              {vald ? <><Check size={15} /> Vald</> : !k.ledig ? 'Fullbokad' : fullt ? 'Max tre valda' : 'Välj veckan'}
            </button>
            <button type="button" onClick={onIntresse} disabled={fullt && !vald} className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${vald ? 'border-[#F6E4CF]/40 text-[#FFF9F2] hover:bg-[#F6E4CF]/10' : 'border-[#321C04]/30 text-[#321C04] hover:border-[#321C04]'}`}>{k.ledig ? 'Jag är intresserad' : 'Ställ mig på kö'}</button>
            <button type="button" onClick={onVisa} className={`inline-flex items-center justify-center gap-1.5 text-sm font-medium underline underline-offset-4 transition-colors ${vald ? 'text-[#F6E4CF]/80 hover:text-[#FFF9F2]' : 'text-[#321C04]/70 hover:text-[#321C04]'}`}>
              Se kursen <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
