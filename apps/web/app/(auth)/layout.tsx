'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-sky-50 flex flex-col">
      {/* Top bar */}
      <header className="flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🦆</span>
          <span className="font-bold text-gray-900 text-lg">DuckFactory</span>
        </Link>
        <button
          onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
          className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors bg-white"
        >
          {lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
        </button>
      </header>

      {/* Main content — passes lang via a hidden div hack-free: use context via cloneElement */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        © 2026 DuckFactory — Cancan le Canard 🦆
      </footer>
    </div>
  )
}
