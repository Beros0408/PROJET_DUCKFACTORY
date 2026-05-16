'use client'

interface LanguageToggleProps {
  lang: 'fr' | 'en'
  onToggle: () => void
  className?: string
}

export function LanguageToggle({ lang, onToggle, className = '' }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
      className={`text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900 ${className}`}
    >
      {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
    </button>
  )
}
