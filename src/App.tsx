import Navbar from './components/Navbar'
import AboutSection from './components/AboutSection'
import FeaturesSection from './components/FeaturesSection'
import AreasSection from './components/AreasSection'
import OpennessSection from './components/OpennessSection'
import EffectSection from './components/EffectSection'
import NewsletterSection from './components/NewsletterSection'
import FaqSection from './components/FaqSection'
import Footer from './components/Footer'

const HERO_VIDEO = 'https://www.uglsverige.store/assets/hero-6193856.mp4'

export default function App() {
  return (
    <>
      <section id="top" className="relative h-screen overflow-hidden mb-[-25px] bg-[#2B2724]">
        <video
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.66) contrast(1.18) saturate(1.05) sepia(0.18)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 40%, rgba(43,39,36,0) 40%, rgba(43,39,36,0.55) 100%), linear-gradient(180deg, rgba(43,39,36,0.25) 0%, rgba(43,39,36,0.3) 55%, rgba(43,39,36,0.75) 100%)',
          }}
        />

        <Navbar />

        <div className="relative z-10 h-full flex flex-col justify-end items-center px-6 pb-12 md:pb-16 gap-6">
          <h1 className="text-center text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-normal text-white leading-[1.1] tracking-tight">
            Utveckling av
            <br />
            grupp och{' '}
            <em className="not-italic" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              ledare
            </em>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-[460px] text-center">
            Sveriges mest använda ledarskapsutbildning.
          </p>
          <div className="bg-black/25 backdrop-blur-md rounded-xl flex flex-row items-center gap-4 pl-6 pr-1 py-1">
            <span className="hidden sm:inline text-white text-sm font-medium">Öppna kurser över hela landet.</span>
            <span className="sm:hidden text-white text-sm font-medium">Öppna kurser i hela landet.</span>
            <a
              href="/kurser"
              className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Se kursdatum
            </a>
          </div>
        </div>
      </section>

      <AboutSection />
      <FeaturesSection />
      <AreasSection />
      <OpennessSection />
      <EffectSection />
      <NewsletterSection />
      <FaqSection />
      <Footer />
    </>
  )
}
