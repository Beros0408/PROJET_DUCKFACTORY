import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const content = {
  fr: {
    welcome: 'Bienvenue sur DuckFactory',
    subtitle: 'Votre studio IA est prêt. Créez votre premier personnage !',
    cards: [
      { icon: '🎭', title: 'Créer un personnage', desc: 'Donnez vie à votre avatar IA', href: '/characters', cta: 'Créer' },
      { icon: '📝', title: 'Générer des scripts', desc: 'GPT-4o rédige vos scripts viraux', href: '/scripts', cta: 'Générer', soon: true },
      { icon: '🎬', title: 'Mes vidéos', desc: 'Gérez votre production vidéo', href: '/videos', cta: 'Voir', soon: true },
      { icon: '⚙️', title: 'Paramètres', desc: 'Gérez votre compte et intégrations', href: '/settings', cta: 'Configurer', soon: true },
    ],
    stats: [
      { label: 'Vidéos générées', value: '0' },
      { label: 'Scripts créés', value: '0' },
      { label: 'Personnages', value: '0' },
      { label: 'Publications', value: '0' },
    ],
    soon: 'Bientôt disponible',
    beta: '🎭 IT-003 — Module personnages actif ! Crée ton premier avatar IA.',
  },
  en: {
    welcome: 'Welcome to DuckFactory',
    subtitle: 'Your AI studio is ready. Create your first character!',
    cards: [
      { icon: '🎭', title: 'Create a character', desc: 'Bring your AI avatar to life', href: '/characters', cta: 'Create' },
      { icon: '📝', title: 'Generate scripts', desc: 'GPT-4o writes your viral scripts', href: '/scripts', cta: 'Generate', soon: true },
      { icon: '🎬', title: 'My videos', desc: 'Manage your video production', href: '/videos', cta: 'View', soon: true },
      { icon: '⚙️', title: 'Settings', desc: 'Manage your account and integrations', href: '/settings', cta: 'Configure', soon: true },
    ],
    stats: [
      { label: 'Videos generated', value: '0' },
      { label: 'Scripts created', value: '0' },
      { label: 'Characters', value: '0' },
      { label: 'Publications', value: '0' },
    ],
    soon: 'Coming soon',
    beta: '🎭 IT-003 — Characters module live! Create your first AI avatar.',
  },
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const lang = 'fr' as 'fr' | 'en'
  const c = content[lang]

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{c.welcome} 🦆</h1>
        <p className="text-gray-500">{c.subtitle}</p>
        {user?.email && (
          <p className="text-sm text-gray-400 mt-1">{user.email}</p>
        )}
      </div>

      {/* Beta banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 mb-8">
        <p className="text-sm text-yellow-800">{c.beta}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {c.stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {c.cards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{card.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{card.title}</h3>
                  {card.soon && (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                      {c.soon}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-4">{card.desc}</p>
                {card.soon ? (
                  <span className="text-sm font-semibold text-gray-300 cursor-not-allowed">{card.cta} →</span>
                ) : (
                  <Link href={card.href} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors">
                    {card.cta} →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
