import Link from 'next/link'

interface HeroSectionProps {
  lang: 'fr' | 'en'
}

const content = {
  fr: {
    badge: '🚀 En version Beta — Rejoignez les premiers utilisateurs',
    title: 'Crée ton personnage IA viral',
    subtitle: 'Studio IA de production de contenus viraux automatisés',
    desc: 'Génère scripts, voix et vidéos automatiquement. Publie sur YouTube, TikTok et Instagram en 1 clic.',
    cta1: 'Commencer gratuitement',
    cta2: 'Voir les fonctionnalités',
    stats: '10+ créateurs déjà inscrits 🦆',
  },
  en: {
    badge: '🚀 Now in Beta — Join early users',
    title: 'Create your viral AI character',
    subtitle: 'AI Studio for automated viral content production',
    desc: 'Auto-generate scripts, voice and videos. Publish on YouTube, TikTok and Instagram in 1 click.',
    cta1: 'Get started free',
    cta2: 'See features',
    stats: '10+ creators already signed up 🦆',
  },
}

export function HeroSection({ lang }: HeroSectionProps) {
  const c = content[lang]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-sky-50 pt-20 pb-28">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-yellow-200">
          {c.badge}
        </div>

        {/* Duck logo */}
        <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
          🦆
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          {c.title}
        </h1>
        <p className="text-xl md:text-2xl text-yellow-600 font-semibold mb-4">{c.subtitle}</p>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">{c.desc}</p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/signup"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {c.cta1}
          </Link>
          <a
            href="#features"
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-2xl text-lg border border-gray-200 transition-all"
          >
            {c.cta2} ↓
          </a>
        </div>

        {/* Social proof */}
        <p className="text-sm text-gray-400">{c.stats}</p>
      </div>
    </section>
  )
}
