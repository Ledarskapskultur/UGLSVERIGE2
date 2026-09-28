import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, CalendarCheck, ChevronDown, ChevronRight, Mail, Pencil, Phone, Send, User, Users, X } from 'lucide-react'
import { MOTTAGARE, posta, kursData } from './forfragan'
import { kr, type Kurs, type Omdome } from './kursdata'
import Dela from './Dela'
import { Stjarnor } from './Omdomen'
import { spara } from './spar'
import { pixelHandelse } from './Samtycke'
import { oppnaRingMig } from './RingMig'
import type { Bevis } from './bevis'

const EM = { fontFamily: "'Instrument Serif', serif" }
const PORTAL = 'https://www.uglsverige.store/portal'
export const SAMTAL = 'mailto:kontakt@uglsverige.se?subject=' + encodeURIComponent('Boka ett kort samtal om UGL') + '&body=' + encodeURIComponent('Hej,\n\njag vill boka ett kort samtal om UGL. Jag kan nås på telefon:\nTider som passar:\n')
const pris = (k: Kurs) => (k.total ? kr(k.total) + ' exkl. moms' : 'Pris meddelas')

const STEG_BOKA = ['Du fyller i namn och telefon', 'Vi ringer inom två arbetsdagar', 'Bekräftelse och faktura, först då bindande']
const init = (n: string) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export default function Kassa({ valda, toggle, onClose, onTipsa, onAndra, kompakt, oppnaIntresse = 0, oppnaBoka = 0, bokaVal, tipsare, omdomen = [], svarar }: { valda: Kurs[]; toggle: (id: string) => void; onClose?: () => void; onTipsa: (flik?: 'chef' | 'tips') => void; onAndra: () => void; kompakt?: boolean; oppnaIntresse?: number; oppnaBoka?: number; bokaVal?: string | null; tipsare?: { namn: string; veckor: string[] } | null; omdomen?: Omdome[]; svarar?: Bevis['svarar'] }) {
  const krock = tipsare ? valda.filter((k) => tipsare.veckor.includes(k.id)) : []
  const [steg, setSteg] = useState<'val' | 'intresse' | 'boka' | 'klart' | 'bokat'>('val')
  useEffect(() => { if (oppnaIntresse > 0) setSteg('intresse') }, [oppnaIntresse])
  const [bokaId, setBokaId] = useState<string | null>(null)
  useEffect(() => { if (oppnaBoka > 0) { setSteg('boka'); if (bokaVal) setBokaId(bokaVal) } }, [oppnaBoka, bokaVal])
  const bokaKurs = valda.find((k) => k.id === bokaId) ?? valda[valda.length - 1]
  const [b, setB] = useState({ namn: '', epost: '', telefon: '', organisation: '', fakturering: '', meddelande: '', samtycke: false })
  const [merFalt, setMerFalt] = useState(false)
  const [sparaEpost, setSparaEpost] = useState('')
  const [sparat, setSparat] = useState(false)
  const [sparar, setSparar] = useState(false)
  const [sparaStatus, setSparaStatus] = useState<string | null>(null)
  // Mejla mig veckorna: lagsta troskeln, bara e-post. Sparas som bevakning med kurser.
  const mejlaVeckor = async (e: FormEvent) => {
    e.preventDefault()
    if (!sparaEpost.includes('@')) return setSparaStatus('Fyll i en giltig e-postadress.')
    setSparar(true); setSparaStatus(null)
    const r = await posta({ typ: 'bevakning', kurser: valda.map((k) => ({ ...kursData(k), id: k.nyckel })), epost: sparaEpost, meddelande: 'Mejla mig veckorna', samtycke: true, kanal: 'spara' })
    setSparar(false)
    if (!r.ok) return setSparaStatus((r.error || 'Något gick fel') + '. Prova igen.')
    spara('veckor_mejlade', { antal: valda.length })
    if (!r.mejl) window.location.href = 'mailto:' + sparaEpost + '?subject=' + encodeURIComponent('Mina UGL-veckor') + '&body=' + encodeURIComponent(valda.map((k) => `Vecka ${k.vecka}, ${k.period}, ${k.anlaggning}, ${k.ort}`).join('\n') + '\n\nhttps://www.uglsverige.store/kurser?valda=' + valda.map((k) => k.nyckel).join(','))
    setSparat(true)
  }
  // Ett omdome intill knappen: helst fran samma kursgard, annars det hogst betygsatta.
  const citat = [...omdomen].filter((o) => o.text).sort((a, b) => (b.anlaggning === bokaKurs?.anlaggning ? 1 : 0) - (a.anlaggning === bokaKurs?.anlaggning ? 1 : 0) || b.betyg - a.betyg)[0]
  const [forsta, setForsta] = useState<string | null>(null)
  const [bortvalda, setBortvalda] = useState<string[]>([])
  const medtagna = valda.filter((k) => !bortvalda.includes(k.id))
  const [f, setF] = useState({ namn: '', epost: '', telefon: '', samtycke: false, oppen: false })
  const [status, setStatus] = useState<string | null>(null)
  const [skickar, setSkickar] = useState(false)
  const forstaId = medtagna.some((k) => k.id === forsta) ? forsta! : medtagna[0]?.id
  const portalLank = PORTAL + '?kurser=' + encodeURIComponent(valda.map((k) => k.nyckel).join(','))
  const field = 'w-full bg-transparent border-b border-[#321C04]/25 focus:border-[#321C04] outline-none py-2.5 text-[#321C04] placeholder:text-[#321C04]/40 text-base transition-colors'
  const label = 'block text-[#321C04]/60 text-[11px] uppercase tracking-[0.2em] font-medium mb-1'
  const eyebrow = 'text-[#321C04]/60 text-[11px] uppercase tracking-[0.25em] font-medium mb-2'

  const skicka = async (e: FormEvent) => {
    e.preventDefault()
    if (!medtagna.length) return setStatus('Bocka i minst en vecka.')
    if (!f.namn.trim() || !f.epost.includes('@')) return setStatus('Fyll i namn och e-post.')
    if (!f.samtycke) return setStatus('Kryssa i samtycket så att vi får kontakta dig.')
    setSkickar(true)
    setStatus(null)
    const ordnade = [...medtagna].sort((a, b) => (a.id === forstaId ? 0 : 1) - (b.id === forstaId ? 0 : 1))
    const rader = ordnade.map((k, i) => `- ${i === 0 ? 'Förstahandsval' : 'Alternativ'}: Vecka ${k.vecka}, ${k.period}, ${k.anlaggning}, ${k.ort}`)
    const r = await posta({ typ: 'intresse', kurser: ordnade.map((k, i) => ({ ...kursData(k), id: k.nyckel, forstahandsval: i === 0 })), meddelande: rader.join('\n') + (f.oppen ? '\n- Öppen för andra veckor också, föreslå gärna datum' : ''), namn: f.namn, epost: f.epost, telefon: f.telefon, samtycke: true })
    setSkickar(false)
    if (!r.ok) return setStatus((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.')
    spara('intresse_skickad', { veckor: medtagna.length }); pixelHandelse('Lead')
    if (!r.mejl) {
      const text = ['Intresseanmälan UGL (ingen plats bokad)', '', 'Namn: ' + f.namn, 'E-post: ' + f.epost, f.telefon ? 'Telefon: ' + f.telefon : '', '', 'Valda veckor:', ...rader].join('\n')
      window.location.href = 'mailto:' + MOTTAGARE + '?subject=' + encodeURIComponent('Intresseanmälan UGL, ' + f.namn) + '&body=' + encodeURIComponent(text)
    }
    setSteg('klart')
  }

  const boka = async (e: FormEvent) => {
    e.preventDefault()
    if (!bokaKurs) return setStatus('Välj vilken vecka du vill boka.')
    if (!b.namn.trim() || !b.epost.includes('@')) return setStatus('Fyll i namn och e-post.')
    if (!b.telefon.trim()) return setStatus('Fyll i telefonnummer, vi ringer och stämmer av.')
    if (!b.samtycke) return setStatus('Kryssa i samtycket så att vi får kontakta dig.')
    setSkickar(true)
    setStatus(null)
    const extra = [b.fakturering ? 'Fakturering: ' + b.fakturering : '', b.meddelande].filter(Boolean).join('\n')
    const r = await posta({ typ: 'bokning', kurser: [{ ...kursData(bokaKurs), id: bokaKurs.nyckel, forstahandsval: true }], namn: b.namn, epost: b.epost, telefon: b.telefon, organisation: b.organisation, meddelande: extra, samtycke: true })
    setSkickar(false)
    if (!r.ok) return setStatus((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.')
    spara('bokning_skickad', { vecka: bokaKurs.vecka, ort: bokaKurs.ort }); pixelHandelse('Lead')
    if (!r.mejl) {
      const text = ['Bokning UGL', '', 'Namn: ' + b.namn, 'E-post: ' + b.epost, 'Telefon: ' + b.telefon, 'Organisation: ' + (b.organisation || 'Ej angiven'), '', `Vecka ${bokaKurs.vecka}, ${bokaKurs.anlaggning}, ${bokaKurs.ort} (${bokaKurs.period})`, '', extra].join('\n')
      window.location.href = 'mailto:' + MOTTAGARE + '?subject=' + encodeURIComponent('Bokning UGL, ' + b.namn) + '&body=' + encodeURIComponent(text)
    }
    setSteg('bokat')
  }

  if (kompakt) {
    return (
      <div className="bg-[#FFF9F2] text-[#321C04] rounded-3xl border border-dashed border-[#D9C4AA] px-5 py-6">
        <p className={eyebrow}>Valda kursveckor</p>
        <p className="text-[30px] leading-none tracking-tight" style={EM}>0 <span className="text-[#321C04]/40">av 3</span></p>
        <p className="mt-3 text-sm text-[#321C04]/65 leading-[1.5]">Välj upp till tre veckor i listan, så samlas de här.</p>
      </div>
    )
  }

  return (
    <div className="relative bg-[#FFF9F2] text-[#321C04] rounded-3xl border border-[#D9C4AA] px-6 py-7">
      {onClose && <button type="button" onClick={onClose} aria-label="Stäng" className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[#321C04]/10 flex items-center justify-center"><X size={18} /></button>}
      <div>

        {steg === 'val' && (
          <>
            <p className={eyebrow}>Valda kursveckor</p>
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-5" style={EM}>Valda kursveckor</h2>
            {valda.length === 0 && (
              <p className="text-sm text-[#321C04]/65 leading-[1.5]">Inga veckor valda ännu. Välj upp till tre veckor i listan, så samlas de här.</p>
            )}
            <ul className="space-y-2.5">
              {valda.map((k) => (
                <li key={k.id} className="flex items-center gap-3 rounded-xl border border-[#D9C4AA] bg-white/60 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px]"><strong className="font-medium" style={EM}>Vecka {k.vecka}</strong> <span className="text-[#321C04]/50">·</span> {k.ort}</p>
                    <p className="text-[13px] text-[#321C04]/65 mt-0.5">{k.period} · {k.anlaggning} · {pris(k)}</p>
                  </div>
                  <button type="button" onClick={() => toggle(k.id)} aria-label={`Ta bort vecka ${k.vecka}`} className="w-8 h-8 rounded-full border border-[#321C04]/30 hover:bg-[#321C04] hover:text-[#FFF9F2] flex items-center justify-center transition-colors"><X size={14} /></button>
                </li>
              ))}
            </ul>
            {krock.length > 0 && tipsare && (
              <p className="mt-3 text-[13px] text-[#9C3A2E] leading-[1.5]">Vecka {krock.map((k) => k.vecka).join(' och ')} är {tipsare.namn}s vecka. UGL bygger på att man inte känner varandra sedan tidigare, välj gärna en annan vecka.</p>
            )}
            {valda.length > 0 && (
              <>
                <button type="button" onClick={onAndra} className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 decoration-[#321C04]/40 hover:decoration-[#321C04]"><Pencil size={14} /> Ändra urval</button>
                <p className="mt-2 text-sm text-[#321C04]/65">Inget är bokat ännu. Välj nedan om du vill boka eller anmäla intresse.</p>
              </>
            )}

            <p className={eyebrow + ' mt-9'}>Nästa steg</p>
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-4" style={EM}>Vad vill du göra?</h2>
            <div className="space-y-3">
              <button type="button" disabled={!valda.length} onClick={() => setSteg('boka')} className="disabled:opacity-40 disabled:cursor-not-allowed w-full text-left grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border-[1.5px] border-[#321C04] bg-[#F6E4CF] px-4 py-4 hover:bg-[#EBD3B6] transition-colors">
                <CalendarCheck size={34} strokeWidth={1.4} />
                <span><span className="block text-[19px] leading-tight" style={EM}>Boka plats</span><span className="block text-[13px] text-[#321C04]/65 mt-1">Du vet vilken vecka. Vi bekräftar inom två arbetsdagar, först då är platsen din.</span></span>
                <ChevronRight size={20} />
              </button>
              <button type="button" disabled={!valda.length} onClick={() => setSteg('intresse')} className="disabled:opacity-40 disabled:cursor-not-allowed w-full text-left grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border border-[#D9C4AA] bg-white/60 px-4 py-4 hover:border-[#321C04] transition-colors">
                <User size={34} strokeWidth={1.4} />
                <span><span className="block text-[19px] leading-tight" style={EM}>Anmäl intresse</span><span className="block text-[13px] text-[#321C04]/65 mt-1">Håll flera veckor öppna. Vi hör av oss, inget bokas.</span></span>
                <ChevronRight size={20} />
              </button>
              <a href={portalLank} aria-disabled={!valda.length} onClick={(e) => { if (!valda.length) e.preventDefault() }} className={`${valda.length ? '' : 'opacity-40 cursor-not-allowed'} w-full grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border border-[#D9C4AA] bg-white/60 px-4 py-4 hover:border-[#321C04] transition-colors`}>
                <Users size={34} strokeWidth={1.4} />
                <span><span className="block text-[19px] leading-tight" style={EM}>En medarbetare</span><span className="block text-[13px] text-[#321C04]/65 mt-1">Fortsätt till arbetsgivarportalen med ditt urval.</span></span>
                <ChevronRight size={20} />
              </a>
              <button type="button" disabled={!valda.length} onClick={() => onTipsa('chef')} className="disabled:opacity-40 disabled:cursor-not-allowed w-full text-left grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border border-[#D9C4AA] bg-white/60 px-4 py-4 hover:border-[#321C04] transition-colors">
                <Send size={30} strokeWidth={1.4} />
                <span><span className="block text-[19px] leading-tight" style={EM}>Beslutsunderlag</span><span className="block text-[13px] text-[#321C04]/65 mt-1">Färdigt underlag med veckor, pris och vad kursen ger, att skicka till den som godkänner.</span></span>
                <ChevronRight size={20} />
              </button>
              <button type="button" disabled={!valda.length} onClick={() => onTipsa('tips')} className="w-full inline-flex items-center justify-center gap-2 text-sm text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4 py-1 disabled:opacity-40">Tipsa en kollega om veckorna</button>
              <button type="button" onClick={oppnaRingMig} className="w-full inline-flex items-center justify-center gap-2 text-sm text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4 py-1"><Phone size={14} /> Osäker? Vi ringer upp dig</button>
            </div>
            {valda.length > 0 && (
              <form onSubmit={mejlaVeckor} noValidate className="mt-6 pt-5 border-t border-[#D9C4AA]">
                <p className={eyebrow}>Inte redo än?</p>
                {sparat ? (
                  <p className="text-[15px] leading-[1.5]">Veckorna är på väg till {sparaEpost}. Länken i mejlet öppnar samma urval.</p>
                ) : (
                  <>
                    <p className="text-[15px] leading-[1.5] mb-3">Mejla mig de här veckorna, så bestämmer jag senare.</p>
                    <div className="flex gap-2">
                      <input type="email" value={sparaEpost} onChange={(e) => setSparaEpost(e.target.value)} placeholder="namn@foretag.se" autoComplete="email" aria-label="E-post" className="flex-1 min-w-0 bg-white/60 border border-[#D9C4AA] focus:border-[#321C04] rounded-xl px-3 py-2.5 text-[15px] outline-none placeholder:text-[#321C04]/40" />
                      <button type="submit" disabled={sparar} className="inline-flex items-center gap-1.5 bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#2B2724] disabled:opacity-60"><Mail size={14} /> Skicka</button>
                    </div>
                    {sparaStatus && <p className="mt-2 text-[13px] text-[#9C3A2E]">{sparaStatus}</p>}
                    <p className="mt-2 text-[12px] text-[#321C04]/55">Ett mejl med veckorna och en länk tillbaka hit. Inget bokas, ingen lista.</p>
                  </>
                )}
              </form>
            )}
            {valda.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#D9C4AA]">
                <Dela kurser={valda} kanal="kassa" rubrik="Dela urvalet" />
              </div>
            )}
          </>
        )}

        {steg === 'intresse' && (
          <form onSubmit={skicka} noValidate>
            <p className={eyebrow}>Anmälan</p>
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-2" style={EM}>Intresseanmälan</h2>
            <p className="text-sm text-[#321C04]/70 mb-5 max-w-[50ch]">Ingen plats är bokad. Vi hör av oss när det närmar sig, eller så fort en plats blir ledig på en vecka du valt.</p>
            <p className={label}>Veckor som ingår i anmälan</p>
            <ul className="divide-y divide-[#321C04]/15 border-y border-[#321C04]/15 mb-2">
              {valda.map((k) => {
                const med = !bortvalda.includes(k.id)
                return (
                  <li key={k.id}>
                    <label className={`flex items-center gap-3 py-3 cursor-pointer ${med ? '' : 'opacity-50'}`}>
                      <input type="checkbox" checked={med} onChange={(e) => setBortvalda((b) => (e.target.checked ? b.filter((x) => x !== k.id) : [...b, k.id]))} className="w-4 h-4 accent-[#321C04]" />
                      <span className="flex-1 min-w-0 text-[15px]"><strong className="font-medium">Vecka {k.vecka}</strong>, {k.ort} <span className="block text-[13px] text-[#321C04]/60">{k.period} · {k.anlaggning}</span></span>
                      <span className="text-sm shrink-0">{pris(k)}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
            {medtagna.length > 1 && (
              <div className="mt-4">
                <p className={label}>Förstahandsval</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {medtagna.map((k) => (
                    <button key={k.id} type="button" onClick={() => setForsta(k.id)} aria-pressed={k.id === forstaId} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${k.id === forstaId ? 'bg-[#321C04] text-[#FFF9F2] border-[#321C04]' : 'border-[#321C04]/25 hover:border-[#321C04]/60'}`}>
                      Vecka {k.vecka}, {k.ort}
                    </button>
                  ))}
                </div>
                <p className="text-[13px] text-[#321C04]/60 mt-2">Övriga ibockade veckor skickas med som alternativ.</p>
              </div>
            )}
            <div className="grid gap-y-4 mt-4">
              <div><label className={label}>Namn</label><input className={field} value={f.namn} onChange={(e) => setF({ ...f, namn: e.target.value })} autoComplete="name" /></div>
              <div><label className={label}>E-post</label><input type="email" className={field} value={f.epost} onChange={(e) => setF({ ...f, epost: e.target.value })} autoComplete="email" /></div>
              <div><label className={label}>Telefon <span className="normal-case tracking-normal text-[#321C04]/40">valfritt</span></label><input type="tel" className={field} value={f.telefon} onChange={(e) => setF({ ...f, telefon: e.target.value })} autoComplete="tel" /></div>
            </div>
            <label className="flex items-start gap-3 mt-5 text-sm text-[#321C04]/80 cursor-pointer">
              <input type="checkbox" checked={f.oppen} onChange={(e) => setF({ ...f, oppen: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#321C04]" />
              Jag är öppen för andra veckor också, föreslå gärna datum.
            </label>
            <label className="flex items-start gap-3 mt-3 text-sm text-[#321C04]/80 cursor-pointer">
              <input type="checkbox" checked={f.samtycke} onChange={(e) => setF({ ...f, samtycke: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#321C04]" />
              Jag godkänner att mina uppgifter används för att kontakta mig om de valda veckorna.
            </label>
            {status && <p className="mt-4 text-sm text-[#9C3A2E]">{status}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSteg('val')} className="inline-flex items-center gap-2 border border-[#321C04]/30 text-sm font-medium px-5 py-3 rounded-xl hover:border-[#321C04]"><ArrowLeft size={15} /> Tillbaka</button>
              <button type="submit" disabled={skickar} className="flex-1 inline-flex items-center justify-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724] disabled:opacity-60 transition-colors">{skickar ? 'Skickar…' : 'Skicka intresseanmälan'}</button>
            </div>
            <p className="mt-3 text-[13px] text-[#321C04]/60">Svar inom två arbetsdagar. Ingen plats bokas förrän du sagt ja.</p>
          </form>
        )}

        {steg === 'boka' && (
          <form onSubmit={boka} noValidate>
            <p className={eyebrow}>Boka plats</p>
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-2" style={EM}>Boka plats</h2>
            <ol className="mb-5 grid grid-cols-3 gap-2">
              {STEG_BOKA.map((t, i) => (
                <li key={t} className="rounded-xl bg-white/60 border border-[#D9C4AA] px-3 py-2.5">
                  <span className="block text-[18px] leading-none text-[#9C7A4A]" style={EM}>0{i + 1}</span>
                  <span className="block mt-1.5 text-[12px] leading-[1.35] text-[#321C04]/80">{t}</span>
                </li>
              ))}
            </ol>
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#D9C4AA] bg-white/60 px-4 py-3">
              {svarar?.bild ? <img src={svarar.bild} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" /> : <span className="w-11 h-11 rounded-full bg-[#F6E4CF] flex items-center justify-center text-sm font-medium shrink-0">{init(svarar?.namn ?? 'UGL Sverige')}</span>}
              <span className="min-w-0"><span className="block text-[15px] leading-tight"><strong className="font-medium">{(svarar?.namn ?? 'Vi').split(' ')[0]} ringer dig</strong> och stämmer av att veckan och gruppen passar.</span><span className="block text-[12px] text-[#321C04]/60 mt-0.5">{svarar?.namn}{svarar?.roll ? ', ' + svarar.roll : ''}</span></span>
            </div>
            <p className={label}>{valda.length > 1 ? 'Vilken vecka vill du boka?' : 'Vecka'}</p>
            <ul className="divide-y divide-[#321C04]/15 border-y border-[#321C04]/15 mb-5">
              {valda.map((k) => (
                <li key={k.id}>
                  <label className="flex items-center gap-3 py-3 cursor-pointer">
                    {valda.length > 1 && <input type="radio" name="boka" checked={bokaKurs?.id === k.id} onChange={() => setBokaId(k.id)} className="w-4 h-4 accent-[#321C04]" />}
                    <span className="flex-1 min-w-0 text-[15px]"><strong className="font-medium">Vecka {k.vecka}</strong>, {k.ort} <span className="block text-[13px] text-[#321C04]/60">{k.period} · {k.anlaggning}</span></span>
                    <span className="text-sm shrink-0">{pris(k)}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="grid gap-y-4">
              <div><label className={label}>Namn</label><input className={field} value={b.namn} onChange={(e) => setB({ ...b, namn: e.target.value })} autoComplete="name" /></div>
              <div><label className={label}>E-post</label><input type="email" className={field} value={b.epost} onChange={(e) => setB({ ...b, epost: e.target.value })} autoComplete="email" /></div>
              <div><label className={label}>Telefon</label><input type="tel" className={field} value={b.telefon} onChange={(e) => setB({ ...b, telefon: e.target.value })} autoComplete="tel" /></div>
            </div>
            <button type="button" onClick={() => setMerFalt((v) => !v)} aria-expanded={merFalt} className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-[#321C04]/70 hover:text-[#321C04] underline underline-offset-4">
              <ChevronDown size={13} className={`transition-transform ${merFalt ? 'rotate-180' : ''}`} /> Organisation, fakturering och meddelande, valfritt
            </button>
            {merFalt && (
              <div className="grid gap-y-4 mt-3">
                <div><label className={label}>Organisation</label><input className={field} value={b.organisation} onChange={(e) => setB({ ...b, organisation: e.target.value })} autoComplete="organization" /></div>
                <div><label className={label}>Fakturering <span className="normal-case tracking-normal text-[#321C04]/40">adress, referens</span></label><input className={field} value={b.fakturering} onChange={(e) => setB({ ...b, fakturering: e.target.value })} /></div>
                <div><label className={label}>Meddelande</label><textarea rows={2} className={field + ' resize-none'} value={b.meddelande} onChange={(e) => setB({ ...b, meddelande: e.target.value })} /></div>
              </div>
            )}
            <label className="flex items-start gap-3 mt-5 text-sm text-[#321C04]/80 cursor-pointer">
              <input type="checkbox" checked={b.samtycke} onChange={(e) => setB({ ...b, samtycke: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#321C04]" />
              Jag godkänner att mina uppgifter används för att hantera bokningen.
            </label>
            {status && <p className="mt-4 text-sm text-[#9C3A2E]">{status}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSteg('val')} className="inline-flex items-center gap-2 border border-[#321C04]/30 text-sm font-medium px-5 py-3 rounded-xl hover:border-[#321C04]"><ArrowLeft size={15} /> Tillbaka</button>
              <button type="submit" disabled={skickar} className="flex-1 inline-flex items-center justify-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724] disabled:opacity-60 transition-colors">{skickar ? 'Skickar…' : 'Skicka bokning'}</button>
            </div>
            <p className="mt-3 text-[13px] text-[#321C04]/60">Betalning mot faktura när platsen är bekräftad. Inget betalas nu. Resten tar vi i samtalet.</p>
            <p className="mt-1.5 text-[13px] text-[#321C04]/60">Ingen sista anmälningsdag. Det går att boka fram till dagen före kursstart, så länge det finns platser kvar.</p>
            {citat && (
              <figure className="mt-5 pt-4 border-t border-[#D9C4AA]">
                <Stjarnor betyg={citat.betyg} size={13} className="text-[#9C7A4A]" />
                <blockquote className="mt-2 text-[15px] leading-[1.45]" style={EM}>”{citat.text}”</blockquote>
                <figcaption className="mt-1.5 text-[12px] text-[#321C04]/60">{citat.namn}{citat.roll ? ', ' + citat.roll : ''}</figcaption>
              </figure>
            )}
          </form>
        )}

        {steg === 'bokat' && (
          <div className="py-6">
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-3" style={EM}>Tack, bokningen är mottagen.</h2>
            <p className="text-[#321C04]/75 max-w-[50ch]">Vi ringer inom två arbetsdagar och bekräftar platsen. Först då är den bindande, och då kommer bekräftelse och faktura.</p>
            <div className="mt-6 pt-5 border-t border-[#D9C4AA]">
              <p className="text-[15px] text-[#321C04] leading-[1.5] mb-4">Berätta för en kollega att du ska gå. Går ni var sin vecka har ni varandra att bolla med efteråt.</p>
              <Dela kurser={bokaKurs ? [bokaKurs] : valda} av={b.namn} epost={b.epost} kanal="efter-bokning" rubrik="Tipsa kollegor och nätverk" />
            </div>
            <button type="button" onClick={() => (onClose ? onClose() : setSteg('val'))} className="mt-6 inline-flex items-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724]">Stäng</button>
          </div>
        )}

        {steg === 'klart' && (
          <div className="py-6">
            <h2 className="text-[30px] leading-[1.1] tracking-tight mb-3" style={EM}>Tack, intresseanmälan är mottagen.</h2>
            <p className="text-[#321C04]/75 max-w-[50ch]">Ingen plats är bokad. Vi hör av oss när det närmar sig, eller när en plats blir ledig på en vecka du valt.</p>
            <div className="mt-6 pt-5 border-t border-[#D9C4AA]">
              <p className="text-[15px] text-[#321C04] leading-[1.5] mb-4">Känner du någon som borde gå? Går ni var sin vecka har ni varandra att bolla med efteråt. Du får ett mejl om någon anmäler intresse via din länk.</p>
              <Dela kurser={medtagna} av={f.namn} epost={f.epost} kanal="efter-intresse" rubrik="Tipsa kollegor och nätverk" />
            </div>
            <button type="button" onClick={() => (onClose ? onClose() : setSteg('val'))} className="mt-6 inline-flex items-center bg-[#321C04] text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2B2724]">Stäng</button>
          </div>
        )}
      </div>
    </div>
  )
}
