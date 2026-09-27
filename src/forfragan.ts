import type { Kurs } from './kursdata'
export const MOTTAGARE = 'kontakt@uglsverige.se'
export const MAX_VALDA = 3
const ENDPOINT = 'https://nepnzqvxnkxvyyfdymui.supabase.co/functions/v1/ugl-forfragan'
export const kursData = (k: Kurs) => ({ vecka: k.vecka, anlaggning: k.anlaggning, ort: k.ort, period: k.period, total: k.total, lank: k.lank })
export async function posta(body: Record<string, unknown>): Promise<{ ok: boolean; mejl: boolean; error?: string }> {
  try {
    const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, kalla: location.hostname }) })
    const j = await r.json().catch(() => ({}))
    return r.ok ? { ok: true, mejl: !!j.mejl } : { ok: false, mejl: false, error: j.error }
  } catch {
    return { ok: false, mejl: false, error: 'Ingen kontakt med servern' }
  }
}

