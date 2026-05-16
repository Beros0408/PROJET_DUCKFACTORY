'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'

export default function Home() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const toggleLang = () => setLang(l => l === 'fr' ? 'en' : 'fr')

  return (
    <>
      <Header lang={lang} onToggleLang={toggleLang} />
      <main>
        <HeroSection lang={lang} />
        <FeaturesSection lang={lang} />
        <HowItWorksSection lang={lang} />
        <PricingSection lang={lang} />
        <FAQSection lang={lang} />
        <CTASection lang={lang} />
      </main>
      <Footer lang={lang} onToggleLang={toggleLang} />
    </>
  )
}
