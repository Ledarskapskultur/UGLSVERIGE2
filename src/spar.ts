// Handelser till Vercel Web Analytics (skriptet /_vercel/insights/script.js laddas i html).
// Fungerar tyst om analytics inte ar paslaget i Vercel-projektet.
declare global {
  interface Window { va?: (ev: 'event' | 'beforeSend' | 'pageview', p?: Record<string, unknown>) => void; vaq?: unknown[] }
}
export function spara(namn: string, data: Record<string, string | number | boolean> = {}) {
  try {
    window.va = window.va || function (...args: unknown[]) { (window.vaq = window.vaq || []).push(args) }
    window.va('event', { name: namn, data })
  } catch { /* tomt */ }
}
