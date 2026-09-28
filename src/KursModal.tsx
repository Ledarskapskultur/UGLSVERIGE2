import { useEffect, useState } from 'react'
import { Award, BedDouble, BookOpen, Calendar, Check, ExternalLink, MapPin, Send, Users, UtensilsCrossed, X } from 'lucide-react'
import { kr, type Kurs } from './kursdata'
import { Stjarnor } from './Omdomen'

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }
type Handledare = { roll?: string; text?: string; bild?: string }
type Anlaggning = { bild?: string; text?: string }
declare global {
  interface Window { UGL_HANDLEDARE?: Record<string, Handledare>; UGL_ANLAGGNINGAR?: Record<string, Anlaggning> }
}
const BAS = 'https://www.uglsverige.store/'
function laddaRegister(cb: () => void) {
  let kvar = 0
  const done = () => { if (--kvar <= 0) cb() }
  for (const [f, key] of [['handledare.js', 'UGL_HANDLEDARE'], ['anlaggningar.js', 'UGL_ANLAGGNINGAR']] as const) {
    if ((window as unknown as Record<string, unknown>)[key]) continue
    kvar++
    const s = document.createElement('script'); s.src = BAS + f; s.onload = done; s.onerror = done; document.head.appendChild(s)
  }
  if (kvar === 0) cb()
}
const INGAR = [
  ['Fem kursdagar', Calendar], ['Boende fyra nätter', BedDouble], ['Alla måltider', UtensilsCrossed],
  ['Kursmaterial', BookOpen], ['Två handledare', Users], ['Intyg efter kursen', Award],
] as const
const DAGAR = [['Dag 1', 'Ni möts'], ['Dag 2', 'Gruppen formas'], ['Dag 3', 'Samtal på djupet'], ['Dag 4', 'Tilliten växer'], ['Dag 5', 'Din plan']]
const init = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export default function KursModal({ k, vald, fullt, betyg, onToggle, onIntresse, onTipsa, onClose }: {
  k: Kurs; vald: boolean; fullt: boolean; betyg?: { snitt: number; antal: number } | null
  onToggle: () => void; onIntresse: () => void; onTipsa: () => void; onClose: () => void
}) {
  const [, setLaddad] = useState(0)
  useEffect(() => { laddaRegister(() => setLaddad((n) => n + 1)) }, [])
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [onClose])
  const anl = window.UGL_ANLAGGNINGAR?.[k.anlaggning]
  const reg = window.UGL_HANDLEDARE ?? {}
  const bild = anl?.bild ? BAS + 'assets/' + anl.bild : k.bild
  const label = 'text-[#321C04]/60 text-[11px] uppercase tracking-[0.2em] font-medium'

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6" role="dialog" aria-modal="true" aria-label={`Vecka ${k.vecka}, ${k.anlaggning}`}>
      <div className="absolute inset-0 bg-[#2B2724]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto no-scrollbar bg-[#FFF9F2] text-[#321C04] rounded-t-3xl md:rounded-3xl border border-[#D9C4AA] shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Stäng" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FFF9F2]/90 hover:bg-[#F6E4CF] flex items-center justify-center"><X size={18} /></button>

        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px] bg-[#2B2724]">
            <img src={bild} alt="" className="absolute inset-0 w-full h-full object-cover" />
            {!k.ledig && <span className="absolute top-4 left-4 text-[11px] uppercase tracking-[0.18em] font-medium px-3 py-1.5 rounded-full bg-[#FFF9F2] text-[#321C04]">Fullbokad</span>}
          </div>
          <div className="p-6 md:p-8">
            <p className={label}>Öppen kurs · {k.region}</p>
            <h2 className="mt-2 text-[40px] leading-none tracking-tight" style={EM}>Vecka {k.vecka}</h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px] text-[#321C04]/85">
              <li className="flex items-start gap-2.5"><Calendar size={16} className="shrink-0 mt-0.5" />{k.period}</li>
              <li className="flex items-start gap-2.5"><MapPin size={16} className="shrink-0 mt-0.5" />{k.anlaggning}, {k.ort}</li>
              <li className="flex items-start gap-2.5"><Users size={16} className="shrink-0 mt-0.5" /><span>{k.handledare.length ? k.handledare.join(' och ') : 'Handledare meddelas senare'}</span></li>
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
              {betyg && <span className="inline-flex items-center gap-1.5 text-[#9C7A4A]"><Stjarnor betyg={betyg.snitt} size={13} /><span className="text-[#321C04]/60">{betyg.snitt.toFixed(1).replace('.', ',')} · {betyg.antal} {betyg.antal === 1 ? 'omdöme' : 'omdömen'}</span></span>}
              {k.ledig && k.platser !== null && <span className={`font-medium ${k.platser <= 3 ? 'text-[#9C3A2E]' : 'text-[#321C04]/60'}`}>{k.platser === 1 ? '1 plats kvar' : `${k.platser} platser kvar`}</span>}
            </div>

            <div className="mt-6 pt-5 border-t border-[#D9C4AA]">
              {k.total ? (
                <>
                  <p className="text-3xl font-medium tracking-tight">{kr(k.total)} <span className="text-sm font-normal text-[#321C04]/60">exkl. moms per person</span></p>
                  <p className="mt-1 text-sm text-[#321C04]/65">{k.samlat ? 'Kurs, kost och logi ingår i priset.' : `Kursavgift ${kr(k.kurspris)} och kost och logi ${kr(k.logi)}. Resa tillkommer.`}</p>
                </>
              ) : <p className="text-base">Pris meddelas</p>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={onToggle} disabled={!k.ledig || (fullt && !vald)} aria-pressed={vald} className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${vald ? 'bg-[#F6E4CF] text-[#321C04]' : 'bg-[#321C04] text-[#FFF9F2] hover:bg-[#2B2724]'}`}>
                {vald ? <><Check size={15} /> Vald</> : !k.ledig ? 'Fullbokad' : fullt ? 'Max tre valda' : 'Välj veckan'}
              </button>
              <button type="button" onClick={onIntresse} disabled={fullt && !vald} className="inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl border border-[#321C04]/30 hover:border-[#321C04] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">{k.ledig ? 'Jag är intresserad' : 'Ställ mig på kö'}</button>
              <button type="button" onClick={onTipsa} className="inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 rounded-xl text-[#321C04]/80 hover:text-[#321C04] underline underline-offset-4"><Send size={14} /> Tipsa om UGL</button>
            </div>
            <p className="mt-3 text-[13px] text-[#321C04]/60">Anmälan är inte bindande förrän den bekräftats. Svar inom två arbetsdagar.</p>
          </div>
        </div>

        <div className="px-6 md:px-8 pb-8 grid md:grid-cols-2 gap-8 border-t border-[#D9C4AA] pt-7">
          <div>
            <p className={label}>Det här ingår</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[14px]">
              {INGAR.map(([t, Icon]) => <li key={t} className="flex items-center gap-2.5"><Icon size={16} className="text-[#9C7A4A] shrink-0" />{t}</li>)}
            </ul>
            <p className={`${label} mt-7`}>Veckan</p>
            <ol className="mt-3 flex flex-col gap-1.5 text-[14px]">
              {DAGAR.map(([d, t]) => <li key={d} className="flex gap-3"><span className="w-12 text-[#321C04]/50">{d}</span><span>{t}</span></li>)}
            </ol>
          </div>
          <div>
            <p className={label}>Kursgård</p>
            <p className="mt-2 text-[15px] font-medium">{k.anlaggning}, {k.ort}</p>
            <p className="mt-1 text-[14px] text-[#321C04]/75 leading-[1.5]">{anl?.text || 'Kursgård med enkelrum, alla måltider och avskilda grupprum. Vägbeskrivning och tider kommer i välkomstbrevet.'}</p>
            <p className={`${label} mt-7`}>Handledare</p>
            <ul className="mt-3 flex flex-col gap-4">
              {(k.handledare.length ? k.handledare : ['Handledare meddelas senare']).map((n) => {
                const h = reg[n]
                return (
                  <li key={n} className="flex gap-3">
                    {h?.bild ? <img src={BAS + 'assets/' + h.bild} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" /> : <span className="w-12 h-12 rounded-full bg-[#F6E4CF] text-[#321C04] flex items-center justify-center text-sm font-medium shrink-0">{init(n)}</span>}
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium">{n}</p>
                      <p className="text-[13px] text-[#321C04]/65">{h?.roll || 'UGL-handledare certifierad av Försvarshögskolan'}</p>
                      {h?.text && <p className="mt-1 text-[13px] text-[#321C04]/75 leading-[1.5]">{h.text}</p>}
                    </div>
                  </li>
                )
              })}
            </ul>
            <a href={k.lank} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-1.5 text-sm text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4"><ExternalLink size={14} /> Öppna hela kurssidan</a>
          </div>
        </div>
      </div>
    </div>
  )
}
