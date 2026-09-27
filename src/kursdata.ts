import { useEffect, useState } from 'react'

// Kursdatan hämtas från uglsverige.store/kurser-data.js (window.UGL_RADER), så det finns en enda källa.
const DATA_URL = 'https://www.uglsverige.store/kurser-data.js'
const DEFAULT_PRIS = 23900

const REGIONER: Record<string, string> = {
  Stockholm: 'Stockholm', Lidingö: 'Stockholm', Täby: 'Stockholm', Värmdö: 'Stockholm', 'Nacka Strand, Stockholm': 'Stockholm',
  Helsingborg: 'Skåne', Kristianstad: 'Skåne', Halmstad: 'Halland', Göteborg: 'Västra Götaland', Mölnlycke: 'Västra Götaland',
  Jönköping: 'Jönköping', 'Sundsvall/Timrå': 'Västernorrland',
}
const MANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december']
const BILDER = ['ugl-grupp.webp', 'ugl-samtal.webp', 'ugl-tid.webp', 'ugl-feedback.webp', 'ugl-oppenhet.webp', 'ugl-upplevelse.webp', 'ugl-handledare.webp', 'ugl-hero.webp']
const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) }
const slug = (s: string) => s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export type Kurs = {
  id: string
  nyckel: string
  start: Date
  slut: Date
  vecka: number
  anlaggning: string
  ort: string
  region: string
  handledare: string[]
  kurspris: number
  logi: number
  samlat: boolean
  total: number
  ledig: boolean
  period: string
  etikett: string
  bild: string
  lank: string
}

export const kr = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' kr'
const fmt = (d: Date) => `${d.getDate()} ${MANADER[d.getMonth()]}`

export function parseKurser(rader: string): Kurs[] {
  return rader
    .trim()
    .split('\n')
    .filter((r) => r.trim())
    .map((rad, i) => {
      const d = rad.split('|')
      const start = new Date(d[0] + 'T00:00:00')
      const slut = new Date(start.getTime() + 4 * 864e5)
      const logi = +d[5]
      const kurspris = d[7] ? +d[7] : DEFAULT_PRIS
      const samlat = !logi && !!d[7]
      return {
        id: `${d[0]}-${i}`,
        nyckel: `${d[0]}-${slug(d[2])}`,
        start, slut,
        vecka: +d[1],
        anlaggning: d[2],
        ort: d[3],
        region: REGIONER[d[3]] || d[3],
        handledare: d[4] ? d[4].split(';') : [],
        kurspris, logi, samlat,
        total: logi ? kurspris + logi : samlat ? kurspris : 0,
        ledig: d[6] === 'L',
        period: `${fmt(start)} till ${fmt(slut)} ${slut.getFullYear()}`,
        etikett: `Vecka ${d[1]}, ${d[2]}, ${d[3]} (${fmt(start)} ${start.getFullYear()})`,
        bild: `https://www.uglsverige.store/assets/${BILDER[hash(d[2] + d[3]) % BILDER.length]}`,
        lank: `https://www.uglsverige.store/kurs?k=${d[0]}-${slug(d[2])}`,
      }
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

declare global {
  interface Window { UGL_RADER?: string }
}

export function useKurser() {
  const [kurser, setKurser] = useState<Kurs[] | null>(null)
  const [fel, setFel] = useState(false)
  useEffect(() => {
    if (window.UGL_RADER) return setKurser(parseKurser(window.UGL_RADER))
    const s = document.createElement('script')
    s.src = DATA_URL
    s.onload = () => (window.UGL_RADER ? setKurser(parseKurser(window.UGL_RADER)) : setFel(true))
    s.onerror = () => setFel(true)
    document.head.appendChild(s)
  }, [])
  return { kurser, fel }
}
