'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = {
  fr: [
    { href: '/dashboard', icon: '🏠', label: 'Tableau de bord' },
    { href: '/characters', icon: '🎭', label: 'Personnages', soon: true },
    { href: '/scripts', icon: '📝', label: 'Scripts', soon: true },
    { href: '/videos', icon: '🎬', label: 'Vidéos', soon: true },
    { href: '/settings', icon: '⚙️', label: 'Paramètres', soon: true },
  ],
  en: [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/characters', icon: '🎭', label: 'Characters', soon: true },
    { href: '/scripts', icon: '📝', label: 'Scripts', soon: true },
    { href: '/videos', icon: '🎬', label: 'Videos', soon: true },
    { href: '/settings', icon: '⚙️', label: 'Settings', soon: true },
  ],
}

interface AppSidebarProps {
  userEmail: string
}

export default function AppSidebar({ userEmail }: AppSidebarProps) {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const pathname = usePathname()
  const router = useRouter()
  const items = navItems[lang]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦆</span>
          <span className="font-bold text-gray-900">DuckFactory</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <div key={item.href}>
              {item.soon ? (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 cursor-not-allowed">
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                    {lang === 'fr' ? 'Bientôt' : 'Soon'}
                  </span>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-yellow-100 text-yellow-800 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* User + actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm font-bold text-yellow-700">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 truncate flex-1">{userEmail}</span>
        </div>

        <button
          onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
          className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
        >
          {lang === 'fr' ? '🇬🇧 Switch to English' : '🇫🇷 Passer en Français'}
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
        >
          {lang === 'fr' ? '← Déconnexion' : '← Sign out'}
        </button>
      </div>
    </aside>
  )
}
