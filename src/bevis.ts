import { useEffect, useState } from 'react'

export type Bevis = {
  nyckeltal: { tal: string; text: string }[]
  kunder: string[]
  svarar: { namn: string; roll: string; bild: string }
}
declare global { interface Window { UGL_BEVIS?: Partial<Bevis> } }
const TOM: Bevis = { nyckeltal: [], kunder: [], svarar: { namn: 'Carl-Fredrik Zetterman', roll: 'UGL-handledare, certifierad av Försvarshögskolan', bild: '' } }
const URL = 'https://www.uglsverige.store/bevis.js'
const BAS = 'https://www.uglsverige.store/assets/'

function normalisera(b?: Partial<Bevis>): Bevis {
  const svarar = { ...TOM.svarar, ...(b?.svarar ?? {}) }
  if (svarar.bild && !/^https?:/.test(svarar.bild)) svarar.bild = BAS + svarar.bild
  return { nyckeltal: (b?.nyckeltal ?? []).filter((n) => n?.tal && n?.text).slice(0, 3), kunder: (b?.kunder ?? []).filter(Boolean).slice(0, 8), svarar }
}

// Laser bevis.js en gang. Fungerar utan filen ocksa, da visas inga tal och ingen kundrad.
export function useBevis(): Bevis {
  const [b, setB] = useState<Bevis>(() => normalisera(window.UGL_BEVIS))
  useEffect(() => {
    if (window.UGL_BEVIS) return
    const s = document.createElement('script')
    s.src = URL
    s.onload = () => setB(normalisera(window.UGL_BEVIS))
    document.head.appendChild(s)
  }, [])
  return b
}
