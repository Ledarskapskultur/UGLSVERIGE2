import { useState } from 'react'

const LINKS = [
  { label: 'Vad är UGL', href: '/#top' },
  { label: 'Kursdatum', href: '/kurser' },
  { label: 'Kursorter', href: '/ugl' },
  { label: 'Effekter', href: '/#effekten' },
  { label: 'Frågor och svar', href: '/#faq' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const bar =
    'absolute left-0 w-6 h-[2px] bg-black rounded-full transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)]'

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <div className="flex items-center gap-4 bg-white rounded-full shadow-lg pl-5 pr-3 py-2">
        <a href="/" className="text-lg font-bold tracking-tight text-black">UGL Sverige.</a>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative w-8 h-8 flex items-center justify-center"
        >
          <span className="relative block w-6 h-3">
            <span className={`${bar} ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
            <span className={`${bar} ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
          </span>
        </button>
      </div>

      <div
        className={`mt-3 bg-white rounded-2xl shadow-lg py-3 px-2 min-w-[200px] origin-top transition-all duration-300 ease-out ${
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-black hover:bg-black/5 transition-colors"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
