'use client'

import Link from 'next/link'
import { LanguageToggle } from '@/components/common/LanguageToggle'

interface HeaderProps {
  lang: 'fr' | 'en'
  onToggleLang: () => void
}

const navLabels = {
  fr: { features: 'Fonctionnalités', pricing: 'Tarifs', faq: 'FAQ', login: 'Se connecter', signup: 'Commencer gratuitement' },
  en: { features: 'Features', pricing: 'Pricing', faq: 'FAQ', login: 'Sign in', signup: 'Get started free' },
}

export function Header({ lang, onToggleLang }: HeaderProps) {
  const nav = navLabels[lang]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🦆</span>
          <span className="font-bold text-gray-900 text-lg">DuckFactory</span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">{nav.features}</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">{nav.pricing}</a>
          <a href="#faq" className="hover:text-gray-900 transition-colors">{nav.faq}</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LanguageToggle lang={lang} onToggle={onToggleLang} className="hidden sm:flex" />
          <Link
            href="/login"
            className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {nav.login}
          </Link>
          <Link
            href="/signup"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {nav.signup}
          </Link>
        </div>
      </div>
    </header>
  )
}
