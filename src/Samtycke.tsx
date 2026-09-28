import { useEffect, useState } from 'react'

// Cookiesamtycke och annonspixlar. Pixlarna laddas bara efter ett aktivt ja.
// Nodvandiga cookies (inga) och Vercel Analytics (utan cookies, ingen personprofil) kraver inte samtycke.
export const PIXLAR = {
  linkedin: '10928649', // LinkedIn Insight Tag, partner-id
  meta: '', // Meta-pixel, id fran Händelsehanteraren (tomt = laddas inte)
}
const NYCKEL = 'ugl-samtycke'
const EM = { fontFamily: "'Instrument Serif', serif" }

declare global { interface Window { _linkedin_partner_id?: string; _linkedin_data_partner_ids?: string[]; lintrk?: ((a: string, b: Record<string, unknown>) => void) & { q?: unknown[] }; fbq?: (...a: unknown[]) => void; _fbq?: unknown } }

let laddat = false
function laddaPixlar() {
  if (laddat) return
  laddat = true
  if (PIXLAR.linkedin) {
    window._linkedin_partner_id = PIXLAR.linkedin
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
    window._linkedin_data_partner_ids.push(PIXLAR.linkedin)
    if (!window.lintrk) { const f = ((a: string, b: Record<string, unknown>) => { (f.q = f.q || []).push([a, b]) }) as NonNullable<Window['lintrk']>; window.lintrk = f }
    const s = document.createElement('script'); s.async = true; s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'; document.head.appendChild(s)
  }
  if (PIXLAR.meta) {
    const w = window as unknown as Record<string, unknown>
    if (!w.fbq) {
      const n = function (...a: unknown[]) { const f = n as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] }; if (f.callMethod) f.callMethod(...a); else f.queue.push(a) } as unknown as { push: unknown; loaded: boolean; version: string; queue: unknown[] }
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []
      w.fbq = n; w._fbq = n
      const s = document.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(s)
    }
    window.fbq!('init', PIXLAR.meta); window.fbq!('track', 'PageView')
  }
}

// Handelser till pixlarna (bara om samtycke finns). Anvands t.ex. vid skickad bokning.
export function pixelHandelse(namn: 'Lead' | 'Contact' | 'ViewContent') {
  try {
    if (window.fbq) window.fbq('track', namn)
    // LinkedIn: konverteringar satts upp i Campaign Manager (Mät > Konverteringsspårning) som sidbesök,
    // t.ex. /kurser, eller med ett conversion_id som da laggs till har: window.lintrk('track', { conversion_id: 123 })
  } catch { /* tomt */ }
}

export function lasSamtycke(): 'ja' | 'nej' | null {
  try { const v = localStorage.getItem(NYCKEL); return v === 'ja' || v === 'nej' ? v : null } catch { return null }
}

export default function Samtycke() {
  const [visa, setVisa] = useState(false)
  useEffect(() => {
    if (!PIXLAR.linkedin && !PIXLAR.meta) return
    const v = lasSamtycke()
    if (v === 'ja') laddaPixlar()
    else if (v === null) setVisa(true)
    const oppna = () => setVisa(true)
    window.addEventListener('ugl-samtycke-oppna', oppna)
    return () => window.removeEventListener('ugl-samtycke-oppna', oppna)
  }, [])
  const valj = (v: 'ja' | 'nej') => {
    try { localStorage.setItem(NYCKEL, v) } catch { /* tomt */ }
    if (v === 'ja') laddaPixlar()
    setVisa(false)
  }
  if (!visa) return null
  return (
    <div role="dialog" aria-label="Cookies" className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:bottom-6 z-[60] md:max-w-md bg-[#FFF9F2] text-[#321C04] rounded-3xl border border-[#D9C4AA] shadow-[0_12px_40px_rgba(43,39,36,0.3)] p-6">
      <p className="text-[22px] leading-tight tracking-tight" style={EM}>Cookies för annonser</p>
      <p className="mt-2 text-[14px] leading-[1.5] text-[#321C04]/75">Vi använder inga cookies för att sidan ska fungera. Med ditt ja får LinkedIn{PIXLAR.meta ? ' och Meta' : ''} sätta en cookie så att vi kan visa UGL Sverige för dig igen i deras flöden. Du kan ändra dig när som helst via länken i sidfoten.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => valj('ja')} className="inline-flex items-center justify-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#2B2724]">Ja, det är okej</button>
        <button type="button" onClick={() => valj('nej')} className="inline-flex items-center justify-center border border-[#321C04]/30 text-sm font-medium px-5 py-2.5 rounded-xl hover:border-[#321C04]">Bara nödvändiga</button>
      </div>
    </div>
  )
}

export const oppnaSamtycke = () => window.dispatchEvent(new Event('ugl-samtycke-oppna'))
