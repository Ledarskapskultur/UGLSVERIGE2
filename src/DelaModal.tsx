import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import { kr, type Kurs } from './kursdata'
import Dela from './Dela'
import { MAX_VALDA, MOTTAGARE, posta, kursData } from './forfragan'
const EM = { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' as const }

const MOTIV = [
  { id: 'samarbete', t: 'Bättre samarbete i gruppen', d: 'Kunna läsa var gruppen står och vad den behöver.' },
  { id: 'konflikt', t: 'Färre och kortare konflikter', d: 'Gå in tidigt, medan det fortfarande handlar om sak.' },
  { id: 'feedback', t: 'Tydligare kommunikation och feedback', d: 'Ge återkoppling som går att ta emot, och ta emot den själv.' },
]

export default function DelaModal({ flik, setFlik, valda, onClose }: { flik: 'chef' | 'tips'; setFlik: (f: 'chef' | 'tips') => void; valda: Kurs[]; onClose: () => void }) {
  const [f, setF] = useState({ namn: '', epost: '', telefon: '', chefNamn: '', chefEpost: '', kollegaNamn: '', kollegaEpost: '', motiv: [] as string[], egen: '', samtycke: false })
  const [status, setStatus] = useState<string | null>(null)
  const [visaMejl, setVisaMejl] = useState(false)
  const field = 'w-full bg-transparent border-b border-[#321C04]/25 focus:border-[#321C04] outline-none py-2.5 text-[#321C04] placeholder:text-[#321C04]/40 text-base transition-colors'
  const label = 'block text-[#321C04]/60 text-[11px] uppercase tracking-[0.2em] font-medium mb-1'
  const chef = flik === 'chef'
  const kursrader = valda.map((k) => `- Vecka ${k.vecka}, ${k.anlaggning}, ${k.ort} (${k.period})${k.total ? `, ${kr(k.total)} exkl. moms` : ''}`)

  const mejl = chef
    ? [
        `Hej ${f.chefNamn || '[mottagarens namn]'},`,
        '',
        `${f.namn || '[ditt namn]'} vill gå UGL, Utveckling av grupp och ledare, Sveriges mest använda ledarskapsutbildning. ${valda.length > 1 ? 'Här är de veckor som passar, i prioritetsordning:' : 'Här är veckan som passar:'}`,
        ...kursrader,
        '',
        ...(f.motiv.length ? ['Det här vill jag att veckan ska ge:', ...f.motiv.map((m) => '- ' + MOTIV.find((x) => x.id === m)!.t)] : []),
        ...(f.egen ? ['', f.egen] : []),
        '',
        'UGL genomförs på kursgård under fem sammanhängande dagar med 8 till 12 deltagare och två handledare certifierade av Försvarshögskolan. Kursen bygger på Försvarshögskolans ledarskapsmodell och har utvärderats av Karolinska Institutet. Deltagaren kommer hem med en personlig utvecklingsplan.',
        '',
        'Godkänn genom att svara på det här mejlet, så bokar UGL Sverige platsen. Anmälan är inte bindande förrän den bekräftats.',
        '',
        `Vänliga hälsningar\n${f.namn || '[ditt namn]'}`,
      ]
    : [
        `Hej ${f.kollegaNamn || '[kollegans namn]'},`,
        '',
        `Jag tänkte på dig när jag såg det här. UGL är en femdagarskurs i grupputveckling och ledarskap, och ${valda.length > 1 ? 'de här veckorna' : 'den här veckan'} verkar passa:`,
        ...kursrader,
        '',
        'Läs mer och boka på www.uglsverige.store/kurser.',
        '',
        `Hälsningar\n${f.namn || '[ditt namn]'}`,
      ]

  const [skickar, setSkickar] = useState(false)
  const [klart, setKlart] = useState<string | null>(null)
  const skicka = async (e: FormEvent) => {
    e.preventDefault()
    if (!valda.length) return setStatus('Välj minst en vecka först.')
    if (!f.namn.trim() || !f.epost.includes('@')) return setStatus('Fyll i eget namn och e-post.')
    if (chef && (!f.chefNamn.trim() || !f.chefEpost.includes('@'))) return setStatus('Fyll i mottagarens namn och e-post.')
    if (!chef && !f.kollegaEpost.includes('@')) return setStatus('Fyll i kollegans e-post.')
    if (!f.samtycke) return setStatus('Kryssa i samtycket så att vi får kontakta er.')
    setSkickar(true)
    setStatus(null)
    const till = chef ? f.chefEpost : f.kollegaEpost
    const r = await posta({
      typ: chef ? 'chef' : 'tips',
      kurser: valda.map(kursData),
      namn: f.namn, epost: f.epost, telefon: f.telefon,
      mottagare_namn: chef ? f.chefNamn : f.kollegaNamn, mottagare_epost: till,
      motiv: chef ? f.motiv : [], meddelande: chef ? f.egen : '', samtycke: true,
    })
    setSkickar(false)
    if (!r.ok) return setStatus((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.')
    if (r.mejl) {
      setKlart(chef ? `Underlaget är skickat till ${f.chefNamn}, med kopia till dig. Vi hör av oss om några dagar om ni inte redan bokat.` : 'Tipset är skickat, med kopia till dig.')
    } else {
      // Mejlutskick inte aktiverat ännu: uppgifterna är sparade, mejlet går via e-postprogrammet.
      const amne = chef ? `Förslag: UGL, ${valda.map((k) => 'vecka ' + k.vecka).join(', ')}` : 'Tips: UGL, Utveckling av grupp och ledare'
      window.location.href = `mailto:${till}?cc=${encodeURIComponent(f.epost)},${MOTTAGARE}&subject=${encodeURIComponent(amne)}&body=${encodeURIComponent(mejl.join('\n'))}`
      setKlart(chef ? `Uppgifterna är sparade hos oss. Mejlet till ${f.chefNamn} öppnas i e-postprogrammet, klart att skicka.` : 'Uppgifterna är sparade. Tipset öppnas i e-postprogrammet, klart att skicka.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[#2B2724]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#FFF9F2] text-[#321C04] rounded-t-3xl md:rounded-3xl border border-[#D9C4AA] shadow-2xl">
        <div className="sticky top-0 bg-[#FFF9F2] border-b border-[#D9C4AA] px-6 md:px-8 pt-5 pb-0 flex items-start justify-between gap-4">
          <div className="flex gap-6">
            {(['chef', 'tips'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setFlik(t)} className={`pb-4 text-sm md:text-base font-medium border-b-2 -mb-px transition-colors ${flik === t ? 'border-[#321C04] text-[#321C04]' : 'border-transparent text-[#321C04]/50 hover:text-[#321C04]'}`}>
                {t === 'chef' ? 'Skicka underlag' : 'Tipsa en kollega'}
              </button>
            ))}
          </div>
          <button type="button" onClick={onClose} aria-label="Stäng" className="w-9 h-9 rounded-full hover:bg-[#F6E4CF] flex items-center justify-center"><X size={18} /></button>
        </div>

        {klart ? (
          <div className="px-6 md:px-8 py-14 text-center">
            <span className="mx-auto w-14 h-14 rounded-full bg-[#321C04] text-[#F6E4CF] flex items-center justify-center"><Check size={22} /></span>
            <h3 className="mt-6 text-2xl tracking-tight">Klart.</h3>
            <p className="mt-3 text-[#321C04]/75 text-base max-w-[40ch] mx-auto leading-[1.5]">{klart}</p>
            <div className="mt-8 max-w-md mx-auto text-left"><Dela kurser={valda} av={f.namn} epost={f.epost} kanal="efter-tips" rubrik="Sprid det vidare" /></div>
            <button type="button" onClick={onClose} className="mt-8 inline-flex items-center justify-center gap-2 bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724] transition-colors">Stäng</button>
          </div>
        ) : (
        <form onSubmit={skicka} noValidate className="px-6 md:px-8 py-6 flex flex-col gap-6">
          <div>
            <h3 className="text-2xl md:text-[28px] tracking-tight leading-tight">
              {chef ? <>Ett färdigt <em className="not-italic" style={EM}>beslutsunderlag.</em></> : <>Tipsa någon som borde <em className="not-italic" style={EM}>gå.</em></>}
            </h3>
            <p className="mt-2 text-[#321C04]/75 text-[15px] leading-[1.5] max-w-[60ch]">
              {chef
                ? 'Vi skriver mejlet med veckor, pris, innehåll och vad kursen ger organisationen. Mottagaren godkänner med ett svar, och en kopia går till er båda och till oss, så att vi kan hålla platsen.'
                : 'Ett kort mejl med de valda veckorna och en länk. Kopia går till dig.'}
            </p>
          </div>

          <div>
            <span className={label}>Valda veckor ({valda.length} av {MAX_VALDA})</span>
            {valda.length ? (
              <ul className="mt-2 flex flex-col gap-2">
                {valda.map((k, i) => (
                  <li key={k.id} className="flex items-center gap-3 bg-[#F6E4CF] rounded-xl px-4 py-2.5 text-sm">
                    <span className="text-[#321C04]/50 text-xs tracking-[0.2em] font-medium">0{i + 1}</span>
                    <span className="font-medium">Vecka {k.vecka}, {k.anlaggning}</span>
                    <span className="text-[#321C04]/70">{k.ort}, {k.period}</span>
                    {k.total > 0 && <span className="ml-auto text-[#321C04]/70 whitespace-nowrap">{kr(k.total)}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[#321C04]/60 text-sm">Ingen vecka vald ännu. Stäng rutan och välj upp till tre veckor i listan.</p>
            )}
            {valda.length > 0 && valda.length < MAX_VALDA && (
              <p className="mt-2 text-[#321C04]/60 text-sm">Vill du tipsa om fler veckor? Stäng rutan och välj fler i listan, högst tre.</p>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div><label className={label}>Ditt namn</label><input className={field} value={f.namn} onChange={(e) => setF({ ...f, namn: e.target.value })} autoComplete="name" /></div>
            <div><label className={label}>Din e-post</label><input type="email" className={field} value={f.epost} onChange={(e) => setF({ ...f, epost: e.target.value })} autoComplete="email" /></div>
            <div><label className={label}>Din telefon <span className="normal-case tracking-normal text-[#321C04]/40">(valfritt)</span></label><input type="tel" className={field} value={f.telefon} onChange={(e) => setF({ ...f, telefon: e.target.value })} autoComplete="tel" /></div>
          </div>

          {chef ? (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className={label}>Mottagarens namn</label><input className={field} value={f.chefNamn} onChange={(e) => setF({ ...f, chefNamn: e.target.value })} /></div>
                <div><label className={label}>Mottagarens e-post</label><input type="email" className={field} value={f.chefEpost} onChange={(e) => setF({ ...f, chefEpost: e.target.value })} /></div>
              </div>
              <div>
                <span className={label}>Vad ska veckan ge? <span className="normal-case tracking-normal text-[#321C04]/40">(formar mejlet)</span></span>
                <div className="mt-2 grid sm:grid-cols-3 gap-2">
                  {MOTIV.map((m) => {
                    const on = f.motiv.includes(m.id)
                    return (
                      <button key={m.id} type="button" aria-pressed={on} onClick={() => setF({ ...f, motiv: on ? f.motiv.filter((x) => x !== m.id) : [...f.motiv, m.id] })} className={`text-left rounded-2xl border p-3.5 transition-colors ${on ? 'bg-[#321C04] border-[#321C04] text-[#FFF9F2]' : 'border-[#D9C4AA] hover:border-[#321C04]/50'}`}>
                        <span className="block text-sm font-medium">{m.t}</span>
                        <span className={`block mt-1 text-xs leading-snug ${on ? 'text-[#F6E4CF]/75' : 'text-[#321C04]/60'}`}>{m.d}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div><label className={label}>Egen motivering <span className="normal-case tracking-normal text-[#321C04]/40">(valfritt)</span></label><textarea rows={2} className={`${field} resize-none`} value={f.egen} onChange={(e) => setF({ ...f, egen: e.target.value })} /></div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className={label}>Kollegans namn</label><input className={field} value={f.kollegaNamn} onChange={(e) => setF({ ...f, kollegaNamn: e.target.value })} /></div>
              <div><label className={label}>Kollegans e-post</label><input type="email" className={field} value={f.kollegaEpost} onChange={(e) => setF({ ...f, kollegaEpost: e.target.value })} /></div>
            </div>
          )}

          <div>
            <button type="button" onClick={() => setVisaMejl((v) => !v)} className="text-sm underline underline-offset-4 text-[#321C04]/70 hover:text-[#321C04]">
              {visaMejl ? 'Dölj mejlet' : 'Så här ser mejlet ut'}
            </button>
            {visaMejl && <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-[1.55] bg-[#F6E4CF] rounded-2xl p-4 text-[#321C04]/85">{mejl.join('\n')}</pre>}
          </div>

          <label className="flex items-start gap-3 text-sm text-[#321C04]/75 leading-snug">
            <input type="checkbox" checked={f.samtycke} onChange={(e) => setF({ ...f, samtycke: e.target.checked })} className="mt-1 accent-[#321C04]" />
            {chef ? 'Jag godkänner att UGL Sverige sparar mina och mottagarens kontaktuppgifter och kontaktar oss om den här förfrågan.' : 'Jag godkänner att UGL Sverige sparar mina kontaktuppgifter för det här tipset.'}
          </label>

          {status && <p className="text-[#8B5A2B] text-sm">{status}</p>}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button type="submit" disabled={skickar} className="inline-flex items-center justify-center gap-2 bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724] transition-colors disabled:opacity-60">
              {skickar ? 'Skickar…' : chef ? 'Skicka underlaget' : 'Skicka tipset'} <ArrowRight size={16} />
            </button>
            {chef && <button type="button" onClick={() => setFlik('tips')} className="text-sm text-[#321C04]/60 hover:text-[#321C04] underline underline-offset-4">Vill du hellre tipsa någon annan?</button>}
          </div>
          <p className="-mt-3 text-[13px] text-[#321C04]/60">{chef ? 'Kopia till dig och till oss. Vi svarar mottagaren inom två arbetsdagar om frågor kommer.' : 'Kopia till dig. Mottagaren bokar själv, ingen plats reserveras.'}</p>
        </form>
        )}
      </div>
    </div>
  )
}
