import { useEffect, useState } from 'react'
import { Check, Link2, Linkedin, Mail, MessageCircle, MessageSquare, Share2 } from 'lucide-react'
import type { Kurs } from './kursdata'
import { delningskod, delningslank, delningstext } from './delning'

// Delningsrad: LinkedIn, Facebook, X, WhatsApp, Teams, sms, mejl, kopiera lank och systemets egen delning.
// rutnat: tre rader med tre knappar i varje (delningsknappen visas alltid, med kopiering som reserv).
export default function Dela({ kurser, av, epost, kanal, rubrik, morkt, rutnat }: { kurser: Kurs[]; av?: string; epost?: string; kanal: string; rubrik?: string; morkt?: boolean; rutnat?: boolean }) {
  const [kod, setKod] = useState<string | null>(null)
  const [kopierad, setKopierad] = useState(false)
  useEffect(() => { delningskod(kurser, kanal, av, epost).then(setKod) }, [kurser, kanal, av, epost])
  if (!kod) return null
  const url = delningslank(kod, kurser, av)
  const text = delningstext(kurser, av)
  const e = encodeURIComponent
  const amne = 'Tips: UGL, Utveckling av grupp och ledare'
  const kanaler = [
    { n: 'LinkedIn', h: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}`, i: <Linkedin size={18} /> },
    { n: 'Facebook', h: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}&quote=${e(text)}`, i: <FbIkon /> },
    { n: 'X', h: `https://twitter.com/intent/tweet?text=${e(text)}&url=${e(url)}`, i: <XIkon /> },
    { n: 'WhatsApp', h: `https://wa.me/?text=${e(text + '\n' + url)}`, i: <MessageCircle size={18} /> },
    { n: 'Teams', h: `https://teams.microsoft.com/share?href=${e(url)}&msgText=${e(text)}`, i: <TeamsIkon /> },
    { n: 'Sms', h: `sms:?&body=${e(text + ' ' + url)}`, i: <MessageSquare size={18} /> },
    { n: 'Mejl', h: `mailto:?subject=${e(amne)}&body=${e(text + '\n\n' + url)}`, i: <Mail size={18} /> },
  ]
  const kopiera = async () => {
    try { await navigator.clipboard.writeText(url) } catch {
      const t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select()
      try { document.execCommand('copy') } catch { /* tomt */ } document.body.removeChild(t)
    }
    setKopierad(true); setTimeout(() => setKopierad(false), 2000)
  }
  const dela = () => { if (typeof navigator !== 'undefined' && 'share' in navigator) navigator.share({ title: amne, text, url }).catch(() => {}); else kopiera() }
  const ruta = `w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${morkt ? 'border-[#F6E4CF]/30 text-[#FFF9F2] hover:bg-[#F6E4CF]/10' : 'border-[#D9C4AA] bg-white text-[#321C04] hover:border-[#321C04]'}`
  return (
    <div>
      {rubrik && <p className={`text-[11px] uppercase tracking-[0.2em] font-medium mb-3 ${morkt ? 'text-[#F6E4CF]/60' : 'text-[#321C04]/60'}`}>{rubrik}</p>}
      <div className={rutnat ? 'grid grid-cols-3 gap-2 w-fit' : 'flex flex-wrap gap-2'}>
        {kanaler.map((k) => (
          <a key={k.n} href={k.h} target={k.h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={`Dela via ${k.n}`} title={k.n} className={ruta}>{k.i}</a>
        ))}
        <button type="button" onClick={kopiera} aria-label="Kopiera länk" title="Kopiera länk" className={ruta}>{kopierad ? <Check size={18} /> : <Link2 size={18} />}</button>
        {(rutnat || (typeof navigator !== 'undefined' && 'share' in navigator)) && (
          <button type="button" onClick={dela} aria-label="Fler sätt att dela" title="Fler sätt att dela" className={ruta}><Share2 size={18} /></button>
        )}
      </div>
      {kopierad && <p className={`mt-2 text-xs ${morkt ? 'text-[#F6E4CF]/70' : 'text-[#321C04]/60'}`}>Länken är kopierad.</p>}
    </div>
  )
}

function FbIkon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg> }
function XIkon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.7-8.8L1 2h6.8l4.7 6.2L18.9 2zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20z" /></svg> }
function TeamsIkon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="11" height="11" rx="2" /><path d="M6 11h5M8.5 11v4" /><circle cx="18.5" cy="6.5" r="2" /><path d="M16 11h4.5a1 1 0 0 1 1 1v3.5a3 3 0 0 1-3 3H17" /></svg> }
