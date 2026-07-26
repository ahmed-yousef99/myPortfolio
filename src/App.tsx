import { TopNav } from '@/components/layout/top-nav'
import { Footer } from '@/components/layout/footer'
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp'
import { Hero } from '@/sections/hero'
import { Services } from '@/sections/services'
import { FeaturedProjects } from '@/sections/featured-projects'
import { Process } from '@/sections/process'
import { WhyWorkWithMe } from '@/sections/why-work-with-me'
import { TechStack } from '@/sections/tech-stack'
import { Pricing } from '@/sections/pricing'
import { CtaBanner } from '@/sections/cta-banner'
import { Faq } from '@/sections/faq'
import { Contact } from '@/sections/contact'
import { BackgroundEffects } from '@/components/visual/background-effects'
import { initLenis } from '@/lib/scroll'
import { initAnalytics } from '@/lib/analytics'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    initLenis()
    initAnalytics()
  }, [])

  return (
    <div className="relative min-h-screen bg-canvas text-ink overflow-hidden">
      <BackgroundEffects />
      <div className="relative z-10">
        <TopNav />

        <main id="main-content">
          <Hero />
          <Services />
          <FeaturedProjects />
          <Process />
          <WhyWorkWithMe />
          <TechStack />
          <Pricing />
          <CtaBanner />
          <Faq />
          <Contact />
        </main>

        <Footer />
      </div>

      <FloatingWhatsApp />
    </div>
  )
}
