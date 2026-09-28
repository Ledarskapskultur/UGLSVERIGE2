// Delningskoder: en kod per besokare, sparad i webblasaren och registrerad hos servern.
// Landar nagon via ?via=kod skickas koden med anmalan, sa att tipsaren kan kvitteras.
import { posta } from './forfragan'
import type { Kurs } from './kursdata'

const NYCKEL = 'ugl-delning'
export const SAJT = 'https://www.uglsverige.store'

export function lasVia(): { via: string | null; av: string | null; valda: string[] } {
  const q = new URLSearchParams(location.search)
  const via = q.get('via'), av = q.get('av')
  const valda = (q.get('valda') || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (via) { try { sessionStorage.setItem('ugl-via', via) } catch { /* tomt */ } }
  return { via: via || (() => { try { return sessionStorage.getItem('ugl-via') } catch { return null } })(), av, valda }
}

function egenKod(): string {
  try {
    const s = localStorage.getItem(NYCKEL)
    if (s && /^[a-z0-9]{6,12}$/.test(s)) return s
  } catch { /* tomt */ }
  const k = Math.random().toString(36).slice(2, 9)
  try { localStorage.setItem(NYCKEL, k) } catch { /* tomt */ }
  return k
}

let registrerad: string | null = null
export async function delningskod(kurser: Kurs[], kanal: string, namn?: string, epost?: string): Promise<string> {
  const kod = egenKod()
  const nyckel = kod + '|' + (epost || '')
  if (registrerad !== nyckel) {
    registrerad = nyckel
    posta({ typ: 'delning', kod, kanal, namn, epost, kurser: kurser.map((k) => ({ id: k.nyckel, vecka: k.vecka, anlaggning: k.anlaggning, ort: k.ort, period: k.period })) }).catch(() => {})
  }
  return kod
}

export function delningslank(kod: string, kurser: Kurs[], av?: string) {
  const q = new URLSearchParams()
  if (kurser.length) q.set('valda', kurser.map((k) => k.nyckel).join(','))
  q.set('via', kod)
  if (av) q.set('av', av.split(' ')[0])
  return `${SAJT}/kurser?${q.toString()}`
}

export function delningstext(kurser: Kurs[], av?: string) {
  const v = kurser.map((k) => `vecka ${k.vecka} i ${k.ort}`)
  const veckor = v.length ? (v.length === 1 ? v[0] : v.slice(0, -1).join(', ') + ' och ' + v[v.length - 1]) : ''
  if (av && kurser.length === 1) return `Jag går UGL ${veckor}. Välj en annan vecka, så har vi varandra att bolla med efteråt.`
  if (veckor) return `Tips: UGL, Utveckling av grupp och ledare, ${veckor}. Fem dagar som förändrar hur man leder.`
  return 'Tips: UGL, Utveckling av grupp och ledare. Sveriges mest använda ledarskapsutbildning, öppna kurser över hela landet.'
}
