import { ArrowUpRight } from 'lucide-react'
import { oppnaSamtycke } from '../Samtycke'
import Logo from './Logo'

const COLUMNS = [
  {
    title: 'Sidan',
    links: [
      { label: 'Vad är UGL', href: '/#top' },
      { label: 'Utvecklingsområden', href: '/#utvecklingsomraden' },
      { label: 'Öppenhet och trygghet', href: '/#oppenhet' },
      { label: 'Effekter', href: '/#effekten' },
      { label: 'Vanliga frågor', href: '/#faq' },
    ],
  },
  {
    title: 'Kurser',
    links: [
      { label: 'Kursdatum', href: '/kurser' },
      { label: 'Kursorter', href: '/ugl' },
      { label: 'UGL i egen regi', href: '/foretag' },
      { label: 'Nyhetsbrev', href: '/#nyhetsbrev' },
    ],
  },
  {
    title: 'Om UGL',
    links: [
      { label: 'Försvarshögskolan', href: 'https://www.fhs.se/', external: true },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 bg-[#321C04] rounded-t-[25px] -mt-[25px] px-6 pt-20 md:pt-28 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-4">
              <Logo fill="#F6E4CF" />
              <span className="text-[#FFF9F2] text-lg font-medium tracking-tight">UGL Sverige</span>
            </div>
            <p className="mt-6 text-[#F6E4CF]/70 text-[15px] leading-[1.5] max-w-[34ch]">
              Öppna UGL-kurser med certifierade handledare, på kursgårdar runt om i landet. Fem dagar. En grupp som
              byggs från grunden.
            </p>
            <a
              href="mailto:kontakt@uglsverige.se"
              className="mt-6 inline-flex items-center gap-2 text-[#FFF9F2] text-sm font-medium underline underline-offset-4 decoration-[#F6E4CF]/40 hover:decoration-[#F6E4CF] transition-colors"
            >
              kontakt@uglsverige.se
            </a>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="text-[#F6E4CF]/50 text-[11px] uppercase tracking-[0.2em] font-medium">{c.title}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={'external' in l && l.external ? '_blank' : undefined}
                      rel={'external' in l && l.external ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 text-[#F6E4CF]/80 hover:text-[#FFF9F2] text-[15px] transition-colors"
                    >
                      {l.label}
                      {'external' in l && l.external && <ArrowUpRight size={13} className="opacity-60" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-20 pt-6 border-t border-[#F6E4CF]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[#F6E4CF]/50 text-xs">
          <p>
            © {year} UGL Sverige. UGL är ett koncept som ägs av Försvarshögskolan.
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#F6E4CF] transition-colors">
              Integritetspolicy
            </a>
            <button type="button" onClick={oppnaSamtycke} className="hover:text-[#F6E4CF] transition-colors">
              Cookieinställningar
            </button>
            <a href="#top" className="hover:text-[#F6E4CF] transition-colors">
              Till toppen
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
