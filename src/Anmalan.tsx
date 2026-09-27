import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { MOTTAGARE, posta, kursData } from './forfragan'
import type { Kurs } from './kursdata'

const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }
const FORM_IMAGE = 'https://www.uglsverige.store/assets/ugl-samtal.webp'
const STEG = [
  { n: '01', t: 'Anmälan skickas', d: 'Formuläret här intill. Anmälan är inte bindande förrän en bekräftelse har kommit.' },
  { n: '02', t: 'Vi hörs kort', d: 'Inom två arbetsdagar stämmer vi av att veckan passar och att gruppen blir rätt sammansatt.' },
  { n: '03', t: 'Bekräftelse och faktura', d: 'Platsen är klar. Välkomstbrev med kursgård, tider och resväg kommer före kursstart.' },
]

export default function Anmalan({ valdaKurser, toggle }: { valdaKurser: Kurs[]; toggle: (id: string) => void }) {
  const [form, setForm] = useState({ namn: '', epost: '', organisation: '', meddelande: '' })
  const [status, setStatus] = useState<string | null>(null)
  const [skickar, setSkickar] = useState(false)
  const [klart, setKlart] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.namn.trim()) return setStatus('Fyll i namn.')
    if (!form.epost.includes('@')) return setStatus('Fyll i en giltig e-postadress.')
    setSkickar(true)
    setStatus(null)
    const r = await posta({ typ: 'bokning', kurser: valdaKurser.map(kursData), namn: form.namn, epost: form.epost, organisation: form.organisation, meddelande: form.meddelande, samtycke: true })
    setSkickar(false)
    if (r.ok) {
      setKlart(true)
      if (!r.mejl) {
        const rader = ['Anmälan UGL', '', 'Namn: ' + form.namn, 'E-post: ' + form.epost, 'Organisation: ' + (form.organisation || 'Ej angiven'), '', 'Vald kurs:', ...(valdaKurser.length ? valdaKurser.map((k) => '- ' + k.etikett) : ['- Ingen kurs vald']), '', 'Meddelande: ' + (form.meddelande || 'Inget')]
        window.location.href = 'mailto:' + MOTTAGARE + '?subject=' + encodeURIComponent('Anmälan UGL, ' + form.namn) + '&body=' + encodeURIComponent(rader.join('\n'))
      }
    } else {
      setStatus((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.')
    }
  }

  const field =
    'w-full bg-transparent border-b border-[#F6E4CF]/30 focus:border-[#F6E4CF] outline-none py-3 text-[#FFF9F2] placeholder:text-[#F6E4CF]/40 text-base transition-colors'
  const label = 'block text-[#F6E4CF]/60 text-[11px] uppercase tracking-[0.2em] font-medium mb-1'

  return (
      <section id="anmalan" className="relative z-10 bg-[#2B2724] rounded-t-[25px] py-20 md:py-32 px-6 mb-[-25px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${FORM_IMAGE}")` }} />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(43,39,36,0.86) 0%, rgba(43,39,36,0.76) 45%, rgba(43,39,36,0.68) 100%)' }} />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-[#F6E4CF]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">02. Anmälan</p>
            <h2 className="text-[#FFF9F2] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[16ch]">
              Så går det{' '}
              <em className="not-italic" style={EM}>
                till.
              </em>
            </h2>
            <p className="mt-8 text-[#F6E4CF]/80 text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[46ch]">
              Tre steg, inga överraskningar. Anmälan är inte bindande förrän en bekräftelse har kommit.
            </p>
            <ul className="mt-10 border-t border-[#F6E4CF]/20">
              {STEG.map((s) => (
                <li key={s.n} className="border-b border-[#F6E4CF]/20 py-5 flex gap-5">
                  <span className="text-[#F6E4CF]/50 text-xs tracking-[0.2em] font-medium pt-1">{s.n}</span>
                  <span>
                    <span className="block text-[#FFF9F2] text-xl tracking-tight">{s.t}</span>
                    <span className="block mt-2 text-[#F6E4CF]/75 text-[15px] leading-[1.5] max-w-[44ch]">{s.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#2B2724]/70 backdrop-blur-md border border-[#F6E4CF]/15 rounded-3xl p-7 md:p-10">
            {klart ? (
              <div className="py-10 text-center">
                <span className="mx-auto w-14 h-14 rounded-full bg-[#F6E4CF] text-[#2B2724] flex items-center justify-center"><Check size={22} /></span>
                <h3 className="mt-6 text-[#FFF9F2] text-2xl tracking-tight">Tack, anmälan är mottagen.</h3>
                <p className="mt-3 text-[#F6E4CF]/70 text-base max-w-[38ch] mx-auto leading-[1.5]">Vi hör av oss inom två arbetsdagar och bekräftar platsen. Anmälan är inte bindande förrän bekräftelsen har kommit.</p>
              </div>
            ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-7">
              <div>
                <span className={label}>Vald kurs</span>
                {valdaKurser.length ? (
                  <ul className="mt-2 flex flex-col gap-2">
                    {valdaKurser.map((k) => (
                      <li key={k.id} className="flex items-center justify-between gap-3 bg-[#F6E4CF] text-[#2B2724] rounded-xl px-4 py-3 text-sm">
                        <span>
                          <span className="font-medium">Vecka {k.vecka}, {k.anlaggning}</span>
                          <span className="block text-[#2B2724]/70">{k.ort}, {k.period}</span>
                        </span>
                        <button type="button" onClick={() => toggle(k.id)} aria-label="Ta bort" className="text-[#2B2724]/60 hover:text-[#2B2724] text-lg leading-none">×</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[#F6E4CF]/60 text-sm leading-relaxed">
                    Ingen kurs vald ännu. Markera en eller flera veckor i listan ovan, eller skicka anmälan utan vald kurs så föreslår vi datum.
                  </p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="an-namn" className={label}>Namn</label>
                  <input id="an-namn" className={field} placeholder="För- och efternamn" value={form.namn} onChange={(e) => setForm({ ...form, namn: e.target.value })} autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="an-org" className={label}>
                    Organisation <span className="normal-case tracking-normal text-[#F6E4CF]/40">(valfritt)</span>
                  </label>
                  <input id="an-org" className={field} placeholder="Företag eller organisation" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} autoComplete="organization" />
                </div>
              </div>
              <div>
                <label htmlFor="an-epost" className={label}>E-post</label>
                <input id="an-epost" type="email" className={field} placeholder="namn@organisation.se" value={form.epost} onChange={(e) => setForm({ ...form, epost: e.target.value })} autoComplete="email" required />
              </div>
              <div>
                <label htmlFor="an-medd" className={label}>
                  Meddelande <span className="normal-case tracking-normal text-[#F6E4CF]/40">(valfritt)</span>
                </label>
                <textarea id="an-medd" rows={3} className={`${field} resize-none`} placeholder="Frågor, faktureringsuppgifter eller något vi bör känna till" value={form.meddelande} onChange={(e) => setForm({ ...form, meddelande: e.target.value })} />
              </div>
              {status && <p className="text-[#F6C9A8] text-sm -mt-2">{status}</p>}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <button type="submit" disabled={skickar} className="inline-flex items-center justify-center gap-2 bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#FFF9F2] transition-colors disabled:opacity-60">
                  {skickar ? 'Skickar…' : 'Skicka anmälan'}
                  <ArrowRight size={16} />
                </button>
                <p className="text-[#F6E4CF]/50 text-xs leading-relaxed max-w-[34ch]">
                  Vi svarar inom två arbetsdagar. Anmälan är inte bindande.
                </p>
              </div>
            </form>
            )}
          </div>
        </div>
      </section>
  )
}
