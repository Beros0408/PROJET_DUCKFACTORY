import Link from 'next/link'
import { LanguageToggle } from '@/components/common/LanguageToggle'

interface FooterProps {
  lang: 'fr' | 'en'
  onToggleLang: () => void
}

const content = {
  fr: {
    tagline: 'Studio IA de production de contenus viraux.',
    product: 'Produit',
    company: 'Entreprise',
    legal: 'Légal',
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    changelog: 'Changelog',
    about: 'À propos',
    blog: 'Blog',
    contact: 'Contact',
    privacy: 'Confidentialité',
    terms: 'CGU',
    cookies: 'Cookies',
    copyright: '© 2026 DuckFactory. Tous droits réservés.',
    madeWith: 'Fait avec 🦆 par Beros',
  },
  en: {
    tagline: 'AI Studio for viral content production.',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    features: 'Features',
    pricing: 'Pricing',
    changelog: 'Changelog',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    copyright: '© 2026 DuckFactory. All rights reserved.',
    madeWith: 'Made with 🦆 by Beros',
  },
}

export function Footer({ lang, onToggleLang }: FooterProps) {
  const c = content[lang]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🦆</span>
              <span className="font-bold text-white text-lg">DuckFactory</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{c.tagline}</p>
            <LanguageToggle
              lang={lang}
              onToggle={onToggleLang}
              className="!bg-gray-800 !border-gray-700 !text-gray-300 hover:!text-white"
            />
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">{c.product}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">{c.features}</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">{c.pricing}</a></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">{c.changelog}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">{c.company}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{c.about}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{c.blog}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{c.contact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{c.legal}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{c.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{c.terms}</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">{c.cookies}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">{c.copyright}</p>
          <p className="text-sm text-gray-500">{c.madeWith}</p>
        </div>
      </div>
    </footer>
  )
}
