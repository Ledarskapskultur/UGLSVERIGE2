import { useEffect, useState } from 'react'
import type { Kurs } from './kursdata'

// Stader och kursorter med koordinater fran public/orter.js (samma fil som behovsanalysen).
declare global { interface Window { UGL_ORTER?: string; UGL_KURSORT?: Record<string, [number, number]> } }
const URL = 'https://www.uglsverige.store/orter.js'

export type Stad = { namn: string; slug: string; lat: number; lon: number }
export const slugga = (s: string) => s.toLowerCase().replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function parseStader(rader: string): Stad[] {
  return rader.trim().split('\n').map((r) => r.split('|')).filter((d) => d.length >= 3).map((d) => ({ namn: d[0].trim(), slug: slugga(d[0]), lat: +d[1], lon: +d[2] }))
}

export function useOrter() {
  const [data, setData] = useState<{ stader: Stad[]; kursorter: Record<string, [number, number]> } | null>(null)
  useEffect(() => {
    const klar = () => setData({ stader: parseStader(window.UGL_ORTER || ''), kursorter: window.UGL_KURSORT || {} })
    if (window.UGL_ORTER) return klar()
    const s = document.createElement('script'); s.src = URL; s.onload = klar; s.onerror = klar; document.head.appendChild(s)
  }, [])
  return data
}

// Fagelvagsavstand i km, sedan ett vagpaslag pa 25 procent och 75 km/h i snitt.
export function kmMellan(a: [number, number], b: [number, number]) {
  const R = 6371, dLat = ((b[0] - a[0]) * Math.PI) / 180, dLon = ((b[1] - a[1]) * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}
export function restid(km: number) {
  const min = Math.round(((km * 1.25) / 75) * 60)
  if (min < 15) return 'på orten'
  const h = Math.floor(min / 60), m = Math.round((min % 60) / 10) * 10
  return h === 0 ? `ca ${m} min` : m === 0 ? `ca ${h} h` : `ca ${h} h ${m} min`
}

// Kurser sorterade efter avstand fran staden. Kursort utan koordinat hamnar sist.
export function kurserNara(kurser: Kurs[], stad: Stad, kursorter: Record<string, [number, number]>) {
  return kurser.map((k) => {
    const c = kursorter[k.ort]
    const km = c ? kmMellan([stad.lat, stad.lon], c) : 9999
    return { k, km }
  }).sort((a, b) => a.km - b.km || a.k.start.getTime() - b.k.start.getTime())
}
