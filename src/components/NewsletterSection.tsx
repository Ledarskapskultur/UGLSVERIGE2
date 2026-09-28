import { useState, type FormEvent } from 'react'
import { MOTTAGARE, posta } from '../forfragan'
import { spara } from '../spar'
import { ArrowRight, Check } from 'lucide-react'

const BG_IMAGE = 'https://www.uglsverige.store/assets/ugl-feedback.webp'
const REGIONS = ['Norr', 'Mitt', 'Stockholm', 'Väst', 'Syd', 'Hela landet']
const INTERESTS = [
  { id: 'kursveckor', label: 'Besked om kursveckor' },
  { id: 'nyhetsbrev', label: 'Nyhetsbrevet' },
]

type Signup = {
  name: string
  email: string
  organisation: string
  region: string
  interests: string[]
}

export default function NewsletterSection() {
  const [form, setForm] = useState<Signup>({
    name: '',
    email: '',
    organisation: '',
    region: '',
    interests: ['kursveckor', 'nyhetsbrev'],
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const toggleInterest = (id: string) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter((x) => x !== id) : [...f.interests, id],
    }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.email.includes('@')) return setError('Fyll i en giltig e-postadress.')
    if (!form.region) return setError('Välj del av landet.')
    if (form.interests.length === 0) return setError('Välj minst ett alternativ.')
    setStatus('sending')
    const r = await posta({ typ: 'bevakning', kurser: [], namn: form.name, epost: form.email, organisation: form.organisation, meddelande: 'Region: ' + form.region + '\nVill ha: ' + form.interests.join(', '), samtycke: true, kanal: 'nyhetsbrev' })
    if (!r.ok) { setStatus('idle'); return setError((r.error || 'Något gick fel') + '. Prova igen, eller mejla ' + MOTTAGARE + '.') }
    spara('bevakning', { kanal: 'nyhetsbrev', region: form.region })
    setStatus('done')
  }

  const field =
    'w-full bg-transparent border-b border-[#F6E4CF]/30 focus:border-[#F6E4CF] outline-none py-3 text-[#FFF9F2] placeholder:text-[#F6E4CF]/40 text-base transition-colors'
  const label = 'block text-[#F6E4CF]/60 text-[11px] uppercase tracking-[0.2em] font-medium mb-1'

  return (
    <section id="nyhetsbrev" className="relative z-10 bg-[#2B2724] rounded-t-[25px] py-20 md:py-32 px-6 -mt-[25px] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${BG_IMAGE}")` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(43,39,36,0.84) 0%, rgba(43,39,36,0.74) 45%, rgba(43,39,36,0.66) 100%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-24 items-start">
        {/* Left */}
        <div className="lg:sticky lg:top-28">
          <p className="text-[#F6E4CF]/60 text-xs uppercase tracking-[0.25em] font-medium mb-5">Nyhetsbrev</p>
          <h2 className="text-[#FFF9F2] text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-tight font-normal max-w-[16ch]">
            Insikter om UGL, och kursveckor{' '}
            <em className="not-italic" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              som passar.
            </em>
          </h2>
          <p className="mt-8 text-[#F6E4CF]/80 text-base sm:text-[17px] lg:text-lg leading-[1.5] max-w-[46ch]">
            Ett nyhetsbrev om grupper och ledarskap, med besked när det dyker upp kursveckor i rätt del av landet och
            vid rätt tid. Inga utskick utöver det.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-[#F6E4CF]/70 text-sm">
            {['Några gånger per år, inte varje vecka', 'Kursveckor i vald del av landet', 'Avsluta när som helst, med ett klick'].map(
              (t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border border-[#F6E4CF]/30 flex items-center justify-center shrink-0">
                    <Check size={11} />
                  </span>
                  {t}
                </li>
              ),
            )}
          </ul>
          <a
            href="/kurser"
            className="mt-10 inline-flex items-center gap-2 border border-[#F6E4CF]/40 text-[#FFF9F2] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#F6E4CF] hover:text-[#2B2724] hover:border-[#F6E4CF] transition-colors"
          >
            Se kursutbud
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Right: form */}
        <div className="bg-[#2B2724]/70 backdrop-blur-md border border-[#F6E4CF]/15 rounded-3xl p-7 md:p-10">
          {status === 'done' ? (
            <div className="py-10 text-center">
              <span className="mx-auto w-14 h-14 rounded-full bg-[#F6E4CF] text-[#2B2724] flex items-center justify-center">
                <Check size={22} />
              </span>
              <h3 className="mt-6 text-[#FFF9F2] text-2xl tracking-tight">Tack, anmälan är klar.</h3>
              <p className="mt-3 text-[#F6E4CF]/70 text-base max-w-[38ch] mx-auto leading-[1.5]">
                Vi hör av oss när det dyker upp en kursvecka i {form.region === 'Hela landet' ? 'landet' : form.region.toLowerCase()}{' '}
                som passar, och med nyhetsbrevet däremellan.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-7">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nb-name" className={label}>
                    Namn
                  </label>
                  <input
                    id="nb-name"
                    className={field}
                    placeholder="För- och efternamn"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="nb-org" className={label}>
                    Organisation <span className="normal-case tracking-normal text-[#F6E4CF]/40">(valfritt)</span>
                  </label>
                  <input
                    id="nb-org"
                    className={field}
                    placeholder="Företag eller organisation"
                    value={form.organisation}
                    onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nb-email" className={label}>
                  E-post
                </label>
                <input
                  id="nb-email"
                  type="email"
                  className={field}
                  placeholder="namn@organisation.se"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <span className={label}>Del av landet</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {REGIONS.map((r) => {
                    const on = form.region === r
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm({ ...form, region: r })}
                        aria-pressed={on}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          on
                            ? 'bg-[#F6E4CF] text-[#2B2724] border-[#F6E4CF]'
                            : 'text-[#F6E4CF]/80 border-[#F6E4CF]/25 hover:border-[#F6E4CF]/60'
                        }`}
                      >
                        {r}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className={label}>Jag vill ha</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTERESTS.map((it) => {
                    const on = form.interests.includes(it.id)
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => toggleInterest(it.id)}
                        aria-pressed={on}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          on
                            ? 'bg-[#F6E4CF] text-[#2B2724] border-[#F6E4CF]'
                            : 'text-[#F6E4CF]/80 border-[#F6E4CF]/25 hover:border-[#F6E4CF]/60'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            on ? 'border-[#2B2724] bg-[#2B2724] text-[#F6E4CF]' : 'border-current'
                          }`}
                        >
                          {on && <Check size={10} />}
                        </span>
                        {it.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && <p className="text-[#F6C9A8] text-sm -mt-2">{error}</p>}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 bg-[#F6E4CF] text-[#2B2724] text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#FFF9F2] transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? 'Skickar…' : 'Anmäl mig'}
                  <ArrowRight size={16} />
                </button>
                <p className="text-[#F6E4CF]/50 text-xs leading-relaxed max-w-[34ch]">
                  Adressen används bara till detta och lämnas inte vidare.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
