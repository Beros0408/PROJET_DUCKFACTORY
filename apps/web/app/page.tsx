'use client'

import { useState } from 'react'

const content = {
  fr: {
    tagline: 'Studio IA de production de contenus viraux',
    subtitle: 'Créez votre personnage IA, générez des scripts, produisez des vidéos — en automatique.',
    cta: 'Commencer gratuitement',
    features: [
      { icon: '🎭', title: 'Personnage IA', desc: 'Créez votre mascotte unique avec voix et personnalité' },
      { icon: '📝', title: 'Scripts viraux', desc: 'GPT-4o génère des scripts optimisés pour chaque plateforme' },
      { icon: '🎬', title: 'Vidéo auto', desc: 'Production automatique via HeyGen + ElevenLabs' },
      { icon: '🚀', title: 'Publication', desc: 'Publiez sur TikTok, YouTube Shorts et Instagram Reels' },
    ],
    switchLang: 'Switch to English',
    status: 'IT-001 — Setup initial',
  },
  en: {
    tagline: 'AI Studio for Viral Content Production',
    subtitle: 'Create your AI character, generate scripts, produce videos — on autopilot.',
    cta: 'Start for free',
    features: [
      { icon: '🎭', title: 'AI Character', desc: 'Create your unique mascot with voice and personality' },
      { icon: '📝', title: 'Viral Scripts', desc: 'GPT-4o generates scripts optimized for each platform' },
      { icon: '🎬', title: 'Auto Video', desc: 'Automatic production via HeyGen + ElevenLabs' },
      { icon: '🚀', title: 'Publishing', desc: 'Publish on TikTok, YouTube Shorts and Instagram Reels' },
    ],
    switchLang: 'Passer en Français',
    status: 'IT-001 — Initial Setup',
  },
}

export default function Home() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const t = content[lang]

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-yellow-100">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🦆</span>
          <span className="text-xl font-bold text-gray-900">DuckFactory</span>
        </div>
        <button
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1 transition-colors"
        >
          {t.switchLang}
        </button>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <div className="text-7xl mb-6 animate-bounce">🦆</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">DuckFactory</h1>
        <p className="text-2xl text-yellow-600 font-semibold mb-4">{t.tagline}</p>
        <p className="text-gray-500 text-lg max-w-xl mb-8">{t.subtitle}</p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg">
          {t.cta}
        </button>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-6 pb-24">
        {t.features.map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-xs text-gray-400">
        <p>DuckFactory — {t.status} — Cancan le Canard 🦆</p>
      </footer>
    </main>
  )
}
