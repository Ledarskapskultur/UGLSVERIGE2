import { useState, type FormEvent } from 'react'
import { ArrowLeft, ChevronRight, Pencil, Send, User, Users, X } from 'lucide-react'
import { MOTTAGARE, posta, kursData } from './forfragan'
import { kr, type Kurs } from './kursdata'

const EM = { fontFamily: "'Instrument Serif', serif" }
const PORTAL = 'https://www.uglsverige.store/portal'
const pris = (k: Kurs) => (k.total ? kr(k.total) + ' exkl. moms' : 'Pris meddelas')

export default function Kassa({ valda, toggle, onClose, onTipsa, onAndra, kompakt }: { valda: Kurs[]; toggle: (id: string) => void; onClose?: () => void; onTipsa: () => void; onAndra: () => void; kompakt?: boolean }) {
  const [steg, setSteg] = useState<'val' | 'intresse' | 'klart'>('val')
  const [forsta, setForsta] = useState<string | null>(null)
  const [bortvalda, setBortvalda] = useState<string[]>([])
  const medtagna = valda.filter((k) => !bortvalda.includes(k.id))
  const [f, setF] = useState({ namn: '', epost: '', telefon: '', samtycke: false })
  const [status, setStatus] = useState<string | null>(null)
  const [skickar, setSkickar] = useState(false)
  const forstaId = medtagna.some((k) => k.id === forsta) ? forsta! : medtagna[0]?.id
  const portalLank = PORTAL + '?kurser=' + encodeURIComponent(valda.map((k) => k.nyckel).join(','))
  const field = 'w-full bg-transparent border-b border-[#321C04]/25 focus:border-[#321C04] outline-none py-2.5 text-[#321C04] placeholder:text-[#321C04]/40 text-base transition-colors'
  const label = 'block text-[#321C04]/60 text-[11px] uppercase tracking-[0.2em] font-medium mb-1'
  const eyebrow = 'text-[#321C04]/60 text-[11px] uppercase tracking-[0.25em] font-medium mb-2'

  const skicka = async (e: FormEvent) => {
    e.preventDefault()
    if (!medtagna.length) return setStatus('Bocka i minst en vecka.')
    if (!f.namn.trim() || !f.epost.includes('@')) return setStatus('Fyll i namn och e-post.')
    if (!f.samtycke) return setStatus('Kryssa i samtycket så att vi får kontakta dig.')
    setSkickar(true)
    setStatus(null)
    const ordnade = [...medtagna].sort((a, b) => (a.id === forstaId ? 0 : 1) - (b.id === forstaId ? 0 : 1))
    const rader = ordnade.map((k, i) => `- ${i === 0 ? 'Förstahandsval' : 'Alternativ'}: Vecka ${k.vecka}, ${k.period}, ${k.anlaggning}, ${k.ort}`)
    const r = await posta({ typ: 'intresse', kurser: ordnade.map((k, i) => ({ ...kursData(k), id: k.nyckel, forstahandsval: i === 0 })), meddelande: rader.join('\n'), namn: f.namn, epost: f.epost, telefon: f.telefon, samtycke: true })
    setSkickar(false)
    if (!r.ok) return setStatus((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.')
    if (!r.mejl) {
      const text = ['Intresseanmälan UGL (ingen plats bokad)', '', 'Namn: ' + f.namn, 'E-post: ' + f.epost, f.telefon ? 'Telefon: ' + f.telefon : '', '', 'Valda veckor:', ...rader].join('\n')
      window.location.href = 'mailto:' + MOTTAGARE + '?subject=' + encodeURIComponent('Intresseanmälan UGL, ' + f.namn) + '&body=' + encodeURIComponent(text)
    }
    setSteg('klart')
  }

  if (kompakt) {
    return (
      <div className="bg-[#FFF9F2] text-[#321C04] rounded-3xl border border-dashed border-[#D9C4AA] px-5 py-6">
        <p className={eyebrow}>Valda kursveckor</p>
        <p className="text-[30px] leading-none tracking-tight" style={EM}>0 <span className="text-[#321C04]/40">av 3</span></p>
        <p className="mt-3 text-sm text-[#321C04]/65 leading-[1.5]">Välj upp till tre veckor i listan, så samlas de här.</p>
      </div>
    )
  }

  return (
    <div className="relative bg-[#FFF9F2] text-[#321C04] rounded-3xl border border-[#D9C4AA] px-6 py-7">
      {onClose && <button type="button" onClick={onClose} aria-label="Stäng" className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[#321C04]/10 flex items-center justify-center"><X size={18} /></button>}
      <div>

        {steg === 'val' && (
          <>
            <p className={eyebrow}>Valda kursveckor</p>
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-5" style={EM}>Valda kursveckor</h2>
            {valda.length === 0 && (
              <p className="text-sm text-[#321C04]/65 leading-[1.5]">Inga veckor valda ännu. Välj upp till tre veckor i listan, så samlas de här.</p>
            )}
            <ul className="space-y-2.5">
              {valda.map((k) => (
                <li key={k.id} className="flex items-center gap-3 rounded-xl border border-[#D9C4AA] bg-white/60 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px]"><strong className="font-medium" style={EM}>Vecka {k.vecka}</strong> <span className="text-[#321C04]/50">·</span> {k.ort}</p>
                    <p className="text-[13px] text-[#321C04]/65 mt-0.5">{k.period} · {k.anlaggning} · {pris(k)}</p>
                  </div>
                  <button type="button" onClick={() => toggle(k.id)} aria-label={`Ta bort vecka ${k.vecka}`} className="w-8 h-8 rounded-full border border-[#321C04]/30 hover:bg-[#321C04] hover:text-[#FFF9F2] flex items-center justify-center transition-colors"><X size={14} /></button>
                </li>
              ))}
            </ul>
            {valda.length > 0 && (
              <>
                <button type="button" onClick={onAndra} className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 decoration-[#321C04]/40 hover:decoration-[#321C04]"><Pencil size={14} /> Ändra urval</button>
                <p className="mt-2 text-sm text-[#321C04]/65">Välj förstahandsval i nästa steg. Inga platser är bokade.</p>
              </>
            )}

            <p className={eyebrow + ' mt-9'}>Anmälan</p>
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-4" style={EM}>Vem anmäler du?</h2>
            <div className="space-y-3">
              <button type="button" disabled={!valda.length} onClick={() => setSteg('intresse')} className="disabled:opacity-40 disabled:cursor-not-allowed w-full text-left grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border-[1.5px] border-[#321C04] bg-[#F6E4CF] px-4 py-4 hover:bg-[#EBD3B6] transition-colors">
                <User size={34} strokeWidth={1.4} />
                <span><span className="block text-[19px] leading-tight" style={EM}>Mig själv</span><span className="block text-[13px] text-[#321C04]/65 mt-1">Ange förstahandsval och skicka en intresseanmälan.</span></span>
                <ChevronRight size={20} />
              </button>
              <a href={portalLank} aria-disabled={!valda.length} onClick={(e) => { if (!valda.length) e.preventDefault() }} className={`${valda.length ? '' : 'opacity-40 cursor-not-allowed'} w-full grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border border-[#D9C4AA] bg-white/60 px-4 py-4 hover:border-[#321C04] transition-colors`}>
                <Users size={34} strokeWidth={1.4} />
                <span><span className="block text-[19px] leading-tight" style={EM}>En medarbetare</span><span className="block text-[13px] text-[#321C04]/65 mt-1">Fortsätt till arbetsgivarportalen med ditt urval.</span></span>
                <ChevronRight size={20} />
              </a>
              <button type="button" disabled={!valda.length} onClick={onTipsa} className="w-full inline-flex items-center justify-center gap-2 border border-[#321C04]/30 text-sm font-medium px-5 py-3 rounded-xl hover:border-[#321C04] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><Send size={15} /> Tipsa om UGL, chefen eller en kollega</button>
            </div>
          </>
        )}

        {steg === 'intresse' && (
          <form onSubmit={skicka} noValidate>
            <p className={eyebrow}>Anmälan</p>
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-2" style={EM}>Intresseanmälan</h2>
            <p className="text-sm text-[#321C04]/70 mb-5 max-w-[50ch]">Ingen plats är bokad. Vi hör av oss när det närmar sig, eller så fort en plats blir ledig på en vecka du valt.</p>
            <p className={label}>Veckor som ingår i anmälan</p>
            <ul className="divide-y divide-[#321C04]/15 border-y border-[#321C04]/15 mb-2">
              {valda.map((k) => {
                const med = !bortvalda.includes(k.id)
                return (
                  <li key={k.id}>
                    <label className={`flex items-center gap-3 py-3 cursor-pointer ${med ? '' : 'opacity-50'}`}>
                      <input type="checkbox" checked={med} onChange={(e) => setBortvalda((b) => (e.target.checked ? b.filter((x) => x !== k.id) : [...b, k.id]))} className="w-4 h-4 accent-[#321C04]" />
                      <span className="flex-1 min-w-0 text-[15px]"><strong className="font-medium">Vecka {k.vecka}</strong>, {k.ort} <span className="block text-[13px] text-[#321C04]/60">{k.period} · {k.anlaggning}</span></span>
                      <span className="text-sm shrink-0">{pris(k)}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
            {medtagna.length > 1 && (
              <div className="mt-4">
                <p className={label}>Förstahandsval</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {medtagna.map((k) => (
                    <button key={k.id} type="button" onClick={() => setForsta(k.id)} aria-pressed={k.id === forstaId} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${k.id === forstaId ? 'bg-[#321C04] text-[#FFF9F2] border-[#321C04]' : 'border-[#321C04]/25 hover:border-[#321C04]/60'}`}>
                      Vecka {k.vecka}, {k.ort}
                    </button>
                  ))}
                </div>
                <p className="text-[13px] text-[#321C04]/60 mt-2">Övriga ibockade veckor skickas med som alternativ.</p>
              </div>
            )}
            <div className="grid gap-y-4 mt-4">
              <div><label className={label}>Namn</label><input className={field} value={f.namn} onChange={(e) => setF({ ...f, namn: e.target.value })} autoComplete="name" /></div>
              <div><label className={label}>E-post</label><input type="email" className={field} value={f.epost} onChange={(e) => setF({ ...f, epost: e.target.value })} autoComplete="email" /></div>
              <div><label className={label}>Telefon <span className="normal-case tracking-normal text-[#321C04]/40">valfritt</span></label><input type="tel" className={field} value={f.telefon} onChange={(e) => setF({ ...f, telefon: e.target.value })} autoComplete="tel" /></div>
            </div>
            <label className="flex items-start gap-3 mt-5 text-sm text-[#321C04]/80 cursor-pointer">
              <input type="checkbox" checked={f.samtycke} onChange={(e) => setF({ ...f, samtycke: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#321C04]" />
              Jag godkänner att mina uppgifter används för att kontakta mig om de valda veckorna.
            </label>
            {status && <p className="mt-4 text-sm text-[#9C3A2E]">{status}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSteg('val')} className="inline-flex items-center gap-2 border border-[#321C04]/30 text-sm font-medium px-5 py-3 rounded-xl hover:border-[#321C04]"><ArrowLeft size={15} /> Tillbaka</button>
              <button type="submit" disabled={skickar} className="flex-1 inline-flex items-center justify-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724] disabled:opacity-60 transition-colors">{skickar ? 'Skickar…' : 'Skicka intresseanmälan'}</button>
            </div>
          </form>
        )}

        {steg === 'klart' && (
          <div className="py-6">
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-3" style={EM}>Tack, intresseanmälan är mottagen.</h2>
            <p className="text-[#321C04]/75 max-w-[50ch]">Ingen plats är bokad. Vi hör av oss när det närmar sig, eller när en plats blir ledig på en vecka du valt.</p>
            <button type="button" onClick={() => (onClose ? onClose() : setSteg('val'))} className="mt-6 inline-flex items-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724]">Stäng</button>
          </div>
        )}
      </div>
    </div>
  )
}
