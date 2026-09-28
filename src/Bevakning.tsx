import { useEffect, useState, type FormEvent } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { MOTTAGARE, posta } from './forfragan'
import { spara } from './spar'

const EM = { fontFamily: "'Instrument Serif', serif" }
const REGIONER = ['Hela landet', 'Norr', 'Mitt', 'Stockholm', 'Väst', 'Syd']
const NYCKEL = 'ugl-bevakning'

// Bevakning: e-post och del av landet, ingen vald vecka. Anvands bade som block under listan
// och som ruta nar besokaren ar pa vag att lamna sidan (bara pa dator, en gang per besok).
export function BevakningForm({ morkt, kanal, onKlar }: { morkt?: boolean; kanal: string; onKlar?: () => void }) {
  const [epost, setEpost] = useState('')
  const [region, setRegion] = useState('Hela landet')
  const [status, setStatus] = useState<string | null>(null)
  const [skickar, setSkickar] = useState(false)
  const [klar, setKlar] = useState(false)
  const field = `w-full bg-transparent border-b outline-none py-2.5 text-base transition-colors ${morkt ? 'border-[#F6E4CF]/30 focus:border-[#F6E4CF] text-[#FFF9F2] placeholder:text-[#F6E4CF]/40' : 'border-[#321C04]/25 focus:border-[#321C04] text-[#321C04] placeholder:text-[#321C04]/40'}`
  const label = `block text-[11px] uppercase tracking-[0.2em] font-medium mb-1 ${morkt ? 'text-[#F6E4CF]/60' : 'text-[#321C04]/60'}`

  const skicka = async (e: FormEvent) => {
    e.preventDefault()
    if (!epost.includes('@')) return setStatus('Fyll i en giltig e-postadress.')
    setSkickar(true); setStatus(null)
    const r = await posta({ typ: 'bevakning', kurser: [], epost, meddelande: 'Region: ' + region, samtycke: true, kanal })
    setSkickar(false)
    if (!r.ok) return setStatus((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.')
    try { localStorage.setItem(NYCKEL, '1') } catch { /* tomt */ }
    spara('bevakning', { kanal, region })
    setKlar(true); onKlar?.()
  }

  if (klar) {
    return (
      <p className={`flex items-start gap-3 text-[15px] leading-[1.5] ${morkt ? 'text-[#FFF9F2]' : 'text-[#321C04]'}`}>
        <span className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${morkt ? 'bg-[#F6E4CF] text-[#2B2724]' : 'bg-[#321C04] text-[#FFF9F2]'}`}><Check size={13} /></span>
        Tack. Du får ett mejl när nya veckor eller lediga platser släpps{region === 'Hela landet' ? '' : ' i ' + region.toLowerCase()}. Inget är bokat.
      </p>
    )
  }
  return (
    <form onSubmit={skicka} noValidate className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-end">
      <div><label className={label}>E-post</label><input type="email" className={field} placeholder="namn@foretag.se" value={epost} onChange={(e) => setEpost(e.target.value)} autoComplete="email" /></div>
      <div><label className={label}>Del av landet</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={field + ' cursor-pointer'}>
          {REGIONER.map((r) => <option key={r} value={r} className="text-[#321C04]">{r}</option>)}
        </select>
      </div>
      <button type="submit" disabled={skickar} className={`inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl transition-colors disabled:opacity-60 ${morkt ? 'bg-[#F6E4CF] text-[#2B2724] hover:bg-[#FFF9F2]' : 'bg-[#321C04] text-[#FFF9F2] hover:bg-[#2B2724]'}`}><Bell size={15} /> {skickar ? 'Skickar…' : 'Bevaka'}</button>
      {status && <p className="sm:col-span-3 text-sm text-[#9C3A2E]">{status}</p>}
      <p className={`sm:col-span-3 text-[13px] ${morkt ? 'text-[#F6E4CF]/60' : 'text-[#321C04]/60'}`}>Ett mejl per släpp, inget nyhetsbrev. Avsluta när du vill.</p>
    </form>
  )
}

export function BevakningBlock() {
  return (
    <div className="mt-10 rounded-3xl border border-[#D9C4AA] bg-[#F6E4CF]/60 px-6 py-6 md:px-8 md:py-7">
      <p className="text-[#321C04]/60 text-[11px] uppercase tracking-[0.25em] font-medium mb-2">Inte rätt vecka ännu?</p>
      <h3 className="text-[#321C04] text-[26px] leading-[1.1] tracking-tight mb-4" style={EM}>Få nästa lediga platser till mejlen.</h3>
      <BevakningForm kanal="lista" />
    </div>
  )
}

// Rutan visas nar musen lamnar fonstret uppat (pa vag mot adressfaltet), tidigast efter 20 sekunder,
// hogst en gang per besok, och aldrig for den som redan bevakar eller skickat nagot.
export function BevakningRuta({ aktiv }: { aktiv: boolean }) {
  const [visa, setVisa] = useState(false)
  useEffect(() => {
    if (!aktiv || window.innerWidth < 1024) return
    try { if (sessionStorage.getItem(NYCKEL + '-visad') || localStorage.getItem(NYCKEL)) return } catch { /* tomt */ }
    let redo = false
    const t = setTimeout(() => { redo = true }, 20000)
    const ut = (e: MouseEvent) => {
      if (!redo || e.clientY > 0 || e.relatedTarget) return
      setVisa(true); spara('bevakning_ruta')
      try { sessionStorage.setItem(NYCKEL + '-visad', '1') } catch { /* tomt */ }
      document.removeEventListener('mouseout', ut)
    }
    document.addEventListener('mouseout', ut)
    return () => { clearTimeout(t); document.removeEventListener('mouseout', ut) }
  }, [aktiv])
  if (!visa) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label="Bevaka lediga platser">
      <div className="absolute inset-0 bg-[#2B2724]/60 backdrop-blur-sm" onClick={() => setVisa(false)} />
      <div className="relative w-full max-w-lg bg-[#FFF9F2] text-[#321C04] rounded-3xl border border-[#D9C4AA] shadow-2xl p-7 md:p-9">
        <button type="button" onClick={() => setVisa(false)} aria-label="Stäng" className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[#321C04]/10 flex items-center justify-center"><X size={18} /></button>
        <p className="text-[#321C04]/60 text-[11px] uppercase tracking-[0.25em] font-medium mb-2">Innan du går</p>
        <h3 className="text-[30px] leading-[1.1] tracking-tight mb-3" style={EM}>Få nästa lediga platser till mejlen.</h3>
        <p className="text-[15px] text-[#321C04]/75 leading-[1.5] mb-6">Veckorna fylls i den ordning anmälningarna kommer in. Vi mejlar när nya veckor eller platser släpps i den del av landet du väljer. Ingen vecka behöver väljas, inget bokas.</p>
        <BevakningForm kanal="ruta" />
      </div>
    </div>
  )
}
