import { useEffect, useState } from 'react'
import { Check, Instagram, Link2, Linkedin, Mail, MessageCircle, MessageSquare, Share2 } from 'lucide-react'
import type { Kurs } from './kursdata'
import { delningskod, delningslank, delningstext } from './delning'

// Delningsrad, tio knappar i tva rader om fem: LinkedIn, Facebook, X, Instagram, TikTok, WhatsApp, sms, mejl,
// kopiera lank och systemets egen delning. Instagram och TikTok saknar delningslankar pa webben, sa dar
// anvands telefonens delningsmeny om den finns, annars kopieras lanken och appen oppnas.
export default function Dela({ kurser, av, epost, kanal, rubrik, morkt }: { kurser: Kurs[]; av?: string; epost?: string; kanal: string; rubrik?: string; morkt?: boolean }) {
  const [kod, setKod] = useState<string | null>(null)
  const [kopierad, setKopierad] = useState<false | 'lank' | 'app'>(false)
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
    { n: 'Sms', h: `sms:?&body=${e(text + ' ' + url)}`, i: <MessageSquare size={18} /> },
    { n: 'Mejl', h: `mailto:?subject=${e(amne)}&body=${e(text + '\n\n' + url)}`, i: <Mail size={18} /> },
  ]
  const kanShare = typeof navigator !== 'undefined' && 'share' in navigator
  const kopiera = async (visa: 'lank' | 'app' = 'lank') => {
    try { await navigator.clipboard.writeText(url) } catch {
      const t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select()
      try { document.execCommand('copy') } catch { /* tomt */ } document.body.removeChild(t)
    }
    setKopierad(visa); setTimeout(() => setKopierad(false), 4000)
  }
  const dela = () => { if (kanShare) navigator.share({ title: amne, text, url }).catch(() => {}); else kopiera() }
  // Instagram och TikTok: delningsmenyn pa mobil, annars kopierad lank och appen i ny flik.
  const app = (adress: string) => async () => {
    if (kanShare) { navigator.share({ title: amne, text, url }).catch(() => {}); return }
    await kopiera('app'); window.open(adress, '_blank', 'noopener')
  }
  const ruta = `w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${morkt ? 'border-[#F6E4CF]/30 text-[#FFF9F2] hover:bg-[#F6E4CF]/10' : 'border-[#D9C4AA] bg-white text-[#321C04] hover:border-[#321C04]'}`
  return (
    <div>
      {rubrik && <p className={`text-[11px] uppercase tracking-[0.2em] font-medium mb-3 ${morkt ? 'text-[#F6E4CF]/60' : 'text-[#321C04]/60'}`}>{rubrik}</p>}
      <div className="grid grid-cols-5 gap-2 w-fit">
        {kanaler.slice(0, 3).map((k) => (
          <a key={k.n} href={k.h} target="_blank" rel="noopener noreferrer" aria-label={`Dela via ${k.n}`} title={k.n} className={ruta}>{k.i}</a>
        ))}
        <button type="button" onClick={app('https://www.instagram.com/')} aria-label="Dela på Instagram" title="Instagram" className={ruta}><Instagram size={18} /></button>
        <button type="button" onClick={app('https://www.tiktok.com/')} aria-label="Dela på TikTok" title="TikTok" className={ruta}><TikTokIkon /></button>
        {kanaler.slice(3).map((k) => (
          <a key={k.n} href={k.h} target={k.h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={`Dela via ${k.n}`} title={k.n} className={ruta}>{k.i}</a>
        ))}
        <button type="button" onClick={() => kopiera()} aria-label="Kopiera länk" title="Kopiera länk" className={ruta}>{kopierad ? <Check size={18} /> : <Link2 size={18} />}</button>
        <button type="button" onClick={dela} aria-label="Fler sätt att dela" title="Fler sätt att dela" className={ruta}><Share2 size={18} /></button>
      </div>
      {kopierad && <p className={`mt-2 text-xs ${morkt ? 'text-[#F6E4CF]/70' : 'text-[#321C04]/60'}`}>{kopierad === 'app' ? 'Länken är kopierad. Klistra in den i ett inlägg, en story eller din bio.' : 'Länken är kopierad.'}</p>}
    </div>
  )
}

function FbIkon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg> }
function XIkon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.7-8.8L1 2h6.8l4.7 6.2L18.9 2zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20z" /></svg> }
function TikTokIkon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.6 6.7a4.9 4.9 0 0 1-3.8-4.2V2h-3.4v13.6a2.9 2.9 0 1 1-2-2.7V9.4a6.3 6.3 0 1 0 5.4 6.2V8.4a8.3 8.3 0 0 0 4.8 1.5V6.7h-1z" /></svg> }
