import { useEffect, useState, type FormEvent } from 'react'
import { Check, Phone, X } from 'lucide-react'
import { MOTTAGARE, posta, kursData } from './forfragan'
import type { Kurs } from './kursdata'
import { spara } from './spar'

const EM = { fontFamily: "'Instrument Serif', serif" }
const TIDER = ['När som helst', 'Förmiddag', 'Lunch', 'Eftermiddag', 'Efter 17']

// Ring mig: telefonnummer och nar det passar. Ersatter mejllanken "Boka ett kort samtal".
// Oppnas fran hero, kassan och Sa gar det till via handelsen 'ugl-ring'.
export const oppnaRingMig = () => window.dispatchEvent(new Event('ugl-ring'))

export default function RingMig({ valda }: { valda: Kurs[] }) {
  const [visa, setVisa] = useState(false)
  const [f, setF] = useState({ namn: '', telefon: '', tid: TIDER[0], samtycke: false })
  const [status, setStatus] = useState<string | null>(null)
  const [skickar, setSkickar] = useState(false)
  const [klar, setKlar] = useState(false)
  useEffect(() => {
    const oppna = () => { setVisa(true); spara('ring_mig_oppnad') }
    window.addEventListener('ugl-ring', oppna)
    return () => window.removeEventListener('ugl-ring', oppna)
  }, [])
  useEffect(() => {
    if (!visa) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setVisa(false) }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [visa])
  const field = 'w-full bg-transparent border-b border-[#321C04]/25 focus:border-[#321C04] outline-none py-2.5 text-[#321C04] placeholder:text-[#321C04]/40 text-base transition-colors'
  const label = 'block text-[#321C04]/60 text-[11px] uppercase tracking-[0.2em] font-medium mb-1'

  const skicka = async (e: FormEvent) => {
    e.preventDefault()
    if (f.telefon.replace(/\D/g, '').length < 7) return setStatus('Fyll i ett telefonnummer.')
    if (!f.samtycke) return setStatus('Kryssa i samtycket så att vi får ringa dig.')
    setSkickar(true); setStatus(null)
    const r = await posta({ typ: 'samtal', namn: f.namn, telefon: f.telefon, meddelande: 'Passar bäst: ' + f.tid, kurser: valda.map((k) => ({ ...kursData(k), id: k.nyckel })), samtycke: true })
    setSkickar(false)
    if (!r.ok) return setStatus((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.')
    spara('ring_mig_skickad', { tid: f.tid })
    if (!r.mejl) window.location.href = 'mailto:' + MOTTAGARE + '?subject=' + encodeURIComponent('Ring mig om UGL') + '&body=' + encodeURIComponent(`Namn: ${f.namn}\nTelefon: ${f.telefon}\nPassar bäst: ${f.tid}`)
    setKlar(true)
  }

  if (!visa) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label="Ring mig">
      <div className="absolute inset-0 bg-[#2B2724]/60 backdrop-blur-sm" onClick={() => setVisa(false)} />
      <div className="relative w-full max-w-md bg-[#FFF9F2] text-[#321C04] rounded-3xl border border-[#D9C4AA] shadow-2xl p-7 md:p-8">
        <button type="button" onClick={() => setVisa(false)} aria-label="Stäng" className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[#321C04]/10 flex items-center justify-center"><X size={18} /></button>
        {klar ? (
          <div className="py-4">
            <span className="w-12 h-12 rounded-full bg-[#321C04] text-[#FFF9F2] flex items-center justify-center"><Check size={20} /></span>
            <h3 className="mt-5 text-[28px] leading-[1.1] tracking-tight" style={EM}>Vi ringer dig.</h3>
            <p className="mt-2 text-[15px] text-[#321C04]/75 leading-[1.5]">Senast nästa arbetsdag, {f.tid === TIDER[0] ? 'när det passar oss båda' : f.tid.toLowerCase()}. Inget är bokat.</p>
            <button type="button" onClick={() => setVisa(false)} className="mt-6 inline-flex items-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724]">Stäng</button>
          </div>
        ) : (
          <form onSubmit={skicka} noValidate>
            <p className="text-[#321C04]/60 text-[11px] uppercase tracking-[0.25em] font-medium mb-2">Osäker?</p>
            <h3 className="text-[28px] leading-[1.1] tracking-tight mb-2" style={EM}>Vi ringer upp dig.</h3>
            <p className="text-[15px] text-[#321C04]/75 leading-[1.5] mb-5">Tio minuter om vilken vecka som passar, vad chefen behöver veta och hur gruppen sätts ihop. Inget säljsamtal, inget bokas.</p>
            <div className="grid gap-y-4">
              <div><label className={label}>Telefon</label><input type="tel" className={field} value={f.telefon} onChange={(e) => setF({ ...f, telefon: e.target.value })} autoComplete="tel" placeholder="070 123 45 67" /></div>
              <div><label className={label}>Namn <span className="normal-case tracking-normal text-[#321C04]/40">valfritt</span></label><input className={field} value={f.namn} onChange={(e) => setF({ ...f, namn: e.target.value })} autoComplete="name" /></div>
              <div><label className={label}>När passar det?</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {TIDER.map((t) => <button key={t} type="button" onClick={() => setF({ ...f, tid: t })} aria-pressed={f.tid === t} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${f.tid === t ? 'bg-[#321C04] text-[#FFF9F2] border-[#321C04]' : 'border-[#321C04]/25 hover:border-[#321C04]/60'}`}>{t}</button>)}
                </div>
              </div>
            </div>
            {valda.length > 0 && <p className="mt-4 text-[13px] text-[#321C04]/60">Vi ser vilka veckor du valt ({valda.map((k) => 'v. ' + k.vecka).join(', ')}), så vi kan prata om dem direkt.</p>}
            <label className="flex items-start gap-3 mt-4 text-sm text-[#321C04]/80 cursor-pointer">
              <input type="checkbox" checked={f.samtycke} onChange={(e) => setF({ ...f, samtycke: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#321C04]" />
              Jag godkänner att ni ringer mig på numret ovan.
            </label>
            {status && <p className="mt-3 text-sm text-[#9C3A2E]">{status}</p>}
            <button type="submit" disabled={skickar} className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724] disabled:opacity-60"><Phone size={15} /> {skickar ? 'Skickar…' : 'Ring mig'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
